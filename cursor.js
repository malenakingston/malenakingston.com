/* ===== Big wand cursor + deep-blue/purple trail =====
   Replaces the system cursor with a larger wand image and leaves a
   fading sparkle trail. Desktop only; touch devices are left alone. */
(function () {
  if (window.matchMedia && window.matchMedia("(pointer: coarse)").matches) return; // skip touch

  const WAND = "images/wand.png";
  const WAND_CLICK = "images/wand-click.png";
  const SIZE = 110;       // on-screen wand size in px (bigger = more visible)
  const HOTSPOT_X = 0.42; // where the "tip" is, as a fraction of width
  const HOTSPOT_Y = 0.30;

  // hide the real cursor everywhere
  const style = document.createElement("style");
  style.textContent = "*{cursor:none !important;}";
  document.head.appendChild(style);

  // the wand element
  const wand = document.createElement("img");
  wand.src = WAND;
  wand.alt = "";
  Object.assign(wand.style, {
    position: "fixed", left: "0", top: "0", width: SIZE + "px",
    pointerEvents: "none", zIndex: "99999",
    transform: "translate(-9999px,-9999px)",
    filter: "drop-shadow(0 0 6px rgba(90,40,160,0.6))"
  });
  document.body.appendChild(wand);

  let mx = -9999, my = -9999;
  document.addEventListener("mousemove", (e) => {
    mx = e.clientX; my = e.clientY;
    wand.style.transform =
      `translate(${mx - SIZE*HOTSPOT_X}px, ${my - SIZE*HOTSPOT_Y}px)`;
    spawnTrail(mx, my);
  });

  // swap to sparkle wand on click
  document.addEventListener("mousedown", () => { wand.src = WAND_CLICK; });
  document.addEventListener("mouseup",   () => { wand.src = WAND; });

  // ---- trail: deep blue/purple fading dots ----
  let last = 0;
  function spawnTrail(x, y) {
    const now = Date.now();
    if (now - last < 18) return;   // throttle
    last = now;
    const d = document.createElement("div");
    const s = 6 + Math.random() * 8;
    const hue = 250 + Math.random() * 30; // 250-280 = blue→purple
    Object.assign(d.style, {
      position: "fixed",
      left: (x - s/2) + "px",
      top:  (y - s/2) + "px",
      width: s + "px", height: s + "px",
      borderRadius: "50%",
      background: `radial-gradient(circle, hsla(${hue},85%,60%,0.9), hsla(${hue},85%,45%,0))`,
      pointerEvents: "none", zIndex: "99998",
      transition: "transform 0.6s ease-out, opacity 0.6s ease-out",
      opacity: "1"
    });
    document.body.appendChild(d);
    requestAnimationFrame(() => {
      d.style.transform = `translateY(${8 + Math.random()*10}px) scale(0.2)`;
      d.style.opacity = "0";
    });
    setTimeout(() => d.remove(), 650);
  }
})();
