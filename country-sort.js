(()=>{
const DB="birdCompendiumDB",STORE="birds";
let pendingCountry=null;
function openDB(){return new Promise((res,rej)=>{const r=indexedDB.open(DB,1);r.onsuccess=()=>res(r.result);r.onerror=()=>rej(r.error)})}
async function getBird(id){const d=await openDB();return new Promise((res,rej)=>{const r=d.transaction(STORE).objectStore(STORE).get(id);r.onsuccess=()=>res(r.result);r.onerror=()=>rej(r.error)})}
async function putBird(b){const d=await openDB();return new Promise((res,rej)=>{const r=d.transaction(STORE,"readwrite").objectStore(STORE).put(b);r.onsuccess=()=>res();r.onerror=()=>rej(r.error)})}
function installCountryField(){
  const notes=document.getElementById("birdNotesInput");if(!notes||document.getElementById("birdCountryInput"))return;
  const label=document.createElement("label");label.innerHTML='<span>Country</span><input id="birdCountryInput" type="text" autocomplete="country-name" placeholder="e.g. Australia">';
  notes.closest("label").insertAdjacentElement("beforebegin",label);
  const save=document.getElementById("saveBirdBtn");
  save?.addEventListener("click",()=>{pendingCountry=(document.getElementById("birdCountryInput")?.value||"").trim()},true);
  document.getElementById("addBirdBtn")?.addEventListener("click",()=>setTimeout(()=>{const el=document.getElementById("birdCountryInput");if(el)el.value=""},0));
  document.getElementById("emptyAddBtn")?.addEventListener("click",()=>setTimeout(()=>{const el=document.getElementById("birdCountryInput");if(el)el.value=""},0));
  document.getElementById("editBirdBtn")?.addEventListener("click",()=>setTimeout(async()=>{
    const name=(document.getElementById("commonNameInput")?.value||"").trim();
    const d=await openDB();const all=await new Promise((res,rej)=>{const r=d.transaction(STORE).objectStore(STORE).getAll();r.onsuccess=()=>res(r.result);r.onerror=()=>rej(r.error)});
    const b=all.find(x=>x.commonName===name);const el=document.getElementById("birdCountryInput");if(el)el.value=b?.country||"";
  },0));
}
function installSortOptions(){
  const s=document.getElementById("sortSelect");if(!s||s.querySelector('option[value="country-asc"]'))return;
  s.insertAdjacentHTML("beforeend",'<option value="country-asc">Country: A–Z</option><option value="country-desc">Country: Z–A</option>');
  if(typeof window.getFiltered==="function"){
    const base=window.getFiltered;
    window.getFiltered=function(){const a=base();const mode=s.value;if(mode==="country-asc"||mode==="country-desc")a.sort((x,y)=>{const ax=(x.country||"").trim(),ay=(y.country||"").trim();if(!ax&&!ay)return x.commonName.localeCompare(y.commonName);if(!ax)return 1;if(!ay)return -1;const c=ax.localeCompare(ay);return mode==="country-desc"?-c:c});return a};
  }
}
window.addEventListener("bird-local-change",async e=>{
  if(e.detail?.type!=="put"||pendingCountry===null)return;
  const id=e.detail.id,country=pendingCountry;pendingCountry=null;
  try{const b=await getBird(id);if(!b||b.country===country)return;b.country=country;await putBird(b);window.dispatchEvent(new CustomEvent("bird-local-change",{detail:{type:"put",id}}));if(typeof window.render==="function")window.render()}catch(err){console.error("Country save failed",err)}
});
function init(){installCountryField();installSortOptions()}
if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",init);else init();
})();