// Supabase Edge Function: create-checkout
// Deploy with secrets: STRIPE_SECRET_KEY, SUPABASE_SERVICE_ROLE_KEY, PUBLIC_SITE_URL
// Stripe price IDs MUST be set on server; never accept an arbitrary price from a user.
import { serve } from "https://deno.land/std@0.224.0/http/server.ts";
import { createClient } from "npm:@supabase/supabase-js@2.49.4";
const site = (Deno.env.get("PUBLIC_SITE_URL") || "https://pilot.petrranda.cz").replace(/\/$/,"");
const cors: Record<string,string> = {
  "Access-Control-Allow-Origin": site,
  "Access-Control-Allow-Headers": "authorization, content-type, apikey",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Vary": "Origin"
};
const plans: Record<string, {priceEnv:string,mode:"payment"|"subscription",amount:number}> = {
  month: {priceEnv:"STRIPE_PRICE_MONTHLY",mode:"subscription",amount:39900},
  quarter: {priceEnv:"STRIPE_PRICE_QUARTER",mode:"payment",amount:99000},
  half: {priceEnv:"STRIPE_PRICE_HALF_YEAR",mode:"payment",amount:169000},
  year: {priceEnv:"STRIPE_PRICE_YEAR",mode:"payment",amount:249000}
};
// Veřejná Stripe sandbox Price ID (netajné identifikátory), pouze testovací účet.
const sandboxPriceIds: Record<string,string> = {
  month: "price_1UZXHiC1UC9efvKajcz82GGj",
  quarter: "price_1UZXIhC1UC9efvKaMGDZXEEF",
  half: "price_1UZXInC1UC9efvKaYhaZUW81",
  year: "price_1UZXIsC1UC9efvKaWxZoa8N9"
};
const reply=(status:number,body:unknown)=>new Response(JSON.stringify(body),{status,headers:{...cors,"Content-Type":"application/json; charset=utf-8","Cache-Control":"no-store"}});
serve(async request=>{
  if(request.method==="OPTIONS")return new Response(null,{status:204,headers:cors});
  if(request.method!=="POST")return reply(405,{error:"Method not allowed"});
  if(request.headers.get("origin")!==site)return reply(403,{error:"Origin not allowed"});
  const auth=request.headers.get("Authorization")||"";
  const jwt=auth.startsWith("Bearer ")?auth.slice(7):"";
  if(!jwt)return reply(401,{error:"Přihlášení je vyžadováno."});
  const sbUrl=Deno.env.get("SUPABASE_URL"),serviceKey=Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
  const stripeKey=Deno.env.get("STRIPE_SECRET_KEY");
  if(!sbUrl||!serviceKey||!stripeKey)return reply(503,{error:"Platby ještě nejsou nakonfigurovány."});
  const supabase=createClient(sbUrl,serviceKey,{auth:{autoRefreshToken:false,persistSession:false}});
  const {data:{user},error:authErr}=await supabase.auth.getUser(jwt);
  if(authErr||!user?.id||!user.email)return reply(401,{error:"Neplatné přihlášení."});
  let requested:unknown;try{requested=await request.json()}catch{return reply(400,{error:"Neplatný požadavek."})}
  const plan=(requested as {plan?:unknown})?.plan;
  if(typeof plan!=="string"||!Object.hasOwn(plans,plan))return reply(400,{error:"Neznámý tarif."});
  const selected=plans[plan],priceId=sandboxPriceIds[plan];
  // Fail closed if a mismatching production price is accidentally configured.
  if(Deno.env.get(selected.priceEnv)&&Deno.env.get(selected.priceEnv)!==priceId)return reply(503,{error:"Nesoulad testovacího ceníku."});
  if(!priceId||!/^price_[A-Za-z0-9]+$/.test(priceId))return reply(503,{error:"Tarif zatím není aktivní."});
  // Fail closed if the linked Stripe Price does not match the approved tariff.
  // CZK amounts use minor units (haléře), e.g. 399 Kč = 39900.
  let price: {id?:string,currency?:string,unit_amount?:number,type?:string,recurring?:{interval?:string,interval_count?:number},active?:boolean};
  try {
    const check=await fetch("https://api.stripe.com/v1/prices/"+encodeURIComponent(priceId),{
      headers:{"Authorization":"Bearer "+stripeKey}
    });
    if(!check.ok)return reply(503,{error:"Tarif Stripe nebylo možné ověřit."});
    price=await check.json();
  } catch{return reply(503,{error:"Nepodařilo se ověřit ceník."})}
  const recurring=selected.mode==="subscription";
  if(price.id!==priceId||price.active!==true||price.currency!=="czk"||
     price.unit_amount!==selected.amount||
     (recurring ? price.type!=="recurring"||price.recurring?.interval!=="month"||price.recurring?.interval_count!==1 : price.type!=="one_time")){
    return reply(503,{error:"Konfigurace tarifu neodpovídá schválenému ceníku."});
  }
  if(selected.mode==="subscription"){
    const {data:active,error:dbErr}=await supabase.from("memberships").select("id").eq("user_id",user.id).eq("status","active").eq("product_code","monthly").gt("ends_at",new Date().toISOString()).limit(1);
    if(dbErr)return reply(503,{error:"Členství nelze ověřit."});
    if(active?.length)return reply(409,{error:"Máš již aktivní měsíční předplatné. Nové lze řešit ve správě účtu."});
  }
  const body=new URLSearchParams();
  body.set("mode",selected.mode);
  body.set("line_items[0][price]",priceId);
  body.set("line_items[0][quantity]","1");
  body.set("customer_email",user.email);
  body.set("client_reference_id",user.id);
  body.set("metadata[user_id]",user.id);
  body.set("metadata[plan]",plan);
  if(selected.mode==="subscription"){
    body.set("subscription_data[metadata][user_id]",user.id);
    body.set("subscription_data[metadata][plan]",plan);
  }else{
    body.set("payment_intent_data[metadata][user_id]",user.id);
    body.set("payment_intent_data[metadata][plan]",plan);
  }
  body.set("success_url",site+"/ucet.html?checkout=return");
  body.set("cancel_url",site+"/clenstvi.html?checkout=cancel");
  const response=await fetch("https://api.stripe.com/v1/checkout/sessions",{
    method:"POST",
    headers:{"Authorization":"Bearer "+stripeKey,"Content-Type":"application/x-www-form-urlencoded"},
    body:body.toString()
  });
  const result=await response.json();
  if(!response.ok||!result.url)return reply(502,{error:"Založení platby se nezdařilo."});
  return reply(200,{url:result.url});
});
