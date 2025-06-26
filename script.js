// ICON
const favicon = document.createElement("link");
favicon.rel = "icon";
favicon.type = "image/png";
favicon.href = "/assets/socrates-middle-finger.png";
document.head.appendChild(favicon);

// MAIN
const header = document.querySelector("header");
const headerHeight = header.offsetHeight;

const main = document.querySelector("main");
const viewportHeight = window.innerHeight;

main.style.minHeight = `${viewportHeight - headerHeight - 23}px`;
main.style.marginTop = `${headerHeight + 10}px`;

window.addEventListener("resize", () => {
  const viewportHeight = window.innerHeight;
  const header = document.querySelector("header");
  const headerHeight = header.offsetHeight;
  main.style.minHeight = `${viewportHeight - headerHeight - 23}px`;
  main.style.marginTop = `${headerHeight + 10}px`;
});

// Insert horizontal line paragraph into every article > section
const ch65 = document.createElement("p");
ch65.id = "ch65";
ch65.textContent =
  "-------------------------------------------------------------------------------------------------";

const lastSection = document.querySelector("article > section:last-of-type");
if (lastSection) {
  lastSection.appendChild(ch65);
}
