document.addEventListener("DOMContentLoaded", () => {
  const images = document.querySelectorAll("main :not(a) img");

  images.forEach((img) => {
    img.addEventListener("click", () => {
      // Create overlay
      const overlay = document.createElement("div");
      overlay.style.position = "fixed";
      overlay.style.top = 0;
      overlay.style.left = 0;
      overlay.style.width = "100vw";
      overlay.style.height = "100vh";
      overlay.style.backgroundColor = "rgba(0,0,0,0.9)";
      overlay.style.display = "flex";
      overlay.style.alignItems = "center";
      overlay.style.justifyContent = "center";
      overlay.style.cursor = "zoom-out";
      overlay.style.zIndex = 9999;

      // Create zoomed image
      const zoomImg = document.createElement("img");
      zoomImg.src = img.src;
      zoomImg.style.maxWidth = "90%";
      zoomImg.style.maxHeight = "90%";
      zoomImg.style.boxShadow = "0 0 20px rgba(0,0,0,0.5)";
      zoomImg.style.borderRadius = "10px";

      overlay.appendChild(zoomImg);
      document.body.appendChild(overlay);

      overlay.addEventListener("click", () => {
        overlay.remove();
      });
    });
  });
});
