(function () {
  var year = document.getElementById('year');
  if (year) year.textContent = new Date().getFullYear();

  document.querySelectorAll('.faq-item__question').forEach(function (button) {
    if (button.dataset.accordionReady === 'true') return;
    button.dataset.accordionReady = 'true';
    button.setAttribute('aria-expanded', 'false');

    button.addEventListener('click', function () {
      var item = button.closest('.faq-item');
      var opening = !item.classList.contains('open');

      document.querySelectorAll('.faq-item.open').forEach(function (openItem) {
        openItem.classList.remove('open');
        var openButton = openItem.querySelector('.faq-item__question');
        if (openButton) openButton.setAttribute('aria-expanded', 'false');
      });

      item.classList.toggle('open', opening);
      button.setAttribute('aria-expanded', String(opening));
    });
  });
})();
