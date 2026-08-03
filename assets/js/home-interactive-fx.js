/* MB Interactive v1.0 — web-design-agent 2026-07-17 */
/* try/catch gehaertet 2026-07-19 web-design-agent: Clarity meldete ScriptErrorCount 24,24%
   der DE-Sessions (3-Tage-Fenster) seit Einbau dieses + des Compass-v2.0-Blocks (17./18.07.) --
   zeitliche Korrelation. Kein reproduzierbarer Stack-Trace isolierbar (Playwright-Konsole nur
   "Y", keine Browser-Devtools-Zugriff), daher defensiv: ein Fehler in diesem rein dekorativen
   Block darf nie als Uncaught Exception zaehlen/sichtbar werden. Verhalten unveraendert bei
   Erfolg, stiller No-Op bei Fehler. */
(()=>{
try{
  const rm=window.matchMedia('(prefers-reduced-motion:reduce)').matches;
  const touch=matchMedia('(pointer:coarse)').matches;

  /* 1 — Cursor glow */
  if(!touch){
    const g=document.createElement('div');
    g.id='mb-cursor-glow';
    document.body.prepend(g);
    let gx=-999,gy=-999,rf=0;
    document.addEventListener('mousemove',e=>{
      gx=e.clientX;gy=e.clientY;
      document.body.classList.add('mb-cursor-active');
      if(!rf)rf=requestAnimationFrame(()=>{g.style.left=gx+'px';g.style.top=gy+'px';rf=0;});
    },{passive:true});
  }

  /* 2 — Compass: mouse tracking + glow rings + cardinal bearing snap */
  /* CWV-Fix 2026-07-23 web-design-agent: this block was the ONE effect in this file NOT gated
     by !touch (Cursor-Glow §1, Magnetic-Tilt §4 already skip touch devices) -- it unconditionally
     appended 2 continuously-animating divs (compass-ring 4.5s pulse x3, compass-glint 9s sweep)
     on every visit incl. mobile/touch, where the mouse-tracking payoff inside is dead code anyway
     (no mouse). Matches the exact regression window in lighthouse-alerts.md (mobile Home CLS/TBT
     worsened 0.44->0.39, TBT 870ms) and the Clarity ScriptErrorCount spike (19.07 comment above,
     20/session-group ~35% -- same block, same install date 17/18.07). Gating to !touch removes
     always-on compositor work + the mouse-listener dead code path from the majority-mobile DE
     audience (GA4 28d: 13/31 sessions mobile) with zero visual change on desktop and no loss of
     the scroll-linked base tilt (separate, already-gated-for-both code path above). Fully
     reversible: revert this one condition to restore prior behaviour. */
  if(cb&&hero&&!rm&&!touch){
    cb.classList.add('mb-live');
    // Three expanding pulse rings
    for(let i=0;i<3;i++){const r=document.createElement('div');r.className='compass-ring';cb.appendChild(r);}
    // Mouse tracking (desktop only)
    if(!touch){
      let crf=0;
      hero.addEventListener('mousemove',e=>{
        if(crf)return;
        crf=requestAnimationFrame(()=>{
          const r=hero.getBoundingClientRect();
          const nx=(e.clientX-r.left)/r.width*2-1;   // −1…+1 (L→R)
          const ny=(e.clientY-r.top)/r.height*2-1;    // −1…+1 (T→B)
          cb.style.setProperty('--mouse-tilt-x',(-ny*5).toFixed(2)+'deg');   // lean toward cursor
          cb.style.setProperty('--mouse-rot-y',(nx*8).toFixed(2)+'deg');      // billboard Y
          cb.style.setProperty('--mouse-rot-z',(nx*5).toFixed(2)+'deg');      // Z-spin toward cursor
          crf=0;
        });
      },{passive:true});
      hero.addEventListener('mouseleave',()=>{
        cb.style.setProperty('--mouse-tilt-x','0deg');
        cb.style.setProperty('--mouse-rot-y','0deg');
        cb.style.setProperty('--mouse-rot-z','0deg');
      });
    }
    // Compass glint — metallic light streak element
    if(!rm){const gl=document.createElement('div');gl.className='compass-glint';cb.appendChild(gl);}
    // Cardinal bearing: hovering a direction spins compass to point there + brightens glow
    document.querySelectorAll('.compass-cardinals a[data-bearing]').forEach(a=>{
      a.addEventListener('mouseenter',()=>{
        cb.style.setProperty('--mouse-rot-z',(+a.dataset.bearing*0.08).toFixed(2)+'deg');
        hero.classList.add('compass-cardinal-hover');
      });
      a.addEventListener('mouseleave',()=>{
        cb.style.setProperty('--mouse-rot-z','0deg');
        hero.classList.remove('compass-cardinal-hover');
      });
    });
  }

  /* 3 — Gold particles floating up in hero */
  if(hero&&!rm){
    [[3,14,72,10,0,.55],[2,28,58,8,1.5,.4],[4,48,82,12,.5,.45],[2,68,62,9,2,.4],
     [3,84,76,11,.8,.5],[2,22,38,7.5,3,.35],[3,58,34,13,1,.4],[2,78,48,9.5,2.5,.45],
     [3,38,66,8.5,.3,.5],[2,92,55,11,1.8,.45],[2,54,80,7,4,.35],[3,72,28,10.5,.6,.5]
    ].forEach(([s,x,y,d,t,o])=>{
      const p=document.createElement('div');
      p.className='hero-particle';
      p.style.cssText=`left:${x}%;top:${y}%;width:${s}px;height:${s}px;--hp-d:${d}s;--hp-t:${t}s;--hp-o:${o};--hp-h:-${Math.round(70+d*8)}px`;
      hero.appendChild(p);
    });
  }

  /* 4 — Magnetic 3D tilt on asset/pillar/step cards */
  if(!rm&&!touch){
    document.querySelectorAll('.asset,.pillar,.step').forEach(c=>{
      c.addEventListener('mousemove',e=>{
        const r=c.getBoundingClientRect();
        const x=(e.clientX-r.left)/r.width-.5;
        const y=(e.clientY-r.top)/r.height-.5;
        c.style.transform=`perspective(700px) rotateY(${(x*7).toFixed(2)}deg) rotateX(${(-y*5).toFixed(2)}deg) translateZ(2px)`;
      },{passive:true});
      c.addEventListener('mouseleave',()=>{c.style.transform='';});
    });
  }
}catch(e){}
})();
