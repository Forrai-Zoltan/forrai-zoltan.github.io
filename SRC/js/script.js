
const html = document.documentElement;
const toggle = document.getElementById("theme-toggle");
const key = "theme";

const saved = localStorage.getItem(key);
const theme = saved || "dark";

html.setAttribute("data-theme", theme);
toggle.checked = theme === "dark";

toggle.onchange = () => {
  const next = toggle.checked ? "dark" : "light";
  html.setAttribute("data-theme", next);
  localStorage.setItem(key, next);
};