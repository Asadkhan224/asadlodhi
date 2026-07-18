// ══════════════════════════════════════════
// PREMIUM FX — Preloader, Cursor, Reveal
// ══════════════════════════════════════════
(function () {
  "use strict";

  /* ============ 0. Tiny sound engine (WebAudio, no files needed) ============ */
  let actx = null;
  function ctxOn() {
    if (!actx) {
      try { actx = new (window.AudioContext || window.webkitAudioContext)(); }
      catch (e) { actx = null; }
    }
    return actx;
  }
  function blip(freq, dur, vol, type) {
    const ac = ctxOn();
    if (!ac) return;
    if (ac.state === "suspended") ac.resume();
    const osc = ac.createOscillator();
    const gain = ac.createGain();
    osc.type = type || "sine";
    osc.frequency.value = freq;
    gain.gain.setValueAtTime(vol || 0.05, ac.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.0001, ac.currentTime + (dur || 0.12));
    osc.connect(gain).connect(ac.destination);
    osc.start();
    osc.stop(ac.currentTime + (dur || 0.12));
  }
  const soundHover = () => blip(740, 0.06, 0.025, "sine");
  const soundClick = () => blip(320, 0.1, 0.05, "triangle");
  // unlock audio on first real interaction
  ["pointerdown", "keydown"].forEach(ev =>
    window.addEventListener(ev, ctxOn, { once: true, passive: true })
  );

  /* ============ 1. PRELOADER: show loading gif briefly, then fade ============ */
  function runPreloader() {
    const pre = document.getElementById("preloader");
    if (!pre) return;
    const MIN_SHOW = 1100; // ms, fast + premium
    const start = performance.now();

    function finish() {
      const elapsed = performance.now() - start;
      const wait = Math.max(0, MIN_SHOW - elapsed);
      setTimeout(() => {
        pre.classList.add("fade-out");
        document.body.classList.remove("no-scroll");
        setTimeout(() => pre.remove(), 650);
      }, wait);
    }

    document.body.classList.add("no-scroll");
    let done = false;
    function finishOnce() { if (done) return; done = true; finish(); }
    if (document.readyState === "complete") finishOnce();
    else window.addEventListener("load", finishOnce);
    // safety net in case load event is delayed by slow assets
    setTimeout(finishOnce, 4000);
  }

  /* ============ 2. Simple hover sound feedback (no custom cursor) ============ */
  function initHoverSound() {
    const hoverables = "a, button, .btn-hire, .btn-primary, .btn-outline, .btn-ghost, .project-card, .skill-card";
    function bind(el) {
      if (el.dataset.fxBound) return;
      el.dataset.fxBound = "1";
      el.addEventListener("mouseenter", soundHover);
    }
    document.querySelectorAll(hoverables).forEach(bind);
    new MutationObserver((mutations) => {
      mutations.forEach(m => m.addedNodes.forEach(n => {
        if (n.nodeType !== 1) return;
        if (n.matches && n.matches(hoverables)) bind(n);
        n.querySelectorAll && n.querySelectorAll(hoverables).forEach(bind);
      }));
    }).observe(document.body, { childList: true, subtree: true });
  }

  /* ============ 3. Magnetic pull on buttons ============ */
  function initMagnetic() {
    const isFine = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
    if (!isFine) return;
    const targets = document.querySelectorAll(".btn-primary, .btn-outline, .btn-ghost, .btn-hire, #wa-fab, #hire-submit-btn");
    targets.forEach((btn) => {
      btn.classList.add("magnetic-el");
      btn.addEventListener("mousemove", (e) => {
        const r = btn.getBoundingClientRect();
        const relX = e.clientX - r.left - r.width / 2;
        const relY = e.clientY - r.top - r.height / 2;
        btn.style.transform = `translate(${relX * 0.28}px, ${relY * 0.35}px)`;
      });
      btn.addEventListener("mouseleave", () => { btn.style.transform = ""; });
    });
  }

  /* ============ 4. Soft glow-pulse + click sound on buttons ============ */
  function initClickPulse() {
    const targets = document.querySelectorAll(".btn-primary, .btn-outline, .btn-ghost, .btn-hire, .project-card, #hire-submit-btn, #wa-fab");
    targets.forEach((el) => {
      el.classList.add("pulse-el");
      el.addEventListener("click", (e) => {
        soundClick();
        const r = el.getBoundingClientRect();
        const glow = document.createElement("span");
        glow.className = "pulse-glow";
        glow.style.setProperty("--px", ((e.clientX - r.left) / r.width * 100) + "%");
        glow.style.setProperty("--py", ((e.clientY - r.top) / r.height * 100) + "%");
        el.appendChild(glow);
        setTimeout(() => glow.remove(), 600);
      });
    });
  }

  /* ============ 5. Scroll reveal: fade+slide-up, letter reveal, parallax ============ */
  function initScrollReveal() {
    // Auto-tag section children for fade-up reveal
    document.querySelectorAll("section > *:not(.neon-glow-orb):not(.float-shape)").forEach((el) => {
      if (!el.classList.contains("fade-up")) el.classList.add("reveal-up");
    });
    // section-titles get letter-by-letter reveal
    document.querySelectorAll(".section-title").forEach((h) => {
      if (h.dataset.split) return;
      h.dataset.split = "1";
      const text = h.textContent;
      h.innerHTML = "";
      h.classList.add("reveal-letters");
      [...text].forEach((ch, i) => {
        const span = document.createElement("span");
        span.className = "rl-char";
        span.style.transitionDelay = (i * 18) + "ms";
        span.textContent = ch === " " ? "\u00A0" : ch;
        h.appendChild(span);
      });
    });

    const io = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("in-view");
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15, rootMargin: "0px 0px -60px 0px" });

    document.querySelectorAll(".reveal-up, .reveal-letters, .fade-up").forEach((el) => io.observe(el));

    // Parallax on hero photo + about image
    const parallaxEls = [
      { el: document.querySelector(".hero-photo"), speed: 0.12 },
      { el: document.querySelector(".about-img"), speed: 0.08 },
      { el: document.querySelector(".hero-bg-text"), speed: -0.06 }
    ].filter(p => p.el);

    let ticking = false;
    window.addEventListener("scroll", () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        const sc = window.scrollY;
        parallaxEls.forEach(p => {
          p.el.style.transform = `translateY(${sc * p.speed}px)`;
        });
        ticking = false;
      });
    }, { passive: true });
  }

  /* ============ Boot ============ */
  document.addEventListener("DOMContentLoaded", () => {
    runPreloader();
    initHoverSound();
    initMagnetic();
    initClickPulse();
    initScrollReveal();
  });
})();
