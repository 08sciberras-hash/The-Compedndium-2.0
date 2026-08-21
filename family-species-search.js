(()=>{
function norm(s){return String(s||"").trim().toLowerCase()}
function installFamilySpeciesSearch(){
  const sort=document.getElementById("speciesSort");
  const grid=document.getElementById("familyGrid");
  if(!sort||!grid||document.getElementById("speciesSearch"))return;
  const controls=sort.closest(".families-controls")||sort.parentElement;
  if(!controls)return;
  const input=document.createElement("input");
  input.id="speciesSearch";
  input.className="family-search";
  input.type="search";
  input.autocomplete="off";
  input.placeholder="Search species in this family…";
  input.value=sessionStorage.getItem("compSpeciesSearch")||"";
  controls.insertBefore(input,sort);

  const apply=()=>{
    const q=norm(input.value);
    let shown=0,total=0;
    grid.querySelectorAll(".family-species-tile").forEach(tile=>{
      total++;
      const common=norm(tile.querySelector(".family-species-name")?.textContent);
      const scientific=norm(tile.querySelector(".family-species-scientific")?.textContent);
      const match=!q||common.includes(q)||scientific.includes(q);
      tile.style.display=match?"":"none";
      if(match)shown++;
    });
    const status=document.getElementById("familySpeciesStatus");
    if(status&&q)status.textContent=`${shown} of ${total} species shown`;
  };
  input.addEventListener("input",()=>{sessionStorage.setItem("compSpeciesSearch",input.value);apply()});
  sort.addEventListener("change",()=>setTimeout(apply,0));

  const observer=new MutationObserver(()=>apply());
  observer.observe(grid,{childList:true});
  setTimeout(apply,0);
}

const viewObserver=new MutationObserver(()=>setTimeout(installFamilySpeciesSearch,0));
function init(){
  const view=document.getElementById("familiesView");
  if(view)viewObserver.observe(view,{childList:true,subtree:false});
  installFamilySpeciesSearch();
}
if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",()=>setTimeout(init,0));else setTimeout(init,0);
})();