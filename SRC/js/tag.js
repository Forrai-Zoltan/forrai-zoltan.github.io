document.querySelectorAll("mark").forEach((mark) => {
  mark.style.padding = "0";
  const text = mark.textContent;
  const link = document.createElement("a");

  link.textContent = text;
  link.href = `/literary/shorts?q=${encodeURIComponent(text)}`;

  mark.textContent = "";
  mark.appendChild(link);
});
