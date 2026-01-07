document.querySelectorAll("mark").forEach((mark) => {
  const text = mark.textContent;
  const link = document.createElement("a");

  link.textContent = text;
  link.href = `/literary/shorts?q=${encodeURIComponent(text)}`;

  mark.textContent = "";
  mark.appendChild(link);
});
