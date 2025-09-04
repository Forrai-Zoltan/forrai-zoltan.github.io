// For the navigation bars //

// HEADER
const siteTitleBar = document.getElementById("Title-bar");
if (siteTitleBar) {
  siteTitleBar.innerHTML = `
  <a href="/">
    <img width="36" height="36" src="/cdn/media/img/compressed/socrates-middle-finger.avif">
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

const breadcrumbs = document.getElementById("Breadcrumbs");
if (breadcrumbs) {
  breadcrumbs.innerHTML = breadcrumbHTML;
}

// DROPDOWN MENU
const dropdownMenu = document.getElementById("Dropdown-menu");
if (dropdownMenu) {
  dropdownMenu.innerHTML = `
    <ul>
  <li class="dropdown-category">
    <a href="/personal/">Personal</a>
    <ul>
      <li><a href="/personal/who_am_i">Who am I?</a></li>
      <li><a href="/personal/thoughts">Thoughts</a></li>
      <li><a href="/personal/obsessions">Obsessions</a></li>
    </ul>
  </li>
  <li class="dropdown-category">
    <a href="/literary/">Literary</a>
    <ul>
      <li><a href="/literary/shorts">Shorts</a></li>
      <li><a href="/literary/novels">Novels</a></li>
      <li><a href="/literary/essays">Essays</a></li>
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
    <a href="/beyond/">Beyond</a>
    <ul>
      <li><a href="/beyond/contact">Contact</a></li>
      <li><a href="/beyond/secret">Secret</a></li>
      <li><a href="/beyond/colophon">Colophon</a></li>
    </ul>
  </li>
</ul>
  `;
}
