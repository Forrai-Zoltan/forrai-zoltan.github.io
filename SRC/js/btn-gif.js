document
  .querySelector('img[src="/SRC/btn.gif"]')
  .addEventListener("click", async function (event) {
    const htmlCode =
      '<a href="//gildrom.com"><img src="//gildrom.com/SRC/btn.gif"/></a>';

    try {
      await navigator.clipboard.writeText(htmlCode);

      const tooltip = document.createElement("div");
      tooltip.textContent = "Link copied";
      tooltip.style.position = "fixed";
      tooltip.style.background = "#270647";
      tooltip.style.color = "#fff";
      tooltip.style.padding = "8px 12px";
      tooltip.style.borderRadius = "5px";
      tooltip.style.border = "1px solid orange";
      tooltip.style.fontSize = "14px";
      tooltip.style.fontFamily = "var(--font-mono)";
      tooltip.style.fontWeight = "bold";
      tooltip.style.pointerEvents = "none";
      tooltip.style.zIndex = "10000";
      tooltip.style.transition = "opacity 0.3s";
      tooltip.style.boxShadow = "0 5px 6px rgba(0, 0, 0, 0.8)";

      document.body.appendChild(tooltip);

      const moveTooltip = (e) => {
        tooltip.style.left = e.clientX + 25 + "px";
        tooltip.style.top = e.clientY + 15 + "px";
      };

      moveTooltip(event);
      document.addEventListener("mousemove", moveTooltip);

      setTimeout(() => {
        tooltip.style.opacity = "0";
        setTimeout(() => {
          document.removeEventListener("mousemove", moveTooltip);
          document.body.removeChild(tooltip);
        }, 300);
      }, 2500);
    } catch (err) {
      console.error("Failed to copy to clipboard:", err);
    }
  });
