import test from "node:test";
import assert from "node:assert/strict";
import { mkdtemp, readdir, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { DatabaseSync } from "node:sqlite";
import { PilotStore } from "../pilot-store.mjs";
import { startServer } from "../server.mjs";
import { createEmptyCandidateProvider } from "../candidate-provider.mjs";
import { PILOT_SCHEMA_VERSION } from "../pilot-hardening-runtime.mjs";

const users=[
  {login_id:"owner",user_id:"owner",password:"owner-secret",role:"FIELD_USER",tenant_id:"tenant-a",enabled:true},
  {login_id:"spa",user_id:"spa",password:"spa-secret",role:"SPA",tenant_id:"tenant-a",enabled:true},
  {login_id:"coordinator",user_id:"coordinator",password:"coordinator-secret",role:"SPA",tenant_id:"tenant-a",capabilities:["REVIEW_COORDINATE"],enabled:true},
  {login_id:"foreign",user_id:"foreign",password:"foreign-secret",role:"FIELD_USER",tenant_id:"tenant-b",enabled:true},
];
const empty=(userId,fieldId,seasonId)=>({schema_version:2,users:[{user_id:userId}],fields:[{field_id:fieldId,season_id:seasonId,owner_user_id:userId,name:`Field ${fieldId}`,crop:"rice",planting_date:"2026-08-01",created_at:"2026-09-01T00:00:00Z",updated_at:"2026-09-01T00:00:00Z"}],seasons:[{field_id:fieldId,season_id:seasonId,crop:"rice",status:"ACTIVE"}],guidance:[],activities:[],cases:[],observations:[],evidence:[],conversations:[],messages:[],decision_logs:[],case_summaries:[],weather_snapshots:[]});
async function harness(){
  const root=await mkdtemp(join(tmpdir(),"cpmoakb-fw01r2-visual-")),dbPath=join(root,"pilot.sqlite"),exportDir=join(root,"exports"),uploadDir=join(root,"uploads");
  const store=await new PilotStore({dbPath,exportDir,pilotProfile:"FIELD_CAPTURE_ALPHA",scopedIdentities:users,investigationCandidateProvider:createEmptyCandidateProvider()}).open();
  store.putWorkspace("owner",empty("owner","field-a","season-a"));
  store.putWorkspace("foreign",empty("foreign","field-foreign","season-foreign"));
  for(const caseId of ["case-a","case-b"])store.createInvestigationRecord("owner","CASE",{field_id:"field-a",season_id:"season-a",case_id:caseId,purpose:caseId});
  store.createInvestigationRecord("foreign","CASE",{field_id:"field-foreign",season_id:"season-foreign",case_id:"case-foreign",purpose:"private foreign"});
  return{root,dbPath,exportDir,uploadDir,store,close:async()=>{store.close();await rm(root,{recursive:true,force:true,maxRetries:5,retryDelay:50});}};
}
async function serve(h){
  h.store.close();
  const server=await startServer({port:0,dbPath:h.dbPath,exportDir:h.exportDir,uploadDir:h.uploadDir,pilotProfile:"FIELD_CAPTURE_ALPHA",pilotUsers:users,investigationCandidateProvider:createEmptyCandidateProvider()});
  const base=`http://127.0.0.1:${server.address().port}`,cookies={};
  for(const user of users){const result=await fetch(`${base}/api/pilot/session`,{method:"POST",headers:{"content-type":"application/json"},body:JSON.stringify({login_id:user.login_id,password:user.password})});assert.equal(result.status,200);cookies[user.user_id]=result.headers.get("set-cookie").split(";")[0];}
  return{server,base,cookies,close:()=>new Promise((done)=>server.close(done))};
}
const bytes=Buffer.from("identical-pilot-image-bytes");
function imagePayload(caseId,{fieldId="field-a",seasonId="season-a"}={}){return{field_id:fieldId,crop_season_id:seasonId,case_id:caseId,captured_at:"2026-09-14T08:00:00Z",source:"UPLOAD",capture_intent:"LEAF",plant_part_scope:"LEAF_BLADE",spatial_scope:"SAMPLED_OBJECT",view_type:"DETAIL",original_filename:"same.png",media_type:"image/png",size_bytes:bytes.length,content_base64:bytes.toString("base64")};}
async function upload(app,user,caseId,scope){const response=await fetch(`${app.base}/api/pilot/visual-evidence`,{method:"POST",headers:{cookie:app.cookies[user],"content-type":"application/json"},body:JSON.stringify(imagePayload(caseId,scope))});return{status:response.status,body:await response.json()};}
const get=(app,user,path)=>fetch(app.base+path,{headers:{cookie:app.cookies[user]}});
const post=(app,user,path,body)=>fetch(app.base+path,{method:"POST",headers:{cookie:app.cookies[user],"content-type":"application/json"},body:JSON.stringify(body)});

test("FW01R2 identical bytes have separate Case bindings, shared storage, and isolated provenance",async()=>{
  const h=await harness(),grant=h.store.access.grant("coordinator",{subject_user_id:"spa",scope_type:"CASE",scope_id:"case-a",capability:"CASE_OPERATE",reason:"Case A only"});let app;
  try{
    app=await serve(h);
    const privateUpload=await upload(app,"owner","case-b");assert.equal(privateUpload.status,201);
    const privateId=privateUpload.body.image.image_evidence_id;
    const assignedUpload=await upload(app,"spa","case-a");assert.equal(assignedUpload.status,201);
    const assignedId=assignedUpload.body.image.image_evidence_id;
    assert.notEqual(assignedId,privateId);assert.equal(assignedUpload.body.image.case_id,"case-a");
    assert.ok(!JSON.stringify(assignedUpload.body).includes("case-b"));assert.ok(!JSON.stringify(assignedUpload.body).includes(privateId));
    assert.equal((await get(app,"spa",`/api/pilot/visual-evidence?image_evidence_id=${privateId}`)).status,403);
    assert.equal((await get(app,"spa","/api/pilot/access/case?case_id=case-b")).status,404);
    const db=new DatabaseSync(h.dbPath,{readOnly:true});try{
      const rows=db.prepare("SELECT image_evidence_id,case_id,storage_key FROM image_evidence ORDER BY case_id").all();assert.equal(rows.length,2);assert.equal(rows[0].storage_key,rows[1].storage_key);
      const events=db.prepare("SELECT image_evidence_id,COUNT(*) count FROM image_capture_events GROUP BY image_evidence_id").all();assert.deepEqual(events.map((row)=>row.count),[1,1]);
    }finally{db.close();}
    assert.equal((await readdir(h.uploadDir)).length,1);
    const repeat=await upload(app,"spa","case-a");assert.equal(repeat.status,200);assert.equal(repeat.body.image.image_evidence_id,assignedId);assert.equal(repeat.body.image.exact_duplicate,true);
    const dbAfter=new DatabaseSync(h.dbPath,{readOnly:true});try{assert.equal(dbAfter.prepare("SELECT COUNT(*) count FROM image_capture_events WHERE image_evidence_id=?").get(privateId).count,1);assert.equal(dbAfter.prepare("SELECT COUNT(*) count FROM image_capture_events WHERE image_evidence_id=?").get(assignedId).count,2);}finally{dbAfter.close();}
    const revoked=await post(app,"coordinator","/api/pilot/access/revocations",{grant_id:grant.grant_id,reason:"Assignment ended"});assert.equal(revoked.status,200);
    assert.equal((await upload(app,"spa","case-a")).status,403);
  }finally{await app?.close();await h.close();}
});

test("FW01R2 identical bytes cannot cross tenant or unrelated Field scope",async()=>{
  const h=await harness();h.store.access.grant("coordinator",{subject_user_id:"spa",scope_type:"FIELD",scope_id:"field-a",capability:"FIELD_OPERATE",reason:"Field A only"});let app;
  try{app=await serve(h);const foreign=await upload(app,"foreign","case-foreign",{fieldId:"field-foreign",seasonId:"season-foreign"});assert.equal(foreign.status,201);const own=await upload(app,"spa","case-a");assert.equal(own.status,201);assert.notEqual(own.body.image.image_evidence_id,foreign.body.image.image_evidence_id);assert.ok(!JSON.stringify(own.body).includes("case-foreign"));assert.equal((await upload(app,"spa","case-foreign",{fieldId:"field-foreign",seasonId:"season-foreign"})).status,403);assert.equal((await get(app,"spa",`/api/pilot/visual-evidence?image_evidence_id=${foreign.body.image.image_evidence_id}`)).status,403);}finally{await app?.close();await h.close();}
});

test("FW01R2 v15 visual index migrates to Case-scoped uniqueness without rewriting images",async()=>{
  const h=await harness();try{
    const {content_base64:ignored,...privateMetadata}=imagePayload("case-b");void ignored;
    const original=h.store.createImageEvidence("owner",{...privateMetadata,content_hash:"a".repeat(64),storage_key:"old-image.png"});
    h.store.close();const db=new DatabaseSync(h.dbPath);try{db.exec("DROP INDEX image_evidence_case_content; CREATE UNIQUE INDEX image_evidence_exact_content ON image_evidence(owner_user_id,field_id,season_id,content_hash)");db.prepare("UPDATE pilot_meta SET value='15' WHERE key='pilot_schema_version'").run();}finally{db.close();}
    const reopened=await new PilotStore({dbPath:h.dbPath,exportDir:h.exportDir,pilotProfile:"FIELD_CAPTURE_ALPHA",scopedIdentities:users,investigationCandidateProvider:createEmptyCandidateProvider()}).open();try{assert.equal(PILOT_SCHEMA_VERSION,16);assert.equal(reopened.db.prepare("SELECT value FROM pilot_meta WHERE key='pilot_schema_version'").get().value,"16");assert.equal(reopened.db.prepare("SELECT COUNT(*) count FROM sqlite_master WHERE type='index' AND name='image_evidence_exact_content'").get().count,0);assert.equal(reopened.db.prepare("SELECT COUNT(*) count FROM sqlite_master WHERE type='index' AND name='image_evidence_case_content'").get().count,1);assert.equal(reopened.getImageEvidence("owner",original.image_evidence_id).case_id,"case-b");const {content_base64:unused,...assignedMetadata}=imagePayload("case-a");void unused;const next=reopened.createImageEvidence("owner",{...assignedMetadata,content_hash:"a".repeat(64),storage_key:"old-image.png"});assert.equal(next.case_id,"case-a");assert.notEqual(next.image_evidence_id,original.image_evidence_id);}finally{reopened.close();}
  }finally{await rm(h.root,{recursive:true,force:true,maxRetries:5,retryDelay:50});}
});
