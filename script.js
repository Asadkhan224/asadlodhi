// ─────────────────────────────────────────────────────────────────
// 0.  MOBILE HAMBURGER MENU
// ─────────────────────────────────────────────────────────────────
function toggleMobileMenu() {
  const drawer = document.getElementById('mobileDrawer');
  const burger = document.getElementById('hamburger');
  const isOpen = drawer.classList.contains('open');
  if (isOpen) {
    drawer.classList.remove('open');
    burger.classList.remove('open');
    document.body.style.overflow = '';
  } else {
    drawer.classList.add('open');
    burger.classList.add('open');
    document.body.style.overflow = 'hidden';
  }
}
function closeMobileMenu() {
  document.getElementById('mobileDrawer').classList.remove('open');
  document.getElementById('hamburger').classList.remove('open');
  document.body.style.overflow = '';
}
// Close drawer on Escape key
document.addEventListener('keydown', e => {
  if (e.key === 'Escape') closeMobileMenu();
});


// ─────────────────────────────────────────────────────────────────
// 1.  TYPED TEXT
// ─────────────────────────────────────────────────────────────────
// ─────────────────────────────────────────────────────────────────
const phrases = [
  "Digital Marketing That Drives Results",
  "Performance Marketing Specialist",
  "Data Driven Strategy",
  "Content That Converts",
  "Growth Focus Marketer"
];
let phraseIdx = 0, charIdx = 0, deleting = false;
const typedEl = document.getElementById("typed-text");
function type() {
  const cur = phrases[phraseIdx];
  if (!deleting) {
    typedEl.textContent = cur.slice(0, ++charIdx);
    if (charIdx === cur.length) { deleting = true; return setTimeout(type, 1800); }
  } else {
    typedEl.textContent = cur.slice(0, --charIdx);
    if (charIdx === 0) { deleting = false; phraseIdx = (phraseIdx + 1) % phrases.length; }
  }
  setTimeout(type, deleting ? 50 : 90);
}
type();

// ─────────────────────────────────────────────────────────────────
// 3.  SCROLL ANIMATIONS
// ─────────────────────────────────────────────────────────────────
const observer = new IntersectionObserver((entries) => {
  entries.forEach((e, i) => {
    if (e.isIntersecting) {
      setTimeout(() => e.target.classList.add("visible"), i * 80);
      observer.unobserve(e.target);
    }
  });
}, { threshold: 0.1 });
document.querySelectorAll(".fade-up").forEach(el => observer.observe(el));

// ─────────────────────────────────────────────────────────────────
// 4.  NAVBAR SCROLL
// ─────────────────────────────────────────────────────────────────
window.addEventListener("scroll", () => {
  document.getElementById("navbar").style.background =
    window.scrollY > 50 ? "rgba(10,10,10,0.98)" : "rgba(10,10,10,0.85)";
});

// ─────────────────────────────────────────────────────────────────
// 5.  CONTACT FORM → Formspree
//     Sends the message to Asad's Formspree inbox, which forwards it
//     straight to his Gmail. Works on GitHub Pages with no backend.
// ─────────────────────────────────────────────────────────────────
const contactForm = document.getElementById('contactForm');

contactForm.addEventListener('submit', async function (e) {
  e.preventDefault();

  const btn = document.getElementById('sendBtn');
  const successMsg = document.getElementById('successMsg');

  const first = document.getElementById('cf-first').value.trim();
  const email = document.getElementById('cf-email').value.trim();
  const msg = document.getElementById('cf-msg').value.trim();

  if (!first || !email || !msg) {
    successMsg.innerHTML = '<i class="fas fa-triangle-exclamation"></i> Please fill in your name, email, and message.';
    successMsg.style.background = 'rgba(255,85,85,0.1)';
    successMsg.style.borderColor = 'rgba(255,85,85,0.3)';
    successMsg.style.color = '#FF5555';
    successMsg.style.display = 'block';
    return;
  }

  btn.disabled = true;
  btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
  successMsg.style.display = 'none';

  try {
    const response = await fetch(contactForm.action, {
      method: 'POST',
      body: new FormData(contactForm),
      headers: { 'Accept': 'application/json' }
    });

    if (response.ok) {
      successMsg.innerHTML = '<i class="fas fa-circle-check"></i> Message sent! Asad will reply within 24 hours.';
      successMsg.style.display = 'block';
      contactForm.reset();
      btn.innerHTML = '<i class="fas fa-circle-check"></i> Sent!';
    } else {
      throw new Error('Formspree error');
    }
  } catch (err) {
    successMsg.innerHTML = '<i class="fas fa-triangle-exclamation"></i> Something went wrong. Please email asadkhandigital6@gmail.com directly.';
    successMsg.style.background = 'rgba(255,85,85,0.1)';
    successMsg.style.borderColor = 'rgba(255,85,85,0.3)';
    successMsg.style.color = '#FF5555';
    successMsg.style.display = 'block';
    btn.innerHTML = 'Send Message <i class="fas fa-arrow-right"></i>';
  } finally {
    setTimeout(() => {
      btn.innerHTML = 'Send Message <i class="fas fa-arrow-right"></i>';
      btn.disabled = false;
    }, 3000);
  }
});

/* ── Certificate Lightbox (zoomable gallery) ── */
(function () {
  const certGroups = {
    google: {
      label: "Google",
      images: [
        { src: "images/certs/cert-google-ai-performance.webp", caption: "AI-Powered Performance Ads Certification — Google" }
      ]
    },
    senator: {
      label: "SenatorWeRunAds.com — Ovais Ahmad",
      images: [
        { src: "images/certs/cert-google-ads.webp", caption: "Google Ads Complete Course" },
        { src: "images/certs/cert-meta-ads.webp", caption: "Meta Ads Complete Course" },
        { src: "images/certs/cert-campaign-manager.webp", caption: "Campaign Manager 360" }
      ]
    },
    dlm: {
      label: "Digital Lodhi Marketing (DLM)",
      images: [
        { src: "images/certs/cert-dlm-internship.webp", caption: "Internship Completion Letter — DLM" }
      ]
    },
    hp: {
      label: "HP LIFE — HP Foundation",
      images: [
        { src: "images/certs/cert-hp-social-media.webp", caption: "Social Media Marketing — HP LIFE" }
      ]
    },
    simplilearn: {
      label: "Simplilearn SkillUp",
      images: [
        { src: "images/certs/cert-simplilearn-dms.webp", caption: "Digital Marketing Strategy — Certificate of Completion" }
      ]
    }
  };

  const lightbox = document.getElementById("cert-lightbox");
  if (!lightbox) return;

  const imgEl = document.getElementById("cert-lightbox-img");
  const wrapEl = document.getElementById("cert-lightbox-imgwrap");
  const captionEl = document.getElementById("cert-lightbox-caption");
  const thumbsEl = document.getElementById("cert-lightbox-thumbs");
  const prevBtn = lightbox.querySelector("[data-cert-prev]");
  const nextBtn = lightbox.querySelector("[data-cert-next]");

  let currentImages = [];
  let currentIndex = 0;
  let scale = 1, panX = 0, panY = 0;
  let isDragging = false, dragStartX = 0, dragStartY = 0, panStartX = 0, panStartY = 0;
  let pinchStartDist = 0, pinchStartScale = 1;

  function resetTransform() {
    scale = 1; panX = 0; panY = 0;
    applyTransform();
  }

  function applyTransform() {
    imgEl.style.transform = `translate(${panX}px, ${panY}px) scale(${scale})`;
  }

  function loadIndex(i) {
    currentIndex = (i + currentImages.length) % currentImages.length;
    const item = currentImages[currentIndex];
    imgEl.src = item.src;
    imgEl.alt = item.caption;
    captionEl.textContent = item.caption;
    resetTransform();

    thumbsEl.querySelectorAll("img").forEach((t, idx) => {
      t.classList.toggle("active", idx === currentIndex);
    });

    const multi = currentImages.length > 1;
    prevBtn.style.display = multi ? "flex" : "none";
    nextBtn.style.display = multi ? "flex" : "none";
  }

  function openGroup(key) {
    const group = certGroups[key];
    if (!group) return;
    currentImages = group.images;

    thumbsEl.innerHTML = "";
    if (currentImages.length > 1) {
      currentImages.forEach((item, idx) => {
        const t = document.createElement("img");
        t.src = item.src;
        t.alt = item.caption;
        t.addEventListener("click", () => loadIndex(idx));
        thumbsEl.appendChild(t);
      });
    }

    loadIndex(0);
    lightbox.classList.add("open");
    lightbox.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
  }

  function closeLightbox() {
    lightbox.classList.remove("open");
    lightbox.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";
    imgEl.src = "";
  }

  document.querySelectorAll("[data-cert-group]").forEach((btn) => {
    btn.addEventListener("click", () => openGroup(btn.getAttribute("data-cert-group")));
  });

  const showAllBtn = document.getElementById("cert-showall-btn");
  const moreGrid = document.getElementById("cert-more-grid");
  if (showAllBtn && moreGrid) {
    showAllBtn.addEventListener("click", () => {
      const isOpen = moreGrid.classList.toggle("open");
      showAllBtn.classList.toggle("open", isOpen);
      showAllBtn.innerHTML = isOpen
        ? '<i class="fas fa-chevron-down"></i> Hide Certificates'
        : '<i class="fas fa-chevron-down"></i> Show All Certificates';
    });
  }

  lightbox.querySelectorAll("[data-cert-close]").forEach((el) => {
    el.addEventListener("click", closeLightbox);
  });

  prevBtn.addEventListener("click", () => loadIndex(currentIndex - 1));
  nextBtn.addEventListener("click", () => loadIndex(currentIndex + 1));

  lightbox.querySelector("[data-cert-zoomin]").addEventListener("click", () => {
    scale = Math.min(scale + 0.5, 5);
    applyTransform();
  });
  lightbox.querySelector("[data-cert-zoomout]").addEventListener("click", () => {
    scale = Math.max(scale - 0.5, 1);
    if (scale === 1) { panX = 0; panY = 0; }
    applyTransform();
  });
  lightbox.querySelector("[data-cert-zoomreset]").addEventListener("click", resetTransform);

  document.addEventListener("keydown", (e) => {
    if (!lightbox.classList.contains("open")) return;
    if (e.key === "Escape") closeLightbox();
    if (e.key === "ArrowLeft") loadIndex(currentIndex - 1);
    if (e.key === "ArrowRight") loadIndex(currentIndex + 1);
  });

  /* Double click / double tap to zoom */
  let lastTap = 0;
  wrapEl.addEventListener("click", (e) => {
    if (isDragging) return;
    const now = Date.now();
    if (now - lastTap < 300) {
      scale = scale > 1 ? 1 : 2.2;
      if (scale === 1) { panX = 0; panY = 0; }
      applyTransform();
    }
    lastTap = now;
  });

  /* Mouse wheel zoom (desktop) */
  wrapEl.addEventListener("wheel", (e) => {
    e.preventDefault();
    const delta = e.deltaY < 0 ? 0.2 : -0.2;
    scale = Math.min(Math.max(scale + delta, 1), 5);
    if (scale === 1) { panX = 0; panY = 0; }
    applyTransform();
  }, { passive: false });

  /* Drag to pan (mouse) */
  wrapEl.addEventListener("mousedown", (e) => {
    if (scale <= 1) return;
    isDragging = true;
    wrapEl.classList.add("dragging");
    dragStartX = e.clientX; dragStartY = e.clientY;
    panStartX = panX; panStartY = panY;
  });
  window.addEventListener("mousemove", (e) => {
    if (!isDragging) return;
    panX = panStartX + (e.clientX - dragStartX);
    panY = panStartY + (e.clientY - dragStartY);
    applyTransform();
  });
  window.addEventListener("mouseup", () => {
    isDragging = false;
    wrapEl.classList.remove("dragging");
  });

  /* Touch: pinch to zoom + drag to pan (mobile) */
  function touchDist(touches) {
    const dx = touches[0].clientX - touches[1].clientX;
    const dy = touches[0].clientY - touches[1].clientY;
    return Math.sqrt(dx * dx + dy * dy);
  }

  wrapEl.addEventListener("touchstart", (e) => {
    if (e.touches.length === 2) {
      pinchStartDist = touchDist(e.touches);
      pinchStartScale = scale;
    } else if (e.touches.length === 1 && scale > 1) {
      isDragging = true;
      dragStartX = e.touches[0].clientX;
      dragStartY = e.touches[0].clientY;
      panStartX = panX; panStartY = panY;
    }
  }, { passive: true });

  wrapEl.addEventListener("touchmove", (e) => {
    if (e.touches.length === 2) {
      e.preventDefault();
      const dist = touchDist(e.touches);
      scale = Math.min(Math.max(pinchStartScale * (dist / pinchStartDist), 1), 5);
      if (scale === 1) { panX = 0; panY = 0; }
      applyTransform();
    } else if (e.touches.length === 1 && isDragging) {
      panX = panStartX + (e.touches[0].clientX - dragStartX);
      panY = panStartY + (e.touches[0].clientY - dragStartY);
      applyTransform();
    }
  }, { passive: false });

  wrapEl.addEventListener("touchend", () => {
    isDragging = false;
  });
})();
