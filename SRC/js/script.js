/* COLOR SWITCHER */
const html = document.documentElement;
const toggle = document.getElementById("theme-toggle");
const label = toggle.closest(".toggle");
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

const saved = localStorage.getItem(key);
const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
const theme = saved || (prefersDark ? "dark" : "light");

label.classList.add("no-transition");
updateTheme(theme === "dark");

requestAnimationFrame(() => {
  requestAnimationFrame(() => {
    label.classList.remove("no-transition");
  });
});

toggle.onchange = () => transitionTheme(!toggle.checked);