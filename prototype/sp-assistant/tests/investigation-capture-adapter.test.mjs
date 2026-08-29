import test from "node:test";
import assert from "node:assert/strict";
import { mkdtemp, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { InvestigationCaptureAdapter, InvestigationDraftRepository, ServerInvestigationAdapter } from "../assets/investigation-capture-adapter.js";
import { PilotStore } from "../pilot-store.mjs";
import { startServer } from "../server.mjs";
import { MemoryStorage, authenticatePilot, testPilotUsers } from "./support.mjs";

const scope={field_id:"field-capture",season_id:"season-capture"};

function lifecycle(userId="user-a"){
  return {schema_version:2,users:[{user_id:userId}],fields:[{field_id:scope.field_id,owner_user_id:userId,name:"นา capture",polygon:{type:"Polygon",coordinates:[[[100,13],[100.01,13],[100,13.01],[100,13]]]},crop:"rice",planting_date:"2026-07-01",current_crop_stage:{code:"TILLERING",label:"แตกกอ",model_version:"field-stage-model/v1"},current_cmp_stage:{stage_id:"CMP-03",label:"ระยะแตกกอ",model_version:"field-stage-model/v1"},season_id:scope.season_id,stage_provenance:"USER_CONFIRMED",created_at:"2026-07-01T00:00:00.000Z",updated_at:"2026-08-20T00:00:00.000Z"}],seasons:[{season_id:scope.season_id,field_id:scope.field_id,crop:"rice",status:"ACTIVE"}],guidance:[],activities:[],cases:[],observations:[],evidence:[],conversations:[],messages:[],decision_logs:[],case_summaries:[],weather_snapshots:[]};
}

function ids(){let value=0;return {randomUUID:()=>`00000000-0000-4000-8000-${String(++value).padStart(12,"0")}`};}
async function authenticate(base,userId="user-a"){return authenticatePilot(base,userId);}
function authenticatedFetcher(base,cookie){return (path,options={})=>fetch(`${base}${path}`,{...options,headers:{...(options.headers??{}),cookie}});}

async function harness(){
  const root=await mkdtemp(join(tmpdir(),"cpmoakb-capture-adapter-")),options={pilotUsers:testPilotUsers("user-a","user-b"),port:0,dbPath:join(root,"pilot.sqlite"),exportDir:join(root,"exports"),uploadDir:join(root,"uploads")};
  const seed=await new PilotStore({dbPath:options.dbPath,exportDir:options.exportDir}).open();seed.putWorkspace("user-a",lifecycle());seed.close();
  const server=await startServer(options),base=`http://127.0.0.1:${server.address().port}`,cookie=await authenticate(base);
  return {root,options,server,base,cookie,close:async()=>{await new Promise((done)=>server.close(done));await rm(root,{recursive:true,force:true});}};
}

function goldenEvidence(observationTime){return [
  {record_type:"SPATIAL_EVIDENCE",record:{observed_at:observationTime,source:"FIELD_OBSERVED",confidence:"NOT_ASSESSED",evidence_level:"SP1_SITE_SUPPORTED",review_state:"UNREVIEWED",payload:{observation_scope:"PATCH",geometry:"PATCH",field_positions:[],patterns:["PATCH"],field_extent:"LOCAL",direction:"UNKNOWN",affected_status:"AFFECTED",location_provenance:"USER_REPORTED"}}},
  {record_type:"MORPHOLOGY_EVIDENCE",record:{observed_at:observationTime,source:"FIELD_OBSERVED",confidence:"NOT_ASSESSED",evidence_level:"MO0_REPORTED",review_state:"UNREVIEWED",payload:{plant_part:"LEAF_SHEATH",primary_phenotypes:["YELLOWING"],negative_evidence:[]}}},
  {record_type:"SEVERITY_MEASUREMENT",record:{observed_at:observationTime,source:"FIELD_OBSERVED",confidence:"NOT_ASSESSED",evidence_level:"SV2_COUNT_SUPPORTED",review_state:"UNREVIEWED",payload:{measurement_concept:"AFFECTED_TILLERS_PER_OBSERVED_TILLERS",numerator:4,denominator:20,unit:"COUNT_RATIO",plant_part:"TILLER"}}},
  {record_type:"MANAGEMENT_EVENT",record:{event_type:"UNKNOWN_MANAGEMENT_EVENT",event_at:null,time_precision:"UNKNOWN",source:"USER_REPORTED",reported_product_name:"ชื่อบนถุงอ่านไม่ชัด",product_identity_confidence:"UNKNOWN"}},
];}

test("golden offline draft retries exactly once and refreshes the authoritative bundle",async()=>{
  const h=await harness(); try {
    const storage=new MemoryStorage(),repository=new InvestigationDraftRepository(storage),online=authenticatedFetcher(h.base,h.cookie); let mode="offline",lost=false;
    const controlled=async(path,options)=>{if(mode==="offline")throw new Error("offline");const response=await online(path,options);if(mode==="lose-first-response"&&options?.method==="POST"&&!lost){lost=true;await response.text();throw new Error("response lost after commit");}return response;};
    const adapter=new InvestigationCaptureAdapter({draftRepository:repository,server:new ServerInvestigationAdapter(controlled),clock:()=>new Date("2026-08-20T08:30:00Z"),cryptoProvider:ids()});
    const draft=adapter.createDraft(scope,{note:"ข้าวเหลืองตรงนี้",observed_at:"2026-08-20T08:30:00Z",evidence:goldenEvidence("2026-08-20T08:30:00Z")});
    assert.equal(draft.state,"DRAFT_LOCAL");assert.equal(draft.authority,"LOCAL_DRAFT_ONLY");
    let failed=await adapter.sync(draft.draft_id);assert.equal(failed.state,"SYNC_FAILED");assert.equal(failed.error_code,"NETWORK_ERROR");
    const restored=new InvestigationDraftRepository(storage).get(draft.draft_id);assert.equal(restored.observation.note,"ข้าวเหลืองตรงนี้");assert.equal(restored.authority,"LOCAL_DRAFT_ONLY");
    mode="lose-first-response";failed=await adapter.retry(draft.draft_id);assert.equal(failed.state,"SYNC_FAILED");assert.equal(failed.completed_request_ids.length,0,"lost response leaves the stable request pending");
    mode="online";const synced=await adapter.retry(draft.draft_id);assert.equal(synced.state,"SYNCED");assert.equal(synced.authority,"SERVER_CONFIRMED_COPY");
    const bundle=synced.authoritative_bundle;assert.equal(bundle.stage_assessment.crop_stage.code,"TILLERING");assert.equal(bundle.stage_assessment.provenance,"USER_CONFIRMED");assert.equal(bundle.observations.length,1);assert.equal(bundle.observations[0].revision,1);assert.equal(bundle.evidence.length,3);assert.equal(bundle.management_events.length,1);assert.equal(bundle.management_events[0].active_ingredient,null);assert.equal(bundle.evidence.find((item)=>item.evidence_type==="SEVERITY_MEASUREMENT").derived_percent,20);assert.equal(bundle.candidates.length,0);assert.equal(bundle.follow_up_plans.length,0);
    const count=await (await online(`/api/pilot/investigation-bundle?field_id=${scope.field_id}&season_id=${scope.season_id}`,{headers:{accept:"application/json"}})).json();assert.equal(count.observations.length,1,"retry cannot duplicate the observation");assert.equal(count.evidence.length,3,"retry cannot duplicate typed evidence");
  } finally {await h.close();}
});

test("two browser drafts detect revision conflict, preserve local work, and reapply deliberately",async()=>{
  const h=await harness(); try {
    const serverAdapter=new ServerInvestigationAdapter(authenticatedFetcher(h.base,h.cookie)),creator=new InvestigationCaptureAdapter({draftRepository:new InvestigationDraftRepository(new MemoryStorage()),server:serverAdapter,cryptoProvider:ids()});
    const created=creator.createDraft(scope,{note:"original",observed_at:"2026-08-20T08:30:00Z"}),synced=await creator.sync(created.draft_id),original=synced.authoritative_bundle.observations[0];assert.equal(original.revision,1);
    const first=new InvestigationCaptureAdapter({draftRepository:new InvestigationDraftRepository(new MemoryStorage()),server:serverAdapter,cryptoProvider:ids()}),secondStorage=new MemoryStorage(),second=new InvestigationCaptureAdapter({draftRepository:new InvestigationDraftRepository(secondStorage),server:serverAdapter,cryptoProvider:ids()});
    const firstDraft=first.createUpdateDraft(scope,original,{note:"browser one"}),secondDraft=second.createUpdateDraft(scope,original,{note:"browser two unsaved"});
    const firstResult=await first.sync(firstDraft.draft_id);assert.equal(firstResult.state,"SYNCED");assert.equal(firstResult.authoritative_bundle.observations[0].revision,2);
    const conflict=await second.sync(secondDraft.draft_id);assert.equal(conflict.state,"CONFLICT");assert.equal(conflict.error_code,"VERSION_CONFLICT");assert.equal(conflict.record.note,"browser two unsaved");
    const refreshed=await second.refresh(secondDraft.draft_id);assert.equal(refreshed.authoritative_bundle.observations[0].note,"browser one");assert.equal(refreshed.record.note,"browser two unsaved","server refresh cannot overwrite the local draft");
    const reapplied=second.createUpdateDraft(scope,refreshed.authoritative_bundle.observations[0],{note:refreshed.record.note}),final=await second.sync(reapplied.draft_id);assert.equal(final.state,"SYNCED");assert.equal(final.authoritative_bundle.observations[0].revision,3);assert.equal(final.authoritative_bundle.observations[0].note,"browser two unsaved");
  } finally {await h.close();}
});

test("validation, authorization, cross-scope, and server errors remain distinct",async()=>{
  const h=await harness(); try {
    const userAFetch=authenticatedFetcher(h.base,h.cookie),userBCookie=await authenticate(h.base,"user-b"),userB=new InvestigationCaptureAdapter({draftRepository:new InvestigationDraftRepository(new MemoryStorage()),server:new ServerInvestigationAdapter(authenticatedFetcher(h.base,userBCookie)),cryptoProvider:ids()});
    const foreign=userB.createDraft(scope,{note:"attempt foreign write"}),denied=await userB.sync(foreign.draft_id);assert.equal(denied.state,"SYNC_FAILED");assert.equal(denied.error_code,"AUTHORIZATION_ERROR");
    const cross=new InvestigationCaptureAdapter({draftRepository:new InvestigationDraftRepository(new MemoryStorage()),server:new ServerInvestigationAdapter(userAFetch),cryptoProvider:ids()}),crossDraft=cross.createDraft({field_id:scope.field_id,season_id:"wrong-season"},{note:"wrong season"}),crossResult=await cross.sync(crossDraft.draft_id);assert.equal(crossResult.error_code,"AUTHORIZATION_ERROR");
    const invalid=cross.createDraft(scope,{note:"local cannot claim field",evidence:[{record_type:"SPATIAL_EVIDENCE",record:{source:"FIELD_OBSERVED",evidence_level:"SP3_FIELD_SUPPORTED",payload:{observation_scope:"PATCH",geometry:"PATCH",field_extent:"LOCAL",location_provenance:"USER_REPORTED"}}}]}),invalidResult=await cross.sync(invalid.draft_id);assert.equal(invalidResult.error_code,"VALIDATION_ERROR");assert.equal(invalidResult.observation.note,"local cannot claim field");
    const serverFailure=new ServerInvestigationAdapter(async()=>({ok:false,status:503,json:async()=>({})}));await assert.rejects(serverFailure.bundle(scope),(error)=>error.code==="SERVER_ERROR");
  } finally {await h.close();}
});

test("idempotent update retry increments revision only once",async()=>{
  const h=await harness(); try {
    const fetcher=authenticatedFetcher(h.base,h.cookie),serverAdapter=new ServerInvestigationAdapter(fetcher),capture=new InvestigationCaptureAdapter({draftRepository:new InvestigationDraftRepository(new MemoryStorage()),server:serverAdapter,cryptoProvider:ids()}),created=capture.createDraft(scope,{note:"before update"}),synced=await capture.sync(created.draft_id),observation=synced.authoritative_bundle.observations[0],requestId="request-update-retry",record={observation_id:observation.observation_id,...scope,case_id:null,observed_at:observation.observed_at,source:observation.source,confidence:observation.confidence,review_state:observation.review_state,note:"after update"};
    const first=await serverAdapter.update("OBSERVATION",observation.observation_id,record,1,requestId),replay=await serverAdapter.update("OBSERVATION",observation.observation_id,record,1,requestId);assert.equal(first.status,"UPDATED");assert.equal(replay.status,"IDEMPOTENT_REPLAY");assert.equal(replay.replayed,true);
    const bundle=await serverAdapter.bundle(scope);assert.equal(bundle.observations[0].revision,2);assert.equal(bundle.observations[0].note,"after update");
  } finally {await h.close();}
});
