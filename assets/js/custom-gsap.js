/***************************************************
==================== JS INDEX ======================
****************************************************

01. Smooth Scroll Js
02. Char SplitText Js
03. Text Invart Js
04. Button Hover Js
05. Banner Title
06. Footer Title
07. Portfolio Panel Js
08. Image Cliping Effect
09. Hover Reveal
10. Tesimonial Two Shape Effect
11. Portfolio Three Effect


****************************************************/

(function ($) {
  "use strict";

  ////////////////////////////////////////////////////
  // 01. Smooth Scroll & Endpoint Navigation JS
  let portfolioSmoother = null;
  if ($("#smooth-wrapper").length && $("#smooth-content").length && $(window).width() > 991) {
    gsap.registerPlugin(
      ScrollTrigger,
      ScrollSmoother,
      TweenMax,
      ScrollToPlugin,
    );
    gsap.config({
      nullTargetWarn: false,
    });
    portfolioSmoother = ScrollSmoother.create({
      smoothTouch: false,
      smooth: 0.9,
      effects: false,
      normalizeScroll: false,
      ignoreMobileResize: true,
    });
  }

  // Unified Anchor Endpoints Handler (Navbar, Offcanvas, Buttons, Footer)
  $(document).on("click", 'a[href^="#"]', function (e) {
    const href = $(this).attr("href");
    if (!href || href === "#") return;
    const target = $(href);
    if (target.length) {
      e.preventDefault();

      // Close Offcanvas Mobile Drawer if open
      $(".tw-offcanvas-2-area").removeClass("opened");
      $(".body-overlay").removeClass("opened apply");
      $(".tw-text-hover-effect-word").removeClass("animated-text");

      const targetTop = target.offset().top - 80;
      if (portfolioSmoother && typeof portfolioSmoother.scrollTo === "function") {
        portfolioSmoother.scrollTo(target.get(0), true, "top 80px");
      } else {
        $("html, body").stop().animate({ scrollTop: targetTop }, 600, "swing");
      }

      // Update active classes across all menus
      updateActiveRoute(href);

      // Update URL hash smoothly without jump
      if (window.history && window.history.replaceState) {
        window.history.replaceState(null, null, href);
      }
    }
  });

  // Dynamic ScrollSpy Route Updater
  function updateActiveRoute(hash) {
    $(".main-menu a, .tw-main-menu-mobile a").removeClass("color-active");
    $(".main-menu a[href='" + hash + "'], .tw-main-menu-mobile a[href='" + hash + "']").addClass("color-active");
    $(".quick-nav-link").removeClass("active");
    $(".quick-nav-link[href='" + hash + "']").addClass("active");
  }

  const navSectionIds = ["#home", "#about", "#services", "#projects", "#experience", "#contact"];
  let currentActiveSection = "";

  function handleScrollSpy() {
    const scrollPosition = $(window).scrollTop() + 200;
    let activeId = "";

    for (let i = 0; i < navSectionIds.length; i++) {
      const section = $(navSectionIds[i]);
      if (section.length) {
        const top = section.offset().top;
        const bottom = top + section.outerHeight();
        if (scrollPosition >= top && scrollPosition < bottom) {
          activeId = navSectionIds[i];
          break;
        }
      }
    }

    // Edge-case for reaching bottom of page (trigger #contact)
    if (!activeId && $(window).scrollTop() + $(window).height() >= $(document).height() - 100) {
      activeId = "#contact";
    }

    if (activeId && activeId !== currentActiveSection) {
      currentActiveSection = activeId;
      updateActiveRoute(activeId);
      if (window.history && window.history.replaceState) {
        window.history.replaceState(null, null, activeId);
      }
    }
  }

  // Throttle scroll spy with requestAnimationFrame
  let isScrolling = false;
  $(window).on("scroll", function () {
    if (!isScrolling) {
      window.requestAnimationFrame(function () {
        handleScrollSpy();
        isScrolling = false;
      });
      isScrolling = true;
    }
  });

  // Initial check on load
  $(document).ready(function () {
    setTimeout(handleScrollSpy, 300);
  });

  ////////////////////////////////////////////////////
  // 02. Char SplitText Js
  if ($(window).width() > 991 && $(".tw-char-animation").length > 0) {
    let char_come = gsap.utils.toArray(".tw-char-animation");
    char_come.forEach((splitTextLine) => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: splitTextLine,
          start: "top 90%",
          end: "bottom 60%",
          scrub: false,
          markers: false,
          toggleActions: "play none none none",
        },
      });
      const itemSplitted = new SplitText(splitTextLine, {
        type: "chars, words",
      });
      gsap.set(splitTextLine, {
        perspective: 300,
      });
      itemSplitted.split({
        type: "chars, words",
      });
      tl.from(itemSplitted.chars, {
        duration: 1,
        delay: 0.5,
        x: 100,
        autoAlpha: 0,
        stagger: 0.05,
      });
    });
  }

  ////////////////////////////////////////////////////
  // 03. Text Invart Js
  if ($(window).width() > 991 && $(".tw-itm-title tw-itm-anim").length) {
    let staggerAmount = 0.03,
      translateXValue = 20,
      delayValue = 0.1,
      easeType = "power2.out",
      animatedTextElements = document.querySelectorAll(
        ".tw-itm-title tw-itm-anim",
      );

    animatedTextElements.forEach((element) => {
      let animationSplitText = new SplitText(element, { type: "chars, words" });

      ScrollTrigger.create({
        trigger: element,
        start: "top 85%",
        onEnter: () => {
          gsap.from(animationSplitText.chars, {
            duration: 1,
            delay: delayValue,
            x: translateXValue,
            autoAlpha: 0,
            stagger: staggerAmount,
            ease: easeType,
          });
        },
      });
    });
  }
  if ($(window).width() > 991 && $(".tw-sub-tilte").length) {
    var agtsub = $(".tw-sub-tilte");
    if (agtsub.length == 0) return;
    gsap.registerPlugin(SplitText);
    agtsub.each(function (index, el) {
      el.split = new SplitText(el, {
        type: "lines,words,chars",
        linesClass: "split-line",
      });
      if ($(el).hasClass("tw-sub-anim")) {
        gsap.set(el.split.chars, {
          opacity: 0,
          x: "7",
        });
      }
      el.anim = gsap.to(el.split.chars, {
        scrollTrigger: {
          trigger: el,
          start: "top 90%",
          end: "top 60%",
          markers: false,
          scrub: 1,
        },
        x: "0",
        y: "0",
        opacity: 1,
        duration: 0.7,
        stagger: 0.2,
      });
    });
  }
  if ($(".tw-itm-title").length) {
    var txtheading = $(".tw-itm-title");
    if (txtheading.length == 0) return;
    gsap.registerPlugin(SplitText);
    txtheading.each(function (index, el) {
      el.split = new SplitText(el, {
        type: "lines,words,chars",
        linesClass: "split-line",
      });
      if ($(el).hasClass("tw-itm-anim")) {
        gsap.set(el.split.chars, {
          opacity: 0.3,
          x: "-7",
        });
      }
      el.anim = gsap.to(el.split.chars, {
        scrollTrigger: {
          trigger: el,
          start: "top 92%",
          end: "top 60%",
          markers: false,
          scrub: 1,
        },
        x: "0",
        y: "0",
        opacity: 1,
        duration: 0.7,
        stagger: 0.2,
      });
    });
  }

  ////////////////////////////////////////////////////
  // 04. Button Hover Js
  $(".tw-hover-btn").on("mouseenter", function (e) {
    var x = e.pageX - $(this).offset().left;
    var y = e.pageY - $(this).offset().top;
    $(this).find(".tw-hover-btn-circle-dot").css({
      top: y,
      left: x,
    });
  });
  $(".tw-hover-btn").on("mouseout", function (e) {
    var x = e.pageX - $(this).offset().left;
    var y = e.pageY - $(this).offset().top;
    $(this).find(".tw-hover-btn-circle-dot").css({
      top: y,
      left: x,
    });
  });
  $(".tw-hover-btn").on("mouseenter", function (e) {
    var x = e.pageX - $(this).offset().left;
    var y = e.pageY - $(this).offset().top;
    $(this).find(".tw-btn-circle-dot").css({
      top: y,
      left: x,
    });
  });
  $(".tw-hover-btn").on("mouseout", function (e) {
    var x = e.pageX - $(this).offset().left;
    var y = e.pageY - $(this).offset().top;
    $(this).find(".tw-btn-circle-dot").css({
      top: y,
      left: x,
    });
  });
  var hoverBtns = gsap.utils.toArray(".tw-hover-btn-wrapper");
  const hoverBtnItem = gsap.utils.toArray(".tw-hover-btn-item");
  hoverBtns.forEach((btn, i) => {
    $(btn).mousemove(function (e) {
      callParallax(e);
    });
    function callParallax(e) {
      parallaxIt(e, hoverBtnItem[i], 60);
    }
    function parallaxIt(e, target, movement) {
      var $this = $(btn);
      var relX = e.pageX - $this.offset().left;
      var relY = e.pageY - $this.offset().top;
      gsap.to(target, 1, {
        x: ((relX - $this.width() / 2) / $this.width()) * movement,
        y: ((relY - $this.height() / 2) / $this.height()) * movement,
        ease: Power2.easeOut,
      });
    }
    $(btn).mouseleave(function (e) {
      gsap.to(hoverBtnItem[i], 1, {
        x: 0,
        y: 0,
        ease: Power2.easeOut,
      });
    });
  });

  ////////////////////////////////////////////////////
  // 05. Banner Title
  const mm = gsap.matchMedia();
  mm.add(
    {
      desktop: "(max-width: 1920px)",
      desktop_one: "(min-width: 1700px) and (max-width: 1800px)",
      desktop_two: "((min-width: 1600px) and (max-width: 1699px))",
      desktop_three: "((min-width: 1400px) and (max-width: 1599px)",
      desktop_four: "((min-width: 1200px) and (max-width: 1399px))",
      desktop_five: "((min-width: 992px) and (max-width: 1199px))",
      desktop_six: "((min-width: 768px) and (max-width: 991px))",
      desktop_seven: "((min-width: 576px) and (max-width: 767px))",
      desktop_eight: "((min-width: 425px) and (max-width: 575px))",
      desktop_nine: "((min-width: 375px) and (max-width: 424px))",
    },
    (context) => {
      const {
        desktop,
        desktop_one,
        desktop_two,
        desktop_three,
        desktop_four,
        desktop_five,
        desktop_six,
        desktop_seven,
        desktop_eight,
        desktop_nine,
      } = context.conditions;
      if (document.querySelector(".banner-area")) {
        const isDarkMode = document.body.classList.contains("dark");
        const bigtextColor = isDarkMode ? "#FFFFFF" : "#FF5101";
        let scaleVal, yVal, xVal;

        if (desktop) {
          scaleVal = 0.095;
          yVal = "39.5%";
          xVal = "-11.5%";
        }

        if (desktop_one) {
          scaleVal = 0.105;
          yVal = "41.5%";
          xVal = "-11.5%";
        }

        if (desktop_two) {
          scaleVal = 0.11;
          yVal = "44%";
          xVal = "-11%";
        }

        if (desktop_three) {
          scaleVal = 0.125;
          yVal = "51%";
          xVal = "-10%";
        }

        if (desktop_four) {
          scaleVal = 0.105;
          yVal = "55%";
          xVal = "-11%";
        }

        if (desktop_five) {
          scaleVal = 0.125;
          yVal = "66%";
          xVal = "-44%";
        }

        if (desktop_six) {
          scaleVal = 0.165;
          yVal = "71%";
          xVal = "-42%";
        }

        if (desktop_seven) {
          scaleVal = 0.225;
          yVal = "98%";
          xVal = "-39%";
        }

        if (desktop_eight) {
          scaleVal = 0.285;
          yVal = "119%";
          xVal = "-36%";
        }

        if (desktop_nine) {
          scaleVal = 0.305;
          yVal = "136%";
          xVal = "-35%";
        }
        const ab2 = gsap.timeline({
          duration: 5,
          scrollTrigger: {
            trigger: ".banner-area",
            scrub: 2,
            start: "top 100%",
            end: "bottom 0%",
          },
        });
        ab2.to(".big-text-wrapper .big-text", {
          scale: scaleVal,
          color: bigtextColor,
          duration: 2,
          y: yVal,
          x: xVal,
          transformOrigin: "bottom center",
        });
      }
    },
  );

  ////////////////////////////////////////////////////
  // 06. Footer Title
  if ($(".animated-title").length > 0) {
    let cta = gsap.timeline({
      repeat: -1,
      delay: 0.5,
      scrollTrigger: {
        trigger: ".animated-title",
        start: "bottom 100%-=50px",
      },
    });
    gsap.set(".animated-title", {
      opacity: 0,
    });
    gsap.to(".animated-title", {
      opacity: 1,
      duration: 1,
      ease: "power1.out",
      scrollTrigger: {
        trigger: ".animated-title",
        start: "bottom 100%-=50px",
        once: true,
      },
    });
    let mySplitText = new SplitText(".animated-title", { type: "words,chars" });
    let chars = mySplitText.chars;
    let endGradient = chroma.scale([
      "#ffff",
      "#ffff",
      "#ffff",
      "#ffff",
      "#ffff",
    ]);
    cta.to(chars, {
      duration: 0.5,
      scaleY: 0.6,
      ease: "power1.out",
      stagger: 0.04,
      transformOrigin: "center bottom",
    });
    cta.to(
      chars,
      {
        yPercent: -10,
        ease: "elastic",
        stagger: 0.03,
        duration: 0.8,
      },
      0.5,
    );
    cta.to(
      chars,
      {
        scaleY: 1,
        ease: "elastic.out",
        stagger: 0.03,
        duration: 1.5,
      },
      0.5,
    );
    cta.to(
      chars,
      {
        color: (i, el, arr) => {
          return endGradient(i / arr.length).hex();
        },
        ease: "power1.out",
        stagger: 0.03,
        duration: 0.3,
      },
      0.5,
    );
    cta.to(
      chars,
      {
        yPercent: 0,
        ease: "back",
        stagger: 0.03,
        duration: 0.8,
      },
      0.7,
    );
    cta.to(chars, {
      color: "#ffff",
      duration: 1.4,
      stagger: 0.05,
    });
  }

  ////////////////////////////////////////////////////
  // 07. Portfolio Panel Js
  let otherSections = document.querySelectorAll(".portfolio-panel");
  if (otherSections.length > 0) {
    gsap.set(otherSections, {
      scale: 1,
    });
    otherSections.forEach((section) => {
      gsap.to(section, {
        scale: 0.8,
        scrollTrigger: {
          trigger: section,
          pin: true,
          scrub: 1,
          start: "top 20%",
          end: "bottom 100%",
          endTrigger: ".portfolio-panel-area",
          pinSpacing: false,
          markers: false,
        },
      });
    });
  }

  ///////////////////////
  // 08. Image Cliping Effect
  document.addEventListener("DOMContentLoaded", () => {
    const initialClipPaths = [
      "polygon(0% 0%, 0% 0%, 0% 0%, 0% 0%)",
      "polygon(33.33% 0%, 33.33% 0%, 33.33% 0%, 33.33% 0%)",
      "polygon(65.66% 0%, 66.66% 0%, 66.66% 0%, 66.66% 0%)",
      "polygon(0% 33.33%, 0% 33.33%, 0% 33.33%, 0% 33.33%)",
      "polygon(33.33% 33.33%, 33.33% 33.33%, 33.33% 33.33%, 33.33% 33.33%)",
      "polygon(65.66% 33.33%, 66.66% 33.33%, 66.66% 33.33%, 66.66% 33.33%)",
      "polygon(0% 66.66%, 0% 66.66%, 0% 66.66%, 0% 66.66%)",
      "polygon(33.33% 66.66%, 33.33% 66.66%, 33.33% 66.66%, 33.33% 66.66%)",
      "polygon(65.66% 66.66%, 66.66% 66.66%, 66.66% 66.66%, 66.66% 66.66%)",
    ];
    const finalClipPaths = [
      "polygon(0% 0%, 34.33% 0%, 34.33% 34.33%, 0% 34.33%)",
      "polygon(32.33% 0%, 66.66% 0%, 66.66% 33.33%, 33.33% 34.33%)",
      "polygon(65.66% 0%, 100% 0%, 100% 33.33%, 65.66% 34.33%)",
      "polygon(0% 33.33%, 33.33% 33.33%, 33.33% 66.66%, 0% 66.66%)",
      "polygon(30.33% 33.33%, 66.66% 33.33%, 66.66% 66.66%, 33.33% 66.66%)",
      "polygon(65.66% 33.33%, 100% 32.33%, 100% 66.66%, 65.66% 66.66%)",
      "polygon(0% 65.66%, 33.33% 66.66%, 33.33% 100%, 0% 100%)",
      "polygon(30.33% 66.66%, 66.66% 65.66%, 66.66% 100%, 33.33% 100%)",
      "polygon(65.66% 66.66%, 100% 65.66%, 100% 100%, 65.66% 100%)",
    ];
    // Create mask divs for each wrapper
    document.querySelectorAll(".tw-clip-anim").forEach((wrapper) => {
      const img = wrapper.querySelector(".tw-anim-img[data-animate='true']");
      if (!img) return;
      const url = img.src;
      // Remove old masks if any (reuse safe)
      wrapper.querySelectorAll(".mask").forEach((m) => m.remove());
      for (let i = 0; i < 9; i++) {
        const mask = document.createElement("div");
        mask.className = `mask mask-${i + 1}`;
        Object.assign(mask.style, {
          backgroundImage: `url(${url})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          position: "absolute",
          inset: "0",
        });
        wrapper.appendChild(mask);
      }
    });
    // Animate masks
    gsap.utils.toArray(".tw-clip-anim").forEach((wrapper) => {
      const masks = wrapper.querySelectorAll(".mask");
      if (!masks.length) return;
      gsap.set(masks, { clipPath: (i) => initialClipPaths[i] });
      const order = [
        [".mask-1"],
        [".mask-2", ".mask-4"],
        [".mask-3", ".mask-5", ".mask-7"],
        [".mask-6", ".mask-8"],
        [".mask-9"],
      ];
      const tl = gsap.timeline({
        scrollTrigger: { trigger: wrapper, start: "top 75%" },
      });
      order.forEach((targets, i) => {
        const validTargets = targets
          .map((c) => wrapper.querySelector(c))
          .filter((el) => el); // filter out nulls

        if (validTargets.length) {
          tl.to(
            validTargets,
            {
              clipPath: (j, el) =>
                finalClipPaths[Array.from(masks).indexOf(el)],
              duration: 1,
              ease: "power4.out",
              stagger: 0.1,
            },
            i * 0.125,
          );
        }
      });
    });
  });

  ///////////////////////
  // 09. Hover Reveal (Smooth Cursor Follower across entire row)
  const hoverItems = document.querySelectorAll(".hover__reveal-item");
  hoverItems.forEach((item) => {
    const revealBg = item.querySelector(".hover__reveal-bg, .hover__reveal-img, .hover-reveal-img, img");
    if (!revealBg) return;

    item.addEventListener("mouseenter", (e) => {
      const rect = item.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      gsap.set(revealBg, {
        x: x,
        y: y,
        opacity: 0,
        scale: 0.85,
      });
      gsap.to(revealBg, {
        opacity: 1,
        scale: 1,
        duration: 0.35,
        ease: "power2.out",
      });
    });

    item.addEventListener("mousemove", (e) => {
      const rect = item.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      gsap.to(revealBg, {
        x: x,
        y: y,
        duration: 0.35,
        ease: "power2.out",
        overwrite: "auto",
      });
    });

    item.addEventListener("mouseleave", () => {
      gsap.to(revealBg, {
        opacity: 0,
        scale: 0.85,
        duration: 0.25,
        ease: "power2.in",
        overwrite: "auto",
      });
    });
  });

  ///////////////////////
  // 10. Tesimonial Two child (2) Effect
  if ($(".testimonial-two-main").length > 0) {
    gsap.registerPlugin(ScrollTrigger);
    ScrollTrigger.matchMedia({
      "(min-width: 1199px)": function () {
        gsap.fromTo(
          ".testimonial-two-main .testimonial-wrapper:nth-child(2)",
          {
            y: 300,
          },
          {
            y: 0,
            ease: "power9.out",
            scrollTrigger: {
              trigger: ".testimonial-two-main",
              start: "top 80%",
              end: "top 40%",
              scrub: 5.5,
              markers: false,
            },
          },
        );
      },
    });
  }

  ///////////////////////
  // 10. Tesimonial Two Shape Effect
  if ($(".testimonial-two-shape").length > 0) {
    let nn = gsap.matchMedia();
    nn.add("(min-width: 1199px)", () => {
      gsap.fromTo(
        ".testimonial-two-shape",
        { y: "0%" },
        {
          y: "100%",
          ease: "none",
          scrollTrigger: {
            trigger: ".testimonial-two-shape",
            start: "top bottom",
            end: "bottom top",
            scrub: 1,
          },
        },
      );
    });
  }

  ///////////////////////
  // 11. Portfolio Three Effect (Both Desktop & Mobile: Centered Sticky Pin & Parallax Across ALL Projects)
  if (typeof gsap !== "undefined" && typeof ScrollTrigger !== "undefined") {
    // Pin the WORKS shape container in the exact viewport center for the entire height of all projects
    ScrollTrigger.create({
      trigger: ".portfolio-three-area",
      start: "top top",
      end: "bottom bottom",
      pin: ".portfolio-three-shape",
      pinSpacing: false,
      anticipatePin: 1,
      invalidateOnRefresh: true,
    });

    // Smooth scrubbed horizontal drift & scale animation tracking user scroll across all projects
    gsap.fromTo(
      ".portfolio-three-shape-title",
      {
        x: "6%",
        scale: 0.96,
        opacity: 0.85,
      },
      {
        x: "-6%",
        scale: 1.04,
        opacity: 1,
        ease: "none",
        scrollTrigger: {
          trigger: ".portfolio-three-area",
          start: "top top",
          end: "bottom bottom",
          scrub: 1,
          invalidateOnRefresh: true,
        },
      }
    );
  }

  ///////////////////////
  // 12. Alternating Project Cards Scroll Parallax Animation
  if ($(window).width() > 991) {
    gsap.utils.toArray(".portfolio-item-left").forEach((item) => {
      gsap.from(item, {
        y: 40,
        duration: 0.8,
        ease: "power2.out",
        scrollTrigger: {
          trigger: item,
          start: "top 90%",
          toggleActions: "play none none none",
        },
      });
    });

    gsap.utils.toArray(".portfolio-item-right").forEach((item) => {
      gsap.from(item, {
        y: 40,
        duration: 0.8,
        ease: "power2.out",
        scrollTrigger: {
          trigger: item,
          start: "top 90%",
          toggleActions: "play none none none",
        },
      });
    });
  }
})(jQuery);
