document.querySelectorAll("mark").forEach((mark) => {
  mark.style.padding = "0";
  const text = mark.textContent;
  const link = document.createElement("a");

  link.textContent = text;
  const isPoetryPage = window.location.pathname.includes("/poetry");
  link.href = isPoetryPage
    ? `/literary/poetry?q=${encodeURIComponent(text)}`
    : `/literary/fiction?q=${encodeURIComponent(text)}`;

  mark.textContent = "";
  mark.appendChild(link);
});
