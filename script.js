/* =========================================================
   ZAFIR AHMAD NAIK — ACADEMIC PORTFOLIO — script.js
   Vanilla JS: nav, scroll progress, reveal animations,
   count-up stats, publication filters, copy-to-clipboard,
   and the hero/contact "Manhattan plot" canvas signature.
   ========================================================= */

(function () {
  "use strict";

  /* ---------------- Footer year ---------------- */
  var yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ---------------- Header scroll state + progress bar ---------------- */
  var header = document.getElementById("siteHeader");
  var progress = document.getElementById("scrollProgress");
  var backToTop = document.getElementById("backToTop");

  function onScroll() {
    var doc = document.documentElement;
    var scrollTop = window.scrollY || doc.scrollTop;
    var max = doc.scrollHeight - doc.clientHeight;
    var pct = max > 0 ? (scrollTop / max) * 100 : 0;
    if (progress) progress.style.width = pct + "%";

    if (header) {
      if (scrollTop > 24) header.classList.add("is-scrolled");
      else header.classList.remove("is-scrolled");
    }
  }
  document.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  /* ---------------- Mobile nav toggle ---------------- */
  var navToggle = document.getElementById("navToggle");
  var navLinks = document.getElementById("navLinks");

  if (navToggle && navLinks) {
    navToggle.addEventListener("click", function () {
      var isOpen = navLinks.classList.toggle("is-open");
      navToggle.setAttribute("aria-expanded", isOpen ? "true" : "false");
      navToggle.classList.toggle("is-active", isOpen);
    });

    navLinks.querySelectorAll(".nav-link").forEach(function (link) {
      link.addEventListener("click", function () {
        navLinks.classList.remove("is-open");
        navToggle.setAttribute("aria-expanded", "false");
      });
    });
  }

  /* ---------------- Active nav link on scroll (IntersectionObserver) ---------------- */
  var sections = document.querySelectorAll("main section[id]");
  var navAnchors = document.querySelectorAll(".nav-link");

  function setActiveLink(id) {
    navAnchors.forEach(function (a) {
      a.classList.toggle("is-active", a.getAttribute("href") === "#" + id);
    });
  }

  if ("IntersectionObserver" in window && sections.length) {
    var navObserver = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) setActiveLink(entry.target.id);
        });
      },
      { rootMargin: "-45% 0px -50% 0px", threshold: 0 }
    );
    sections.forEach(function (s) { navObserver.observe(s); });
  }

  /* ---------------- Reveal-on-scroll for cards & key blocks ---------------- */
  var revealTargets = document.querySelectorAll(
    ".card, .skill-block, .about-copy, .about-card, .contact-card, .timeline-item, .pub-item"
  );
  revealTargets.forEach(function (el) { el.classList.add("reveal"); });

  if ("IntersectionObserver" in window) {
    var revealObserver = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry, i) {
          if (entry.isIntersecting) {
            var el = entry.target;
            var delay = Math.min((i % 6) * 60, 240);
            setTimeout(function () { el.classList.add("is-visible"); }, delay);
            revealObserver.unobserve(el);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
    );
    revealTargets.forEach(function (el) { revealObserver.observe(el); });
  } else {
    revealTargets.forEach(function (el) { el.classList.add("is-visible"); });
  }

  /* ---------------- Skill bar fill animation ---------------- */
  var bars = document.querySelectorAll(".bar-fill");
  if (bars.length && "IntersectionObserver" in window) {
    var barObserver = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            var el = entry.target;
            el.style.width = el.getAttribute("data-level") + "%";
            barObserver.unobserve(el);
          }
        });
      },
      { threshold: 0.4 }
    );
    bars.forEach(function (b) { barObserver.observe(b); });
  }

  /* ---------------- Count-up stats in hero ---------------- */
  var statEls = document.querySelectorAll(".stat[data-count]");
  function animateCount(el) {
    var target = parseInt(el.getAttribute("data-count"), 10) || 0;
    var suffix = el.getAttribute("data-suffix") || "";
    var numEl = el.querySelector(".stat-num");
    var start = 0;
    var duration = 900;
    var startTime = null;

    function step(ts) {
      if (!startTime) startTime = ts;
      var progressRatio = Math.min((ts - startTime) / duration, 1);
      var eased = 1 - Math.pow(1 - progressRatio, 3);
      var value = Math.round(start + (target - start) * eased);
      numEl.textContent = value + (progressRatio === 1 ? suffix : "");
      if (progressRatio < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }

  if (statEls.length && "IntersectionObserver" in window) {
    var statObserver = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            animateCount(entry.target);
            statObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.5 }
    );
    statEls.forEach(function (el) { statObserver.observe(el); });
  }

  /* ---------------- Publication filters ---------------- */
  var filterBtns = document.querySelectorAll(".filter-btn");
  var pubItems = document.querySelectorAll(".pub-item");

  filterBtns.forEach(function (btn) {
    btn.addEventListener("click", function () {
      filterBtns.forEach(function (b) { b.classList.remove("is-active"); });
      btn.classList.add("is-active");
      var filter = btn.getAttribute("data-filter");

      pubItems.forEach(function (item) {
        var match = filter === "all" || item.getAttribute("data-cat") === filter;
        item.classList.toggle("is-hidden", !match);
      });
    });
  });

  /* ---------------- Copy email to clipboard ---------------- */
  var emailCard = document.getElementById("emailCard");
  var toast = document.getElementById("toast");
  var toastTimer = null;

  function showToast(message) {
    if (!toast) return;
    toast.textContent = message;
    toast.classList.add("is-visible");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () { toast.classList.remove("is-visible"); }, 2200);
  }

  if (emailCard) {
    emailCard.addEventListener("click", function (e) {
      var email = "zafirahmad198@gmail.com";
      if (navigator.clipboard && window.isSecureContext) {
        e.preventDefault();
        navigator.clipboard.writeText(email).then(function () {
          showToast("Email copied to clipboard");
        }).catch(function () {
          window.location.href = "mailto:" + email;
        });
      }
      // else: let the mailto: link behave normally
    });
  }

  /* ---------------- Smooth scroll for in-page anchors (fallback) ---------------- */
  document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
    anchor.addEventListener("click", function (e) {
      var targetId = this.getAttribute("href").slice(1);
      var targetEl = document.getElementById(targetId);
      if (targetEl) {
        e.preventDefault();
        var headerOffset = 76;
        var top = targetEl.getBoundingClientRect().top + window.pageYOffset - headerOffset;
        window.scrollTo({ top: top, behavior: "smooth" });
      }
    });
  });

  /* =========================================================
     MANHATTAN PLOT CANVAS
     A genome-wide-association "Manhattan plot" rendered as
     ambient background art: chromosomes as alternating bands
     along the x-axis, points scattered by -log10(p), with one
     point highlighted as the "lead SNP" — a quiet nod to GWAS,
     the subject's own field of research.
     ========================================================= */
  function initManhattan(canvasId, options) {
    var canvas = document.getElementById(canvasId);
    if (!canvas) return;
    var ctx = canvas.getContext("2d");
    var opts = options || {};
    var dpr = Math.min(window.devicePixelRatio || 1, 2);
    var points = [];
    var numChromosomes = 12;
    var width, height;

    var palette = opts.dark
      ? { bandA: "rgba(244,240,228,0.025)", bandB: "rgba(244,240,228,0.05)", dotA: "rgba(184,134,46,0.55)", dotB: "rgba(63,107,77,0.45)", lead: "#D9A53B", line: "rgba(244,240,228,0.08)" }
      : { bandA: "rgba(63,107,77,0.05)", bandB: "rgba(184,134,46,0.05)", dotA: "rgba(63,107,77,0.4)", dotB: "rgba(184,134,46,0.45)", lead: "#9C4A2E", line: "rgba(28,35,31,0.06)" };

    function resize() {
      var rect = canvas.parentElement.getBoundingClientRect();
      width = rect.width;
      height = rect.height;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = width + "px";
      canvas.style.height = height + "px";
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      generatePoints();
    }

    function generatePoints() {
      points = [];
      var bandWidth = width / numChromosomes;
      var density = opts.density || 0.16; // points per px of band width
      var leadChrom = Math.floor(numChromosomes * 0.62);
      var leadX = leadChrom * bandWidth + bandWidth * 0.5;

      for (var c = 0; c < numChromosomes; c++) {
        var bandStart = c * bandWidth;
        var count = Math.max(8, Math.round(bandWidth * density));
        for (var i = 0; i < count; i++) {
          var x = bandStart + Math.random() * bandWidth;
          // base noise floor, taller near the "lead" chromosome for a believable peak
          var distToLead = Math.abs(x - leadX);
          var peakBoost = Math.max(0, 1 - distToLead / (bandWidth * 0.9));
          var base = Math.random() * 0.32;
          var y = base + Math.pow(peakBoost, 2.2) * 0.62 * Math.random();
          points.push({ x: x, baseY: y, chrom: c, r: 1.1 + Math.random() * 1.6 });
        }
      }
      // the single lead SNP, deliberately the tallest point
      points.push({ x: leadX + (Math.random() - 0.5) * 6, baseY: 0.97, chrom: leadChrom, r: 3.2, lead: true });
    }

    function draw(time) {
      ctx.clearRect(0, 0, width, height);

      // chromosome bands
      var bandWidth = width / numChromosomes;
      for (var c = 0; c < numChromosomes; c++) {
        ctx.fillStyle = c % 2 === 0 ? palette.bandA : palette.bandB;
        ctx.fillRect(c * bandWidth, 0, bandWidth, height);
      }

      // a faint significance threshold line
      var threshY = height * (1 - 0.78);
      ctx.strokeStyle = palette.line;
      ctx.lineWidth = 1;
      ctx.setLineDash([5, 6]);
      ctx.beginPath();
      ctx.moveTo(0, threshY);
      ctx.lineTo(width, threshY);
      ctx.stroke();
      ctx.setLineDash([]);

      var t = (time || 0) / 1000;

      points.forEach(function (p, idx) {
        var wobble = p.lead ? 0 : Math.sin(t * 0.6 + idx * 0.37) * 0.012;
        var yRatio = Math.min(0.97, Math.max(0, p.baseY + wobble));
        var y = height - yRatio * height * 0.92 - 6;

        if (p.lead) {
          var pulse = 0.55 + Math.sin(t * 1.8) * 0.18;
          ctx.save();
          ctx.shadowColor = palette.lead;
          ctx.shadowBlur = 16;
          ctx.fillStyle = palette.lead;
          ctx.globalAlpha = pulse + 0.3;
          ctx.beginPath();
          ctx.arc(p.x, y, p.r, 0, Math.PI * 2);
          ctx.fill();
          ctx.restore();
        } else {
          ctx.fillStyle = p.chrom % 2 === 0 ? palette.dotA : palette.dotB;
          ctx.beginPath();
          ctx.arc(p.x, y, p.r, 0, Math.PI * 2);
          ctx.fill();
        }
      });

      requestAnimationFrame(draw);
    }

    var resizeTimer;
    window.addEventListener("resize", function () {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(resize, 150);
    });

    resize();
    requestAnimationFrame(draw);
  }

  var prefersReducedMotion = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (!prefersReducedMotion) {
    initManhattan("manhattanPlot", { dark: false, density: 0.16 });
    initManhattan("contactPlot", { dark: true, density: 0.1 });
  }

})();
