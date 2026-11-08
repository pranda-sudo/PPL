// Protected question delivery – FUTURE paid modules only.
// Current public PPL/ULL/IFR JSON files remain public and are NOT protected by this function.
// Deploy after content rights audit and SQL migration. JWT is validated on every request.
import { serve } from "https://deno.land/std@0.224.0/http/server.ts";
import { createClient } from "npm:@supabase/supabase-js@2.49.4";
const origin=(Deno.env.get("PUBLIC_SITE_URL")||"https://pilot.petrranda.cz").replace(/\/$/,"");
const cors={"Access-Control-Allow-Origin":origin,"Access-Control-Allow-Headers":"authorization, apikey, content-type","Access-Control-Allow-Methods":"POST, OPTIONS","Vary":"Origin"};
function respond(code:number,body:unknown){return new Response(JSON.stringify(body),{status:code,headers:{...cors,"Content-Type":"application/json","Cache-Control":"no-store"}})}
serve(async req=>{
 if(req.method==="OPTIONS")return new Response(null,{status:204,headers:cors});
 if(req.method!=="POST")return respond(405,{error:"Method not allowed"});
 if(req.headers.get("Origin")!==origin)return respond(403,{error:"Origin not allowed"});
 const authorization=req.headers.get("Authorization")||"";
 if(!authorization.startsWith("Bearer "))return respond(401,{error:"Přihlášení je nutné."});
 const url=Deno.env.get("SUPABASE_URL"),key=Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
 if(!url||!key)return respond(503,{error:"Obsah zatím není dostupný."});
 const supabase=createClient(url,key,{auth:{autoRefreshToken:false,persistSession:false}});
 const {data:{user},error:authError}=await supabase.auth.getUser(authorization.slice(7));
 if(authError||!user?.id)return respond(401,{error:"Neplatné přihlášení."});
 const now=new Date().toISOString();
 const {data:memberships,error:membershipError}=await supabase.from("memberships")
  .select("id").eq("user_id",user.id).eq("status","active").lte("starts_at",now).gt("ends_at",now).limit(1);
 if(membershipError)return respond(503,{error:"Nepodařilo se ověřit členství."});
 if(!memberships?.length)return respond(403,{error:"Aktivní členství je vyžadováno."});
 let input:unknown;
 try{input=await req.json()}catch{return respond(400,{error:"Neplatný požadavek."})}
 const {action,module,id,answer}=input as {action?:unknown,module?:unknown,id?:unknown,answer?:unknown};
 if(typeof module!=="string"||!/^[-a-z0-9_]{1,48}$/.test(module))return respond(400,{error:"Neplatný modul."});
 if(action==="question"){
   const {data,error}=await supabase.from("premium_questions").select("id,module_key,question_body,options")
     .eq("module_key",module).order("created_at",{ascending:true}).limit(50);
   if(error)return respond(503,{error:"Databáze otázek není dostupná."});
   return respond(200,{questions:data||[]}); // No correct_answer, no explanation.
 }
 if(action==="answer"){
   if(typeof id!=="string"||!/^[0-9a-f-]{36}$/i.test(id)||typeof answer!=="string"||answer.length>500)return respond(400,{error:"Neplatná odpověď."});
   const {data,error}=await supabase.from("premium_questions")
    .select("correct_answer,explanation").eq("id",id).eq("module_key",module).maybeSingle();
   if(error)return respond(503,{error:"Databáze není dostupná."});
   if(!data)return respond(404,{error:"Otázka nenalezena."});
   return respond(200,{correct:answer===data.correct_answer,correctAnswer:data.correct_answer,explanation:data.explanation});
 }
 return respond(400,{error:"Neznámá akce."});
});
