// HEADER
const siteTitleBar = document.getElementById("site-title-bar");
if (siteTitleBar) {
  siteTitleBar.innerHTML = `
  <a href="/">
    <img width="36" height="36" src="/assets/socrates-middle-finger.png">
    Part&nbsp;Time&nbsp;Writer. Full&nbsp;Time&nbsp;Wizard.
  </a>`;
}

// BREADCRUMBS
const path = window.location.pathname;
const parts = path.split("/").filter(Boolean);

let breadcrumbHTML = "<a href='/'>Home</a>";
let fullPath = "";

if (!(parts.length === 1 && parts[0] === "index")) {
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
  <li class="dropdown-category">
    <a href="/personal/">Personal</a>
    <ul>
      <li><a href="/personal/who_am_i">Who am I?</a></li>
      <li><a href="/personal/thoughts">Thoughts</a></li>
      <li><a href="/personal/gallery">Gallery</a></li>
    </ul>
  </li>
  <li class="dropdown-category">
    <a href="/written/">Written</a>
    <ul>
      <li><a href="/written/shorts">Shorts</a></li>
      <li><a href="/written/novels">Novels</a></li>
      <li><a href="/written/essays">Essays</a></li>
    </ul>
  </li>
  <li class="dropdown-category">
    <a href="/creative/">Creative</a>
    <ul>
      <li><a href="/creative/comics">Comics</a></li>
      <li><a href="/creative/films">Films</a></li>
      <li><a href="/creative/games">Games</a></li>
    </ul>
  </li>
  <li class="dropdown-category">
    <a href="/meta/">Meta</a>
    <ul>
      <li><a href="/meta/contact">Contact</a></li>
      <li><a href="/meta/secret">Secret</a></li>
      <li><a href="/meta/colophon">Colophon</a></li>
    </ul>
  </li>
</ul>
  `;
}
