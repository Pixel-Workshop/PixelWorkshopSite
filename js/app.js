(function () {
  // Year
  var yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  // Cursor glow
  var cursorGlow = document.getElementById('cursor-glow');
  if (cursorGlow && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    var glowActive = false;
    document.addEventListener('mousemove', function (e) {
      if (!glowActive) {
        cursorGlow.classList.add('active');
        glowActive = true;
      }
      cursorGlow.style.left = e.clientX + 'px';
      cursorGlow.style.top = e.clientY + 'px';
    });
    document.addEventListener('mouseleave', function () {
      cursorGlow.classList.remove('active');
      glowActive = false;
    });
  }

  // Header scroll state
  var header = document.getElementById('site-header');
  if (header) {
    var lastScroll = 0;
    window.addEventListener('scroll', function () {
      var currentScroll = window.pageYOffset;
      if (currentScroll > 50) {
        header.classList.add('scrolled');
      } else {
        header.classList.remove('scrolled');
      }
      lastScroll = currentScroll;
    });
  }

  // Typing effect
  var typingEl = document.getElementById('typing-text');
  if (typingEl) {
    var phrases = ['> PIXEL_WORKSHOP v8.0', '> LOCATION: RICHMOND, VA', '> STATUS: ALL SYSTEMS ONLINE'];
    var phraseIndex = 0;
    var charIndex = 0;
    var isDeleting = false;
    var typingSpeed = 60;

    function typeEffect() {
      var currentPhrase = phrases[phraseIndex];
      if (isDeleting) {
        typingEl.textContent = currentPhrase.substring(0, charIndex - 1);
        charIndex--;
      } else {
        typingEl.textContent = currentPhrase.substring(0, charIndex + 1);
        charIndex++;
      }

      if (!isDeleting && charIndex === currentPhrase.length) {
        setTimeout(function () { isDeleting = true; typeEffect(); }, 2000);
        return;
      } else if (isDeleting && charIndex === 0) {
        isDeleting = false;
        phraseIndex = (phraseIndex + 1) % phrases.length;
      }

      setTimeout(typeEffect, isDeleting ? 30 : typingSpeed);
    }

    setTimeout(typeEffect, 1500);
  }

  // Counter animation
  function animateCounters() {
    var counters = document.querySelectorAll('[data-count]');
    counters.forEach(function (counter) {
      if (counter.dataset.animated) return;
      var target = parseFloat(counter.dataset.count);
      var duration = 2000;
      var start = 0;
      var startTime = null;

      function step(timestamp) {
        if (!startTime) startTime = timestamp;
        var progress = Math.min((timestamp - startTime) / duration, 1);
        var eased = 1 - Math.pow(1 - progress, 4);
        var current = start + (target - start) * eased;

        if (target % 1 !== 0) {
          counter.textContent = current.toFixed(1);
        } else {
          counter.textContent = Math.floor(current);
        }

        if (progress < 1) {
          requestAnimationFrame(step);
        }
      }

      counter.dataset.animated = 'true';
      setTimeout(function () { requestAnimationFrame(step); }, 2500);
    });
  }
  animateCounters();

  // Intersection Observer for scroll animations
  var observerOptions = { threshold: 0.15, rootMargin: '0px 0px -50px 0px' };

  var sectionObserver = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add('in-view');
      }
    });
  }, observerOptions);

  document.querySelectorAll('.section').forEach(function (el) {
    sectionObserver.observe(el);
  });

  // Module cards staggered reveal
  var cardObserver = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        var delay = parseInt(entry.target.dataset.index || '1') * 100;
        setTimeout(function () {
          entry.target.classList.add('in-view');
        }, delay);
        cardObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });

  document.querySelectorAll('.module-card').forEach(function (card) {
    cardObserver.observe(card);
  });

  // System nodes staggered reveal
  var nodeObserver = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        var delay = parseInt(entry.target.dataset.node || '1') * 120;
        setTimeout(function () {
          entry.target.classList.add('in-view');
        }, delay);
        nodeObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });

  document.querySelectorAll('.system-node').forEach(function (node) {
    nodeObserver.observe(node);
  });

  // Smooth scroll for anchor links
  document.querySelectorAll('a[href^="#"]').forEach(function (link) {
    link.addEventListener('click', function (e) {
      var target = document.querySelector(this.getAttribute('href'));
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

  // Active nav link on scroll
  var sections = document.querySelectorAll('.section[id], .hero[id]');
  var navLinks = document.querySelectorAll('.nav-link');

  function updateActiveNav() {
    var scrollPos = window.pageYOffset + 200;
    sections.forEach(function (section) {
      var top = section.offsetTop;
      var height = section.offsetHeight;
      var id = section.id;
      if (scrollPos >= top && scrollPos < top + height) {
        navLinks.forEach(function (link) {
          link.classList.remove('active');
          if (link.getAttribute('href') === '#' + id) {
            link.classList.add('active');
          }
        });
      }
    });
  }
  window.addEventListener('scroll', updateActiveNav);

  // Card tilt effect on hover
  document.querySelectorAll('.module-card').forEach(function (card) {
    card.addEventListener('mousemove', function (e) {
      var rect = card.getBoundingClientRect();
      var x = (e.clientX - rect.left) / rect.width - 0.5;
      var y = (e.clientY - rect.top) / rect.height - 0.5;
      card.style.transform = 'translateY(-8px) scale(1.02) perspective(1000px) rotateY(' + (x * 5) + 'deg) rotateX(' + (-y * 5) + 'deg)';
    });

    card.addEventListener('mouseleave', function () {
      card.style.transform = '';
    });
  });

  // FAQ functionality (for support pages)
  document.querySelectorAll('.faq-item__question').forEach(function (btn) {
    btn.addEventListener('click', function () {
      var item = btn.closest('.faq-item');
      var wasOpen = item.classList.contains('open');
      document.querySelectorAll('.faq-item.open').forEach(function (el) {
        el.classList.remove('open');
      });
      if (!wasOpen) item.classList.add('open');
    });
  });

})();
