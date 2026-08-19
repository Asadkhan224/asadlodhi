// ══════════════════════════════════════════
// NEON 3D ENGINE — card tilt + click-reveal only
// (full-page particle canvas removed — too much visual noise for a
//  professional portfolio; recruiters scan in ~6 seconds and shouldn't
//  be fighting a moving background to read your credentials)
// ══════════════════════════════════════════
(function () {
  "use strict";

  /* ---------- Mouse-move 3D tilt (desktop) + tap-lift (mobile) ---------- */
  document.addEventListener("DOMContentLoaded", () => {
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
