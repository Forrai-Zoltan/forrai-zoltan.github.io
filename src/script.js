// ICON
const favicon = document.createElement("link");
favicon.rel = "icon";
favicon.type = "image/x-icon";
favicon.href = "/favicon.ico";
document.head.appendChild(favicon);

// MAIN HEIGHT
const header = document.querySelector("header");
const headerHeight = header.offsetHeight;

const main = document.querySelector("main");
const viewportHeight = window.innerHeight;

main.style.minHeight = `${viewportHeight - headerHeight - 25}px`;

window.addEventListener("resize", () => {
  const viewportHeight = window.innerHeight;
  const header = document.querySelector("header");
  const headerHeight = header.offsetHeight;
  main.style.minHeight = `${viewportHeight - headerHeight - 25}px`;
});

if (main) {
  const div = document.createElement("div");
  div.style.height = "0.01px";
  main.insertAdjacentElement("afterend", div);
}
