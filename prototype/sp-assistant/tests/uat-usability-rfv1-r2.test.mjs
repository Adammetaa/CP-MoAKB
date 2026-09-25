import test from "node:test";
import assert from "node:assert/strict";
import { readFile, mkdtemp, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { resolveBuildIdentity, startServer } from "../server.mjs";

const read=(name)=>readFile(new URL(name,import.meta.url),"utf8");

test("RFV1-R2 separates compact Field Detail preview from viewport-aware boundary editor",async()=>{
  const [css,app]=await Promise.all([read("../assets/field-shell.css"),read("../assets/field-app.js")]);
  assert.match(css,/\.map-canvas \{ height:min\(56vh,430px\); min-height:340px/);
  assert.match(css,/height:min\(48vh,380px\); min-height:340px/);
  assert.match(css,/height:min\(44vh,340px\); min-height:320px/);
  assert.match(css,/\.field-detail-map,\.map-preview \{[^}]*height:260px; max-height:280px/);
  assert.match(css,/\.field-detail-map,\.map-preview \{ height:220px; min-height:200px/);
  assert.match(app,/workspace-mini-map field-detail-map map-preview/);
  assert.ok(app.indexOf("workspace-guidance")<app.indexOf("field-detail-map-panel"),"primary actions must precede the Field Detail map preview");
});

test("RFV1-R2 preserves center-pin controls and prevents narrow editor control collisions",async()=>{
  const [css,app]=await Promise.all([read("../assets/field-shell.css"),read("../assets/field-app.js")]);
  for(const marker of ["center-mode","center-crosshair","add-center-point",'data-map-action="add-center"',"finish-area-button","map-area-badge"])assert.match(app,new RegExp(marker));
  assert.match(css,/grid-template-columns:repeat\(5,minmax\(0,1fr\)\)/);
  assert.match(css,/\.finish-area-button \{ right:10px; bottom:118px/);
  assert.match(css,/\.add-center-point \{ bottom:66px/);
  assert.match(css,/\.real-map-attribution \{ top:142px; bottom:auto/);
});

test("RFV1-R2 makes inspection context and bounded evidence state explicit",async()=>{
  const [css,app,runtime]=await Promise.all([read("../assets/field-shell.css"),read("../assets/field-app.js"),read("../assets/governed-spa-runtime.js")]);
  for(const label of ["แปลง","Case","การตรวจ","สถานะ","ยังไม่ได้เลือก","รอบตรวจใหม่","ตรวจต่อเคสเดิม","กำลังเก็บหลักฐาน"])assert.match(app,new RegExp(label));
  assert.match(app,/presentation\.visual\.slice\(-2\)/);
  assert.match(app,/preview_url:chatPhotoPreviewUrl/);
  assert.match(app,/ผูกกับบริบทแล้ว/);
  assert.match(runtime,/filename:image\.media\?\.original_filename/);
  assert.match(css,/\.inspection-binding-receipt\{display:grid;grid-template-columns:88px minmax\(0,1fr\)/);
  assert.match(css,/bottom:calc\(88px \+ env\(safe-area-inset-bottom\)\)/);
  assert.match(css,/\.inspection-thread \{[^}]*min-width:0/);
  assert.match(css,/\.photo-evidence-message \{[^}]*max-width:100%/);
});

test("RFV1-R2 retains explicit New versus Resume choice without silent Case reuse",async()=>{
  const app=await read("../assets/field-app.js");
  assert.match(app,/เริ่มรอบตรวจใหม่/);
  assert.match(app,/ตรวจต่อในเคสเดิม/);
  assert.match(app,/data-action="begin-new-inspection"/);
  assert.match(app,/data-governed-case-resume/);
  assert.match(app,/ไม่สร้างเคสเปล่า/);
});

test("RFV1-R2 localhost serves truthful UAT build identity in UI and health",async()=>{
  const explicit=await resolveBuildIdentity({repositoryRoot:"Z:\\not-present",environment:{UAT_BUILD_ID:"d42bdb8725736fa5e4bee3e2ac7344bda6ef5866"}});
  assert.deepEqual(explicit,{commit:"d42bdb8725736fa5e4bee3e2ac7344bda6ef5866",label:"d42bdb8 / LOCAL UAT",source:"ENVIRONMENT"});
  const root=await mkdtemp(join(tmpdir(),"cpmoakb-rfv1-r2-")),prior=process.env.UAT_BUILD_ID;
  process.env.UAT_BUILD_ID="abcdef1234567890abcdef1234567890abcdef12";
  let server;
  try{
    server=await startServer({port:0,host:"127.0.0.1",dbPath:join(root,"pilot.sqlite"),exportDir:join(root,"exports"),uploadDir:join(root,"uploads")});
    const base=`http://127.0.0.1:${server.address().port}`,html=await(await fetch(base+"/")).text(),health=await(await fetch(base+"/health")).json();
    assert.match(html,/Build: abcdef1 \/ LOCAL UAT/);
    assert.equal(health.build.commit,"abcdef1234567890abcdef1234567890abcdef12");
    assert.equal(health.build.source,"ENVIRONMENT");
  }finally{
    if(server)await new Promise((done)=>server.close(done));
    if(prior===undefined)delete process.env.UAT_BUILD_ID;else process.env.UAT_BUILD_ID=prior;
    await rm(root,{recursive:true,force:true,maxRetries:5,retryDelay:50});
  }
});
