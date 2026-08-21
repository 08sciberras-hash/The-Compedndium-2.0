(()=>{
const KEY="birdCompendiumTheme";
const THEMES=[
  ["dark","Dark"],
  ["light","Light"],
  ["forest","Forest"],
  ["parchment","Parchment"],
  ["midnight","Midnight"]
];
function applyTheme(theme){
  const valid=THEMES.some(([id])=>id===theme)?theme:"dark";
  document.documentElement.dataset.theme=valid;
  localStorage.setItem(KEY,valid);
  const meta=document.querySelector('meta[name="theme-color"]');
  const colors={dark:"#101214",light:"#f4f1ea",forest:"#0d1813",parchment:"#e8dcc3",midnight:"#090f1a"};
  if(meta)meta.setAttribute("content",colors[valid]);
  const picker=document.getElementById("themePicker");
  if(picker)picker.value=valid;
}
function init(){
  applyTheme(localStorage.getItem(KEY)||"dark");
  const topbar=document.querySelector(".topbar");
  const add=document.getElementById("addBirdBtn");
  if(!topbar||!add)return;
  let actions=topbar.querySelector(".topbar-actions");
  if(!actions){actions=document.createElement("div");actions.className="topbar-actions";topbar.appendChild(actions);actions.appendChild(add)}
  const picker=document.createElement("select");
  picker.id="themePicker";picker.className="theme-picker";picker.setAttribute("aria-label","App theme");
  picker.innerHTML=THEMES.map(([id,label])=>`<option value="${id}">${label}</option>`).join("");
  picker.value=localStorage.getItem(KEY)||"dark";
  picker.onchange=()=>applyTheme(picker.value);
  actions.insertBefore(picker,add);
}
if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",init);else init();
})();