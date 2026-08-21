(()=>{
const DB="birdCompendiumDB",STORE="birds";
let pendingCountry=null;
function openDB(){return new Promise((res,rej)=>{const r=indexedDB.open(DB,1);r.onsuccess=()=>res(r.result);r.onerror=()=>rej(r.error)})}
async function getAll(){const d=await openDB();return new Promise((res,rej)=>{const r=d.transaction(STORE).objectStore(STORE).getAll();r.onsuccess=()=>res(r.result);r.onerror=()=>rej(r.error)})}
async function getBird(id){const d=await openDB();return new Promise((res,rej)=>{const r=d.transaction(STORE).objectStore(STORE).get(id);r.onsuccess=()=>res(r.result);r.onerror=()=>rej(r.error)})}
async function putBird(b){const d=await openDB();return new Promise((res,rej)=>{const r=d.transaction(STORE,"readwrite").objectStore(STORE).put(b);r.onsuccess=()=>res();r.onerror=()=>rej(r.error)})}
async function populateCountryForCurrentForm(){
  const el=document.getElementById("birdCountryInput");if(!el)return;
  const name=(document.getElementById("commonNameInput")?.value||"").trim();
  if(!name){el.value="";return}
  try{const all=await getAll();const b=all.find(x=>(x.commonName||"").trim()===name);el.value=b?.country||""}catch(e){console.error("Country load failed",e)}
}
function installCountryField(){
  const notes=document.getElementById("birdNotesInput");if(!notes||document.getElementById("birdCountryInput"))return;
  const label=document.createElement("label");label.innerHTML='<span>Country</span><input id="birdCountryInput" type="text" autocomplete="country-name" placeholder="e.g. Australia">';
  notes.closest("label").insertAdjacentElement("beforebegin",label);
  const save=document.getElementById("saveBirdBtn");
  save?.addEventListener("click",()=>{pendingCountry=(document.getElementById("birdCountryInput")?.value||"").trim()},true);
  const clearForNew=()=>setTimeout(()=>{const el=document.getElementById("birdCountryInput");if(el)el.value=""},0);
  document.getElementById("addBirdBtn")?.addEventListener("click",clearForNew,true);
  document.getElementById("emptyAddBtn")?.addEventListener("click",clearForNew,true);
  document.getElementById("editBirdBtn")?.addEventListener("click",()=>{
    setTimeout(populateCountryForCurrentForm,30);
    setTimeout(populateCountryForCurrentForm,150);
  },true);
  const dialog=document.getElementById("birdDialog");
  if(dialog){new MutationObserver(()=>{if(dialog.open&&document.getElementById("commonNameInput")?.value)setTimeout(populateCountryForCurrentForm,20)}).observe(dialog,{attributes:true,attributeFilter:["open"]})}
}
function installSortOptions(){
  const s=document.getElementById("sortSelect");if(!s||s.querySelector('option[value="country-asc"]'))return;
  s.insertAdjacentHTML("beforeend",'<option value="country-asc">Country: A–Z</option><option value="country-desc">Country: Z–A</option>');
}
window.addEventListener("bird-local-change",async e=>{
  if(e.detail?.type!=="put"||pendingCountry===null)return;
  const id=e.detail.id,country=pendingCountry;pendingCountry=null;
  try{const b=await getBird(id);if(!b||b.country===country)return;b.country=country;await putBird(b);window.dispatchEvent(new CustomEvent("bird-local-change",{detail:{type:"put",id}}));}catch(err){console.error("Country save failed",err)}
});
function installCountrySort(){
  const s=document.getElementById("sortSelect");if(!s)return;
  s.addEventListener("change",()=>{
    if(!["country-asc","country-desc"].includes(s.value))return;
    const grid=document.getElementById("birdGrid");if(!grid)return;
    getAll().then(all=>{
      const sorted=all.slice().sort((a,b)=>{const ac=(a.country||"").trim(),bc=(b.country||"").trim();if(!ac&&!bc)return (a.commonName||"").localeCompare(b.commonName||"");if(!ac)return 1;if(!bc)return -1;const c=ac.localeCompare(bc);return s.value==="country-desc"?-c:c});
      if(Array.isArray(window.birds))window.birds=sorted;
      if(typeof window.render==="function")window.render();
    }).catch(console.error)
  });
}
function init(){installCountryField();installSortOptions();installCountrySort()}
if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",init);else init();
})();