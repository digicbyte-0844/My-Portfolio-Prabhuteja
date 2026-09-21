/**
 * 3D Gallery Tunnel WebGL Animation (Three.js) - Mobile Only
 * File: assets/js/mobile-tunnel.js
 * 
 * Implements an infinite 3D wireframe grid tunnel with glowing slabs
 * showcasing all of Prabhuteja's skills, credentials, and project highlights.
 * Strict mobile gating (window.innerWidth <= 991) ensures ZERO impact on desktop.
 */

(function () {
  "use strict";

  const MOBILE_BREAKPOINT = 991;

  function isMobile() {
    return window.innerWidth <= MOBILE_BREAKPOINT;
  }

  // 1. Skill Data Configuration
  const SKILL_ITEMS = [
    { title: "React 18", subtitle: "Frontend Architecture", tag: "CORE", color: "#61DAFB", icon: "⚛️", bg: "#061524" },
    { title: "NestJS", subtitle: "Enterprise Microservices", tag: "BACKEND", color: "#E0234E", icon: "🐱", bg: "#220815" },
    { title: "Cloudflare Edge", subtitle: "Workers & Sub-Second CDN", tag: "EDGE", color: "#F38020", icon: "🚀", bg: "#261003" },
    { title: "TypeScript", subtitle: "Type-Safe Engineering", tag: "LANG", color: "#3178C6", icon: "🔷", bg: "#05162a" },
    { title: "Node.js", subtitle: "High-Throughput Runtime", tag: "SERVER", color: "#68A063", icon: "🟢", bg: "#081d0c" },
    { title: "Angular 17+", subtitle: "Enterprise SPAs", tag: "SPA", color: "#DD0031", icon: "🛡️", bg: "#23040a" },
    { title: "Tailwind CSS", subtitle: "Modern UI / Design Systems", tag: "STYLING", color: "#38BDF8", icon: "🎨", bg: "#041a26" },
    { title: "Next.js & SSR", subtitle: "Sub-Second Performance", tag: "HYBRID", color: "#F8FAFC", icon: "⚡", bg: "#11141c" },
    { title: "PostgreSQL", subtitle: "Relational DB Architecture", tag: "DATABASE", color: "#336791", icon: "🐘", bg: "#061524" },
    { title: "Firebase", subtitle: "Firestore Realtime Cloud", tag: "BAAS", color: "#FFCA28", icon: "🔥", bg: "#261901" },
    { title: "MCA (8.15 CGPA)", subtitle: "Master of Computer Apps", tag: "ACADEMIC", color: "#FF5E14", icon: "🎓", bg: "#2b0d02" },
    { title: "Docker & CI/CD", subtitle: "DevOps & Cloud Deploy", tag: "DEVOPS", color: "#2496ED", icon: "🐳", bg: "#031524" },
    { title: "REST APIs", subtitle: "High-Throughput Endpoints", tag: "SYSTEM", color: "#10B981", icon: "🌐", bg: "#021d13" },
    { title: "Core Web Vitals", subtitle: "98% Edge Speed Score", tag: "METRIC", color: "#A855F7", icon: "🏎️", bg: "#170729" },
    { title: "Lighthouse 95+", subtitle: "SEO & Best Practices", tag: "QUALITY", color: "#00C49F", icon: "🌟", bg: "#011b15" },
    { title: "Vite & Redux", subtitle: "State & Bundling Power", tag: "TOOLING", color: "#764ABC", icon: "⚙️", bg: "#120822" }
  ];

  const PROJECT_IMAGE_URLS = [
    "assets/images/thumbs/project-aurasalon.jpg",
    "assets/images/thumbs/project-slms-erp.jpg",
    "assets/images/thumbs/project-vidhata.jpg",
    "assets/images/thumbs/portfolio-three-thumb1.jpg",
    "assets/images/thumbs/portfolio-three-thumb2.jpg",
    "assets/images/thumbs/portfolio-three-thumb3.jpg",
    "assets/images/thumbs/portfolio-three-thumb4.jpg"
  ];

  // Helper: Draw rounded rectangle safely
  function drawRoundedRect(ctx, x, y, width, height, radius) {
    if (typeof ctx.roundRect === "function") {
      ctx.beginPath();
      ctx.roundRect(x, y, width, height, radius);
    } else {
      ctx.beginPath();
      ctx.moveTo(x + radius, y);
      ctx.lineTo(x + width - radius, y);
      ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
      ctx.lineTo(x + width, y + height - radius);
      ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
      ctx.lineTo(x + radius, y + height);
      ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
      ctx.lineTo(x, y + radius);
      ctx.quadraticCurveTo(x, y, x + radius, y);
      ctx.closePath();
    }
  }

  // 2. Procedural Canvas Texture Generator for Skill Cards
  function createSkillTexture(skill) {
    const canvas = document.createElement("canvas");
    canvas.width = 512;
    canvas.height = 320;
    const ctx = canvas.getContext("2d");

    // Background Card
    ctx.fillStyle = skill.bg || "#09101d";
    drawRoundedRect(ctx, 8, 8, 496, 304, 26);
    ctx.fill();

    // Border glow
    ctx.strokeStyle = skill.color;
    ctx.lineWidth = 6;
    ctx.stroke();

    // Corner tech accent
    ctx.fillStyle = skill.color;
    ctx.beginPath();
    ctx.arc(40, 40, 10, 0, Math.PI * 2);
    ctx.fill();

    // Category Tag Pill (Top Right)
    ctx.fillStyle = "rgba(255, 255, 255, 0.16)";
    drawRoundedRect(ctx, 320, 24, 160, 40, 14);
    ctx.fill();

    ctx.fillStyle = skill.color;
    ctx.font = "bold 19px 'Inter', sans-serif";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(skill.tag, 400, 44);

    // Icon Emoji
    ctx.font = "56px 'Apple Color Emoji', 'Segoe UI Emoji', sans-serif";
    ctx.textAlign = "left";
    ctx.textBaseline = "middle";
    ctx.fillText(skill.icon, 36, 128);

    // Title
    ctx.fillStyle = "#FFFFFF";
    ctx.font = "900 42px 'Outfit', sans-serif";
    ctx.fillText(skill.title, 36, 198);

    // Subtitle
    ctx.fillStyle = "#E2E8F0";
    ctx.font = "600 23px 'Inter', sans-serif";
    ctx.fillText(skill.subtitle, 36, 248);

    // Bottom accent indicator line
    const grad = ctx.createLinearGradient(36, 285, 476, 285);
    grad.addColorStop(0, skill.color);
    grad.addColorStop(1, "transparent");
    ctx.fillStyle = grad;
    ctx.fillRect(36, 285, 440, 6);

    const texture = new THREE.CanvasTexture(canvas);
    texture.minFilter = THREE.LinearFilter;
    texture.generateMipmaps = false;
    texture.needsUpdate = true;
    return texture;
  }

  let tunnelInitialized = false;
  let resizeTunnel = null;

  // 3. Main Gallery Tunnel Controller
  function initMobileGalleryTunnel() {
    if (!isMobile()) return;
    if (tunnelInitialized) return;
    if (typeof THREE === "undefined") {
      console.warn("Three.js not loaded, retrying Gallery Tunnel init in 200ms...");
      setTimeout(initMobileGalleryTunnel, 200);
      return;
    }

    const container = document.getElementById("mobileHeroTunnel");
    if (!container) return;

    // Tunnel Dimensions
    const TUNNEL_WIDTH = 2.6;
    const TUNNEL_HEIGHT = 2.3;
    const SEGMENT_DEPTH = 1.1;
    const NUM_SEGMENTS = 14;
    const LINE_RADIUS = 0.005;
    const SCROLL_TO_Z = 0.05;
    const CAMERA_CHASE = 0.12;
    const FOG_FAR = NUM_SEGMENTS * SEGMENT_DEPTH * 0.95;

    const PALETTE = [
      "#FF5E14", // Brand Orange
      "#00E5FF", // Neon Cyan
      "#8B5CF6", // Purple Neon
      "#10B981", // Emerald Green
      "#F59E0B", // Amber Gold
      "#EC4899", // Rose Pink
      "#38BDF8"  // Sky Blue
    ];

    // Create Canvas Element
    const canvas = document.createElement("canvas");
    canvas.className = "mobile-gallery-tunnel-canvas";
    canvas.style.display = "block";
    canvas.style.width = "100%";
    canvas.style.height = "100%";
    container.innerHTML = "";
    container.appendChild(canvas);

    // Three.js Scene Setup
    const scene = new THREE.Scene();
    scene.background = new THREE.Color("#050811");
    scene.fog = new THREE.Fog(new THREE.Color("#050811"), FOG_FAR * 0.2, FOG_FAR);

    const camera = new THREE.PerspectiveCamera(54, 1, 0.1, 1000);
    camera.position.set(0, 0, 0);

    const renderer = new THREE.WebGLRenderer({
      canvas: canvas,
      antialias: true,
      alpha: true,
      powerPreference: "high-performance"
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));

    const lineMaterial = new THREE.MeshBasicMaterial({
      color: new THREE.Color("#00e5ff"),
      transparent: true,
      opacity: 0.55
    });

    const loader = new THREE.TextureLoader();
    loader.setCrossOrigin("anonymous");

    // Generate procedural skill textures
    const skillTextures = SKILL_ITEMS.map(createSkillTexture);
    const skillMaterials = skillTextures.map(tex => new THREE.MeshBasicMaterial({
      map: tex,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.96
    }));

    // Color materials
    const colorMaterials = PALETTE.map(hex => new THREE.MeshBasicMaterial({
      color: new THREE.Color(hex),
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.55
    }));

    // Project image materials
    const projectMaterials = PROJECT_IMAGE_URLS.map(url => {
      const mat = new THREE.MeshBasicMaterial({
        transparent: true,
        opacity: 0.92,
        side: THREE.DoubleSide
      });
      loader.load(url, (tex) => {
        tex.minFilter = THREE.LinearFilter;
        tex.generateMipmaps = false;
        mat.map = tex;
        mat.needsUpdate = true;
      });
      return mat;
    });

    // Combine all usable textures into a rich collection
    const allSlabMaterials = [
      ...skillMaterials,
      ...projectMaterials
    ];

    const hw = TUNNEL_WIDTH / 2;
    const hh = TUNNEL_HEIGHT / 2;
    const cols = 3;
    const rows = 3;
    const colW = TUNNEL_WIDTH / cols;
    const rowH = TUNNEL_HEIGHT / rows;

    const geoFloor = new THREE.PlaneGeometry(colW * 0.92, SEGMENT_DEPTH * 0.88);
    const geoWall = new THREE.PlaneGeometry(SEGMENT_DEPTH * 0.88, rowH * 0.92);

    const geoTubeZ = new THREE.TubeGeometry(
      new THREE.LineCurve3(new THREE.Vector3(0, 0, 0), new THREE.Vector3(0, 0, -SEGMENT_DEPTH)),
      1, LINE_RADIUS, 6
    );
    const geoTubeX = new THREE.TubeGeometry(
      new THREE.LineCurve3(new THREE.Vector3(0, 0, 0), new THREE.Vector3(TUNNEL_WIDTH, 0, 0)),
      1, LINE_RADIUS, 6
    );
    const geoTubeY = new THREE.TubeGeometry(
      new THREE.LineCurve3(new THREE.Vector3(0, 0, 0), new THREE.Vector3(0, TUNNEL_HEIGHT, 0)),
      1, LINE_RADIUS, 6
    );

    const tube = (geo, x, y, z = 0) => {
      const m = new THREE.Mesh(geo, lineMaterial);
      m.position.set(x, y, z);
      return m;
    };

    const SLOTS = [];
    const zSlot = -SEGMENT_DEPTH / 2;
    for (let i = 0; i < cols; i++) {
      const x = -hw + i * colW + colW / 2;
      // Floor slot
      SLOTS.push({
        geo: geoFloor,
        pos: new THREE.Vector3(x, -hh, zSlot),
        rot: new THREE.Euler(-Math.PI / 2, 0, 0)
      });
      // Ceiling slot
      SLOTS.push({
        geo: geoFloor,
        pos: new THREE.Vector3(x, hh, zSlot),
        rot: new THREE.Euler(Math.PI / 2, 0, 0)
      });
    }
    for (let i = 0; i < rows; i++) {
      const y = -hh + i * rowH + rowH / 2;
      // Left wall slot
      SLOTS.push({
        geo: geoWall,
        pos: new THREE.Vector3(-hw, y, zSlot),
        rot: new THREE.Euler(0, Math.PI / 2, 0)
      });
      // Right wall slot
      SLOTS.push({
        geo: geoWall,
        pos: new THREE.Vector3(hw, y, zSlot),
        rot: new THREE.Euler(0, -Math.PI / 2, 0)
      });
    }

    let populateIndex = 0;
    let materialIndex = 0;

    function populateSegment(group) {
      const takesSlabs = populateIndex % 2 === 0;
      populateIndex++;
      const slabs = group.userData.slabs;

      for (const slab of slabs) {
        if (!takesSlabs || Math.random() > 0.6) {
          slab.visible = false;
          continue;
        }
        slab.visible = true;
        if (Math.random() > 0.25) {
          // Display skill or project card
          slab.material = allSlabMaterials[materialIndex % allSlabMaterials.length];
          materialIndex++;
        } else {
          // Display glowing color panel
          slab.material = colorMaterials[materialIndex % colorMaterials.length];
          materialIndex++;
        }
      }
    }

    function createSegment(z) {
      const group = new THREE.Group();
      group.position.z = z;

      for (let i = 0; i <= cols; i++) {
        const x = -hw + i * colW;
        group.add(tube(geoTubeZ, x, -hh));
        group.add(tube(geoTubeZ, x, hh));
      }
      for (let i = 1; i < rows; i++) {
        const y = -hh + i * rowH;
        group.add(tube(geoTubeZ, -hw, y));
        group.add(tube(geoTubeZ, hw, y));
      }
      group.add(tube(geoTubeX, -hw, -hh));
      group.add(tube(geoTubeX, -hw, hh));
      group.add(tube(geoTubeY, -hw, -hh));
      group.add(tube(geoTubeY, hw, -hh));

      const slabs = SLOTS.map(slot => {
        const m = new THREE.Mesh(slot.geo, colorMaterials[0]);
        m.position.copy(slot.pos);
        m.rotation.copy(slot.rot);
        m.visible = false;
        group.add(m);
        return m;
      });
      group.userData.slabs = slabs;

      populateSegment(group);
      return group;
    }

    const segments = [];
    for (let i = 0; i < NUM_SEGMENTS; i++) {
      const g = createSegment(-i * SEGMENT_DEPTH);
      scene.add(g);
      segments.push(g);
    }

    // Resize Handler
    const resize = () => {
      if (!container || !isMobile()) return;
      const w = Math.max(1, container.clientWidth || window.innerWidth);
      const h = Math.max(1, container.clientHeight || window.innerHeight);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h, false);
    };
    resize();
    resizeTunnel = resize;

    // Interaction & Speed Boost Controls
    let scrollPos = 0;
    let baseSpeed = 1.1;
    let boostSpeed = 5.5;
    let isPressed = false;
    let targetCameraX = 0;
    let targetCameraY = 0;
    let isAlive = true;
    let isVisible = true;
    let rafId = 0;

    const onPointerDown = (e) => {
      isPressed = true;
      const rect = container.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      const y = -(((e.clientY - rect.top) / rect.height) * 2 - 1);
      targetCameraX = x * 0.25;
      targetCameraY = y * 0.2;
    };

    const onPointerMove = (e) => {
      if (!isPressed) return;
      const rect = container.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      const y = -(((e.clientY - rect.top) / rect.height) * 2 - 1);
      targetCameraX = x * 0.35;
      targetCameraY = y * 0.25;
    };

    const onPointerUp = () => {
      isPressed = false;
      targetCameraX = 0;
      targetCameraY = 0;
    };

    container.addEventListener("pointerdown", onPointerDown, { passive: true });
    window.addEventListener("pointermove", onPointerMove, { passive: true });
    window.addEventListener("pointerup", onPointerUp, { passive: true });

    // Touch event fallbacks for mobile browsers
    container.addEventListener("touchstart", () => { isPressed = true; }, { passive: true });
    window.addEventListener("touchend", () => { isPressed = false; targetCameraX = 0; targetCameraY = 0; }, { passive: true });

    // IntersectionObserver to pause rendering when out of viewport
    if ("IntersectionObserver" in window) {
      const io = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          isVisible = entry.isIntersecting;
        });
      }, { threshold: 0.05 });
      io.observe(container);
    }

    // Animation Loop
    let lastTime = 0;
    const animate = (now) => {
      if (!isAlive) return;
      rafId = requestAnimationFrame(animate);

      if (!isMobile() || !isVisible) {
        return; // Skip rendering when on desktop or not in view
      }

      const dt = lastTime ? Math.min((now - lastTime) / 1000, 1 / 30) : 1 / 60;
      lastTime = now;

      // Calculate speed
      const speed = isPressed ? boostSpeed : baseSpeed;
      scrollPos += speed * 0.9;

      const wantZ = -SCROLL_TO_Z * scrollPos;
      camera.position.z += CAMERA_CHASE * (wantZ - camera.position.z);
      camera.position.x += (targetCameraX - camera.position.x) * 0.08;
      camera.position.y += (targetCameraY - camera.position.y) * 0.08;

      const span = NUM_SEGMENTS * SEGMENT_DEPTH;
      const z = camera.position.z;

      for (const seg of segments) {
        if (seg.position.z > z + SEGMENT_DEPTH) {
          let min = 0;
          for (const s of segments) min = Math.min(min, s.position.z);
          seg.position.z = min - SEGMENT_DEPTH;
          populateSegment(seg);
        } else if (seg.position.z < z - span - SEGMENT_DEPTH) {
          let max = -999999;
          for (const s of segments) max = Math.max(max, s.position.z);
          seg.position.z = max + SEGMENT_DEPTH;
          populateSegment(seg);
        }
      }

      renderer.render(scene, camera);
    };

    rafId = requestAnimationFrame(animate);
    tunnelInitialized = true;
  }

  // Ensure init on resize or initial load
  function ensureMobileTunnel() {
    if (isMobile()) {
      if (!tunnelInitialized) {
        initMobileGalleryTunnel();
      } else if (resizeTunnel) {
        resizeTunnel();
      }
    }
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", ensureMobileTunnel);
  } else {
    ensureMobileTunnel();
  }

  window.addEventListener("resize", ensureMobileTunnel, { passive: true });

})();
