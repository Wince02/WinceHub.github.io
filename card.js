document.addEventListener('DOMContentLoaded', function () {
  const cards = document.querySelectorAll('.social-card');
  const isTouchDevice = window.matchMedia('(hover: none), (pointer: coarse)').matches;

  if (!isTouchDevice) {
    cards.forEach(function(card) {
      card.addEventListener('mousemove', function(e) {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        const centerX = rect.width / 2;
        const centerY = rect.height / 2;

        const rotateX = ((y - centerY) / centerY) * -6;
        const rotateY = ((x - centerX) / centerX) * 8;

        card.style.transform =
          'perspective(1000px) rotateX(' + rotateX + 'deg) rotateY(' + rotateY + 'deg) translateY(-8px) scale(1.01)';
      });

      card.addEventListener('mouseleave', function() {
        card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0) scale(1)';
      });
    });
  }

  const openButton = document.getElementById('open-dota-overlay');
  const closeButton = document.getElementById('close-dota-overlay');
  const overlay = document.getElementById('dota-overlay');
  const modalOkButton = document.getElementById('modal-ok-button');
  const backdrop = overlay ? overlay.querySelector('[data-close-overlay]') : null;

  function openOverlay() {
    if (!overlay) return;
    overlay.classList.add('is-open');
    overlay.setAttribute('aria-hidden', 'false');
    document.body.classList.add('modal-open');
  }

  function closeOverlay() {
    if (!overlay) return;
    overlay.classList.remove('is-open');
    overlay.setAttribute('aria-hidden', 'true');
    document.body.classList.remove('modal-open');
  }

  if (openButton) openButton.addEventListener('click', openOverlay);
  if (closeButton) closeButton.addEventListener('click', closeOverlay);
  if (modalOkButton) modalOkButton.addEventListener('click', closeOverlay);
  if (backdrop) backdrop.addEventListener('click', closeOverlay);

  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape' && overlay && overlay.classList.contains('is-open')) {
      closeOverlay();
    }
  });
});