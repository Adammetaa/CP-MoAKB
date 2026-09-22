import { spawn } from "node:child_process";
import { mkdtemp, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { PilotStore } from "../pilot-store.mjs";
import { createEmptyCandidateProvider } from "../candidate-provider.mjs";
import { startServer } from "../server.mjs";

const user={login_id:"p2b-admin",user_id:"p2b-admin",password:"p2b-browser-secret",display_name:"P2B Admin",role:"ADMIN",tenant_id:"tenant-p2b",enabled:true};
const field={field_id:"field-p2b-browser",season_id:"season-p2b-browser-one",owner_user_id:user.user_id,name:"แปลงทดสอบ P2B",polygon:{type:"Polygon",coordinates:[[[100,13],[100.01,13],[100,13.01],[100,13]]]},centroid:{latitude:13.003,longitude:100.003},area:{rai:1.2,hectares:0.19},crop:"rice",variety:"หอมมะลิ",planting_date:"2026-01-01",current_crop_stage:{code:"TILLERING",label:"แตกกอ"},current_cmp_stage:{stage_id:"CMP-03",label:"ระยะแตกกอ"},stage_provenance:"USER_CONFIRMED",created_at:"2026-01-01T00:00:00Z",updated_at:"2026-01-01T00:00:00Z"};
const state={schema_version:2,users:[{user_id:user.user_id,role:"FIELD_USER"}],fields:[field],seasons:[{field_id:field.field_id,season_id:field.season_id,crop:"rice",planting_date:field.planting_date,status:"ACTIVE",created_at:field.created_at,updated_at:field.updated_at}],guidance:[],activities:[],cases:[],observations:[],evidence:[],conversations:[],messages:[],decision_logs:[],case_summaries:[],weather_snapshots:[]};
const root=await mkdtemp(join(tmpdir(),"cpmoakb-p2b-browser-"));
const dbPath=join(root,"pilot.sqlite"),exportDir=join(root,"exports"),uploadDir=join(root,"uploads"),profile=join(root,"chrome");
const seed=await new PilotStore({dbPath,exportDir,scopedIdentities:[user],investigationCandidateProvider:createEmptyCandidateProvider()}).open();
seed.putWorkspace(user.user_id,state);
seed.transitionCropSeason(user.user_id,{field_id:field.field_id,expected_current_season_id:field.season_id,crop:"rice",variety:"ปทุมธานี 1",planting_method:"DIRECT_SEEDING",planting_date:"2026-08-01"});
seed.close();
const server=await startServer({port:0,host:"127.0.0.1",dbPath,exportDir,uploadDir,pilotUsers:[user],investigationCandidateProvider:createEmptyCandidateProvider()});
const target=`http://127.0.0.1:${server.address().port}/`;
const browserPath=process.env.BROWSER_PATH??"C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe";
const visible=process.env.SMOKE_VISIBLE==="1",debugPort=9340;
const browser=spawn(browserPath,[visible?"--new-window":"--headless=new","--disable-gpu","--no-first-run","--no-default-browser-check",`--remote-debugging-port=${debugPort}`,`--user-data-dir=${profile}`,"about:blank"],{stdio:["ignore","ignore","pipe"]});
let browserErrors="";browser.stderr.on("data",(chunk)=>{browserErrors+=String(chunk);});
const delay=(ms)=>new Promise((resolve)=>setTimeout(resolve,ms));
async function retry(task,message){let last;for(let attempt=0;attempt<100;attempt+=1){try{return await task();}catch(error){last=error;await delay(100);}}throw new Error(`${message}: ${last?.message??"timed out"}`);}
let socket;
try{
  await retry(async()=>{const response=await fetch(`http://127.0.0.1:${debugPort}/json/version`);if(!response.ok)throw new Error(String(response.status));},"browser did not start");
  const created=await (await fetch(`http://127.0.0.1:${debugPort}/json/new?${encodeURIComponent(target)}`,{method:"PUT"})).json();
  socket=new WebSocket(created.webSocketDebuggerUrl);
  await new Promise((resolve,reject)=>{socket.addEventListener("open",resolve,{once:true});socket.addEventListener("error",reject,{once:true});});
  let sequence=0;const pending=new Map(),pageErrors=[];
  socket.addEventListener("message",(event)=>{const message=JSON.parse(event.data);if(message.method==="Runtime.exceptionThrown"){const detail=message.params.exceptionDetails;pageErrors.push(detail.exception?.description??`${detail.text} at ${detail.url}:${detail.lineNumber}`);}if(message.id&&pending.has(message.id)){const handlers=pending.get(message.id);pending.delete(message.id);message.error?handlers.reject(new Error(`${message.error.message}${browserErrors?`\n${browserErrors}`:""}`)):handlers.resolve(message.result);}});
  const send=(method,params={})=>new Promise((resolve,reject)=>{const id=++sequence;pending.set(id,{resolve,reject});socket.send(JSON.stringify({id,method,params}));});
  const evaluate=async(expression)=>{const result=await send("Runtime.evaluate",{expression,awaitPromise:true,returnByValue:true});if(result.exceptionDetails)throw new Error(result.exceptionDetails.text);return result.result.value;};
  await send("Runtime.enable");await send("Page.enable");await send("Page.navigate",{url:target});
  await retry(async()=>{if(!await evaluate("Boolean(document.querySelector('[data-login-form]'))"))throw new Error("login missing");},"login page did not render");
  await evaluate(`(()=>{document.querySelector('[name=login_id]').value=${JSON.stringify(user.login_id)};document.querySelector('[name=password]').value=${JSON.stringify(user.password)};document.querySelector('[data-login-form]').dispatchEvent(new Event('submit',{bubbles:true,cancelable:true}));})()`);
  await retry(async()=>{if(!await evaluate("Boolean(document.querySelector('[data-route=fields], [data-route=home]'))"))throw new Error(await evaluate("document.body.innerText"));},"workspace did not render");
  if(!await evaluate("Boolean(document.querySelector('[data-route=fields]'))")){await evaluate("document.querySelector('[data-route=home]').click()");await retry(async()=>{if(!await evaluate("Boolean(document.querySelector('[data-route=fields]'))"))throw new Error("Home navigation missing");},"Home did not render");}
  await evaluate("document.querySelector('[data-route=fields]').click()");
  await retry(async()=>{if(!await evaluate("Boolean(document.querySelector('[data-field-open]'))"))throw new Error("field missing");},"Field list did not render");
  await evaluate("document.querySelector('[data-field-open]').click()");
  await retry(async()=>{if(!await evaluate("Boolean(document.querySelector('[data-action=open-history]'))"))throw new Error(`${await evaluate("document.body.innerText")}\n${pageErrors.join(" | ")}`);},"Field detail did not render");
  await evaluate("document.querySelector('[data-action=open-history]').click()");
  await retry(async()=>{const value=await evaluate("({text:document.body.innerText,count:document.querySelectorAll('[data-history-season] option').length})");if(value.count!==2||!value.text.includes('FIELD-HISTORY-01')||!value.text.includes('HISTORICAL / COMPLETED')||!value.text.includes('CURRENT'))throw new Error(JSON.stringify(value));},"historical Crop Season selector did not render");
  await evaluate("(()=>{const button=document.createElement('button');button.dataset.route='assignments';document.querySelector('#field-app').append(button);button.click();})()");
  await retry(async()=>{const text=await evaluate("document.body.innerText");if(!text.includes('ASSIGNMENT-01')||!text.includes('สร้างการมอบหมาย'))throw new Error("assignment surface missing");},"Assignment Management did not render");
  await evaluate("(()=>{const button=document.createElement('button');button.dataset.action='notifications';document.querySelector('#field-app').append(button);button.click();})()");
  await retry(async()=>{const text=await evaluate("document.body.innerText");if(!text.includes('NOTIFICATION-01')||!text.includes('การแจ้งเตือนไม่ใช่สิทธิ์'))throw new Error("notification surface missing");},"Notification Center did not render");
  await evaluate("document.querySelector('[data-route=general-chat]').click()");
  await retry(async()=>{const text=await evaluate("document.body.innerText");if(!text.includes('CHAT-01')||!text.includes('ไม่ผูกแปลง'))throw new Error("general chat missing");},"General Chat did not render");
  await evaluate("(()=>{const input=document.querySelector('[data-general-chat-form] [name=message]');input.value='สวัสดีจาก browser smoke';input.dispatchEvent(new Event('input',{bubbles:true}));document.querySelector('[data-general-chat-form]').dispatchEvent(new Event('submit',{bubbles:true,cancelable:true}));})()");
  await retry(async()=>{if(await evaluate("document.querySelectorAll('.free-message').length")<2)throw new Error("turn not rendered");},"General Chat turn did not complete");
  if(pageErrors.length)throw new Error(`browser page errors: ${pageErrors.join(" | ")}`);
  console.log(`FW01P2B browser smoke passed: FIELD-HISTORY-01, ASSIGNMENT-01, NOTIFICATION-01, CHAT-01 at ${target}`);
  const hold=Number(process.env.SMOKE_HOLD_MS??0);if(hold>0)await delay(hold);
}finally{
  socket?.close();if(browser.exitCode===null){const exited=new Promise((resolve)=>browser.once("exit",resolve));browser.kill();await Promise.race([exited,delay(3000)]);}await new Promise((resolve)=>server.close(resolve));await rm(root,{recursive:true,force:true,maxRetries:5,retryDelay:100});
}
