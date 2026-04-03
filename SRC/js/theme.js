import { playPop } from "./audio.js";

/* COLOR SWITCHER */
const html = document.documentElement;
const toggle = document.getElementById("theme-toggle");
toggle.checked = !html.classList.contains("dark");
const key = "theme";

const updateTheme = (isDark) => {
  html.classList.toggle("dark", isDark);
  html.classList.toggle("light", !isDark);
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

toggle.onclick = () => transitionTheme(html.classList.contains("light"));

/* KEYBOARD SHORTCUT */
document.addEventListener("keydown", (e) => {
  const tag = document.activeElement.tagName;
  const isTyping =
    tag === "INPUT" ||
    tag === "TEXTAREA" ||
    tag === "SELECT" ||
    document.activeElement.isContentEditable;
  if (e.key === "t" && !isTyping) {
    const isDark = html.classList.contains("light");
    transitionTheme(isDark);
    playPop(!isDark);
  }
});
