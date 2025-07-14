const isMobile = /Android|iPhone|iPad|iPod|Windows Phone/i.test(
  navigator.userAgent
);

if (isMobile) {
  window.location.href =
    "https://en.wikipedia.org/wiki/Problematic_smartphone_use";
}
