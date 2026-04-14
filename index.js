(function () {
  const saved = localStorage.getItem("theme");
  const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
  const isDark = saved ? saved === "dark" : prefersDark;
  const html = document.documentElement;
  html.classList.add(isDark ? "dark" : "light");
  html.classList.remove(isDark ? "light" : "dark");
})();

// Menu html inset
if (document.querySelector("title-bar")) {
  await import("/SRC/js/menu.js");
}

// Audio Toggle
if (document.querySelector(".audio-btn")) {
  await import("/SRC/js/audio.js");
}

// Theme Toggle
if (document.querySelector("toggle-btn")) {
  await import("/SRC/js/theme.js");
}

// Spotify Box
if (document.querySelector("pspotify-p")) {
  await import("/SRC/js/spotify.js");
}

// Gallery
if (document.querySelector("gallery-row")) {
  await import("/SRC/js/zoom.js");
}

// Filter
if (document.querySelector(".deck")) {
  await import("/SRC/js/filter.js");
}

// Summary
if (document.querySelector("summary")) {
  await import("/SRC/js/summary.js");
}
