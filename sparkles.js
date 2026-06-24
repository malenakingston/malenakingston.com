/* gentle white sparkle trail that follows the cursor.
   The native wand cursor stays; these are just soft sparkles behind it. */
(function(){
  if (window.matchMedia && window.matchMedia('(pointer: coarse)').matches) return; // skip touch
  const canvas=document.createElement('canvas');
  canvas.style.cssText='position:fixed;inset:0;pointer-events:none;z-index:9998;';
  document.body.appendChild(canvas);
  const ctx=canvas.getContext('2d');
  let W,H;
  function resize(){ W=canvas.width=innerWidth; H=canvas.height=innerHeight; }
  resize(); addEventListener('resize',resize);
  const parts=[]; let last=0;
  addEventListener('mousemove',e=>{
    const now=Date.now();
    if(now-last < 28) return;      // throttle so it's not overbearing
    last=now;
    parts.push({x:e.clientX, y:e.clientY,
      vx:(Math.random()*0.8-0.4), vy:(Math.random()*0.8-0.2),
      life:1, size:Math.random()*2.2+1.2,
      rot:Math.random()*Math.PI});
  });
  function star(x,y,r,rot,a){
    ctx.save(); ctx.translate(x,y); ctx.rotate(rot);
    ctx.beginPath();
    for(let i=0;i<4;i++){ // 4-point sparkle
      ctx.lineTo(0,-r); ctx.lineTo(r*0.25,-r*0.25);
      ctx.rotate(Math.PI/2);
    }
    ctx.closePath();
    ctx.fillStyle=`rgba(255,255,255,${a})`;
    ctx.shadowBlur=6; ctx.shadowColor=`rgba(255,255,255,${a})`;
    ctx.fill(); ctx.restore();
  }
  function tick(){
    ctx.clearRect(0,0,W,H);
    for(let i=parts.length-1;i>=0;i--){
      const p=parts[i]; p.x+=p.vx; p.y+=p.vy; p.life-=0.04;
      if(p.life<=0){ parts.splice(i,1); continue; }
      star(p.x,p.y,p.size*(0.6+p.life), p.rot, p.life*0.8);
    }
    requestAnimationFrame(tick);
  }
  tick();
})();
