const images = document.querySelectorAll("gallery-row img");

images.forEach((img, index) => {
  img.addEventListener("click", () => {
    let currentIndex = index;
    let isSwiping = false;

    const overlay = document.createElement("div");
    overlay.className = "zoom-overlay";

    const zoomImg = document.createElement("img");
    overlay.appendChild(zoomImg);

    function updateImage() {
      const currentImg = images[currentIndex];
      zoomImg.src = currentImg.src;

      if (currentImg.alt) {
        overlay.dataset.caption = currentImg.alt;
      } else {
        delete overlay.dataset.caption;
      }
    }

    function showNext() {
      currentIndex = (currentIndex + 1) % images.length;
      updateImage();
    }

    function showPrev() {
      currentIndex = (currentIndex - 1 + images.length) % images.length;
      updateImage();
    }

    // ✅ Keyboard support
    function handleKey(e) {
      if (e.key === "ArrowRight") {
        showNext();
      } else if (e.key === "ArrowLeft") {
        showPrev();
      } else if (e.key === "Escape") {
        cleanup();
      }
    }

    document.addEventListener("keydown", handleKey);

    // ✅ Swipe support
    let startX = 0;
    let endX = 0;

    overlay.addEventListener("touchstart", (e) => {
      isSwiping = false;
      startX = e.touches[0].clientX;
    });

    overlay.addEventListener("touchmove", () => {
      isSwiping = true;
    });

    overlay.addEventListener("touchend", (e) => {
      endX = e.changedTouches[0].clientX;

      const diff = startX - endX;

      if (Math.abs(diff) > 50) {
        if (diff > 0) {
          showNext();
        } else {
          showPrev();
        }
      }
    });

    // Close logic (clean!)
    function cleanup() {
      document.removeEventListener("keydown", handleKey);
      overlay.remove();
    }

    overlay.addEventListener("click", () => {
      if (!isSwiping) cleanup();
    });

    updateImage();
    document.body.appendChild(overlay);
  });
});
