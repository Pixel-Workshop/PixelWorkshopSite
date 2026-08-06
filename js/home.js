(function () {
  var header = document.getElementById('site-header');
  var toggle = document.querySelector('.nav-toggle');
  var menu = document.getElementById('nav-menu');
  var year = document.getElementById('year');

  function updateHeader() {
    if (header) header.classList.toggle('is-scrolled', window.scrollY > 18);
  }

  function closeMenu() {
    if (!toggle || !menu) return;
    toggle.setAttribute('aria-expanded', 'false');
    toggle.setAttribute('aria-label', 'Open navigation');
    menu.classList.remove('is-open');
    document.body.classList.remove('nav-open');
    menu.inert = window.innerWidth <= 720;
    if (window.innerWidth <= 720) {
      menu.setAttribute('aria-hidden', 'true');
    } else {
      menu.removeAttribute('aria-hidden');
    }
  }

  if (toggle && menu) {
    toggle.addEventListener('click', function () {
      var open = toggle.getAttribute('aria-expanded') === 'true';
      var nextOpen = !open;
      toggle.setAttribute('aria-expanded', String(nextOpen));
      toggle.setAttribute('aria-label', nextOpen ? 'Close navigation' : 'Open navigation');
      menu.classList.toggle('is-open', nextOpen);
      document.body.classList.toggle('nav-open', nextOpen);
      menu.inert = !nextOpen;
      if (nextOpen) menu.removeAttribute('aria-hidden');
    });

    menu.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', closeMenu);
    });

    window.addEventListener('resize', closeMenu);

    document.addEventListener('keydown', function (event) {
      if (event.key !== 'Escape' || toggle.getAttribute('aria-expanded') !== 'true') return;
      closeMenu();
      toggle.focus();
    });

    closeMenu();
  }

  if ('IntersectionObserver' in window) {
    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });

    document.querySelectorAll('.reveal').forEach(function (element) {
      observer.observe(element);
    });
  } else {
    document.querySelectorAll('.reveal').forEach(function (element) {
      element.classList.add('is-visible');
    });
  }

  if (year) year.textContent = new Date().getFullYear();

  updateHeader();
  window.addEventListener('scroll', updateHeader, { passive: true });
})();
