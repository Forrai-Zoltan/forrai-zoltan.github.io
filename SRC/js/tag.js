document.querySelectorAll("mark").forEach((mark) => {
  mark.style.padding = "0";
  const text = mark.textContent;
  const link = document.createElement("a");

  link.textContent = text;
  const isEssayPage = window.location.pathname.includes("/essays");
  link.href = isEssayPage
    ? `/literary/essays?q=${encodeURIComponent(text)}`
    : `/literary/fiction?q=${encodeURIComponent(text)}`;

  mark.textContent = "";
  mark.appendChild(link);
});
