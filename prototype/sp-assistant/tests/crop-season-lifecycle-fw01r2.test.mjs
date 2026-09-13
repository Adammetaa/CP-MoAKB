import test from "node:test";
import assert from "node:assert/strict";
import { mkdtemp, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { PilotStore } from "../pilot-store.mjs";
import { startServer } from "../server.mjs";
import { createEmptyCandidateProvider } from "../candidate-provider.mjs";

const users=[{login_id:"owner",user_id:"owner",password:"owner-secret",role:"FIELD_USER",tenant_id:"tenant-a",enabled:true},{login_id:"spa",user_id:"spa",password:"spa-secret",role:"SPA",tenant_id:"tenant-a",enabled:true},{login_id:"coordinator",user_id:"coordinator",password:"coordinator-secret",role:"SPA",tenant_id:"tenant-a",capabilities:["REVIEW_COORDINATE"],enabled:true}];
const scope={field_id:"field-season",season_id:"season-one"};
function initial(){return{schema_version:2,users:[{user_id:"owner",role:"FIELD_USER"}],fields:[{...scope,owner_user_id:"owner",name:"Seasoned Field",crop:"rice",planting_date:"2026-01-01",current_crop_stage:{code:"TILLERING",label:"แตกกอ"},current_cmp_stage:{stage_id:"CMP-03",label:"ระยะแตกกอ"},stage_provenance:"USER_CONFIRMED",created_at:"2026-01-01T00:00:00Z",updated_at:"2026-01-01T00:00:00Z"}],seasons:[{...scope,crop:"rice",planting_date:"2026-01-01",status:"ACTIVE"}],guidance:[],activities:[],cases:[],observations:[],evidence:[],conversations:[],messages:[],decision_logs:[],case_summaries:[],weather_snapshots:[]};}
async function harness(){const root=await mkdtemp(join(tmpdir(),"cpmoakb-fw01r2-season-")),dbPath=join(root,"pilot.sqlite"),exportDir=join(root,"exports"),uploadDir=join(root,"uploads"),store=await new PilotStore({dbPath,exportDir,pilotProfile:"FIELD_CAPTURE_ALPHA",scopedIdentities:users,investigationCandidateProvider:createEmptyCandidateProvider()}).open();store.putWorkspace("owner",initial());return{root,dbPath,exportDir,uploadDir,store,close:async()=>{store.close();await rm(root,{recursive:true,force:true,maxRetries:5,retryDelay:50});}};}
const next={field_id:scope.field_id,expected_current_season_id:scope.season_id,crop:"rice",variety:"new variety",planting_method:"DIRECT_SEEDING",planting_date:"2026-08-01"};

test("FW01R2 current season changes while old Case, Observation, Evidence, and stage retain season one",async()=>{
  const h=await harness();let reopened,server;
  try{
    const before=h.store.getLifecycle("owner");assert.equal(before.fields[0].season_id,scope.season_id);assert.deepEqual(before.seasons.map((item)=>item.season_id),[scope.season_id]);
    h.store.createInvestigationRecord("owner","CASE",{...scope,case_id:"case-old",purpose:"Historical issue"});
    h.store.createInvestigationRecord("owner","OBSERVATION",{...scope,case_id:"case-old",observation_id:"observation-old",source:"FIELD_OBSERVED",note:"Historical observation"});
    h.store.createInvestigationRecord("owner","MORPHOLOGY_EVIDENCE",{...scope,case_id:"case-old",observation_id:"observation-old",evidence_id:"evidence-old",source:"FIELD_OBSERVED",evidence_level:"MO1_DIRECT_OBSERVATION",payload:{plant_part:"WHOLE_PLANT",primary_phenotypes:["YELLOWING"]}});
    const result=h.store.transitionCropSeason("owner",next),newSeasonId=result.season.season_id;
    assert.equal(result.previous_season_id,"season-one");assert.notEqual(newSeasonId,"season-one");assert.equal(result.field.season_id,newSeasonId);
    const lifecycle=h.store.getLifecycle("owner");assert.deepEqual(new Set(lifecycle.seasons.map((item)=>item.season_id)),new Set(["season-one",newSeasonId]));assert.equal(lifecycle.seasons.find((item)=>item.season_id==="season-one").status,"COMPLETED");assert.equal(lifecycle.seasons.find((item)=>item.season_id===newSeasonId).status,"ACTIVE");assert.equal(lifecycle.fields[0].planting_date,"2026-08-01");assert.equal(lifecycle.fields[0].current_crop_stage,null);
    const old=h.store.getInvestigationBundle("owner",{...scope,case_id:"case-old"});assert.equal(old.field_context.season_id,"season-one");assert.equal(old.field_context.season_status,"COMPLETED");assert.equal(old.cases[0].season_id,"season-one");assert.equal(old.observations[0].season_id,"season-one");assert.equal(old.evidence[0].season_id,"season-one");assert.equal(h.store.db.prepare("SELECT crop_stage_json FROM stage_assessments WHERE owner_user_id='owner' AND season_id='season-one'").get().crop_stage_json.includes("TILLERING"),true);
    const newCase=h.store.createInvestigationRecord("owner","CASE",{field_id:scope.field_id,season_id:newSeasonId,case_id:"case-new",purpose:"New season issue"});assert.equal(newCase.season_id,newSeasonId);
    const timeline=h.store.getInvestigationTimeline("owner",{...scope,case_id:"case-old"});assert.equal(timeline.case_id,"case-old");assert.ok(timeline.events.some((item)=>item.record_id==="observation-old"));
    h.store.close();reopened=await new PilotStore({dbPath:h.dbPath,exportDir:h.exportDir,pilotProfile:"FIELD_CAPTURE_ALPHA",scopedIdentities:users,investigationCandidateProvider:createEmptyCandidateProvider()}).open();
    assert.equal(reopened.getLifecycle("owner").fields[0].season_id,newSeasonId);assert.equal(reopened.getLifecycle("owner").seasons.length,2);assert.equal(reopened.getInvestigationBundle("owner",{...scope,case_id:"case-old"}).evidence[0].evidence_id,"evidence-old");assert.equal(reopened.getInvestigationBundle("owner",{field_id:scope.field_id,season_id:newSeasonId,case_id:"case-new"}).cases[0].case_id,"case-new");
    reopened.close();reopened=null;
    server=await startServer({port:0,dbPath:h.dbPath,exportDir:h.exportDir,uploadDir:h.uploadDir,pilotProfile:"FIELD_CAPTURE_ALPHA",pilotUsers:users,investigationCandidateProvider:createEmptyCandidateProvider()});
    const base=`http://127.0.0.1:${server.address().port}`,login=await fetch(`${base}/api/pilot/session`,{method:"POST",headers:{"content-type":"application/json"},body:JSON.stringify({login_id:"owner",password:"owner-secret"})}),cookie=login.headers.get("set-cookie").split(";")[0],detail=await fetch(`${base}/api/pilot/access/field?field_id=${scope.field_id}`,{headers:{cookie}}),body=await detail.json();assert.equal(detail.status,200);assert.equal(body.field.season_id,newSeasonId);assert.equal(body.field.planting_date,"2026-08-01");assert.equal(body.field.current_crop_stage,null);assert.equal(body.cases.some((item)=>item.case_id==="case-old"),true);
  }finally{if(server)await new Promise((done)=>server.close(done));reopened?.close();await h.close();}
});

test("FW01R2 lifecycle rejects cross-Field pointer and two active seasons without mutation",async()=>{
  const h=await harness();try{
    const original=h.store.getWorkspace("owner").state,foreign=structuredClone(original);foreign.fields.push({...foreign.fields[0],field_id:"field-other",season_id:"season-other",name:"Other Field"});foreign.seasons.push({field_id:"field-other",season_id:"season-other",crop:"rice",status:"ACTIVE"});foreign.fields[0].season_id="season-other";
    assert.throws(()=>h.store.putWorkspace("owner",foreign),/field season mismatch/);
    const both=structuredClone(original);both.fields[0].season_id="season-two";both.seasons.push({field_id:scope.field_id,season_id:"season-two",crop:"rice",status:"ACTIVE"});assert.throws(()=>h.store.putWorkspace("owner",both),/invalid active crop season/);
    assert.equal(h.store.getLifecycle("owner").fields[0].season_id,"season-one");assert.equal(h.store.getLifecycle("owner").seasons.length,1);
    const transition=h.store.transitionCropSeason("owner",next);assert.throws(()=>h.store.transitionCropSeason("owner",next),/current crop season changed/);assert.equal(h.store.getLifecycle("owner").fields[0].season_id,transition.season.season_id);
  }finally{await h.close();}
});

test("FW01R2 season transition API is owner-authorized and current-context only",async()=>{
  const h=await harness();h.store.close();const server=await startServer({port:0,dbPath:h.dbPath,exportDir:h.exportDir,uploadDir:h.uploadDir,pilotProfile:"FIELD_CAPTURE_ALPHA",pilotUsers:users,investigationCandidateProvider:createEmptyCandidateProvider()});
  try{const base=`http://127.0.0.1:${server.address().port}`,cookies={};for(const user of users){const login=await fetch(`${base}/api/pilot/session`,{method:"POST",headers:{"content-type":"application/json"},body:JSON.stringify({login_id:user.login_id,password:user.password})});cookies[user.user_id]=login.headers.get("set-cookie").split(";")[0];}const submit=(user,payload)=>fetch(`${base}/api/pilot/crop-seasons`,{method:"POST",headers:{cookie:cookies[user],"content-type":"application/json"},body:JSON.stringify(payload)});assert.notEqual((await submit("spa",next)).status,201);const created=await submit("owner",next);assert.equal(created.status,201);const body=await created.json();assert.equal(body.field.season_id,body.season.season_id);assert.equal((await submit("owner",next)).status,409);const lifecycle=await(await fetch(`${base}/api/pilot/lifecycle`,{headers:{cookie:cookies.owner}})).json();assert.equal(lifecycle.fields[0].season_id,body.season.season_id);assert.equal(lifecycle.seasons.length,2);}finally{await new Promise((done)=>server.close(done));await h.close();}
});
