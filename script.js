window.addEventListener("DOMContentLoaded", () => {

  if (history.scrollRestoration) history.scrollRestoration = 'manual';
window.scrollTo({ top: 0, behavior: 'instant' });
  // Loader animation: Slide up and fade out
  setTimeout(() => {
    gsap.to("#page-loader", {
      y: "-100%",
      duration: 1,
      ease: "power2.inOut",
      onComplete() {
        const loader = document.getElementById("page-loader");
        if (loader) loader.style.display = "none";
      },
    });
  }, 1400);

  

  // Menu toggle: Slide in from right with staggered links and focus management
  (function () {
    const btn = document.querySelector(".hamburger");
    const menu = document.querySelector(".mobile-menu");
    const closeBtn = menu.querySelector(".mobile-menu__close");
    const links = menu.querySelectorAll(".mobile-menu__link");

    // Assign staggered transition-delays as CSS custom properties
    links.forEach((link, i) => {
      link.style.setProperty("--delay", `${80 + i * 55}ms`);
    });

    function openMenu() {
      menu.removeAttribute("hidden");
      // rAF ensures browser registers hidden removal before adding class (no jank)
      requestAnimationFrame(() => menu.classList.add("is-open"));
      btn.setAttribute("aria-expanded", "true");
      btn.setAttribute("aria-label", "Close navigation menu");
      document.body.style.overflow = "hidden"; // lock background scroll
      links[0]?.focus(); // move focus into overlay
    }

    function closeMenu() {
      menu.classList.remove("is-open");
      btn.setAttribute("aria-expanded", "false");
      btn.setAttribute("aria-label", "Open navigation menu");
      document.body.style.overflow = "";
      // Wait for CSS transition to finish before hiding from DOM
      menu.addEventListener(
        "transitionend",
        () => {
          menu.setAttribute("hidden", "");
        },
        { once: true },
      );
      btn.focus(); // return focus to trigger
    }

    // Hamburger toggle
    btn.addEventListener("click", () =>
      btn.getAttribute("aria-expanded") === "true" ? closeMenu() : openMenu(),
    );

    // Close button inside overlay
    closeBtn.addEventListener("click", closeMenu);

    // Close when a nav link is tapped
    links.forEach((link) => link.addEventListener("click", closeMenu));

    // Close on backdrop click (anywhere outside the nav)
    menu.addEventListener("click", (e) => {
      if (e.target === menu) closeMenu();
    });

    // Close on Escape key
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && menu.classList.contains("is-open")) closeMenu();
    });

    // Trap focus inside overlay while open
    menu.addEventListener("keydown", (e) => {
      if (e.key !== "Tab") return;
      const focusable = [
        ...menu.querySelectorAll('a, button, [tabindex]:not([tabindex="-1"])'),
      ];
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    });
  })();


  // Hero Section
  (function () {
    /* ── 1. Live clock ── */
    const timeEl = document.getElementById("footer-time");
    const ampmEl = document.getElementById("footer-ampm");

    function updateClock() {
      const now = new Date();
      let h = now.getHours();
      const m = String(now.getMinutes()).padStart(2, "0");
      const ampm = h >= 12 ? "PM" : "AM";
      h = h % 12 || 12;
      if (timeEl) timeEl.textContent = `${String(h).padStart(2, "0")}:${m}`;
      if (ampmEl) ampmEl.textContent = ampm;
    }

    updateClock();
    setInterval(updateClock, 1000);

    /* ── 2. Coordinate tracking ── */
    const xEl = document.getElementById("x__value");
    const yEl = document.getElementById("y__value");

    function setCoords(x, y) {
      if (xEl) xEl.textContent = Math.round(x);
      if (yEl) yEl.textContent = Math.round(y);
    }

    // Desktop — mousemove
    document.addEventListener("mousemove", (e) => {
      setCoords(e.clientX, e.clientY);
    });

    // Mobile — touchmove (first touch point)
    document.addEventListener(
      "touchmove",
      (e) => {
        const t = e.touches[0];
        setCoords(t.clientX, t.clientY);
      },
      { passive: true },
    );

    // Video fallback for slow connection / failed playback
    const heroVideo = document.getElementById("heroVideo");
    const fallbackImg = document.querySelector(".video__container img.video-fallback");
    if (heroVideo && fallbackImg) {
      // If video fails to load at all, show the fallback image
      heroVideo.addEventListener("error", () => {
        heroVideo.style.display = "none";
        fallbackImg.style.display = "block";
      });

      // Also check `stalled` event as poor network may pause load
      heroVideo.addEventListener("stalled", () => {
        fallbackImg.style.display = "block";
      });

      heroVideo.addEventListener("canplay", () => {
        fallbackImg.style.display = "none";
      });

      heroVideo.addEventListener("playing", () => {
        fallbackImg.style.display = "none";
        heroVideo.style.display = "block";
      });
    }
  })();


      (function () {
      const wrapper = document.getElementById('btn-wrapper');
      const path    = document.getElementById('orbit-path');

      /* ── 1. Measure exact path length ── */
      const len = path.getTotalLength();

      /* Set dasharray to exact length — cleaner than a hardcoded estimate */
      path.style.strokeDasharray  = len;
      path.style.strokeDashoffset = 0;   /* fully drawn = default state */

      /* ── 2. Track animation so we can kill mid-run on re-hover ── */
      let tween = null;
      let hasCompleted = false;

      /* ── 3. Hover enter ── */
      wrapper.addEventListener('mouseenter', () => {
        /* If a previous tween is still running, kill it before restarting */
        if (tween) tween.kill();

        /* Step A: instantly snap path back to invisible */
        gsap.set(path, { strokeDashoffset: len });

        /* Step B: animate from invisible → fully drawn */
        tween = gsap.to(path, {
          strokeDashoffset: 0,
          duration: 0.9,          /* total redraw time */
          ease: 'power2.inOut',   /* eases in, accelerates, then settles */
          onComplete: () => {
            hasCompleted = true;
            tween = null;
          }
        });
      });

      /*
       * ── 4. Hover leave — do nothing ──
       * Path stays at dashoffset: 0 (fully drawn) permanently after hover,
       * regardless of whether the animation finished or not.
       * On the NEXT hover, step A snaps it back to zero before redrawing again.
       */

    })();



    const accordionData = [
      { q: 'Who can participate in HackOrbit 2026?',
        a: 'Any undergraduate or postgraduate student enrolled in a recognized institution across India. Teams of 2–4 members are required. Solo participation is not allowed — assemble your crew.' },
      { q: 'Is HackOrbit 2026 free to participate in?',
        a: 'Yes. Registration is completely free. All you need is your ideas, your laptop, and an internet connection. No fuel cost for this orbit.' },
      { q: 'How many members can be in a team?',
        a: 'Teams must have a minimum of 2 and a maximum of 4 members. Cross-college teams are encouraged — diversity of perspective makes stronger missions.' },
      { q: 'Do we need to submit a project idea before the hackathon?',
        a: 'A preliminary idea brief is required during registration to help us understand your intended track. Ideas can evolve — we expect them to. The mission refines in flight.' },
      { q: 'Will there be mentors during the hackathon?',
        a: "Absolutely. Domain experts and industry mentors will be available via scheduled office hours and a dedicated Discord server throughout the 48-hour hack. You won't fly blind." },
      { q: 'What should our final submission include?',
        a: 'A working prototype or demo, a project repository link, a 3-minute demo video, and a brief project description covering the problem, solution, tech stack, and impact. The mission log must be complete.' }
    ];

    const accordionRoot = document.getElementById('accordionRoot');
    accordionData.forEach((item, index) => {
      const div = document.createElement('div');
      div.className = 'acc-item';
      div.innerHTML = `
        <div class="acc-header">
          <span class="acc-num">Q.0${index + 1}</span>
          <span class="acc-q">${item.q}</span>
          <span class="acc-toggle">⊕</span>
        </div>
        <div class="acc-body" style="max-height:0">
          <div class="acc-body-inner">${item.a}</div>
        </div>`;
      div.querySelector('.acc-header').addEventListener('click', () => {
        const isOpen = div.classList.contains('open');
        // Close all
        document.querySelectorAll('.acc-item').forEach(el => {
          el.classList.remove('open');
          el.querySelector('.acc-body').style.maxHeight = '0';
        });
        // Open clicked (if it was closed)
        if (!isOpen) {
          div.classList.add('open');
          div.querySelector('.acc-body').style.maxHeight = '500px';
        }
      });
      accordionRoot.appendChild(div);
    });

    /* ── 5. Scroll-triggered animate-in (sections 01-06) ─────────── */
    const animEls = document.querySelectorAll(
      '.anim-fade, .anim-left, .anim-right, .anim-scale, .section-label'
    );
    const animObs = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (e.isIntersecting) { e.target.classList.add('visible'); animObs.unobserve(e.target); }
      });
    }, { threshold: 0.12 });
    animEls.forEach(el => animObs.observe(el));

    /* ── 6. Timeline vertical line draw-in ───────────────────────── */
    const lineEl = document.getElementById('timelineLine');
    if (lineEl) {
      const lineObs = new IntersectionObserver(entries => {
        entries.forEach(e => {
          if (e.isIntersecting) { lineEl.classList.add('drawn'); lineObs.unobserve(lineEl); }
        });
      }, { threshold: 0.1 });
      lineObs.observe(lineEl);
    }

    /* ── 7. Animated counters (About section stats) ──────────────── */
    function animateCounter(el) {
      const target   = parseInt(el.dataset.target, 10);
      const prefix   = el.dataset.prefix || '';
      const sfx      = el.dataset.suffix  || '';
      const duration = 2000;
      let   start    = null;
      (function step(ts) {
        if (!start) start = ts;
        const p    = Math.min((ts - start) / duration, 1);
        const ease = 1 - Math.pow(1 - p, 4);
        el.textContent = prefix + Math.floor(ease * target) + sfx;
        if (p < 1) requestAnimationFrame(step);
        else el.textContent = prefix + target + sfx;
      })(performance.now());
      /* restart via rAF on first real frame */
      el.textContent = prefix + '0' + sfx;
      requestAnimationFrame(ts => {
        start = null;
        (function step(ts2) {
          if (!start) start = ts2;
          const p    = Math.min((ts2 - start) / duration, 1);
          const ease = 1 - Math.pow(1 - p, 4);
          el.textContent = prefix + Math.floor(ease * target) + sfx;
          if (p < 1) requestAnimationFrame(step);
          else el.textContent = prefix + target + sfx;
        })(ts);
      });
    }
    const counterEls = document.querySelectorAll('.stat-value-gradient[data-target]');
    const counterObs = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (e.isIntersecting) { animateCounter(e.target); counterObs.unobserve(e.target); }
      });
    }, { threshold: 0.1 });
    counterEls.forEach(el => counterObs.observe(el));

});


