
(()=>{
const URL="https://yfkbacnbprdmduymjjor.supabase.co";
const KEY="sb_publishable_HRLQSpf6osRgRiGdCC8QnA_ZGzKXknT";
const sb=window.supabase.createClient(URL,KEY);
let user=null,busy=false;
const DB="birdCompendiumDB", STORE="birds";
const metaKey="birdCloudMetaV1", knownKey="birdCloudKnownIdsV1";
const meta=()=>JSON.parse(localStorage.getItem(metaKey)||"{}");
const saveMeta=v=>localStorage.setItem(metaKey,JSON.stringify(v));
const known=()=>new Set(JSON.parse(localStorage.getItem(knownKey)||"[]"));
const saveKnown=s=>localStorage.setItem(knownKey,JSON.stringify([...s]));

function injectUI(){
 const css=document.createElement("style");css.textContent=`
 .cloud-sync-btn{border:1px solid #2d3338;background:#171a1d;color:#f5f6f7;border-radius:14px;padding:10px 13px;font-weight:700;margin-right:8px}
 .cloud-sync-btn.ok{border-color:#36c66b}.cloud-panel{position:fixed;inset:0;z-index:9999;background:rgba(0,0,0,.72);display:none;align-items:flex-end;justify-content:center}
 .cloud-panel.open{display:flex}.cloud-sheet{width:min(620px,100%);background:#171a1d;color:#f5f6f7;border-radius:24px 24px 0 0;padding:18px;padding-bottom:max(24px,env(safe-area-inset-bottom))}
 .cloud-sheet input{width:100%;margin:6px 0 12px;background:#101214;border:1px solid #2d3338;border-radius:13px;color:#fff;padding:12px}
 .cloud-row{display:flex;gap:8px;flex-wrap:wrap}.cloud-sheet button{border:1px solid #2d3338;background:#202428;color:#fff;border-radius:12px;padding:10px 13px}
 .cloud-sheet .primary{background:#f5f6f7;color:#101214}.cloud-muted{color:#9aa1a8;font-size:13px}.cloud-head{display:flex;justify-content:space-between;align-items:center}.cloud-hidden{display:none!important}`;
 document.head.appendChild(css);
 const add=document.getElementById("addBirdBtn");
 const btn=document.createElement("button");btn.id="cloudBtn";btn.className="cloud-sync-btn";btn.textContent="Sync";
 add.parentNode.insertBefore(btn,add);
 const panel=document.createElement("div");panel.id="cloudPanel";panel.className="cloud-panel";panel.innerHTML=`
 <div class="cloud-sheet"><div class="cloud-head"><h2>Cloud Sync</h2><button id="cloudClose">Close</button></div>
 <div id="cloudOut"><p class="cloud-muted">Use the same account on your iPhone and laptop. Your existing collection stays on this device and is copied to your private cloud account.</p>
 <input id="cloudEmail" type="email" placeholder="Email"><input id="cloudPass" type="password" placeholder="Password (6+ characters)">
 <div class="cloud-row"><button class="primary" id="cloudSignIn">Sign in</button><button id="cloudSignUp">Create account</button></div></div>
 <div id="cloudIn" class="cloud-hidden"><p>Signed in as <strong id="cloudWho"></strong></p><p id="cloudStatus" class="cloud-muted">Ready.</p>
 <div class="cloud-row"><button class="primary" id="cloudNow">Sync now</button><button id="cloudSignOut">Sign out</button></div></div>
 <p id="cloudAuthStatus" class="cloud-muted"></p></div>`;
 document.body.appendChild(panel);
 btn.onclick=()=>panel.classList.add("open");cloudClose.onclick=()=>panel.classList.remove("open");
 cloudSignIn.onclick=signIn;cloudSignUp.onclick=signUp;cloudSignOut.onclick=signOut;cloudNow.onclick=sync;
}
function openDB(){return new Promise((res,rej)=>{const r=indexedDB.open(DB,1);r.onsuccess=()=>res(r.result);r.onerror=()=>rej(r.error)})}
async function getAll(){const d=await openDB();return new Promise((res,rej)=>{const r=d.transaction(STORE).objectStore(STORE).getAll();r.onsuccess=()=>res(r.result);r.onerror=()=>rej(r.error)})}
async function put(b){const d=await openDB();return new Promise((res,rej)=>{const r=d.transaction(STORE,"readwrite").objectStore(STORE).put(b);r.onsuccess=()=>res();r.onerror=()=>rej(r.error)})}
async function del(id){const d=await openDB();return new Promise((res,rej)=>{const r=d.transaction(STORE,"readwrite").objectStore(STORE).delete(id);r.onsuccess=()=>res();r.onerror=()=>rej(r.error)})}
async function fingerprint(b){
 const parts=[b.commonName,b.scientificName,b.rarity,b.notes,b.createdAt,b.coverPhoto?.size,b.coverPhoto?.type];
 for(const s of b.sightings||[])parts.push(s.id,s.date,s.location,s.notes,JSON.stringify(s.coords),...(s.photos||[]).flatMap(p=>[p.size,p.type,p.lastModified]));
 const bytes=new TextEncoder().encode(parts.join("|"));const hash=await crypto.subtle.digest("SHA-256",bytes);
 return [...new Uint8Array(hash)].map(x=>x.toString(16).padStart(2,"0")).join("");
}
async function upload(blob,path){if(!blob)return null;const {error}=await sb.storage.from("bird-photos").upload(path,blob,{upsert:true,contentType:blob.type||"image/jpeg"});if(error)throw error;return path}
async function serialize(b){
 const p={id:b.id,commonName:b.commonName,scientificName:b.scientificName||"",rarity:b.rarity,notes:b.notes||"",createdAt:b.createdAt||Date.now(),sightings:[],coverPhotoPath:null};
 if(b.coverPhoto)p.coverPhotoPath=await upload(b.coverPhoto,`${user.id}/${b.id}/cover.jpg`);
 for(const s of b.sightings||[]){const x={id:s.id,date:s.date||"",location:s.location||"",notes:s.notes||"",coords:s.coords||null,photoPaths:[]};
  for(let i=0;i<(s.photos||[]).length;i++)x.photoPaths.push(await upload(s.photos[i],`${user.id}/${b.id}/${s.id}-${i}.jpg`));p.sightings.push(x)}
 return p;
}
async function download(path){if(!path)return null;const {data,error}=await sb.storage.from("bird-photos").download(path);if(error)throw error;return data}
async function hydrate(p){
 const b={id:p.id,commonName:p.commonName,scientificName:p.scientificName||"",rarity:p.rarity||"common",notes:p.notes||"",createdAt:p.createdAt||Date.now(),sightings:[]};
 if(p.coverPhotoPath)try{b.coverPhoto=await download(p.coverPhotoPath)}catch{}
 for(const s of p.sightings||[]){const x={id:s.id,date:s.date||"",location:s.location||"",notes:s.notes||"",coords:s.coords||null,photos:[]};for(const path of s.photoPaths||[])try{x.photos.push(await download(path))}catch{}b.sightings.push(x)}
 return b;
}
async function push(b,t){const payload=await serialize(b);const {error}=await sb.from("cloud_birds").upsert({id:b.id,user_id:user.id,payload,updated_at:new Date(t).toISOString()});if(error)throw error}
async function sync(){
 if(!user||busy)return;busy=true;cloudStatus.textContent="Syncing…";
 try{
  const local=await getAll(), m=meta(), k=known();
  for(const b of local){const fp=await fingerprint(b);if(m[b.id]?.fingerprint!==fp)m[b.id]={fingerprint:fp,modified:Date.now()}}
  const {data,error}=await sb.from("cloud_birds").select("id,payload,updated_at").eq("user_id",user.id);if(error)throw error;
  const remote=new Map((data||[]).map(r=>[r.id,r])), localMap=new Map(local.map(b=>[b.id,b]));
  // IDs previously seen on this device but now locally absent are intentional deletions.
  for(const id of k)if(!localMap.has(id)&&remote.has(id)){await sb.from("cloud_birds").delete().eq("id",id).eq("user_id",user.id);remote.delete(id);delete m[id]}
  for(const b of local){const r=remote.get(b.id), lt=m[b.id]?.modified||b.createdAt||0, rt=r?new Date(r.updated_at).getTime():0;if(!r||lt>rt){await push(b,lt);k.add(b.id)}}
  for(const r of remote.values()){const l=localMap.get(r.id), lt=m[r.id]?.modified||l?.createdAt||0, rt=new Date(r.updated_at).getTime();if(!l||rt>lt){const b=await hydrate(r.payload);await put(b);m[r.id]={fingerprint:await fingerprint(b),modified:rt};k.add(r.id)}}
  saveMeta(m);saveKnown(k);cloudStatus.textContent="Synced. Changes will also sync when you reopen the app.";cloudBtn.classList.add("ok");cloudBtn.textContent="Synced";
  setTimeout(()=>location.reload(),500);
 }catch(e){console.error(e);cloudStatus.textContent="Sync failed. Your local collection is still safe."}finally{busy=false}
}
async function authUI(){const {data:{session}}=await sb.auth.getSession();user=session?.user||null;cloudOut.classList.toggle("cloud-hidden",!!user);cloudIn.classList.toggle("cloud-hidden",!user);if(user){cloudWho.textContent=user.email||"";cloudBtn.textContent="Synced";cloudBtn.classList.add("ok");await sync()}else{cloudBtn.textContent="Sync";cloudBtn.classList.remove("ok")}}
async function signIn(){cloudAuthStatus.textContent="Signing in…";const {error}=await sb.auth.signInWithPassword({email:cloudEmail.value.trim(),password:cloudPass.value});cloudAuthStatus.textContent=error?error.message:"";if(!error)await authUI()}
async function signUp(){cloudAuthStatus.textContent="Creating account…";const {data,error}=await sb.auth.signUp({email:cloudEmail.value.trim(),password:cloudPass.value});cloudAuthStatus.textContent=error?error.message:(data.session?"Account created.":"Account created — check your email if confirmation is required.");if(!error)await authUI()}
async function signOut(){await sb.auth.signOut();user=null;await authUI()}
window.addEventListener("load",async()=>{injectUI();await authUI();document.addEventListener("visibilitychange",()=>{if(document.visibilityState==="visible"&&user)sync()})});
})();
