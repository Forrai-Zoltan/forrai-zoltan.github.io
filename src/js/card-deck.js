// For Cards-View //

document.addEventListener("DOMContentLoaded", () => {
  const searchInput = document.getElementById("Search");
  const cards = document.querySelectorAll(".card");

  searchInput.addEventListener("input", function () {
    // Remove # and , and normalize spaces
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

    let matchCount = 0;

    cards.forEach((card) => {
      const text = card.textContent.toLowerCase();
      const tags = (card.dataset.tags || "").toLowerCase();
      const combined = `${text} ${tags}`;

      // Check includes all tokens are in combined
      const includesAll = includeTokens.every((token) =>
        combined.includes(token)
      );
      // Check excludes none of the exclude tokens appear in combined
      const excludesAll = excludeTokens.every(
        (token) => !combined.includes(token)
      );

      if (includesAll && excludesAll) {
        card.style.display = "";
        matchCount++;
      } else {
        card.style.display = "none";
      }
    });
  });
});

// Card Tab Index

document.querySelectorAll(".card").forEach((card) => {
  card.setAttribute("tabindex", "0");
});

function refreshSpotifyWidget() {
  const img = document.getElementById("SpotifyWidget");
  const baseUrl = img.src.split("?")[0];
  const params = new URLSearchParams(img.src.split("?")[1]);
  params.set("t", Date.now());
  img.src = `${baseUrl}?${params.toString()}`;
  if (img) {
    setInterval(refreshSpotifyWidget, 30000);
  }
}
