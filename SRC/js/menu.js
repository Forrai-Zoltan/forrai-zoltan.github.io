const titleBar = document.querySelector("title-bar");
if (titleBar) {
  titleBar.insertAdjacentHTML("beforeend", `<menu id="tools"></menu>`);

  const menu = document.getElementById("tools");

  menu.insertAdjacentHTML(
    "afterbegin",
    `
    <button class="audio-btn" id="toggleBtn" aria-label="Toggle audio"></button>
    <toggle-btn title="Theme Toggle">
      <label class="toggle">
        <input type="checkbox" id="theme-toggle" />
        <span class="track"></span>
        <span class="thumb"></span>
      </label>
    </toggle-btn>
  `
  );

  const handleBurger = () => {
    const isMobile = window.innerWidth < 1000;
    const existingCheckbox = document.getElementById("burger");

    if (isMobile && !existingCheckbox) {
      menu.insertAdjacentHTML(
        "beforeend",
        `
        <label for="burger">
          <svg width="35" height="35">
            <use href="/SRC/asset/svg/nav.svg#icon-menu"></use>
          </svg>
        </label>
      `
      );
      titleBar.insertAdjacentHTML(
        "afterend",
        `<input type="checkbox" id="burger" />`
      );
    } else if (!isMobile && existingCheckbox) {
      existingCheckbox.remove();
      menu.querySelector('label[for="burger"]')?.remove();
    }
  };

  handleBurger();
  window.addEventListener("resize", handleBurger);
}
