document.addEventListener("DOMContentLoaded", () => {
  const savedHearts = JSON.parse(localStorage.getItem("heartStates") || "{}");

  document.querySelectorAll("status-update").forEach((update, index) => {
    const uniqueId = `heart-${index}`;
    const html = `
      <interaction-row>
        <input type="checkbox" class="heart" id="${uniqueId}" />
        <label for="${uniqueId}">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M2 9.5a5.5 5.5 0 0 1 9.591-3.676.56.56 0 0 0 .818 0A5.49 5.49 0 0 1 22 9.5c0 2.29-1.5 4-3 5.5l-5.492 5.313a2 2 0 0 1-3 .019L5 15c-1.5-1.5-3-3.2-3-5.5" />
          </svg>
        </label>
        <a href="/tavern/contact">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M2.992 16.342a2 2 0 0 1 .094 1.167l-1.065 3.29a1 1 0 0 0 1.236 1.168l3.413-.998a2 2 0 0 1 1.099.092 10 10 0 1 0-4.777-4.719" />
          </svg>
        </a>
        <a href="/rss.xml">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M4 11a9 9 0 0 1 9 9" />
            <path d="M4 4a16 16 0 0 1 16 16" />
            <circle cx="5" cy="19" r="1" />
          </svg>
        </a>
      </interaction-row>
    `;
    update.insertAdjacentHTML("beforeend", html);

    const checkbox = document.getElementById(uniqueId);
    if (savedHearts[uniqueId]) {
      checkbox.checked = true;
    }

    checkbox.addEventListener("change", () => {
      const heartStates = JSON.parse(
        localStorage.getItem("heartStates") || "{}"
      );
      if (checkbox.checked) {
        heartStates[uniqueId] = true;
      } else {
        delete heartStates[uniqueId];
      }
      localStorage.setItem("heartStates", JSON.stringify(heartStates));
    });
  });
});

window.addEventListener("load", () => {
  const firstPost = document.querySelector(
    "tweet-timeline status-update:first-of-type"
  );
  if (!firstPost) return;

  const style = getComputedStyle(firstPost);
  const marginTop = parseFloat(style.marginTop);
  const marginBottom = parseFloat(style.marginBottom);

  const fullHeight = firstPost.offsetHeight + marginTop + marginBottom;

  document.documentElement.style.setProperty(
    "--first-post-height",
    `-${fullHeight}px`
  );
});

window.addEventListener("load", () => {
  const audio = new Audio("/SRC/asset/sound/tweet.mp3");
  audio.preload = "auto";
  audio.volume = 0.2;
  audio.load();

  setTimeout(() => {
    audio.currentTime = 0;
    audio.play();
  }, 0);
});
