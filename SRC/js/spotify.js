const img = document.querySelector(
  'img[src*="spotify-github-profile.kittinanx.com"]'
);
setInterval(() => {
  img.src = img.src.split("&t=")[0] + "&t=" + Date.now();
}, 15000);
