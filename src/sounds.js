const dropSound = new Audio("/cdn/media/aud/Silent_Hill_2_00151.wav");
const menuSound = new Audio("/cdn/media/aud/Silent_Hill_2_00152.wav");

const dropdownItems = document.querySelectorAll(".dropdown-category li");
dropdownItems.forEach(item => {
  item.addEventListener("mouseenter", () => {
    dropSound.currentTime = 0;
    dropSound.play();
  });
});
