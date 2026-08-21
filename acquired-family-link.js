(()=>{
const FAMILY_CACHE="compendiumIocFamiliesV15_2";
const BIRD_FAMILY_CACHE="compendiumBirdFamilyCacheV1";
const FAMILY_NAME_CACHE="compendiumFamilyCommonNameCacheV1";
const norm=s=>String(s||"").trim().toLowerCase();
function readJSON(k,d){try{return JSON.parse(localStorage.getItem(k)||JSON.stringify(d))}catch{return d}}
async function familyParts(latin){
  const families=readJSON(FAMILY_CACHE,[]);
  const cached=families.find(x=>x.latin===latin);
  if(cached?.english&&norm(cached.english)!==norm(latin))return {english:cached.english,latin};
  const nameCache=readJSON(FAMILY_NAME_CACHE,{});
  if(nameCache[latin])return {english:nameCache[latin],latin};
  try{
    const j=await(await fetch(`https://api.inaturalist.org/v1/taxa?q=${encodeURIComponent(latin)}&rank=family&per_page=5`)).json();
    const fam=(j.results||[]).find(x=>norm(x.name)===norm(latin))||j.results?.[0];
    const english=fam?.preferred_common_name||fam?.english_common_name||latin;
    if(english&&norm(english)!==norm(latin)){nameCache[latin]=english;localStorage.setItem(FAMILY_NAME_CACHE,JSON.stringify(nameCache));return {english,latin}}
  }catch(e){console.warn("Could not resolve family common name",e)}
  return {english:latin,latin};
}
async function resolveFamily(scientific,common){const cache=readJSON(BIRD_FAMILY_CACHE,{});const key=norm(scientific||common);if(cache[key])return cache[key];try{const q=encodeURIComponent(scientific||common),j=await(await fetch(`https://api.inaturalist.org/v1/taxa?q=${q}&rank=species&per_page=5`)).json();const exact=(j.results||[]).find(x=>norm(x.name)===norm(scientific)||norm(x.preferred_common_name)===norm(common))||j.results?.[0];if(!exact)return null;let ancestors=exact.ancestors||[];if(!ancestors.length)ancestors=(await(await fetch(`https://api.inaturalist.org/v1/taxa/${exact.id}`)).json()).results?.[0]?.ancestors||[];const fam=ancestors.find(x=>x.rank==="family");if(fam?.name){cache[key]=fam.name;localStorage.setItem(BIRD_FAMILY_CACHE,JSON.stringify(cache));return fam.name}}catch(e){console.warn("Could not resolve family",e)}return null}
function injectStyles(){if(document.getElementById("acquiredFamilyLinkStyles"))return;const s=document.createElement("style");s.id="acquiredFamilyLinkStyles";s.textContent=`.detail-family-subheading{margin:4px 0 8px;color:var(--muted);font-size:13px}.detail-family-link{appearance:none;border:0;background:transparent;color:inherit;text-decoration:underline;text-underline-offset:3px;padding:0;font:inherit;cursor:pointer;font-weight:700}.detail-family-link:hover{color:var(--text)}.detail-family-latin{font-style:italic;font-weight:600}`;document.head.appendChild(s)}
async function goToFamily(latin){document.getElementById("detailDialog")?.close();const tab=document.querySelector('[data-comp-tab="families"]');if(!tab)return;tab.click();for(let i=0;i<40;i++){await new Promise(r=>setTimeout(r,100));const search=document.getElementById("familySearch"),rows=[...document.querySelectorAll(".family-row")];if(search){search.value=latin;search.dispatchEvent(new Event("input",{bubbles:true}))}const match=rows.find(r=>norm(r.querySelector(".family-la")?.textContent)===norm(latin));if(match){match.click();return}}}
async function updateDetailFamily(){const dialog=document.getElementById("detailDialog");if(!dialog?.open)return;const scientific=(document.getElementById("detailScientificName")?.textContent||"").replace(/[()]/g,"").trim(),common=(document.getElementById("detailCommonName")?.textContent||"").trim();if(!common)return;const meta=document.getElementById("detailMeta");if(!meta)return;let line=document.getElementById("detailFamilySubheading");if(!line){line=document.createElement("div");line.id="detailFamilySubheading";line.className="detail-family-subheading";meta.insertAdjacentElement("beforebegin",line)}line.textContent="Family: loading…";const latin=await resolveFamily(scientific,common);if(!latin){line.textContent="";line.style.display="none";return}line.style.display="block";line.innerHTML='Family: ';const parts=await familyParts(latin),b=document.createElement("button");b.type="button";b.className="detail-family-link";b.append(document.createTextNode(`${parts.english} - `));const em=document.createElement("span");em.className="detail-family-latin";em.textContent=parts.latin;b.appendChild(em);b.addEventListener("click",()=>goToFamily(latin));line.appendChild(b)}
function init(){injectStyles();const dialog=document.getElementById("detailDialog");if(!dialog)return;new MutationObserver(()=>{if(dialog.open)setTimeout(updateDetailFamily,0)}).observe(dialog,{attributes:true,attributeFilter:["open"]});dialog.addEventListener("click",e=>{if(e.target.closest?.("#editBirdBtn"))setTimeout(updateDetailFamily,150)})}
if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",init);else init();
})();