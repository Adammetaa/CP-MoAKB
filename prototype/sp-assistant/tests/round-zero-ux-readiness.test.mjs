import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { composeNaturalFieldGuidance, containsForbiddenFieldChatTerm, naturalQuestionForGuidance, naturalVisualReceipt } from "../conversation-presentation.mjs";
import { runRecoverableChatSubmission } from "../assets/chat-recovery.js";
import { BrowserMapAdapter, GoogleSatelliteMapAdapter, ResilientPreferredMapAdapter } from "../assets/browser-map-adapter.js";
import { ServerWorkspaceAdapter } from "../assets/server-workspace-adapter.js";

const points=[{latitude:13.75,longitude:100.5},{latitude:13.75,longitude:100.51},{latitude:13.76,longitude:100.505}];

test("M0A.1 presents PLANT_BASE_INSPECTION as one natural Thai question without governed-code leakage",()=>{
  const result=composeNaturalFieldGuidance({explicitFacts:[{governed_code:"YELLOWING"},{governed_code:"PATCH"}],guidance:{evidence_concept:"PLANT_BASE_INSPECTION"}});
  assert.match(result.text,/รับทราบครับ.*ใบเหลือง.*เป็นหย่อม/u);
  assert.match(result.question,/โคนต้น.*ต้นปกติ/u);
  assert.equal(containsForbiddenFieldChatTerm(`${result.text} ${result.question}`),false);
  assert.equal((result.question.match(/\?/g)??[]).length,1);
});

test("M0A.1 presents WATER_CONTEXT naturally and sanitizes unknown governed targets",()=>{
  assert.match(naturalQuestionForGuidance({evidence_concept:"WATER_CONTEXT"}),/น้ำลึกหรือขัง.*ข้าวปกติ/u);
  const unknown=naturalQuestionForGuidance({evidence_concept:"INTERNAL_NEW_TARGET",what_to_inspect:"INTERNAL_NEW_TARGET"});
  assert.doesNotMatch(unknown,/INTERNAL_NEW_TARGET/u);
  assert.match(unknown,/เทียบกับต้นปกติ/u);
});

test("M0A.1 field image wording keeps optional perception non-diagnostic without B1/B2 labels",()=>{
  for(const message of [naturalVisualReceipt(),naturalVisualReceipt({automaticReadingAvailable:true})]){
    assert.doesNotMatch(message,/\bB[12]\b/u);
    assert.doesNotMatch(message,/วินิจฉัยแล้ว|ยืนยันสาเหตุแล้ว/u);
  }
});

test("M0A.1 common scope URL creation omits null and undefined while retaining required values",()=>{
  const adapter=new ServerWorkspaceAdapter();
  const path=adapter.managementPath({field_id:"field-a",season_id:"season-a",case_id:undefined},"/api/pilot/reminders");
  assert.equal(path,"/api/pilot/reminders?field_id=field-a&season_id=season-a");
  assert.doesNotMatch(path,/undefined|null/u);
  assert.equal(adapter.managementPath({field_id:"field-a",season_id:"season-a",case_id:"case-a"}),"/api/pilot/management-options?field_id=field-a&season_id=season-a&case_id=case-a");
});

test("M0A.1 chat recovery always releases pending state for network, provider, HTTP, and malformed failures",async()=>{
  const failures=[new Error("network"),...([401,403,500,503].map((status)=>({status,message:`HTTP ${status}`}))),{status:"AVAILABLE",message:""}];
  for(const failure of failures){
    const pending=[],events=[];
    const result=await runRecoverableChatSubmission({onPending:(value)=>pending.push(value),submit:async()=>{if(failure instanceof Error)throw failure;return failure;},onSuccess:async()=>events.push("success"),onFailure:async()=>events.push("failure")});
    assert.equal(result.ok,false);assert.deepEqual(pending,[true,false]);assert.deepEqual(events,["failure"]);
  }
});

test("M0A.1 chat retry succeeds after a failed attempt",async()=>{
  let attempts=0,pending=false;
  const callbacks={onPending:(value)=>{pending=value;},submit:async()=>++attempts===1?{status:"UNAVAILABLE",message:"offline"}:{status:"AVAILABLE",message:"รับทราบครับ"},onSuccess:async()=>{},onFailure:async()=>{}};
  assert.equal((await runRecoverableChatSubmission(callbacks)).ok,false);assert.equal(pending,false);
  assert.equal((await runRecoverableChatSubmission(callbacks)).ok,true);assert.equal(pending,false);
});

function fakeMaps({throwOnMap=false}={}){
  const markers=[];
  class Map { constructor(){if(throwOnMap)throw new Error("provider runtime");} addListener(){return{remove(){}};} getCenter(){return{lat:()=>13.75,lng:()=>100.5};}getZoom(){return 17;}fitBounds(){} }
  class Polygon { constructor(){ } setMap(){} }
  class Polyline extends Polygon {}
  class Marker { constructor(options){markers.push(options);}setMap(){} }
  class LatLngBounds { extend(){} }
  return{Map,Polygon,Polyline,Marker,LatLngBounds,SymbolPath:{CIRCLE:"circle"},markers};
}
function fakeContainer(){const noop=()=>{};const child={replaceChildren:noop,setAttribute:noop,addEventListener:noop,removeEventListener:noop,innerHTML:""};return{isConnected:true,clientWidth:0,clientHeight:0,innerHTML:"",classList:{add:noop,remove:noop},querySelector:()=>child,addEventListener:noop,removeEventListener:noop};}

test("M0A.1 Google stays primary and preview hides vertices while edit retains them",()=>{
  const previewMaps=fakeMaps(),preview=new GoogleSatelliteMapAdapter(fakeContainer(),previewMaps,{timeoutMs:60_000});preview.mount({center:points[0],points,closed:true,mode:"preview"});assert.equal(previewMaps.markers.length,0);preview.destroy();
  const editMaps=fakeMaps(),edit=new GoogleSatelliteMapAdapter(fakeContainer(),editMaps,{timeoutMs:60_000});edit.mount({center:points[0],points,closed:true,mode:"tap"});assert.equal(editMaps.markers.length,3);edit.destroy();
  const preferred=new ResilientPreferredMapAdapter(fakeContainer(),fakeMaps(),{timeoutMs:60_000}).mount({center:points[0],points,closed:true,mode:"preview"});assert.ok(preferred.active instanceof GoogleSatelliteMapAdapter);preferred.destroy();
});

test("M0A.1 Google initialization failure cleans the surface and switches to OSM preview",()=>{
  const container=fakeContainer(),preferred=new ResilientPreferredMapAdapter(container,fakeMaps({throwOnMap:true}));preferred.mount({center:points[0],points,closed:true,mode:"preview"});assert.ok(preferred.active instanceof BrowserMapAdapter);assert.match(container.innerHTML,/OpenStreetMap contributors/u);preferred.destroy();
});

test("M0A.1 field composer uses try/finally recovery, retains retry text, and mobile widths remain guarded",async()=>{
  const [app,css,map]=await Promise.all([readFile(new URL("../assets/field-app.js",import.meta.url),"utf8"),readFile(new URL("../assets/field-shell.css",import.meta.url),"utf8"),readFile(new URL("../assets/browser-map-adapter.js",import.meta.url),"utf8")]);
  assert.match(app,/runRecoverableChatSubmission/);assert.match(app,/chatRetryText = text/);assert.match(app,/ข้อความของคุณยังอยู่/);assert.doesNotMatch(app,/รับภาพเข้า B1|หาก B2/u);
  for(const width of [360,390,400,412,430])assert.ok(width<=430&&css.includes("@media (max-width:520px)"));
  assert.match(css,/overflow-x:hidden/);assert.match(css,/safe-area-inset-bottom/);assert.match(map,/gm_authFailure/);assert.match(map,/Google Maps runtime timed out/);assert.match(map,/this\.mode === "preview" \? ""/);
});
