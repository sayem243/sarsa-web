/* ==========================================================================
   SARSA CORPORATION — main.js
   vanilla JS · no dependencies
   modules: header state · mobile menu · scroll reveal · gallery · forms
   ========================================================================== */
(function () {
  "use strict";

  /* ------------------------------------------------------------------
     1. header — refined state after scrolling past threshold
  ------------------------------------------------------------------ */
  var header = document.querySelector(".site-header");
  var onScrollHeader = function () {
    if (!header) return;
    header.classList.toggle("is-scrolled", window.scrollY > 40);
  };
  window.addEventListener("scroll", onScrollHeader, { passive: true });
  onScrollHeader();

  /* ------------------------------------------------------------------
     2. mobile menu — open/close, focus trap-lite, esc to close
  ------------------------------------------------------------------ */
  var burger = document.querySelector(".burger");
  var mobileMenu = document.querySelector(".mobile-menu");

  function closeMenu() {
    if (!mobileMenu || !burger) return;
    mobileMenu.classList.remove("open");
    burger.classList.remove("open");
    burger.setAttribute("aria-expanded", "false");
    burger.setAttribute("aria-label", "Open menu");
    document.body.style.overflow = "";
  }

  if (burger && mobileMenu) {
    burger.addEventListener("click", function () {
      var open = mobileMenu.classList.toggle("open");
      burger.classList.toggle("open", open);
      burger.setAttribute("aria-expanded", open ? "true" : "false");
      burger.setAttribute("aria-label", open ? "Close menu" : "Open menu");
      document.body.style.overflow = open ? "hidden" : "";
    });

    mobileMenu.querySelectorAll("a").forEach(function (a) {
      a.addEventListener("click", closeMenu);
    });

    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape") closeMenu();
    });
  }

  /* ------------------------------------------------------------------
     3. scroll reveal — IntersectionObserver with per-item delay
  ------------------------------------------------------------------ */
  var revealEls = document.querySelectorAll(".reveal");

  if ("IntersectionObserver" in window && revealEls.length) {
    var io = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-in");
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -8% 0px" }
    );
    revealEls.forEach(function (el) { io.observe(el); });
  } else {
    revealEls.forEach(function (el) { el.classList.add("is-in"); });
  }

  /* ------------------------------------------------------------------
     4. gallery — category filter + lightbox
  ------------------------------------------------------------------ */
  var filters = document.querySelectorAll(".gallery-filters button");
  var items = document.querySelectorAll(".masonry__item");

  if (filters.length && items.length) {
    filters.forEach(function (btn) {
      btn.addEventListener("click", function () {
        var cat = btn.getAttribute("data-filter");

        filters.forEach(function (b) {
          b.classList.toggle("is-active", b === btn);
          b.setAttribute("aria-pressed", b === btn ? "true" : "false");
        });

        items.forEach(function (item) {
          var match = cat === "all" || item.getAttribute("data-category") === cat;
          item.classList.toggle("is-hidden", !match);
        });
      });
    });
  }

  /* lightbox */
  var lightbox = document.querySelector(".lightbox");
  if (lightbox) {
    var lbImg = lightbox.querySelector("img");
    var lbCap = lightbox.querySelector(".lightbox__caption");
    var lastTrigger = null;

    function openLightbox(src, caption, trigger) {
      lastTrigger = trigger || null;
      lbImg.src = src;
      lbImg.alt = caption || "";
      lbCap.textContent = caption || "";
      lightbox.classList.add("open");
      document.body.style.overflow = "hidden";
      lightbox.querySelector(".lightbox__close").focus();
    }
    function closeLightbox() {
      lightbox.classList.remove("open");
      document.body.style.overflow = "";
      if (lastTrigger) lastTrigger.focus();
    }

    items.forEach(function (item) {
      item.addEventListener("click", function () {
        var img = item.querySelector("img");
        openLightbox(img.getAttribute("data-large") || img.src, item.getAttribute("data-caption"), item);
      });
    });

    lightbox.querySelector(".lightbox__close").addEventListener("click", closeLightbox);
    lightbox.addEventListener("click", function (e) {
      if (e.target === lightbox) closeLightbox();
    });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && lightbox.classList.contains("open")) closeLightbox();
    });
  }

  /* ------------------------------------------------------------------
     5. quote form — client-side validation + FormSubmit (free email service)
        inquiries are mailed to sarsactg@gmail.com via formsubmit.co —
        no backend/account needed (first submission sends a one-time
        activation email; see README section 6)
  ------------------------------------------------------------------ */
  var FORMSUBMIT_AJAX = "https://formsubmit.co/ajax/sarsactg@gmail.com";

  var form = document.querySelector(".quote-form form");
  if (form) {
    var status = document.querySelector(".form-status");
    var statusText = status ? status.querySelector("p") : null;
    var submitBtn = form.querySelector('button[type="submit"]');
    var submitLabel = submitBtn ? submitBtn.textContent : "";

    var setStatus = function (kind, msg) {
      if (!status) return;
      status.className = "form-status form-status--" + kind + " is-visible";
      if (statusText) statusText.textContent = msg;
    };

    var rules = {
      name: function (v) { return v.trim().length >= 2; },
      phone: function (v) { return v.replace(/[^\d]/g, "").length >= 10; },
      email: function (v) { return v === "" || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v); }
    };

    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var ok = true;

      Object.keys(rules).forEach(function (name) {
        var input = form.elements[name];
        if (!input) return;
        var field = input.closest(".form-field");
        var valid = rules[name](input.value);

        if (field) field.classList.toggle("has-error", !valid);
        if (!valid) ok = false;
      });

      if (!ok) {
        setStatus("err", "Please check the highlighted fields. A name and a valid phone number are required.");
        var firstError = form.querySelector(".has-error input, .has-error select, .has-error textarea");
        if (firstError) firstError.focus();
        return;
      }

      /* honeypot filled — silently drop the bot */
      var honey = form.elements["_honey"];
      if (honey && honey.value !== "") return;

      var val = function (name) {
        var el = form.elements[name];
        return el ? String(el.value || "").trim() : "";
      };

      var payload = {
        _subject: "New Project Inquiry — SARSA Corporation",
        _template: "table",
        _captcha: "false",
        _replyto: val("email"),
        "Name": val("name"),
        "Company / Organization": val("company"),
        "Phone": val("phone"),
        "Email": val("email"),
        "Project Type": val("type"),
        "Project Location": val("location"),
        "Estimated Budget": val("budget"),
        "Project Description": val("description")
      };

      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.textContent = "Sending…";
      }
      setStatus("ok", "Sending your inquiry, please wait…");

      fetch(FORMSUBMIT_AJAX, {
        method: "POST",
        headers: { "Content-Type": "application/json", "Accept": "application/json" },
        body: JSON.stringify(payload)
      })
        .then(function (res) { return res.json(); })
        .then(function (data) {
          if (data && (data.success === "true" || data.success === true)) {
            setStatus("ok", "Thank you for your inquiry. Our team will contact you within one business day.");
            form.reset();
          } else {
            setStatus("err", "Sorry — the message could not be sent right now. Please email us at sarsactg@gmail.com or call 01577 686060.");
          }
        })
        .catch(function () {
          setStatus("err", "Sorry — the message could not be sent right now. Please email us at sarsactg@gmail.com or call 01577 686060.");
        })
        .finally(function () {
          if (submitBtn) {
            submitBtn.disabled = false;
            submitBtn.textContent = submitLabel;
          }
        });
    });

    /* clear error state while typing */
    form.addEventListener("input", function (e) {
      var field = e.target.closest(".form-field");
      if (field) field.classList.remove("has-error");
    });
  }

  /* ------------------------------------------------------------------
     6. hero video — calm the timelapse + respect reduced-motion
  ------------------------------------------------------------------ */
  var heroVideo = document.querySelector(".hero__media video");
  if (heroVideo) {
    /* slow the timelapse so motion stays easy on the eyes */
    heroVideo.playbackRate = 0.5;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      heroVideo.removeAttribute("autoplay");
      heroVideo.pause();
    }
  }

  /* ------------------------------------------------------------------
     7. footer year
  ------------------------------------------------------------------ */
  var yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = String(new Date().getFullYear());
})();
