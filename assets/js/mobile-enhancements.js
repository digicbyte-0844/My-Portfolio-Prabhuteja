/**
 * Mobile-Only Dynamic Enhancements & Visual Engine
 * File: assets/js/mobile-enhancements.js
 * 
 * Features Originkit Scramble Text (GlitchCharReveal) for Name & Rotating Roles
 * Scoped strictly for mobile viewport (window.innerWidth <= 991)
 */

(function () {
  "use strict";

  const MOBILE_BREAKPOINT = 991;

  function isMobile() {
    return window.innerWidth <= MOBILE_BREAKPOINT;
  }

  // --------------------------------------------------------------------------
  // ORIGINKIT SCRAMBLE TEXT ENGINE (GlitchCharReveal)
  // --------------------------------------------------------------------------
  const GLITCH_CHARS_UPPER = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  const GLITCH_CHARS_LOWER = "abcdefghijklmnopqrstuvwxyz";
  const WAVE_CURSOR_CHARS = "░▒▓█";
  const SYMBOL_POOL = "!<>-_/[]{}—=+*^?#";

  function getRandomGlitchChar(isUpper = true) {
    const r = Math.random();
    if (r < 0.35) {
      return WAVE_CURSOR_CHARS[Math.floor(Math.random() * WAVE_CURSOR_CHARS.length)];
    }
    if (r < 0.55) {
      return SYMBOL_POOL[Math.floor(Math.random() * SYMBOL_POOL.length)];
    }
    const pool = isUpper ? GLITCH_CHARS_UPPER : GLITCH_CHARS_LOWER;
    return pool[Math.floor(Math.random() * pool.length)];
  }

  function cubicBezier(x1, y1, x2, y2) {
    const cx = 3 * x1;
    const bx = 3 * (x2 - x1) - cx;
    const ax = 1 - cx - bx;
    const cy = 3 * y1;
    const by = 3 * (y2 - y1) - cy;
    const ay = 1 - cy - by;
    const sampleX = (t) => ((ax * t + bx) * t + cx) * t;
    const sampleY = (t) => ((ay * t + by) * t + cy) * t;
    const sampleDX = (t) => (3 * ax * t + 2 * bx) * t + cx;
    return (x) => {
      let t = x;
      for (let i = 0; i < 8; i++) {
        const dx = sampleX(t) - x;
        const d = sampleDX(t);
        if (Math.abs(dx) < 1e-6) break;
        if (d === 0) break;
        t -= dx / d;
      }
      return sampleY(Math.max(0, Math.min(1, t)));
    };
  }

  const easeOutFn = cubicBezier(0.16, 1, 0.3, 1);

  class OriginkitScrambleText {
    constructor(element, options = {}) {
      this.element = element;
      this.currentText = element.textContent.trim() || "";
      this.targetText = this.currentText;
      this.options = Object.assign({
        duration: 1.8,
        flickerEnabled: true,
        flickerColor: "#ff5e14",
        cursorColor: "#00e5ff",
        baseColor: "#ffffff",
        replayOnTap: true
      }, options);

      this.isAnimating = false;
      this.rafId = null;

      this.initDOM();
      if (this.options.replayOnTap) {
        const trigger = (e) => {
          if (e) e.stopPropagation();
          if (typeof this.options.onTap === "function") {
            this.options.onTap();
          } else {
            this.scrambleTo(this.targetText);
          }
        };
        this.element.style.cursor = "pointer";
        this.element.addEventListener("click", trigger, { passive: true });
        this.element.addEventListener("touchstart", trigger, { passive: true });
      }
    }

    initDOM() {
      this.renderStatic(this.currentText);
    }

    renderStatic(text) {
      this.element.innerHTML = "";
      const frag = document.createDocumentFragment();
      for (let i = 0; i < text.length; i++) {
        const ch = text[i];
        const span = document.createElement("span");
        span.className = "originkit-char locked";
        span.textContent = ch === " " ? "\u00A0" : ch;
        frag.appendChild(span);
      }
      this.element.appendChild(frag);
    }

    scrambleTo(newText, durationOverride = null) {
      if (!isMobile()) return;
      if (this.rafId) {
        cancelAnimationFrame(this.rafId);
      }

      this.isAnimating = true;
      this.targetText = newText;
      const duration = (durationOverride || this.options.duration) * 1000;
      const totalLen = Math.max(this.currentText.length, newText.length);

      this.element.innerHTML = "";
      const frag = document.createDocumentFragment();
      const slots = [];

      for (let i = 0; i < totalLen; i++) {
        const span = document.createElement("span");
        span.className = "originkit-char";
        const finalChar = i < newText.length ? newText[i] : "";
        span.textContent = finalChar === " " ? "\u00A0" : (finalChar || "\u00A0");
        frag.appendChild(span);
        slots.push({
          el: span,
          finalChar: finalChar,
          isSpace: finalChar === " " || finalChar === "",
          locked: false
        });
      }
      this.element.appendChild(frag);

      const startTime = performance.now();

      const tick = (now) => {
        const elapsed = now - startTime;
        const progress = Math.min(1, elapsed / duration);
        const easedProgress = easeOutFn(progress);

        const frontier = easedProgress * totalLen;
        const frontierIdx = Math.floor(frontier);

        for (let i = 0; i < totalLen; i++) {
          const slot = slots[i];
          if (slot.isSpace) {
            slot.el.textContent = "\u00A0";
            slot.el.className = "originkit-char";
            continue;
          }

          if (i < frontierIdx) {
            if (!slot.locked) {
              slot.locked = true;
              slot.el.textContent = slot.finalChar;
              slot.el.className = "originkit-char locked";
              if (this.options.flickerEnabled && Math.random() < 0.4) {
                slot.el.classList.add("flicker");
                setTimeout(() => slot.el && slot.el.classList.remove("flicker"), 85);
              }
            }
          } else if (i === frontierIdx) {
            slot.locked = false;
            slot.el.textContent = WAVE_CURSOR_CHARS[Math.floor(Math.random() * WAVE_CURSOR_CHARS.length)];
            slot.el.className = "originkit-char cursor";
          } else {
            slot.locked = false;
            const isUpper = slot.finalChar === slot.finalChar.toUpperCase();
            slot.el.textContent = getRandomGlitchChar(isUpper);
            slot.el.className = "originkit-char glitch";
          }
        }

        if (progress < 1) {
          this.rafId = requestAnimationFrame(tick);
        } else {
          this.currentText = newText;
          this.isAnimating = false;
          slots.forEach((s, idx) => {
            if (idx < newText.length) {
              s.el.textContent = s.finalChar === " " ? "\u00A0" : s.finalChar;
              s.el.className = "originkit-char locked";
            } else {
              s.el.remove();
            }
          });
        }
      };

      this.rafId = requestAnimationFrame(tick);
    }
  }

  // --------------------------------------------------------------------------
  // ROLE ROTATOR & SCRAMBLE CONTROLLER
  // --------------------------------------------------------------------------
  const roles = [
    "FULL STACK DEVELOPER",
    "REACT & NESTJS ARCHITECT",
    "CLOUDFLARE EDGE SPECIALIST",
    "MICROSERVICES & API EXPERT",
    "MCA GRADUATE (CGPA 8.15)"
  ];

  let currentRoleIndex = 0;
  let rotatorInterval = null;
  let nameWaveInterval = null;
  let nameScrambleInstance = null;
  let roleScrambleInstance = null;
  let scrambleInitialized = false;

  function initOriginkitScrambleAnimations() {
    if (!isMobile()) return;
    if (scrambleInitialized) return;

    const nameElem = document.getElementById("mobileScrambleName");
    const roleElem = document.getElementById("mobileRoleRotator");

    if (nameElem) {
      nameScrambleInstance = new OriginkitScrambleText(nameElem, {
        duration: 1.8,
        baseColor: "#ffffff",
        flickerColor: "#ff5e14",
        cursorColor: "#00e5ff",
        onTap: () => {
          if (nameScrambleInstance) {
            nameScrambleInstance.scrambleTo("PRABHUTEJA KODA", 1.4);
          }
        }
      });
      // Initial entrance reveal
      nameScrambleInstance.scrambleTo("PRABHUTEJA KODA");

      // Periodic cyber glitch wave every 7.5 seconds
      if (nameWaveInterval) clearInterval(nameWaveInterval);
      nameWaveInterval = setInterval(() => {
        if (isMobile() && nameScrambleInstance && !nameScrambleInstance.isAnimating) {
          nameScrambleInstance.scrambleTo("PRABHUTEJA KODA", 1.3);
        }
      }, 7500);
    }

    if (roleElem) {
      const nextRole = () => {
        currentRoleIndex = (currentRoleIndex + 1) % roles.length;
        if (roleScrambleInstance) {
          roleScrambleInstance.scrambleTo(roles[currentRoleIndex]);
        }
      };

      roleScrambleInstance = new OriginkitScrambleText(roleElem, {
        duration: 1.5,
        baseColor: "#ff5e14",
        flickerColor: "#ffffff",
        cursorColor: "#00e5ff",
        onTap: nextRole
      });

      // Auto cycle roles every 3.8s using Originkit Scramble transition
      if (rotatorInterval) clearInterval(rotatorInterval);
      rotatorInterval = setInterval(() => {
        if (!isMobile()) return;
        nextRole();
      }, 3800);
    }

    scrambleInitialized = true;
  }

  // --------------------------------------------------------------------------
  // AMBIENT PARTICLES / BACKGROUNDS (Mobile Only)
  // --------------------------------------------------------------------------
  function initAmbientBackground() {
    const homeSection = document.getElementById("home");
    if (!homeSection) return;
    if (homeSection.querySelector(".mobile-ambient-bg")) return;

    const ambientBg = document.createElement("div");
    ambientBg.className = "mobile-ambient-bg d-lg-none";
    ambientBg.setAttribute("aria-hidden", "true");
    ambientBg.innerHTML = `
      <div class="mobile-ambient-orb mobile-ambient-orb-1"></div>
      <div class="mobile-ambient-orb mobile-ambient-orb-2"></div>
      <div class="mobile-ambient-orb mobile-ambient-orb-3"></div>
    `;

    homeSection.prepend(ambientBg);
  }

  // --------------------------------------------------------------------------
  // DYNAMIC STATS REFRESH
  // --------------------------------------------------------------------------
  function initStatsRefreshOnMobile() {
    if (typeof PureCounter === "function") {
      try {
        new PureCounter();
      } catch (e) {
        // PureCounter already initialized
      }
    }
  }

  // Initialize all mobile enhancements
  function setupMobileExperience() {
    if (!isMobile()) return;
    initAmbientBackground();
    initOriginkitScrambleAnimations();
    initStatsRefreshOnMobile();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", setupMobileExperience);
  } else {
    setupMobileExperience();
  }

  // Re-check on window resize
  window.addEventListener("resize", function () {
    if (isMobile()) {
      setupMobileExperience();
    }
  }, { passive: true });

})();
