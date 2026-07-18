// ══════════════════════════════════════════
// NEON 3D ENGINE — particles, tilt, reveal
// ══════════════════════════════════════════
(function () {
  "use strict";

  /* ---------- 1. Floating 3D particle canvas ---------- */
  const canvas = document.createElement("canvas");
  canvas.id = "neon-particles";
  document.body.prepend(canvas);
  const ctx = canvas.getContext("2d");

  let w, h, particles = [];
  const COLORS = ["#00B8D4", "#0EA5C4", "#22D3EE"];
  const COUNT = window.innerWidth < 768 ? 35 : 80;

  function resize() {
    w = canvas.width = window.innerWidth;
    h = canvas.height = window.innerHeight * 1.0;
    canvas.style.height = document.documentElement.scrollHeight + "px";
    h = document.documentElement.scrollHeight;
    canvas.height = h;
  }

  function makeParticle() {
    return {
      x: Math.random() * w,
      y: Math.random() * h,
      z: Math.random() * 1 + 0.2,
      r: Math.random() * 2 + 0.6,
      vx: (Math.random() - 0.5) * 0.25,
      vy: (Math.random() - 0.5) * 0.25,
      color: COLORS[Math.floor(Math.random() * COLORS.length)],
      pulse: Math.random() * Math.PI * 2
    };
  }

  function init() {
    resize();
    particles = Array.from({ length: COUNT }, makeParticle);
  }

  function step() {
    ctx.clearRect(0, 0, w, h);
    for (const p of particles) {
      p.x += p.vx * p.z;
      p.y += p.vy * p.z;
      p.pulse += 0.02;
      if (p.x < -10) p.x = w + 10;
      if (p.x > w + 10) p.x = -10;
      if (p.y < -10) p.y = h + 10;
      if (p.y > h + 10) p.y = -10;

      const glow = (Math.sin(p.pulse) + 1) / 2;
      const radius = p.r * p.z * (1 + glow * 0.6);

      ctx.beginPath();
      ctx.arc(p.x, p.y, radius * 2.4, 0, Math.PI * 2);
      const grad = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, radius * 2.4);
      grad.addColorStop(0, p.color + "55");
      grad.addColorStop(1, p.color + "00");
      ctx.fillStyle = grad;
      ctx.fill();

      ctx.beginPath();
      ctx.arc(p.x, p.y, radius, 0, Math.PI * 2);
      ctx.fillStyle = p.color;
      ctx.fill();
    }
    requestAnimationFrame(step);
  }

  window.addEventListener("resize", () => {
    clearTimeout(window._neonResizeT);
    window._neonResizeT = setTimeout(init, 200);
  });

  init();
  requestAnimationFrame(step);

  /* ---------- 2. Abstract background image + floating 3D shapes in hero ---------- */
  document.addEventListener("DOMContentLoaded", () => {
    const hero = document.getElementById("home");
    if (hero) {
      const shapes = [
        { cls: "shape-cube", style: "top:12%; left:6%;" },
        { cls: "shape-ring", style: "top:65%; left:10%;" },
        { cls: "shape-tri", style: "top:20%; right:8%;" },
        { cls: "shape-diamond", style: "top:70%; right:14%;" }
      ];
      shapes.forEach((s, i) => {
        const el = document.createElement("div");
        el.className = "float-shape " + s.cls;
        el.style.cssText = s.style + `animation-delay:${i * 0.7}s;`;
        hero.appendChild(el);
      });
    }

    /* ---------- 3. Mouse-move 3D tilt (desktop) + tap-lift (mobile) ---------- */
    const isCoarsePointer = window.matchMedia("(pointer: coarse)").matches;
    const tiltSelectors = ".skill-card, .project-card, .process-card, .service-item";
    document.querySelectorAll(tiltSelectors).forEach((card) => {
      card.classList.add("click-lift");
      card.style.transformStyle = "preserve-3d";

      if (!isCoarsePointer) {
        // fine pointer (mouse/trackpad): full 3D tilt follows cursor
        card.addEventListener("mousemove", (e) => {
          const rect = card.getBoundingClientRect();
          const x = e.clientX - rect.left;
          const y = e.clientY - rect.top;
          const cx = rect.width / 2;
          const cy = rect.height / 2;
          const rotateX = ((y - cy) / cy) * -8;
          const rotateY = ((x - cx) / cx) * 8;
          card.style.transform = `perspective(900px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateZ(6px)`;
        });
        card.addEventListener("mouseleave", () => {
          card.style.transform = "";
        });
      } else {
        // touch: quick lift feedback on tap, auto-releases
        card.addEventListener("touchstart", () => {
          card.style.transform = "translateY(-6px) scale(1.015)";
        }, { passive: true });
        card.addEventListener("touchend", () => {
          setTimeout(() => { card.style.transform = ""; }, 220);
        }, { passive: true });
      }
    });

    /* ---------- 4. Click-to-reveal panels (project cards etc.) ---------- */
    document.querySelectorAll("[data-reveal]").forEach((card) => {
      card.addEventListener("click", (e) => {
        if (e.target.closest("a, button")) return; // let links/buttons work normally
        card.classList.toggle("card-active");
      });
    });

    /* ---------- 5. (parallax orbs removed — background now uses static abstract image) ---------- */
  });
})();
