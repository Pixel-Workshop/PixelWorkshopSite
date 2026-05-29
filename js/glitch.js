(function () {
  var reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reducedMotion) return;

  // Boot sequence typing effect
  var bootEl = document.getElementById('boot-text');
  if (bootEl) {
    var lines = bootEl.getAttribute('data-lines').split('|');
    var html = '';
    var delay = 0;
    for (var i = 0; i < lines.length; i++) {
      html += '<span class="boot-line" style="animation-delay:' + delay + 'ms">' + lines[i] + '</span>';
      delay += 400;
    }
    bootEl.innerHTML = html;
    // Trigger hero content reveal after boot completes
    var totalDelay = delay + 300;
    setTimeout(function () {
      var heroContent = document.querySelector('.hero__content');
      if (heroContent) heroContent.classList.add('revealed');
    }, totalDelay);
  } else {
    // No boot sequence, reveal hero content immediately
    var heroContent = document.querySelector('.hero__content');
    if (heroContent) heroContent.classList.add('revealed');
  }

  // Intersection observer for scroll animations
  var observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) entry.target.classList.add('visible');
    });
  }, { threshold: 0.1 });

  document.querySelectorAll('.animate-in').forEach(function (el) {
    observer.observe(el);
  });

  // Year
  var yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();
})();
