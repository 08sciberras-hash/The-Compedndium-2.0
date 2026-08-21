(()=>{
const DB="birdCompendiumDB",STORE="birds";
let pendingCountry=null,pendingEditBirdId=null;
function openDB(){return new Promise((res,rej)=>{const r=indexedDB.open(DB,1);r.onsuccess=()=>res(r.result);r.onerror=()=>rej(r.error)})}
async function getAll(){const d=await openDB();return new Promise((res,rej)=>{const r=d.transaction(STORE).objectStore(STORE).getAll();r.onsuccess=()=>res(r.result);r.onerror=()=>rej(r.error)})}
async function getBird(id){const d=await openDB();return new Promise((res,rej)=>{const r=d.transaction(STORE).objectStore(STORE).get(id);r.onsuccess=()=>res(r.result);r.onerror=()=>rej(r.error)})}
async function putBird(b){const d=await openDB();return new Promise((res,rej)=>{const r=d.transaction(STORE,"readwrite").objectStore(STORE).put(b);r.onsuccess=()=>res();r.onerror=()=>rej(r.error)})}
function ensureCountryField(){
  let el=document.getElementById("birdCountryInput");if(el)return el;
  const notes=document.getElementById("birdNotesInput");if(!notes)return null;
  const label=document.createElement("label");label.id="birdCountryLabel";label.innerHTML='<span>Country</span><input id="birdCountryInput" type="text" autocomplete="country-name" placeholder="e.g. Australia">';
  notes.closest("label").insertAdjacentElement("beforebegin",label);
  return document.getElementById("birdCountryInput");
}
async function birdIdFromDetail(){
  const name=(document.getElementById("detailCommonName")?.textContent||"").trim();if(!name)return null;
  const all=await getAll();const b=all.find(x=>(x.commonName||"").trim()===name);return b?.id||null;
}
async function loadCountryForEdit(id){
  const el=ensureCountryField();if(!el)return;
  try{const b=id?await getBird(id):null;el.value=b?.country||""}catch(e){console.error("Country load failed",e)}
}
function clearCountry(){const el=ensureCountryField();if(el)el.value="";pendingEditBirdId=null}
function installHandlers(){
  ensureCountryField();
  const save=document.getElementById("saveBirdBtn");
  save?.addEventListener("click",()=>{pendingCountry=(ensureCountryField()?.value||"").trim()},true);
  const startNew=()=>setTimeout(clearCountry,0);
  document.getElementById("addBirdBtn")?.addEventListener("click",startNew,true);
  document.getElementById("emptyAddBtn")?.addEventListener("click",startNew,true);
  document.getElementById("editBirdBtn")?.addEventListener("click",async()=>{
    pendingEditBirdId=await birdIdFromDetail();
    setTimeout(()=>loadCountryForEdit(pendingEditBirdId),0);
    setTimeout(()=>loadCountryForEdit(pendingEditBirdId),80);
    setTimeout(()=>loadCountryForEdit(pendingEditBirdId),250);
  },true);
}
function installSortOptions(){
  const s=document.getElementById("sortSelect");if(!s)return;
  if(!s.querySelector('option[value="country-asc"]'))s.insertAdjacentHTML("beforeend",'<option value="country-asc">Country: A–Z</option><option value="country-desc">Country: Z–A</option>');
}
window.addEventListener("bird-local-change",async e=>{
  if(e.detail?.type!=="put"||pendingCountry===null)return;
  const id=e.detail.id,country=pendingCountry;pendingCountry=null;
  try{const b=await getBird(id);if(!b)return;if((b.country||"")===country)return;b.country=country;await putBird(b);window.dispatchEvent(new CustomEvent("bird-local-change",{detail:{type:"put",id}}));}catch(err){console.error("Country save failed",err)}
});
function installCountrySort(){
  const s=document.getElementById("sortSelect");if(!s)return;
  s.addEventListener("change",()=>{
    if(!["country-asc","country-desc"].includes(s.value))return;
    getAll().then(all=>{
      const sorted=all.slice().sort((a,b)=>{const ac=(a.country||"").trim(),bc=(b.country||"").trim();if(!ac&&!bc)return (a.commonName||"").localeCompare(b.commonName||"");if(!ac)return 1;if(!bc)return -1;const c=ac.localeCompare(bc);return s.value==="country-desc"?-c:c});
      const grid=document.getElementById("birdGrid");if(!grid)return;
      const byName=new Map([...grid.children].map(n=>[n.querySelector(".tile-name")?.textContent,n]));
      sorted.forEach(b=>{const node=byName.get(b.commonName);if(node)grid.appendChild(node)});
    }).catch(console.error)
  });
}
function init(){installHandlers();installSortOptions();installCountrySort()}
if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",init);else init();
})();