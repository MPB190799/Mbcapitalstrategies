/* Compass v2.0 — web-design-agent 2026-07-18 */
/* try/catch gehaertet 2026-07-19 web-design-agent: siehe Kommentar bei MB Interactive v1.0 oben --
   gleiche ScriptErrorCount-Korrelation, gleiche defensive Massnahme. */
(()=>{
try{
  if(window.matchMedia('(prefers-reduced-motion:reduce)').matches) return;
  const touch = matchMedia('(pointer:coarse)').matches;
  const NS = 'http://www.w3.org/2000/svg';
  const gold = '#d4af37';
  const ga = a => `rgba(212,175,55,${a})`;

  function el(tag, attrs, txt) {
    const e = document.createElementNS(NS, tag);
    if(attrs) Object.entries(attrs).forEach(([k,v]) => e.setAttribute(k, String(v)));
    if(txt) e.textContent = txt;
    return e;
  }
  function pt(cx, cy, deg, r) {
    const rad = deg * Math.PI / 180;
    return { x: cx + r * Math.sin(rad), y: cy - r * Math.cos(rad) };
  }

  /* ── HERO SVG OVERLAY ── */
  function buildHeroSVG() {
    const svg = el('svg', {viewBox:'0 0 100 100', class:'compass-svg-overlay', 'aria-hidden':'true'});
    const cx=50, cy=50;

    // Defs — cap gradient
    const defs = el('defs',{});
    const rg = el('radialGradient',{id:'capGH',cx:'40%',cy:'35%'});
    rg.appendChild(el('stop',{'offset':'0%','stop-color':'#f5e070'}));
    rg.appendChild(el('stop',{'offset':'100%','stop-color':'#6a4008'}));
    defs.appendChild(rg); svg.appendChild(defs);

    // 1. GRAD RING (CW 45s)
    const gGrad = el('g',{class:'cmp-gradring'});
    gGrad.appendChild(el('circle',{cx,cy,r:'46',fill:'none',stroke:ga(.15),'stroke-width':'.35'}));
    for(let i=0;i<360;i+=5){
      const isCard=i%90===0, isMaj30=i%30===0, isMin=i%10!==0;
      const rOut=46, rIn=isCard?37:isMaj30?41:isMin?44.5:42.5;
      const p1=pt(cx,cy,i,rOut), p2=pt(cx,cy,i,rIn);
      gGrad.appendChild(el('line',{
        x1:p1.x.toFixed(2),y1:p1.y.toFixed(2),
        x2:p2.x.toFixed(2),y2:p2.y.toFixed(2),
        stroke:isCard?gold:ga(isMin?.18:.32),
        'stroke-width':isCard?'1.1':isMaj30?'.5':'.22'
      }));
    }
    // Cardinal letters inside ring
    [['N',0],['O',90],['S',180],['W',270]].forEach(([lbl,deg])=>{
      const p=pt(cx,cy,deg,32);
      gGrad.appendChild(el('text',{
        x:p.x.toFixed(1),y:(p.y+2.2).toFixed(1),
        'text-anchor':'middle','font-size':'5.5',
        fill:ga(.75),'font-family':'monospace','font-weight':'bold','letter-spacing':'.5'
      },lbl));
    });
    svg.appendChild(gGrad);

    // 2. COMPASS ROSE (CCW 65s)
    const gRose = el('g',{class:'cmp-rose'});
    for(let i=0;i<8;i++){
      const deg=i*45, isCard=i%2===0;
      const rTip=isCard?29:19, rSide=isCard?4.2:2.8, rBase=isCard?5.5:3.5;
      const tip=pt(cx,cy,deg,rTip);
      const L=pt(cx,cy,deg-90,rSide), R=pt(cx,cy,deg+90,rSide);
      const base=pt(cx,cy,deg+180,rBase);
      gRose.appendChild(el('path',{
        d:`M${tip.x.toFixed(2)} ${tip.y.toFixed(2)} L${L.x.toFixed(2)} ${L.y.toFixed(2)} L${base.x.toFixed(2)} ${base.y.toFixed(2)} L${R.x.toFixed(2)} ${R.y.toFixed(2)}Z`,
        fill:isCard?ga(.48):ga(.15), stroke:ga(.6),'stroke-width':'.28'
      }));
    }
    svg.appendChild(gRose);

    // 3. NEEDLE (JS-controlled)
    const gNeedle = el('g',{class:'cmp-needle'});
    gNeedle.appendChild(el('path',{
      d:`M${cx} ${cy-27} L${cx-2.6} ${cy} L${cx} ${cy+3} L${cx+2.6} ${cy}Z`,
      fill:gold, stroke:ga(.7),'stroke-width':'.3'
    }));
    gNeedle.appendChild(el('path',{
      d:`M${cx} ${cy+27} L${cx+2.6} ${cy} L${cx} ${cy-3} L${cx-2.6} ${cy}Z`,
      fill:'#241807', stroke:ga(.28),'stroke-width':'.3'
    }));
    svg.appendChild(gNeedle);

    // 4. CENTER CAP
    svg.appendChild(el('circle',{cx,cy,r:'4.8',fill:'url(#capGH)',stroke:gold,'stroke-width':'.6'}));
    svg.appendChild(el('circle',{cx,cy,r:'1.8',fill:ga(.9)}));

    return {svg, needle:gNeedle};
  }

  /* ── MINI COMPASS ── */
  function buildMini() {
    const wrap = document.createElement('div');
    wrap.id = 'compass-mini';
    wrap.setAttribute('aria-hidden','true');
    const svg = el('svg',{viewBox:'0 0 100 100',width:'100%',height:'100%'});
    const cx=50, cy=50;

    const defs2 = el('defs',{});
    const rg2 = el('radialGradient',{id:'capGM',cx:'40%',cy:'35%'});
    rg2.appendChild(el('stop',{'offset':'0%','stop-color':'#f5e070'}));
    rg2.appendChild(el('stop',{'offset':'100%','stop-color':'#6a4008'}));
    defs2.appendChild(rg2); svg.appendChild(defs2);

    svg.appendChild(el('circle',{cx,cy,r:'48',fill:'rgba(12,11,9,.9)',stroke:ga(.45),'stroke-width':'1.5'}));

    // 4 sector arcs
    const secs = [{id:'sN',deg:0},{id:'sE',deg:90},{id:'sS',deg:180},{id:'sW',deg:270}];
    const gSec = el('g',{class:'cmp-mini-sectors'});
    secs.forEach(s=>{
      const a1=s.deg-44, a2=s.deg+44, r=46;
      const p1=pt(cx,cy,a1,r), p2=pt(cx,cy,a2,r);
      gSec.appendChild(el('path',{
        d:`M${cx} ${cy} L${p1.x.toFixed(2)} ${p1.y.toFixed(2)} A${r} ${r} 0 0 1 ${p2.x.toFixed(2)} ${p2.y.toFixed(2)}Z`,
        fill:ga(0), stroke:ga(.1),'stroke-width':'.4',
        'data-sector':s.id, class:'cmp-sector'
      }));
    });
    svg.appendChild(gSec);

    // Tick ring
    for(let i=0;i<360;i+=30){
      const isC=i%90===0;
      const p1=pt(cx,cy,i,46), p2=pt(cx,cy,i,isC?38:42);
      svg.appendChild(el('line',{
        x1:p1.x.toFixed(1),y1:p1.y.toFixed(1),
        x2:p2.x.toFixed(1),y2:p2.y.toFixed(1),
        stroke:ga(isC?.5:.22),'stroke-width':isC?'.8':'.4'
      }));
    }

    svg.appendChild(el('text',{x:cx,y:'13','text-anchor':'middle','font-size':'7',fill:ga(.65),'font-family':'monospace','font-weight':'bold'},'N'));

    // Mini needle
    const gN = el('g',{class:'cmp-mini-needle'});
    gN.appendChild(el('path',{d:`M${cx} ${cy-25} L${cx-2.4} ${cy} L${cx} ${cy+2.4} L${cx+2.4} ${cy}Z`,fill:gold}));
    gN.appendChild(el('path',{d:`M${cx} ${cy+25} L${cx+2.4} ${cy} L${cx} ${cy-2.4} L${cx-2.4} ${cy}Z`,fill:'#241807'}));
    svg.appendChild(gN);

    svg.appendChild(el('circle',{cx,cy,r:'4',fill:'url(#capGM)',stroke:gold,'stroke-width':'.5'}));
    svg.appendChild(el('circle',{cx,cy,r:'1.5',fill:ga(.9)}));

    wrap.appendChild(svg);
    return {el:wrap, needle:gN, sectors:gSec};
  }

  /* ── NEEDLE SPRING TRACKER ── */
  function trackNeedle(needleEl, getCenter, spring=0.09) {
    let angle=0, target=0, raf=0;
    function step(){
      let d=target-angle;
      while(d>180)d-=360; while(d<-180)d+=360;
      angle+=d*spring;
      needleEl.setAttribute('transform',`rotate(${angle.toFixed(2)} 50 50)`);
      raf = Math.abs(d)>.25 ? requestAnimationFrame(step) : 0;
    }
    function onMove(e){
      const c=getCenter();
      target=Math.atan2(e.clientX-c.x,-(e.clientY-c.y))*180/Math.PI;
      if(!raf) raf=requestAnimationFrame(step);
    }
    // Spin 1.8s then track
    const t0=performance.now(), dur=1800;
    function spin(now){
      const t=Math.min(1,(now-t0)/dur);
      const e=t<.5?2*t*t:-1+(4-2*t)*t;
      angle=e*720;
      needleEl.setAttribute('transform',`rotate(${angle.toFixed(2)} 50 50)`);
      if(t<1) requestAnimationFrame(spin);
      else if(!touch) document.addEventListener('mousemove',onMove,{passive:true});
    }
    requestAnimationFrame(spin);
  }

  /* ── MAIN ── */
  const compassEl = document.getElementById('compass-backdrop');
  const heroEl = document.getElementById('hero');
  if(!compassEl||!heroEl) return;

  // Hero overlay
  const {svg:hSvg, needle:hNeedle} = buildHeroSVG();
  compassEl.appendChild(hSvg);
  trackNeedle(hNeedle, ()=>{
    const r=compassEl.getBoundingClientRect();
    return {x:r.left+r.width/2, y:r.top+r.height/2};
  }, 0.09);

  // Mini compass
  const {el:miniEl, needle:mNeedle, sectors:mSectors} = buildMini();
  document.body.appendChild(miniEl);

  // Show mini when hero leaves viewport
  new IntersectionObserver(([e])=>{
    miniEl.classList.toggle('visible', !e.isIntersecting);
  },{threshold:0.15}).observe(heroEl);

  // Mini needle tracks mouse
  trackNeedle(mNeedle, ()=>{
    const r=miniEl.getBoundingClientRect();
    return {x:r.left+r.width/2, y:r.top+r.height/2};
  }, 0.06);

  // Section awareness → sector highlight
  const map = {philosophy:'sN', assets:'sW', insights:'sE', newsletter:'sS'};
  const secObs = new IntersectionObserver(entries=>{
    entries.forEach(e=>{
      if(!e.isIntersecting) return;
      mSectors.querySelectorAll('.cmp-sector').forEach(s=>s.classList.remove('active'));
      const sid=map[e.target.id];
      if(sid){const s=mSectors.querySelector(`[data-sector="${sid}"]`);if(s)s.classList.add('active');}
    });
  },{threshold:.35});
  document.querySelectorAll('#philosophy,#assets,#insights,#newsletter').forEach(s=>secObs.observe(s));
}catch(e){}
})();
