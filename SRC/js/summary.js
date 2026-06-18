document.querySelectorAll("summary").forEach((el) => {
  el.addEventListener("mousedown", (e) => {
    if (e.detail > 1) {
      // double-click or more
      e.preventDefault(); // prevents text selection
    }
  });
});
