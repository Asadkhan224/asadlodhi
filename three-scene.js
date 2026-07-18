// ══════════════════════════════════════════
// THREE.JS SCENES — bg particle field + hero object
// Requires THREE (r128) loaded globally before this file
// ══════════════════════════════════════════
(function () {
  "use strict";
  if (typeof THREE === "undefined") return;

  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const isMobile = window.innerWidth < 768;

  /* ============ A. Full-page floating particle background ============ */
  function initBgParticles() {
    const canvas = document.createElement("canvas");
    canvas.id = "bg-three-canvas";
    document.body.appendChild(canvas);

    const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.75));
    renderer.setSize(window.innerWidth, window.innerHeight);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 100);
    camera.position.z = 12;

    // Lighting for subtle depth on particles
    scene.add(new THREE.AmbientLight(0x404060, 1.2));
    const pt = new THREE.PointLight(0x00b8d4, 1.4, 40);
    pt.position.set(6, 6, 8);
    scene.add(pt);

    const COUNT = isMobile ? 180 : 420;
    const geo = new THREE.BufferGeometry();
    const positions = new Float32Array(COUNT * 3);
    const speeds = new Float32Array(COUNT);
    const colorChoices = [
      new THREE.Color(0x00b8d4),
      new THREE.Color(0x0ea5c4),
      new THREE.Color(0x22d3ee)
    ];
    const colors = new Float32Array(COUNT * 3);

    for (let i = 0; i < COUNT; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 26;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 16;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 18;
      speeds[i] = 0.15 + Math.random() * 0.35;
      const c = colorChoices[i % 3];
      colors[i * 3] = c.r; colors[i * 3 + 1] = c.g; colors[i * 3 + 2] = c.b;
    }
    geo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    geo.setAttribute("color", new THREE.BufferAttribute(colors, 3));

    const mat = new THREE.PointsMaterial({
      size: isMobile ? 0.09 : 0.075,
      vertexColors: true,
      transparent: true,
      opacity: 0.85,
      depthWrite: false,
      blending: THREE.AdditiveBlending
    });
    const points = new THREE.Points(geo, mat);
    scene.add(points);

    let targetX = 0, targetY = 0, curX = 0, curY = 0;
    window.addEventListener("mousemove", (e) => {
      targetX = (e.clientX / window.innerWidth - 0.5) * 2;
      targetY = (e.clientY / window.innerHeight - 0.5) * 2;
    });

    let raf;
    function animate() {
      raf = requestAnimationFrame(animate);
      const t = performance.now() * 0.00006;
      const pos = geo.attributes.position.array;
      for (let i = 0; i < COUNT; i++) {
        pos[i * 3 + 1] += Math.sin(t * 40 + i) * 0.0009 * speeds[i] * 40 * 0.02;
        pos[i * 3] += Math.cos(t * 30 + i) * 0.0006 * speeds[i] * 40 * 0.02;
      }
      geo.attributes.position.needsUpdate = true;

      curX += (targetX - curX) * 0.02;
      curY += (targetY - curY) * 0.02;
      points.rotation.y = curX * 0.25 + t * 2;
      points.rotation.x = -curY * 0.15;
      camera.position.x += (curX * 1.2 - camera.position.x) * 0.03;
      camera.position.y += (-curY * 0.8 - camera.position.y) * 0.03;
      camera.lookAt(scene.position);

      renderer.render(scene, camera);
    }
    if (!reduceMotion) animate(); else renderer.render(scene, camera);

    window.addEventListener("resize", () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    });

    document.addEventListener("visibilitychange", () => {
      if (document.hidden) cancelAnimationFrame(raf);
      else if (!reduceMotion) animate();
    });
  }

  /* ============ B. Hero rotating 3D object w/ lighting + scroll zoom ============ */
  function initHeroObject() {
    const hero = document.getElementById("home");
    if (!hero) return;
    const wrap = document.createElement("div");
    wrap.id = "hero-three-canvas";
    hero.insertBefore(wrap, hero.firstChild);

    const canvas = document.createElement("canvas");
    wrap.appendChild(canvas);

    const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(wrap.clientWidth, wrap.clientHeight);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, wrap.clientWidth / wrap.clientHeight, 0.1, 100);
    camera.position.set(0, 0, 7);

    // Lighting: key + rim + ambient for realistic shading/reflections
    scene.add(new THREE.AmbientLight(0x8888aa, 0.55));
    const key = new THREE.DirectionalLight(0x00b8d4, 1.6);
    key.position.set(4, 5, 6);
    scene.add(key);
    const rim = new THREE.PointLight(0x22d3ee, 2.2, 20);
    rim.position.set(-5, -3, 4);
    scene.add(rim);
    const fill = new THREE.PointLight(0x0ea5c4, 1.4, 20);
    fill.position.set(0, 4, -4);
    scene.add(fill);

    const geometry = new THREE.IcosahedronGeometry(1.7, isMobile ? 1 : 2);
    const material = new THREE.MeshPhysicalMaterial({
      color: 0x0b1220,
      metalness: 0.85,
      roughness: 0.22,
      clearcoat: 0.6,
      clearcoatRoughness: 0.25,
      emissive: 0x0b2a3a,
      emissiveIntensity: 0.35,
      flatShading: true
    });
    const mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);

    // wireframe overlay for a techy edge highlight
    const wireGeo = new THREE.IcosahedronGeometry(1.73, isMobile ? 1 : 2);
    const wireMat = new THREE.MeshBasicMaterial({ color: 0x00b8d4, wireframe: true, transparent: true, opacity: 0.18 });
    const wireMesh = new THREE.Mesh(wireGeo, wireMat);
    scene.add(wireMesh);

    let mouseX = 0, mouseY = 0, curMX = 0, curMY = 0;
    wrap.style.pointerEvents = "none"; // let hero interactions pass through; track window mouse instead
    window.addEventListener("mousemove", (e) => {
      mouseX = (e.clientX / window.innerWidth - 0.5) * 2;
      mouseY = (e.clientY / window.innerHeight - 0.5) * 2;
    });

    let scrollProgress = 0;
    function updateScroll() {
      const rect = hero.getBoundingClientRect();
      const total = rect.height;
      const passed = Math.min(Math.max(-rect.top, 0), total);
      scrollProgress = passed / total; // 0 → 1 as hero scrolls out
    }
    window.addEventListener("scroll", updateScroll, { passive: true });

    let raf;
    function animate() {
      raf = requestAnimationFrame(animate);
      mesh.rotation.y += 0.0032;
      mesh.rotation.x += 0.0014;
      wireMesh.rotation.y += 0.0032;
      wireMesh.rotation.x += 0.0014;

      curMX += (mouseX - curMX) * 0.05;
      curMY += (mouseY - curMY) * 0.05;
      mesh.rotation.y += curMX * 0.004;
      mesh.rotation.x += curMY * 0.003;
      wireMesh.rotation.y = mesh.rotation.y;
      wireMesh.rotation.x = mesh.rotation.x;

      // scroll: zoom into the object and fade as we leave hero
      const zoom = 1 + scrollProgress * 1.8;
      mesh.scale.setScalar(zoom);
      wireMesh.scale.setScalar(zoom);
      camera.position.z = 7 - scrollProgress * 3.2;
      wrap.style.opacity = String(Math.max(0, 1 - scrollProgress * 1.3));

      renderer.render(scene, camera);
    }
    if (!reduceMotion) animate(); else renderer.render(scene, camera);

    window.addEventListener("resize", () => {
      camera.aspect = wrap.clientWidth / wrap.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(wrap.clientWidth, wrap.clientHeight);
    });

    document.addEventListener("visibilitychange", () => {
      if (document.hidden) cancelAnimationFrame(raf);
      else if (!reduceMotion) animate();
    });
  }

  document.addEventListener("DOMContentLoaded", () => {
    initBgParticles();
    // Hero rotating/zooming 3D object removed per request — hero now uses
    // the abstract background image (see initHeroAbstractBg in premium.js) instead.
  });
})();
