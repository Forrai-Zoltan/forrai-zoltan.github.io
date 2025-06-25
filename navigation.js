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

if (!(parts.length === 1 && parts[0] === "index.html")) {
  for (let i = 0; i < parts.length; i++) {
    const part = parts[i];
    fullPath += "/" + part.replace(/\.html$/, "");
    const label = part
      .replace(/\.html$/, "")
      .replace(/_/g, " ")
      .replace(/\b\w/g, (c) => c.toUpperCase());

    if (i < parts.length - 1) {
      breadcrumbHTML += `<a href="${fullPath}">${label}</a>`;
    } else {
      breadcrumbHTML += ` / <a href="${fullPath}" aria-current="page">${label}</a>`;
    }
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
      <li class="dropdown-category" tabindex="0">Personal
        <ul>
          <li><a href="#">Who am I?</a></li>
          <li><a href="#">Philosophy</a></li>
          <li><a href="#">Gallery</a></li>
        </ul>
      </li>
      <li class="dropdown-category" tabindex="0">Written
        <ul>
          <li><a href="#">Essays</a></li>
          <li><a href="#">Shorts</a></li>
          <li><a href="#">Novels</a></li>
        </ul>
      </li>
      <li class="dropdown-category" tabindex="0">Creative
        <ul>
          <li><a href="#">Comics</a></li>
          <li><a href="#">Films</a></li>
          <li><a href="#">Games</a></li>
        </ul>
      </li>
      <li class="dropdown-category" tabindex="0">Meta
        <ul>
          <li><a href="#">Contact</a></li>
          <li><a href="/404">Secret</a></li>
          <li><a href="#">Colophon</a></li>
        </ul>
      </li>
    </ul>
  `;
}
