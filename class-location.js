(()=>{
const RADIUS_KM=50;
function status(msg){const el=document.getElementById('autoClassStatus');if(el)el.textContent=msg}
async function resolveTaxonId(){
  const common=document.getElementById('commonNameInput');
  const scientific=document.getElementById('scientificNameInput');
  if(common?.dataset?.taxonId)return common.dataset.taxonId;
  const q=(scientific?.value||common?.value||'').trim();
  if(!q)return null;
  const r=await fetch(`https://api.inaturalist.org/v1/taxa?q=${encodeURIComponent(q)}&rank=species&per_page=8`);
  const j=await r.json();
  const exact=(j.results||[]).find(x=>x.name?.toLowerCase()===q.toLowerCase()||(x.preferred_common_name||'').toLowerCase()===q.toLowerCase())||j.results?.[0];
  if(exact&&common)common.dataset.taxonId=exact.id;
  return exact?.id||null;
}
async function geocodeLocation(text){
  const url=`https://nominatim.openstreetmap.org/search?format=jsonv2&limit=1&addressdetails=1&q=${encodeURIComponent(text)}`;
  const r=await fetch(url,{headers:{'Accept':'application/json'}});
  if(!r.ok)throw new Error('geocode failed');
  const j=await r.json();
  if(!j.length)return null;
  return {lat:Number(j[0].lat),lon:Number(j[0].lon),label:j[0].display_name?.split(',').slice(0,3).join(',')||text};
}
async function suggestAt(coords){
  const taxonId=await resolveTaxonId();
  if(!taxonId){status('Enter or look up the species first');return}
  status(`Checking records near ${coords.label}…`);
  try{
    const d=new Date();d.setFullYear(d.getFullYear()-5);
    const url=`https://api.inaturalist.org/v1/observations?taxon_id=${taxonId}&lat=${coords.lat}&lng=${coords.lon}&radius=${RADIUS_KM}&quality_grade=research&d1=${d.toISOString().slice(0,10)}&per_page=1`;
    const r=await fetch(url),j=await r.json(),n=j.total_results||0;
    selectedRarity=n>=500?'common':n>=120?'uncommon':n>=25?'epic':n>=4?'mythical':'legendary';
    renderRarityPicker();
    status(`${rarityObj(selectedRarity).label} — ${n.toLocaleString()} records within ${RADIUS_KM} km of ${coords.label}`);
  }catch(e){console.error(e);status('Couldn’t check observations — choose manually')}
}
async function suggestFromEntered(){
  const input=document.getElementById('birdLocationInput');
  const place=(input?.value||'').trim();
  if(!place){status('Enter the sighting suburb or location first');return}
  status(`Finding ${place}…`);
  try{
    const coords=await geocodeLocation(place);
    if(!coords){status('Couldn’t find that place — try a more specific suburb or town');return}
    await suggestAt(coords);
  }catch(e){console.error(e);status('Couldn’t resolve that place — try a more specific suburb or town')}
}
function init(){
  const original=document.getElementById('autoClassBtn');
  if(!original)return;
  original.textContent='Suggest class from entered location';
  original.onclick=suggestFromEntered;
  const current=document.getElementById('currentClassBtn');
  if(current)current.remove();
  const row=original.parentElement;if(row)row.classList.add('class-location-actions');
}
window.addEventListener('load',()=>setTimeout(init,0));
})();