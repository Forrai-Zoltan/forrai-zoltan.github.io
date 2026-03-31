const html = document.documentElement;
const toggle = document.getElementById("theme-toggle");
const key = "theme";

const updateTheme = (isDark) => {
  html.classList.toggle("dark", isDark);
  html.classList.toggle("light", !isDark);
  toggle.checked = isDark;
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
updateTheme(theme === "dark");

toggle.onchange = () => transitionTheme(toggle.checked);
