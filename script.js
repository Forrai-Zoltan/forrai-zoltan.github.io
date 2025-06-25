// HEADER
const siteTitleBar = document.getElementById("site-title-bar");
if (siteTitleBar) {
  siteTitleBar.innerHTML = `
  <a href="index.html">
    <img src="/assets/socrates-middle-finger.png">
    Part&nbsp;Time&nbsp;Writer. Full&nbsp;Time&nbsp;Wizard.
  </a>`;
}

// BREADCRUMBS
const path = window.location.pathname;
const parts = path.split("/").filter(Boolean);

let breadcrumbHTML = "<a href='/index.html'>Home</a>";
let fullPath = "";

for (let i = 0; i < parts.length; i++) {
  const part = parts[i];
  fullPath += "/" + part.replace(/\.html$/, "");
  const label = part
    .replace(/\.html$/, "")
    .replace(/_/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase());

  if (i < parts.length - 1) {
    breadcrumbHTML += ` / <a href="${fullPath}">${label}</a>`;
  } else {
    breadcrumbHTML += ` / <a href="${fullPath}" aria-current="page">${label}</a>`;
  }
}

const breadcrumbs = document.getElementById("breadcrumbs");
if (breadcrumbs) {
  breadcrumbs.innerHTML = breadcrumbHTML;
}

// DROPDOWN MENU
const dropdownMenu = document.getElementById("dropdown-menu");
if (dropdownMenu) {
  dropdownMenu.innerHTML = `
    <ul>
      <li class="dropdown-category">Personal
        <ul>
          <li><a href="#">Who am I?</a></li>
          <li><a href="#">Philosophy</a></li>
          <li><a href="#">Gallery</a></li>
        </ul>
      </li>
      <li class="dropdown-category">Written
        <ul>
          <li><a href="#">Essays</a></li>
          <li><a href="#">Shorts</a></li>
          <li><a href="#">Novels</a></li>
        </ul>
      </li>
      <li class="dropdown-category">Creative
        <ul>
          <li><a href="#">Comics</a></li>
          <li><a href="#">Films</a></li>
          <li><a href="#">Games</a></li>
        </ul>
      </li>
      <li class="dropdown-category">Meta
        <ul>
          <li><a href="#">Contact</a></li>
          <li><a href="#">Secret</a></li>
          <li><a href="#">Colophon</a></li>
        </ul>
      </li>
    </ul>
  `;
}

// MAIN

const header = document.querySelector("header");
const headerHeight = header.offsetHeight;

const main = document.querySelector("main");
const viewportHeight = window.innerHeight;

main.style.height = `${viewportHeight - headerHeight - 25}px`;
main.style.marginTop = `${headerHeight + 10}px`;

window.addEventListener("resize", () => {
  const viewportHeight = window.innerHeight;
  const header = document.querySelector("header");
  const headerHeight = header.offsetHeight;
  main.style.height = `${viewportHeight - headerHeight - 25}px`;
  main.style.marginTop = `${headerHeight + 10}px`;
});
