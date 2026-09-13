import { randomUUID } from "node:crypto";

export const USER_ATTACHMENT_RUNTIME_VERSION="governed-user-attachment/v1";
export const USER_ATTACHMENT_MAX_BYTES=10*1024*1024;
export const USER_ATTACHMENT_MIME_TYPES=Object.freeze({
  "image/jpeg":"jpg",
  "image/png":"png",
  "image/webp":"webp",
  "application/pdf":"pdf",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document":"docx",
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet":"xlsx",
  "text/csv":"csv",
  "text/plain":"txt",
});

const fail=(message,code="VALIDATION_ERROR",status=400)=>{throw Object.assign(new Error(message),{code,status});};
const id=(value,name)=>{if(typeof value!=="string"||!/^[A-Za-z0-9._:-]{1,180}$/.test(value))fail(`invalid ${name}`);return value;};

export function initializeUserAttachmentSchema(db){db.exec(`
  CREATE TABLE IF NOT EXISTS governed_user_attachments(
    attachment_id TEXT PRIMARY KEY,
    owner_user_id TEXT NOT NULL,
    field_id TEXT NOT NULL,
    season_id TEXT NOT NULL,
    case_id TEXT NOT NULL,
    conversation_id TEXT NOT NULL,
    original_filename TEXT NOT NULL,
    mime_type TEXT NOT NULL,
    size_bytes INTEGER NOT NULL,
    created_at TEXT NOT NULL,
    storage_reference TEXT NOT NULL UNIQUE,
    source_type TEXT NOT NULL,
    review_state TEXT NOT NULL,
    sha256 TEXT NOT NULL,
    attachment_json TEXT NOT NULL,
    FOREIGN KEY(field_id) REFERENCES lifecycle_fields(field_id),
    FOREIGN KEY(season_id) REFERENCES crop_seasons(season_id),
    FOREIGN KEY(case_id) REFERENCES investigation_cases(case_id),
    FOREIGN KEY(conversation_id) REFERENCES governed_conversations(conversation_id)
  );
  CREATE INDEX IF NOT EXISTS governed_user_attachments_scope ON governed_user_attachments(owner_user_id,field_id,season_id,case_id,conversation_id,created_at);
`);db.prepare("INSERT OR IGNORE INTO investigation_schema_migrations(version,applied_at) VALUES(14,?)").run(new Date().toISOString());}

export function validateAttachmentFilename(value){
  if(typeof value!=="string"||!value.trim()||value.length>240||value!==value.split(/[\\/]/).at(-1)||value.includes("..")||/[\u0000-\u001f]/u.test(value))fail("invalid attachment filename");
  return value.trim();
}

export function validateAttachmentBytes(bytes,mimeType,filename){
  if(!Buffer.isBuffer(bytes)||bytes.length<1||bytes.length>USER_ATTACHMENT_MAX_BYTES)fail(bytes?.length>USER_ATTACHMENT_MAX_BYTES?"attachment exceeds 10 MB limit":"invalid attachment size",bytes?.length>USER_ATTACHMENT_MAX_BYTES?"PAYLOAD_TOO_LARGE":"VALIDATION_ERROR",bytes?.length>USER_ATTACHMENT_MAX_BYTES?413:400);
  const extension=USER_ATTACHMENT_MIME_TYPES[mimeType],actualExtension=filename.toLowerCase().split(".").at(-1);
  if(!extension||actualExtension!==extension&&!(mimeType==="image/jpeg"&&actualExtension==="jpeg"))fail("unsupported attachment type");
  const starts=(...values)=>values.every((value,index)=>bytes[index]===value);
  const signatureOk=mimeType==="image/jpeg"?starts(0xff,0xd8,0xff):mimeType==="image/png"?starts(0x89,0x50,0x4e,0x47):mimeType==="image/webp"?bytes.subarray(0,4).toString()==="RIFF"&&bytes.subarray(8,12).toString()==="WEBP":mimeType==="application/pdf"?bytes.subarray(0,5).toString()==="%PDF-":mimeType.includes("openxmlformats")?starts(0x50,0x4b):!bytes.includes(0);
  if(!signatureOk)fail("attachment content does not match declared type");
  return extension;
}

function record(row){if(!row)return null;return{attachment_id:row.attachment_id,owner_user_id:row.owner_user_id,field_id:row.field_id,season_id:row.season_id,case_id:row.case_id,conversation_id:row.conversation_id,original_filename:row.original_filename,mime_type:row.mime_type,size_bytes:row.size_bytes,created_at:row.created_at,storage_reference:row.storage_reference,source_type:row.source_type,review_state:row.review_state,sha256:row.sha256,authority_boundary:{is_visual_evidence:false,is_scientific_source:false,is_canonical_knowledge:false,is_diagnosis:false,is_recommendation:false,automatic_ingestion:false}};}

export class UserAttachmentService{
  constructor(db,{clock=()=>new Date(),idProvider=()=>randomUUID(),access=null}={}){this.db=db;this.clock=clock;this.idProvider=idProvider;this.access=access;}
  validateScope(ownerUserId,input){
    id(ownerUserId,"owner_user_id");for(const key of ["field_id","season_id","case_id","conversation_id"])id(input[key],key);
    const row=this.db.prepare(`SELECT c.conversation_id FROM governed_conversations c JOIN investigation_cases i ON i.case_id=c.case_id WHERE c.conversation_id=? AND c.owner_user_id=? AND c.field_id=? AND c.season_id=? AND c.case_id=? AND i.owner_user_id=c.owner_user_id AND i.field_id=c.field_id AND i.season_id=c.season_id`).get(input.conversation_id,ownerUserId,input.field_id,input.season_id,input.case_id);
    if(!row)fail("attachment context not found","SCOPE_NOT_FOUND",404);
    return true;
  }
  create(ownerUserId,input){
    this.validateScope(ownerUserId,input);const filename=validateAttachmentFilename(input.original_filename),mimeType=String(input.mime_type??""),extension=USER_ATTACHMENT_MIME_TYPES[mimeType];if(!extension)fail("unsupported attachment type");
    if(!Number.isInteger(input.size_bytes)||input.size_bytes<1||input.size_bytes>USER_ATTACHMENT_MAX_BYTES)fail("invalid attachment size");
    if(typeof input.sha256!=="string"||!/^[a-f0-9]{64}$/.test(input.sha256))fail("invalid attachment sha256");
    if(typeof input.storage_reference!=="string"||!/^attachment-[A-Za-z0-9-]+\.[a-z0-9]+$/.test(input.storage_reference))fail("invalid storage reference");
    const createdAt=this.clock().toISOString(),item={attachment_id:`attachment-${this.idProvider()}`,owner_user_id:ownerUserId,field_id:input.field_id,season_id:input.season_id,case_id:input.case_id,conversation_id:input.conversation_id,original_filename:filename,mime_type:mimeType,size_bytes:input.size_bytes,created_at:createdAt,storage_reference:input.storage_reference,source_type:"USER_ATTACHMENT",review_state:"UNREVIEWED",sha256:input.sha256,schema_version:USER_ATTACHMENT_RUNTIME_VERSION};
    this.db.prepare("INSERT INTO governed_user_attachments VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)").run(item.attachment_id,item.owner_user_id,item.field_id,item.season_id,item.case_id,item.conversation_id,item.original_filename,item.mime_type,item.size_bytes,item.created_at,item.storage_reference,item.source_type,item.review_state,item.sha256,JSON.stringify(item));return record(item);
  }
  get(requesterUserId,attachmentId){id(requesterUserId,"requester_user_id");id(attachmentId,"attachment_id");const row=this.db.prepare("SELECT * FROM governed_user_attachments WHERE attachment_id=?").get(attachmentId);if(!row||!(row.owner_user_id===requesterUserId||this.access?.identities.has(requesterUserId)&&this.access.canReadAttachment(requesterUserId,row)))fail("attachment not found","NOT_FOUND",404);return record(row);}
  list(requesterUserId,scope={}){id(requesterUserId,"requester_user_id");const where=[],values=[];for(const key of ["field_id","season_id","case_id","conversation_id"]){if(scope[key]){where.push(`${key}=?`);values.push(id(scope[key],key));}}return this.db.prepare(`SELECT * FROM governed_user_attachments${where.length?` WHERE ${where.join(" AND ")}`:""} ORDER BY created_at,attachment_id`).all(...values).filter((row)=>row.owner_user_id===requesterUserId||this.access?.identities.has(requesterUserId)&&this.access.canReadAttachment(requesterUserId,row)).map(record);}
}
