(function () {
  var header = document.querySelector('.site-header');
  var yearNodes = document.querySelectorAll('#year');
  var revealNodes = document.querySelectorAll('.animate-in, .reveal');

  function updateHeader() {
    if (header) {
      header.classList.toggle('is-scrolled', window.scrollY > 18);
    }
  }

  yearNodes.forEach(function (node) {
    node.textContent = new Date().getFullYear();
  });

  if ('IntersectionObserver' in window && revealNodes.length) {
    revealNodes.forEach(function (node) {
      node.classList.add('will-animate');
    });

    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      });
    }, {
      rootMargin: '0px 0px -10% 0px',
      threshold: 0.08
    });

    revealNodes.forEach(function (node) {
      observer.observe(node);
    });
  } else {
    revealNodes.forEach(function (node) {
      node.classList.add('is-visible');
    });
  }

  updateHeader();
  window.addEventListener('scroll', updateHeader, { passive: true });
})();
