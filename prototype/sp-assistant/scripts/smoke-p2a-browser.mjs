import { spawn } from "node:child_process";
import { mkdtemp, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";

const browserPath=process.env.BROWSER_PATH??"C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe";
const target=process.env.SMOKE_URL??"http://127.0.0.1:4199/";
const loginId=process.env.SMOKE_LOGIN_ID,password=process.env.SMOKE_PASSWORD;
if(!loginId||!password)throw new Error("SMOKE_LOGIN_ID and SMOKE_PASSWORD are required");
const profile=await mkdtemp(join(tmpdir(),"cpmoakb-p2a-browser-"));
const browser=spawn(browserPath,["--headless=new","--disable-gpu","--no-first-run","--no-default-browser-check","--remote-debugging-port=9339",`--user-data-dir=${profile}`,"about:blank"],{stdio:"ignore"});
const delay=(ms)=>new Promise((resolve)=>setTimeout(resolve,ms));
async function retry(task,message){let last;for(let attempt=0;attempt<80;attempt+=1){try{return await task();}catch(error){last=error;await delay(100);}}throw new Error(`${message}: ${last?.message??"timed out"}`);}
let socket;
try{
  await retry(async()=>{const response=await fetch("http://127.0.0.1:9339/json/version");if(!response.ok)throw new Error(String(response.status));return response.json();},"browser did not start");
  const created=await (await fetch(`http://127.0.0.1:9339/json/new?${encodeURIComponent(target)}`,{method:"PUT"})).json();
  socket=new WebSocket(created.webSocketDebuggerUrl);await new Promise((resolve,reject)=>{socket.addEventListener("open",resolve,{once:true});socket.addEventListener("error",reject,{once:true});});
  let sequence=0;const pending=new Map();socket.addEventListener("message",(event)=>{const message=JSON.parse(event.data);if(message.id&&pending.has(message.id)){const {resolve,reject}=pending.get(message.id);pending.delete(message.id);message.error?reject(new Error(message.error.message)):resolve(message.result);}});
  const send=(method,params={})=>new Promise((resolve,reject)=>{const id=++sequence;pending.set(id,{resolve,reject});socket.send(JSON.stringify({id,method,params}));});
  const evaluate=async(expression)=>{const result=await send("Runtime.evaluate",{expression,awaitPromise:true,returnByValue:true});if(result.exceptionDetails)throw new Error(result.exceptionDetails.text);return result.result.value;};
  await send("Runtime.enable");await send("Page.enable");await send("Page.navigate",{url:target});
  await retry(async()=>{if(await evaluate("document.readyState")==="loading")throw new Error("loading");},"login page did not load");
  await retry(async()=>{if(!await evaluate("Boolean(document.querySelector('[data-login-form]'))"))throw new Error("login form missing");},"login form did not render");
  await evaluate(`(()=>{document.querySelector('[name=login_id]').value=${JSON.stringify(loginId)};document.querySelector('[name=password]').value=${JSON.stringify(password)};document.querySelector('[data-login-form]').dispatchEvent(new Event('submit',{bubbles:true,cancelable:true}));})()`);
  await retry(async()=>{if(!await evaluate("Boolean(document.querySelector('[data-route=home]'))"))throw new Error("post-login route missing");},"post-login route did not render");await evaluate("document.querySelector('[data-route=home]').click()");
  try{await retry(async()=>{const text=await evaluate("document.body.innerText");if(!text.includes('งานที่ควรทำตอนนี้'))throw new Error("Home projection missing");},"Home did not render");}catch(error){throw new Error(`${error.message}\nRendered body: ${await evaluate("document.body.innerText")}`);}
  const nav=await evaluate("document.querySelector('.field-bottom-nav')?.innerText??''");if(nav.includes("กล่องข้อมูล"))throw new Error("Inbox navigation visible without review scope");
  await evaluate("document.querySelector('[data-route=profile]').click()");
  await retry(async()=>{const text=await evaluate("document.body.innerText");if(!text.includes('ขอบเขตงานที่ระบบยืนยัน')||!text.includes('single-pilot'))throw new Error("Profile projection missing");},"Profile did not render");
  const profileText=await evaluate("document.body.innerText");if(/grant_id|subject_user_id|password|secret|token/i.test(profileText))throw new Error("Profile exposed raw access internals");
  await evaluate("(()=>{const button=document.createElement('button');button.dataset.route='learning-inbox';document.querySelector('#field-app').append(button);button.click();})()");
  await retry(async()=>{const text=await evaluate("document.body.innerText");if(!text.includes('บัญชีนี้ยังไม่มีงานหรือสิทธิ์สำหรับการทบทวน'))throw new Error("unauthorized state missing");},"Inbox unauthorized state did not render");
  console.log("FW01P2A browser smoke passed: Home, hidden Inbox navigation, Profile projection, and explicit unauthorized Inbox state");
}finally{socket?.close();browser.kill();await rm(profile,{recursive:true,force:true,maxRetries:5,retryDelay:50});}
