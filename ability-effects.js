(()=>{
const STATE='compendiumAbilityStatesV1';
function state(){try{return JSON.parse(localStorage.getItem(STATE)||'{}')}catch{return{}}}
function swallowEnabled(){const s=state();return s.swallow?.unlocked===true&&s.swallow?.enabled===true}
function ensureStyle(){if(document.getElementById('swallowAbilityStyle'))return;const style=document.createElement('style');style.id='swallowAbilityStyle';style.textContent=`
.swallow-gentle-slide{position:fixed;z-index:2147483647;left:-56px;top:24vh;width:34px;height:18px;pointer-events:none;opacity:0;transform:translateX(0) rotate(-8deg);transition:none}
.swallow-gentle-slide::before,.swallow-gentle-slide::after{content:"";position:absolute;top:7px;width:19px;height:2px;background:currentColor;border-radius:999px;transform-origin:center}
.swallow-gentle-slide::before{left:0;transform:rotate(22deg)}.swallow-gentle-slide::after{right:0;transform:rotate(-22deg)}
.swallow-gentle-slide.fly{animation:swallowGentleSlide 1.2s ease-in-out forwards}
@keyframes swallowGentleSlide{0%{left:-56px;opacity:0;top:25vh;transform:rotate(-8deg)}12%{opacity:.72}50%{top:22vh;transform:rotate(3deg)}88%{opacity:.68}100%{left:calc(100vw + 56px);opacity:0;top:24vh;transform:rotate(-4deg)}}
@media(prefers-reduced-motion:reduce){.swallow-gentle-slide{display:none!important}}
`;document.head.appendChild(style)}
function play(){if(!swallowEnabled())return;const d=document.getElementById('detailDialog');if(!d?.open)return;document.querySelectorAll('.swallow-gentle-slide').forEach(x=>x.remove());const el=document.createElement('div');el.className='swallow-gentle-slide';el.setAttribute('aria-hidden','true');document.body.appendChild(el);requestAnimationFrame(()=>el.classList.add('fly'));setTimeout(()=>el.remove(),1350)}
function init(){ensureStyle();document.addEventListener('click',e=>{if(!e.target.closest?.('.bird-tile'))return;setTimeout(play,70)})}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init);else init();
})();