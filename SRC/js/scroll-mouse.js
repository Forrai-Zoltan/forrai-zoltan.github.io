function adjustForScrollbar() {
  const scrollbarWidth =
    window.innerWidth - document.documentElement.clientWidth;
  const hasScrollbar =
    document.documentElement.scrollHeight > window.innerHeight;
  const mainElement = document.querySelector("main");

  if (mainElement) {
    if (hasScrollbar && scrollbarWidth > 0) {
      mainElement.style.paddingRight = "0";
    } else {
      mainElement.style.paddingRight = "";
    }
  }
}

adjustForScrollbar();

window.addEventListener("resize", adjustForScrollbar);
window.addEventListener("load", adjustForScrollbar);

const observer = new MutationObserver(adjustForScrollbar);
observer.observe(document.body, { childList: true, subtree: true });

setInterval(adjustForScrollbar, 500);
