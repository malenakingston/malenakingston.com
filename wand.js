/* shared magic wand cursor + sparkle trail */
(function(){
  const wand=document.getElementById('wand-cursor');
  const canvas=document.getElementById('trail');
  if(!wand||!canvas) return;
  const ctx=canvas.getContext('2d');
  let W,H;
  function resize(){ W=canvas.width=innerWidth; H=canvas.height=innerHeight; }
  resize(); addEventListener('resize',resize);
  const particles=[]; let mx=innerWidth/2,my=innerHeight/2;
  addEventListener('mousemove',e=>{
    mx=e.clientX; my=e.clientY;
    wand.style.left=(mx-58)+'px'; wand.style.top=(my-38)+'px';
    for(let i=0;i<2;i++){
      particles.push({x:mx+(Math.random()*10-5),y:my+(Math.random()*10-5),
        vx:(Math.random()*2-1),vy:(Math.random()*2-1)+0.5,life:1,
        size:Math.random()*5+2, hue:Math.random()<0.5?'88,60,200':'60,80,220'});
    }
  });
  function tick(){
    ctx.clearRect(0,0,W,H);
    for(let i=particles.length-1;i>=0;i--){
      const p=particles[i]; p.x+=p.vx; p.y+=p.vy; p.life-=0.03;
      if(p.life<=0){ particles.splice(i,1); continue; }
      ctx.beginPath(); ctx.arc(p.x,p.y,p.size*p.life,0,Math.PI*2);
      ctx.fillStyle=`rgba(${p.hue},${p.life})`;
      ctx.shadowBlur=12; ctx.shadowColor=`rgba(${p.hue},${p.life})`; ctx.fill();
    }
    requestAnimationFrame(tick);
  }
  tick();
  addEventListener('mousedown',()=>wand.src='images/wand-click.png');
  addEventListener('mouseup',()=>wand.src='images/wand-big.png');
})();
