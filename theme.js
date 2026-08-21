(()=>{
const THEME_KEY="birdCompendiumTheme";
const FONT_KEY="birdCompendiumFont";
const THEMES=[["dark","Dark"],["light","Light"],["forest","Forest"],["parchment","Parchment"],["midnight","Midnight"]];
const FONTS=[
  ["system","System"],["oldenglish","Old English"],["garamond","Garamond"],["georgia","Georgia"],
  ["typewriter","Typewriter"],["rounded","Rounded"],["condensed","Condensed"],["trebuchet","Trebuchet"]
];
function applyTheme(theme){
  const valid=THEMES.some(([id])=>id===theme)?theme:"dark";
  document.documentElement.dataset.theme=valid;localStorage.setItem(THEME_KEY,valid);
  const meta=document.querySelector('meta[name="theme-color"]');
  const colors={dark:"#101214",light:"#f4f1ea",forest:"#0d1813",parchment:"#e8dcc3",midnight:"#090f1a"};
  if(meta)meta.setAttribute("content",colors[valid]);
  const picker=document.getElementById("themePicker");if(picker)picker.value=valid;
}
function applyFont(font){
  const valid=FONTS.some(([id])=>id===font)?font:"system";
  document.documentElement.dataset.font=valid;localStorage.setItem(FONT_KEY,valid);
  const picker=document.getElementById("fontPicker");if(picker)picker.value=valid;
}
function makePicker(id,label,items,value,onchange){
  const picker=document.createElement("select");picker.id=id;picker.className="preference-picker";picker.setAttribute("aria-label",label);
  picker.innerHTML=items.map(([key,name])=>`<option value="${key}">${name}</option>`).join("");picker.value=value;picker.onchange=()=>onchange(picker.value);return picker;
}
function setupMobileAdd(topbar,actions,add){
  add.innerHTML='<span class="add-plus">＋</span><span class="add-label">Add species</span>';
  let dock=document.getElementById("mobileAddDock");
  if(!dock){dock=document.createElement("div");dock.id="mobileAddDock";dock.className="mobile-add-dock";topbar.insertAdjacentElement("afterend",dock)}
  let observer=null;
  const place=()=>{
    const mobile=window.matchMedia("(max-width:700px)").matches;
    if(observer){observer.disconnect();observer=null}
    add.classList.remove("mobile-floating","mobile-docked");
    if(mobile){
      if(add.parentElement!==dock)dock.appendChild(add);
      add.classList.add("mobile-docked");
      observer=new IntersectionObserver(entries=>{
        const visible=entries[0]?.isIntersecting;
        add.classList.toggle("mobile-floating",!visible);
      },{threshold:0.15});
      observer.observe(dock);
    }else{
      if(add.parentElement!==actions)actions.appendChild(add);
    }
  };
  place();window.addEventListener("resize",place,{passive:true});
}
function init(){
  const theme=localStorage.getItem(THEME_KEY)||"dark",font=localStorage.getItem(FONT_KEY)||"system";applyTheme(theme);applyFont(font);
  const topbar=document.querySelector(".topbar"),add=document.getElementById("addBirdBtn");if(!topbar||!add)return;
  let actions=topbar.querySelector(".topbar-actions");if(!actions){actions=document.createElement("div");actions.className="topbar-actions";topbar.appendChild(actions);actions.appendChild(add)}
  const controls=document.createElement("div");controls.className="preference-controls";
  controls.append(makePicker("themePicker","App theme",THEMES,theme,applyTheme),makePicker("fontPicker","App font",FONTS,font,applyFont));
  actions.insertBefore(controls,add);
  setupMobileAdd(topbar,actions,add);
}
if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",init);else init();
})();