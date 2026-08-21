(()=>{
function install(){
  if(document.getElementById('desktopBirdBackdrop')) return;
  const style=document.createElement('style');
  style.id='desktopBirdBackdropStyles';
  style.textContent=`
  .desktop-bird-backdrop{display:none}
  @media (min-width:1280px){
    .desktop-bird-backdrop{display:block;position:fixed;inset:0;pointer-events:none;overflow:hidden;z-index:0}
    #app{position:relative;z-index:1}
    .desktop-bird{position:absolute;width:54px;height:54px;object-fit:contain;opacity:.075;filter:grayscale(1) contrast(1.25);animation:desktopBirdDrift var(--dur,18s) ease-in-out infinite alternate;transform:rotate(var(--rot,0deg))}
    .desktop-bird.big{width:78px;height:78px;opacity:.055}
    .desktop-bird.small{width:38px;height:38px;opacity:.06}
    @keyframes desktopBirdDrift{from{translate:0 0;rotate:var(--rot,0deg)}to{translate:var(--dx,10px) var(--dy,-14px);rotate:calc(var(--rot,0deg) + 4deg)}}
  }
  @media (prefers-reduced-motion:reduce){.desktop-bird{animation:none!important}}
  `;
  document.head.appendChild(style);
  const wrap=document.createElement('div');
  wrap.id='desktopBirdBackdrop';
  wrap.className='desktop-bird-backdrop';
  const birds=[
    ['5%','12%','-11deg','14px','-10px','21s','big'],
    ['12%','34%','8deg','-12px','16px','17s',''],
    ['3%','58%','-18deg','16px','-13px','24s','small'],
    ['14%','76%','12deg','-10px','-17px','20s',''],
    ['6%','91%','-4deg','14px','-8px','22s','small'],
    ['91%','15%','14deg','-14px','12px','19s',''],
    ['84%','31%','-9deg','12px','-15px','23s','small'],
    ['94%','51%','19deg','-16px','-8px','18s','big'],
    ['86%','72%','-14deg','13px','14px','25s',''],
    ['93%','88%','6deg','-10px','-12px','21s','small']
  ];
  for(const [left,top,rot,dx,dy,dur,size] of birds){
    const img=document.createElement('img');
    img.src='apple-touch-icon.png';
    img.alt='';
    img.className=`desktop-bird ${size}`.trim();
    img.style.left=left;img.style.top=top;
    img.style.setProperty('--rot',rot);img.style.setProperty('--dx',dx);img.style.setProperty('--dy',dy);img.style.setProperty('--dur',dur);
    wrap.appendChild(img);
  }
  document.body.prepend(wrap);
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',install);else install();
})();