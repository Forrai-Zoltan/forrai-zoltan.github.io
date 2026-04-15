

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
