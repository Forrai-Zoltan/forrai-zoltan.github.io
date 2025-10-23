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

//////////////////////////////////////
// Only show first two rows of cards!

function showOnlyTwoRows() {
  const deck = document.getElementById("Deck");
  const cards = Array.from(deck.children);

  if (!cards.length) return;

  // Reset all cards so heights are correct after resize
  cards.forEach((card) => (card.style.display = ""));

  const firstTop = cards[0].offsetTop;

  // Find the bottom of the second row
  let secondRowBottom = firstTop;
  for (let card of cards) {
    if (card.offsetTop === firstTop) {
      secondRowBottom = card.offsetTop + card.offsetHeight;
    } else {
      secondRowBottom = card.offsetTop + card.offsetHeight;
      break;
    }
  }

  // Hide cards below second row, but only if they are empty
  for (let card of cards) {
    if (card.offsetTop >= secondRowBottom && !card.textContent.trim()) {
      card.style.display = "none";
    }
  }
}

// Initial run
showOnlyTwoRows();

// Update on window resize
window.addEventListener("resize", showOnlyTwoRows);
