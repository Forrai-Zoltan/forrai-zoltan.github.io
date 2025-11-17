
// Lightbox / Zoom helper for images inside `.image-row`
(() => {
  // Create overlay and image elements
  const overlay = document.createElement('div');
  overlay.id = 'Img-overlay';
  overlay.setAttribute('role', 'dialog');
  overlay.setAttribute('aria-hidden', 'true');

  const overlayInner = document.createElement('div');
  overlayInner.className = 'Img-overlay-inner';

  const overlayImg = document.createElement('img');
  overlayImg.className = 'Img-overlay-img';
  overlayImg.alt = '';

  overlayInner.appendChild(overlayImg);
  overlay.appendChild(overlayInner);
  document.body.appendChild(overlay);

  // Styling for overlay (scoped here so no external CSS changes required)
  const style = document.createElement('style');
  style.textContent = `
    #Img-overlay {
      position: fixed;
      inset: 0;
      display: flex;
      align-items: center;
      justify-content: center;
      background: rgba(0,0,0,0.85);
      z-index: 9999;
      padding: 20px;
      box-sizing: border-box;
      user-select: none;
    }
    #Img-overlay[aria-hidden="true"] { display: none; }
    /* Inner container will size to viewport minus padding so image fits */
    .Img-overlay-inner {
      width: calc(100% - 40px);
      height: calc(100% - 40px);
      max-width: 100%;
      max-height: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
      box-sizing: border-box;
      overflow: hidden;
    }
    .Img-overlay-img {
      display: block;
      max-width: 100%;
      max-height: 100%;
      width: auto;
      height: auto;
      object-fit: contain;
      border-radius: 6px;
      box-shadow: 0 10px 30px rgba(0,0,0,0.6);
    }
    body.no-scroll { overflow: hidden !important; height: 100vh !important; }
  `;
  document.head.appendChild(style);

  // Gather all images inside .image-row and make them zoomable
  function markZoomableImages() {
    const imgs = document.querySelectorAll('.image-row img');
    imgs.forEach((img) => {
      img.setAttribute('tabindex', '0');
      img.setAttribute('role', 'button');
      img.setAttribute('aria-label', 'Open image');
    });
  }

  markZoomableImages();

  // Utility to find the list of zoomable images (we scope to same .image-row container when possible)
  function getGroupImages(currentImg) {
    const row = currentImg.closest('.image-row');
    if (row) return Array.from(row.querySelectorAll('img'));
    // fallback: all zoomable images
    return Array.from(document.querySelectorAll('.image-row img'));
  }

  let currentIndex = -1;
  let currentGroup = [];

  function openOverlayFrom(imgEl) {
    currentGroup = getGroupImages(imgEl);
    currentIndex = currentGroup.indexOf(imgEl);
    overlayImg.src = imgEl.src;
    overlayImg.alt = imgEl.alt || '';
    overlay.setAttribute('aria-hidden', 'false');
    document.body.classList.add('no-scroll');
  }

  function closeOverlay() {
    overlay.setAttribute('aria-hidden', 'true');
    document.body.classList.remove('no-scroll');
    currentIndex = -1;
    currentGroup = [];
  }

  function showNext(delta) {
    if (!currentGroup.length) return;
    currentIndex = (currentIndex + delta + currentGroup.length) % currentGroup.length;
    const next = currentGroup[currentIndex];
    overlayImg.src = next.src;
    overlayImg.alt = next.alt || '';
  }

  // Click handler (delegated)
  document.addEventListener('click', (e) => {
    const target = e.target;
    if (target.matches('.image-row img.zoomable')) {
      e.preventDefault();
      openOverlayFrom(target);
      return;
    }

    // click on overlay background closes
    if (e.target === overlay || e.target === overlayInner) {
      closeOverlay();
      return;
    }
  });

  // Keyboard handlers
  document.addEventListener('keydown', (e) => {
    // If focused on a zoomable image, Enter opens
    const active = document.activeElement;
    if (e.key === 'Enter' && active && active.matches && active.matches('.image-row img.zoomable')) {
      e.preventDefault();
      openOverlayFrom(active);
      return;
    }

    // If overlay open
    const overlayVisible = overlay.getAttribute('aria-hidden') === 'false';
    if (!overlayVisible) return;

    if (e.key === 'Escape') {
      closeOverlay();
      return;
    }

    if (e.key === 'ArrowRight') {
      showNext(1);
      return;
    }

    if (e.key === 'ArrowLeft') {
      showNext(-1);
      return;
    }
  });

  // Make sure newly added images (dynamic content) get marked
  const observer = new MutationObserver((mutations) => {
    for (const m of mutations) {
      if (m.addedNodes && m.addedNodes.length) markZoomableImages();
    }
  });
  observer.observe(document.body, { childList: true, subtree: true });

})();
