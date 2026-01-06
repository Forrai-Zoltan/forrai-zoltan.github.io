document.addEventListener("DOMContentLoaded", () => {
  const searchInput = document.querySelector(
    'input[type="search"][name="filter"]'
  );
  const cards = document.querySelectorAll("deck-section a");

  if (!searchInput) return;

  const form = searchInput.closest("form");

  if (form) {
    form.addEventListener("reset", () => {
      cards.forEach((card) => {
        card.style.display = "";
      });
    });
  }

  searchInput.addEventListener("input", function () {
    const cleanedInput = this.value.replace(/[#,\s]+/g, " ").toLowerCase();
    const rawTokens = cleanedInput
      .split(" ")
      .filter((token) => token.trim() !== "" && token !== "-");

    const includeTokens = [];
    const excludeTokens = [];

    rawTokens.forEach((token) => {
      if (token.startsWith("-") && token.length > 1) {
        excludeTokens.push(token.slice(1));
      } else {
        includeTokens.push(token);
      }
    });

    cards.forEach((card) => {
      const text = card.textContent.toLowerCase();
      const tags = (card.dataset.tags || "").toLowerCase();
      const combined = `${text} ${tags}`;

      const includesAll = includeTokens.every((token) =>
        combined.includes(token)
      );
      const excludesAll = excludeTokens.every(
        (token) => !combined.includes(token)
      );

      card.style.display = includesAll && excludesAll ? "" : "none";
    });
  });
});
