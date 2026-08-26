export const INVESTIGATION_DRAFT_STATES = Object.freeze({ DRAFT_LOCAL:"DRAFT_LOCAL", PENDING_SYNC:"PENDING_SYNC", SYNCING:"SYNCING", SYNCED:"SYNCED", SYNC_FAILED:"SYNC_FAILED", CONFLICT:"CONFLICT", ABANDONED:"ABANDONED" });
export const INVESTIGATION_ERROR_CODES = Object.freeze({ VALIDATION_ERROR:"VALIDATION_ERROR", AUTHORIZATION_ERROR:"AUTHORIZATION_ERROR", NETWORK_ERROR:"NETWORK_ERROR", SERVER_ERROR:"SERVER_ERROR", VERSION_CONFLICT:"VERSION_CONFLICT" });
const EVIDENCE_RECORD_TYPES = new Set(["SPATIAL_EVIDENCE","MORPHOLOGY_EVIDENCE","SEVERITY_MEASUREMENT","SAMPLING_SESSION","WEATHER_CONTEXT","WATER_CONTEXT","MANAGEMENT_EVENT","TEMPORAL_EVIDENCE","FOLLOW_UP_PLAN","OUTCOME"]);

export class InvestigationCaptureError extends Error {
  constructor(code,message,status=null){ super(message); this.name="InvestigationCaptureError"; this.code=code; this.status=status; }
}

function stableId(prefix,cryptoProvider=globalThis.crypto){ const value=cryptoProvider?.randomUUID?.(); if(!value) throw new Error("stable ID provider is unavailable"); return `${prefix}-${value}`; }
function clone(value){ return structuredClone(value); }
function scopeOnly(context){ if(!context?.field_id||!context?.season_id) throw new InvestigationCaptureError("VALIDATION_ERROR","field_id and season_id are required"); return {field_id:context.field_id,season_id:context.season_id,...(context.case_id?{case_id:context.case_id}:{})}; }

export class InvestigationDraftRepository {
  constructor(storage,key="cpmoakb.investigation-drafts.v1"){ this.storage=storage; this.key=key; }
  load(){ try { const parsed=JSON.parse(this.storage?.getItem?.(this.key)??""); return parsed?.schema_version===1&&Array.isArray(parsed.drafts)?parsed:{schema_version:1,drafts:[]}; } catch { return {schema_version:1,drafts:[]}; } }
  list(){ return this.load().drafts.map(clone); }
  get(draftId){ return this.list().find((item)=>item.draft_id===draftId)??null; }
  save(draft){ const state=this.load(),index=state.drafts.findIndex((item)=>item.draft_id===draft.draft_id),next=clone(draft); if(index>=0)state.drafts[index]=next;else state.drafts.push(next); this.storage?.setItem?.(this.key,JSON.stringify(state)); return clone(next); }
  remove(draftId){ const state=this.load(); state.drafts=state.drafts.filter((item)=>item.draft_id!==draftId); this.storage?.setItem?.(this.key,JSON.stringify(state)); }
}

export class ServerInvestigationAdapter {
  constructor(fetcher=(...args)=>globalThis.fetch(...args),endpoint="/api/pilot/investigation-records"){ this.fetcher=fetcher; this.endpoint=endpoint; }
  async request(url,options={}){
    let response; try { response=await this.fetcher(url,options); } catch(error){ throw new InvestigationCaptureError("NETWORK_ERROR",error?.message||"network request failed"); }
    const payload=await response.json().catch(()=>({}));
    if(!response.ok){ const code=payload.error_code??(response.status===409?"VERSION_CONFLICT":response.status===401||response.status===403?"AUTHORIZATION_ERROR":response.status>=500?"SERVER_ERROR":"VALIDATION_ERROR"); throw new InvestigationCaptureError(code,payload.message??"investigation request failed",response.status); }
    return payload;
  }
  create(recordType,record,requestId){ return this.request(this.endpoint,{method:"POST",headers:{"content-type":"application/json"},body:JSON.stringify({record_type:recordType,record,request_id:requestId})}); }
  update(recordType,recordId,record,expectedRevision,requestId){ return this.request(this.endpoint,{method:"PATCH",headers:{"content-type":"application/json"},body:JSON.stringify({record_type:recordType,record_id:recordId,expected_revision:expectedRevision,record,request_id:requestId})}); }
  bundle(scope){ const query=new URLSearchParams(scopeOnly(scope)); return this.request(`/api/pilot/investigation-bundle?${query}`,{headers:{accept:"application/json"}}); }
  timeline(scope){ const query=new URLSearchParams(scopeOnly(scope)); return this.request(`/api/pilot/investigation-timeline?${query}`,{headers:{accept:"application/json"}}); }
}

export class InvestigationCaptureAdapter {
  constructor({draftRepository,server,clock=()=>new Date(),cryptoProvider=globalThis.crypto}){ this.drafts=draftRepository; this.server=server; this.clock=clock; this.cryptoProvider=cryptoProvider; }
  now(){ return this.clock().toISOString(); }
  newId(prefix){ return stableId(prefix,this.cryptoProvider); }
  createDraft(context,{note,observed_at=null,case_id=null,evidence=[]}={}){
    const scope=scopeOnly({...context,...(case_id?{case_id}:{})}),now=this.now(),observationId=this.newId("observation"),draftId=this.newId("investigation-draft"),noteValue=String(note??"").trim(); if(!noteValue)throw new InvestigationCaptureError("VALIDATION_ERROR","observation note is required");
    const observation={observation_id:observationId,...scope,observed_at:observed_at??now,source:"USER_REPORTED",confidence:"NOT_ASSESSED",review_state:"UNREVIEWED",note:noteValue};
    const records=evidence.map((item,index)=>this.prepareEvidence(scope,observationId,item,index));
    return this.drafts.save({draft_id:draftId,authority:"LOCAL_DRAFT_ONLY",state:"DRAFT_LOCAL",mode:"CREATE",scope,observation,records,observation_request_id:this.newId("request"),completed_request_ids:[],authoritative_bundle:null,error_code:null,error_message:null,created_at:now,updated_at:now});
  }
  prepareEvidence(scope,observationId,item,index){
    if(!EVIDENCE_RECORD_TYPES.has(item?.record_type)) throw new InvestigationCaptureError("VALIDATION_ERROR",`unsupported evidence record type at ${index}`);
    const record=clone(item.record??{}),isManagement=item.record_type==="MANAGEMENT_EVENT",idKey=isManagement?"management_event_id":"evidence_id";
    record[idKey]??=this.newId(isManagement?"management-event":"evidence"); Object.assign(record,scope); if(!isManagement)record.observation_id=observationId;
    return {record_type:item.record_type,record,request_id:this.newId("request")};
  }
  createUpdateDraft(context,serverObservation,patch={}){
    const scope=scopeOnly(context); if(!serverObservation?.observation_id||!Number.isInteger(serverObservation.revision)) throw new InvestigationCaptureError("VALIDATION_ERROR","server observation revision is required");
    const record={observation_id:serverObservation.observation_id,...scope,case_id:serverObservation.case_id??scope.case_id??null,observed_at:serverObservation.observed_at,source:serverObservation.source,confidence:serverObservation.confidence,review_state:serverObservation.review_state,note:serverObservation.note??null,...clone(patch)};
    const now=this.now(); return this.drafts.save({draft_id:this.newId("investigation-draft"),authority:"LOCAL_DRAFT_ONLY",state:"DRAFT_LOCAL",mode:"UPDATE",scope,record_type:"OBSERVATION",record_id:record.observation_id,expected_revision:serverObservation.revision,record,request_id:this.newId("request"),authoritative_bundle:null,error_code:null,error_message:null,created_at:now,updated_at:now});
  }
  queue(draftId){ const draft=this.requireDraft(draftId); if(draft.state==="ABANDONED"||draft.state==="SYNCED") return draft; draft.state="PENDING_SYNC"; draft.error_code=null; draft.error_message=null; draft.updated_at=this.now(); return this.drafts.save(draft); }
  requireDraft(draftId){ const draft=this.drafts.get(draftId); if(!draft) throw new InvestigationCaptureError("VALIDATION_ERROR","draft not found"); return draft; }
  async sync(draftId){
    let draft=this.queue(draftId); if(draft.state==="SYNCED"||draft.state==="ABANDONED") return draft; draft.state="SYNCING"; draft.updated_at=this.now(); draft=this.drafts.save(draft);
    try {
      if(draft.mode==="UPDATE") await this.server.update(draft.record_type,draft.record_id,draft.record,draft.expected_revision,draft.request_id);
      else {
        if(!draft.completed_request_ids.includes(draft.observation_request_id)){ await this.server.create("OBSERVATION",draft.observation,draft.observation_request_id); draft.completed_request_ids.push(draft.observation_request_id); this.drafts.save(draft); }
        for(const operation of draft.records){ if(draft.completed_request_ids.includes(operation.request_id))continue; await this.server.create(operation.record_type,operation.record,operation.request_id); draft.completed_request_ids.push(operation.request_id); this.drafts.save(draft); }
      }
      const bundle=await this.server.bundle(draft.scope); draft.authoritative_bundle=bundle; draft.state="SYNCED"; draft.authority="SERVER_CONFIRMED_COPY"; draft.error_code=null; draft.error_message=null; draft.synced_at=this.now(); draft.updated_at=draft.synced_at; return this.drafts.save(draft);
    } catch(error){ const code=Object.values(INVESTIGATION_ERROR_CODES).includes(error?.code)?error.code:"SERVER_ERROR"; draft.state=code==="VERSION_CONFLICT"?"CONFLICT":"SYNC_FAILED"; draft.authority="LOCAL_DRAFT_ONLY"; draft.error_code=code; draft.error_message=error?.message??"sync failed"; draft.updated_at=this.now(); return this.drafts.save(draft); }
  }
  retry(draftId){ return this.sync(draftId); }
  async refresh(draftId){ const draft=this.requireDraft(draftId),bundle=await this.server.bundle(draft.scope); draft.authoritative_bundle=bundle; draft.updated_at=this.now(); return this.drafts.save(draft); }
  async loadBundle(context){ return this.server.bundle(scopeOnly(context)); }
  abandon(draftId){ const draft=this.requireDraft(draftId); draft.state="ABANDONED"; draft.authority="LOCAL_DRAFT_ONLY"; draft.updated_at=this.now(); return this.drafts.save(draft); }
}
