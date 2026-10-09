(function () {
  'use strict';

  // ---------- Mobile nav toggle ----------
  var menuBtn = document.querySelector('.menu-btn');
  var nav = document.querySelector('.main-nav');

  function closeMenu() {
    nav.classList.remove('open');
    menuBtn.classList.remove('open');
    menuBtn.setAttribute('aria-expanded', 'false');
  }

  function toggleMenu() {
    var isOpen = nav.classList.toggle('open');
    menuBtn.classList.toggle('open', isOpen);
    menuBtn.setAttribute('aria-expanded', String(isOpen));
  }

  if (menuBtn && nav) {
    menuBtn.addEventListener('click', toggleMenu);

    nav.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', closeMenu);
    });

    document.addEventListener('keydown', function (event) {
      if (event.key === 'Escape' && nav.classList.contains('open')) {
        closeMenu();
        menuBtn.focus();
      }
    });
  }

  // ---------- One-time stat count-up when scrolled into view ----------
  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var statNumbers = document.querySelectorAll('.stat h2[data-count]');
  var statBand = document.querySelector('.stat-band');

  function formatNumber(value) {
    return value.toLocaleString('en-US') + '+';
  }

  function animateCount(el) {
    var target = parseInt(el.dataset.count, 10);
    if (isNaN(target)) return;

    if (reduceMotion) {
      el.textContent = formatNumber(target);
      return;
    }

    el.textContent = formatNumber(0);
    var duration = 1400;
    var start = performance.now();

    function step(now) {
      var progress = Math.min((now - start) / duration, 1);
      var eased = 1 - Math.pow(1 - progress, 3);
      el.textContent = formatNumber(Math.round(target * eased));
      if (progress < 1) requestAnimationFrame(step);
    }

    requestAnimationFrame(step);
  }

  if (statNumbers.length && statBand && 'IntersectionObserver' in window) {
    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          statNumbers.forEach(animateCount);
          observer.disconnect();
        }
      });
    }, { threshold: 0.4 });

    observer.observe(statBand);
  } else if (statNumbers.length) {
    // Fallback for browsers without IntersectionObserver support
    statNumbers.forEach(animateCount);
  }

  // ---------- Highlight the nav link for the section in view ----------
  var navLinks = Array.prototype.slice.call(
    document.querySelectorAll('nav.main-nav a[href^="#"]')
  );
  var trackedSections = navLinks
    .map(function (link) {
      return document.querySelector(link.getAttribute('href'));
    })
    .filter(Boolean);

  function setActiveLink(id) {
    navLinks.forEach(function (link) {
      if (link.getAttribute('href') === '#' + id) {
        link.setAttribute('aria-current', 'true');
      } else {
        link.removeAttribute('aria-current');
      }
    });
  }

  if (trackedSections.length && 'IntersectionObserver' in window) {
    var sectionObserver = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) setActiveLink(entry.target.id);
        });
      },
      { rootMargin: '-45% 0px -50% 0px', threshold: 0 }
    );

    trackedSections.forEach(function (section) {
      sectionObserver.observe(section);
    });
  }

  // ---------- Registration form (register.html) ----------
  var registerForm = document.getElementById('registerForm');
  var formSuccess = document.getElementById('formSuccess');

  if (registerForm && formSuccess) {
    registerForm.addEventListener('submit', function (event) {
      event.preventDefault();

      if (!registerForm.checkValidity()) {
        registerForm.reportValidity();
        return;
      }

      registerForm.hidden = true;
      formSuccess.classList.add('visible');
      formSuccess.focus();
    });
  }
})();