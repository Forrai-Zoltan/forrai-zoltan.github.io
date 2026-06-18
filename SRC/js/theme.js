import { playPop } from "./audio.js";
/* COLOR SWITCHER */
const html = document.documentElement;
const toggle = document.querySelector("toggle-btn");
toggle.checked = html.id !== "dark";
const key = "theme";
toggle.insertAdjacentHTML(
  "afterbegin",
  `
    <label>
      <input type="checkbox" />
      <theme-track></theme-track>
      <theme-thumb></theme-thumb>
    </label>
`
);
const updateTheme = (isDark) => {
  html.id = isDark ? "dark" : "light";
  toggle.checked = !isDark;
  localStorage.setItem(key, isDark ? "dark" : "light");
};
const transitionTheme = (isDark) => {
  if (!document.startViewTransition) {
    updateTheme(isDark);
    return;
  }
  document.startViewTransition(() => updateTheme(isDark));
};
toggle.onclick = () => {
  const isDark = html.id === "light";
  transitionTheme(isDark);
  playPop(!isDark);
};
/* KEYBOARD SHORTCUT */
document.addEventListener("keydown", (e) => {
  const tag = document.activeElement.tagName;
  const isTyping =
    tag === "INPUT" ||
    tag === "TEXTAREA" ||
    tag === "SELECT" ||
    document.activeElement.isContentEditable;
  if (e.key === "t" && !isTyping) {
    const isDark = html.id === "light";
    transitionTheme(isDark);
    playPop(!isDark);
  }
});
