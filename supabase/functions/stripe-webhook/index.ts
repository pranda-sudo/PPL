// Supabase Edge Function: stripe-webhook
// Only deploy after Stripe secrets and database migration are configured.
// Stripe webhook endpoint MUST run with verify_jwt=false; authentication is via Stripe signature.
// This handler records paid one-time purchases and monthly subscription periods.
// IMPORTANT: perform a Stripe test-mode end-to-end audit before enabling a production checkout button.
import { serve } from "https://deno.land/std@0.224.0/http/server.ts";
import { createClient } from "npm:@supabase/supabase-js@2.49.4";
const encoder=new TextEncoder();
function hex(buffer:ArrayBuffer){return [...new Uint8Array(buffer)].map(b=>b.toString(16).padStart(2,"0")).join("")}
async function verifyStripe(body:string,header:string,secret:string){
 const segments=header.split(",").map(x=>x.trim().split("="));
 const t=segments.find(x=>x[0]==="t")?.[1],signatures=segments.filter(x=>x[0]==="v1").map(x=>x[1]);
 if(!t||!signatures.length||!/^\d+$/.test(t)||Math.abs(Date.now()/1000-Number(t))>300)return false;
 const key=await crypto.subtle.importKey("raw",encoder.encode(secret),{name:"HMAC",hash:"SHA-256"},false,["sign"]);
 const expected=hex(await crypto.subtle.sign("HMAC",key,encoder.encode(t+"."+body)));
 // Constant-time compare only similarly shaped hashes.
 return signatures.some(signature=>{if(!signature||signature.length!==expected.length)return false;let diff=0;for(let i=0;i<signature.length;i++)diff|=signature.charCodeAt(i)^expected.charCodeAt(i);return diff===0});
}
type Checkout={id:string,mode:string,payment_status?:string,client_reference_id?:string,metadata?:Record<string,string>,subscription?:string|null,customer?:string|null};
const plans:Record<string,{code:string,days:number}>={quarter:{code:"quarter",days:90},half:{code:"half_year",days:180},year:{code:"year",days:365},month:{code:"monthly",days:0}};
function text(message:string,status=200){return new Response(message,{status,headers:{"Content-Type":"text/plain; charset=utf-8","Cache-Control":"no-store"}})}
serve(async req=>{
 if(req.method!=="POST")return text("Method not allowed",405);
 const secret=Deno.env.get("STRIPE_WEBHOOK_SECRET"),stripeKey=Deno.env.get("STRIPE_SECRET_KEY"),
  sbUrl=Deno.env.get("SUPABASE_URL"),serviceKey=Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
 if(!secret||!stripeKey||!sbUrl||!serviceKey)return text("Missing server configuration",503);
 const raw=await req.text();
 if(!await verifyStripe(raw,req.headers.get("stripe-signature")||"",secret))return text("Invalid Stripe signature",400);
 const event=JSON.parse(raw);
 if(event.livemode!==false)return text("Sandbox only",400);
 const sb=createClient(sbUrl,serviceKey,{auth:{autoRefreshToken:false,persistSession:false}});
 const {data:prior,error:priorErr}=await sb.from("stripe_event_receipts").select("stripe_event_id").eq("stripe_event_id",event.id).maybeSingle();
 if(priorErr)return text("Could not verify event state",503);
 if(prior)return text("Already processed",200);
 const fetchStripe=async(path:string)=>{
  const r=await fetch("https://api.stripe.com/v1/"+path,{headers:{"Authorization":"Bearer "+stripeKey}});
  if(!r.ok)throw new Error("Stripe API lookup failed");
  return await r.json();
 };
 async function updateMonthly(subscriptionId:string){
  const subscription=await fetchStripe("subscriptions/"+encodeURIComponent(subscriptionId));
  const userId=subscription.metadata?.user_id;
  if(!userId||!/^[a-f\d-]{36}$/i.test(userId))throw new Error("Subscription lacks valid user ID");
  const item=subscription.items?.data?.[0];
  if(item?.price?.id!=="price_1UZXHiC1UC9efvKajcz82GGj")throw new Error("Subscription price does not belong to Pilot Academy sandbox");
  const started=item?.current_period_start||subscription.current_period_start;
  const ended=item?.current_period_end||subscription.current_period_end;
  if(!started||!ended)throw new Error("Subscription period unavailable");
  const latestInvoice=subscription.latest_invoice;
  const invoiceId=typeof latestInvoice==="string"?latestInvoice:latestInvoice?.id;
  const invoice=invoiceId?await fetchStripe("invoices/"+encodeURIComponent(invoiceId)):null;
  const hasPaidInvoice=invoice?.status==="paid"&&invoice?.amount_paid>0;
  const {data:existing,error:lookupErr}=await sb.from("memberships").select("id").eq("stripe_subscription_id",subscriptionId).maybeSingle();
  if(lookupErr)throw lookupErr;
  const status=subscription.status==="canceled"?"cancelled":
    subscription.status==="past_due"||subscription.status==="unpaid"?"past_due":
    subscription.status==="active"&&hasPaidInvoice?"active":"pending";
  const row={user_id:userId,product_code:"monthly",status,starts_at:new Date(started*1000).toISOString(),ends_at:new Date(ended*1000).toISOString(),
    stripe_customer_id:typeof subscription.customer==="string"?subscription.customer:null,stripe_subscription_id:subscriptionId,updated_at:new Date().toISOString()};
  const result=existing?await sb.from("memberships").update(row).eq("id",existing.id):await sb.from("memberships").insert(row);
  if(result.error)throw result.error;
 }
 try{
  if(event.type==="checkout.session.completed"||event.type==="checkout.session.async_payment_succeeded"){
    const session:Checkout=event.data.object;
    if(session.mode==="payment"&&session.payment_status==="paid"){
      const plan=session.metadata?.plan||"";
      const p=plans[plan],userId=session.client_reference_id||session.metadata?.user_id;
      if(!p||!p.days||!userId||!/^[a-f\d-]{36}$/i.test(userId))throw new Error("Invalid paid checkout metadata");
      const {data:existing,error:lookupErr}=await sb.from("memberships").select("id").eq("stripe_checkout_session_id",session.id).maybeSingle();
      if(lookupErr)throw lookupErr;
      if(!existing){
        const start=new Date(),end=new Date(start.getTime()+p.days*86400000);
        const {error}=await sb.from("memberships").insert({user_id:userId,product_code:p.code,status:"active",starts_at:start.toISOString(),ends_at:end.toISOString(),
          stripe_checkout_session_id:session.id,stripe_customer_id:session.customer||null});
        if(error)throw error;
      }
    }
    if(session.mode==="subscription"&&session.subscription&&session.payment_status==="paid"){
      await updateMonthly(session.subscription);
    }
  }
  if(event.type==="invoice.paid"){
    const invoice=event.data.object;
    const rawSubscription=invoice.parent?.subscription_details?.subscription||invoice.subscription;
    const subscriptionId=typeof rawSubscription==="string"?rawSubscription:rawSubscription?.id||null;
    if(subscriptionId)await updateMonthly(subscriptionId);
  }
  if(event.type==="invoice.payment_failed"){
    const invoice=event.data.object;
    const rawSubscription=invoice.parent?.subscription_details?.subscription||invoice.subscription;
    const subscriptionId=typeof rawSubscription==="string"?rawSubscription:rawSubscription?.id||null;
    if(subscriptionId)await updateMonthly(subscriptionId);
  }
  if(event.type==="charge.refunded"||event.type==="charge.dispute.created"){
    const charge=event.type==="charge.refunded"?event.data.object:event.data.object.charge;
    const chargeObj=typeof charge==="string"?await fetchStripe("charges/"+encodeURIComponent(charge)):charge;
    const fullyRefunded=event.type==="charge.dispute.created"||(
      chargeObj.refunded===true||(chargeObj.amount_refunded>0&&chargeObj.amount_refunded>=chargeObj.amount));
    if(fullyRefunded&&chargeObj.payment_intent){
      const intent=typeof chargeObj.payment_intent==="string"?chargeObj.payment_intent:chargeObj.payment_intent.id;
      const sessions=await fetchStripe("checkout/sessions?payment_intent="+encodeURIComponent(intent)+"&limit=10");
      for(const session of sessions.data||[]){
        const {error}=await sb.from("memberships").update({status:"cancelled",updated_at:new Date().toISOString()}).eq("stripe_checkout_session_id",session.id);
        if(error)throw error;
      }
    }
  }
  if(event.type==="customer.subscription.created"||event.type==="customer.subscription.updated"||event.type==="customer.subscription.deleted"){
    const subscription=event.data.object;
    await updateMonthly(subscription.id);
  }
  // Keep receipt *after* successful handling; existing memberships are keyed
  // by Stripe Checkout Session or Subscription IDs to prevent duplicate grants.
  const {error:receiptErr}=await sb.from("stripe_event_receipts").insert({stripe_event_id:event.id,event_type:event.type});
  if(receiptErr&&receiptErr.code!=="23505")throw receiptErr;
  return text("OK");
 }catch(err){
  console.error("Stripe webhook processing failed for event",event.id,String(err));
  return text("Processing failed",500);
 }
});
