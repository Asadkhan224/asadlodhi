// ══════════════════════════════════════════
// PREMIUM FX — Scroll Reveal only
// (sound effects, magnetic buttons, and click-pulse glow removed —
//  not appropriate for a professional/corporate portfolio)
// ══════════════════════════════════════════
(function () {
  "use strict";

  /* ============ Scroll reveal: fade+slide-up, letter reveal ============ */
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

    const mobileReveal = window.innerWidth < 768;
    const io = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("in-view");
          io.unobserve(entry.target);
        }
      });
    }, mobileReveal
      ? { threshold: 0.05, rootMargin: "0px 0px -20px 0px" }
      : { threshold: 0.15, rootMargin: "0px 0px -60px 0px" });

    document.querySelectorAll(".reveal-up, .reveal-letters, .fade-up").forEach((el) => io.observe(el));
  }

  /* ============ Boot ============ */
  document.addEventListener("DOMContentLoaded", () => {
    initScrollReveal();
  });
})();
