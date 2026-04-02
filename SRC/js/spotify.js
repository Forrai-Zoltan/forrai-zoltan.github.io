const imgs = document.querySelectorAll(
  'img[src*="spotify-github-profile.kittinanx.com"]'
);
setInterval(() => {
  imgs.forEach(img => {
    img.src = img.src.split("&t=")[0] + "&t=" + Date.now();
  });
}, 5000);