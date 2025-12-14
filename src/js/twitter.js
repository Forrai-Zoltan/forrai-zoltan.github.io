// TWITTER //
document.querySelectorAll(".tweet-box").forEach((box) => {
  const time = box.querySelector("time");
  const texts = box.querySelectorAll(".tweet-text");
  texts.forEach((text) => {
    text.querySelectorAll("img").forEach((img) => {
      img.classList.add("zoomable");
      img.setAttribute("tabindex", "0");
    });
  });

  box.innerHTML = "";
  box.style.position = "relative";

  const profilePic = document.createElement("img");
  profilePic.className = "profile-pic no-select";
  profilePic.src = "/src/media/img/compressed/profile_bw_sq.png";
  profilePic.alt = "profile pic";
  profilePic.width = 50;
  profilePic.height = 50;

  const tweeterSpan = document.createElement("span");
  tweeterSpan.className = "tweeter-me no-select";
  tweeterSpan.textContent = "Zoltan Forrai";

  const verified = document.createElement("img");
  verified.src = "/src/asset/ico/twitter_verified_badge.svg";
  verified.className = "no-select";
  verified.alt = "verified badge";
  verified.width = 20;
  verified.height = 20;
  verified.setAttribute("tabindex", "-1");

  const handleSpan = document.createElement("span");
  handleSpan.className = "tweet-handle no-select";
  handleSpan.textContent = "@gildrom";

  const greySpan = document.createElement("span");
  greySpan.className = "tweet-grey no-select";
  greySpan.appendChild(handleSpan);
  greySpan.appendChild(time);

  const nameAndMeta = document.createElement("span");
  nameAndMeta.appendChild(tweeterSpan);
  nameAndMeta.appendChild(verified);
  nameAndMeta.appendChild(greySpan);

  const rightDiv = document.createElement("div");
  rightDiv.appendChild(nameAndMeta);
  texts.forEach((text) => rightDiv.appendChild(text));

  const rssLink = document.createElement("a");
  rssLink.href = "/src/rss-tweets.xml";
  rssLink.className = "rss-icon-link no-select";

  const rssIcon = document.createElement("img");
  rssIcon.src = "/src/asset/ico/rss.svg";
  rssIcon.className = "no-select";
  rssIcon.alt = "RSS Feed";
  rssIcon.width = 16;
  rssIcon.height = 16;

  rssLink.appendChild(rssIcon);
  box.appendChild(rssLink);

  box.appendChild(profilePic);
  box.appendChild(rightDiv);
});

// Create overlay element once
const overlay = document.createElement("div");
overlay.id = "img-overlay";

const overlayImg = document.createElement("img");
overlay.appendChild(overlayImg);
document.body.appendChild(overlay);

// Close overlay on click
overlay.addEventListener("click", () => {
  overlay.style.display = "none";
  document.body.classList.remove("no-scroll");
});

// Add click handler to all .zoomable images
document.addEventListener("click", (e) => {
  if (e.target.classList.contains("zoomable")) {
    overlayImg.src = e.target.src;
    overlay.style.display = "flex";
  }
});

// Inject CSS for .no-scroll class
const style = document.createElement("style");
style.textContent = `
.no-scroll {
  overflow: hidden !important;
  height: 100vh !important;
  }
  `;
document.head.appendChild(style);

// overlay keyboard logic

let overlayOpen = false;

document.addEventListener("keydown", (e) => {
  const active = document.activeElement;
  const isVisible = window.getComputedStyle(overlay).display !== "none";

  if (
    e.key === "Enter" &&
    active.classList.contains("zoomable") &&
    !overlayOpen
  ) {
    overlayImg.src = active.src;
    overlay.style.display = "flex";
    document.body.classList.add("no-scroll");
    overlayOpen = true;
    return;
  }

  if ((e.key === "Escape" || e.key === "Enter") && isVisible) {
    overlay.style.display = "none";
    document.body.classList.remove("no-scroll");
    overlayOpen = false;
  }
});

document.addEventListener("click", (e) => {
  if (e.target.classList.contains("zoomable")) {
    overlayImg.src = e.target.src;
    overlay.style.display = "flex";
    document.body.classList.add("no-scroll");
    overlayOpen = true;
  } else if (e.target === overlay) {
    overlay.style.display = "none";
    document.body.classList.remove("no-scroll");
    overlayOpen = false;
  }
});


// Copy LINK

function copyToClipboard(text) {
  if (navigator.clipboard && window.isSecureContext) {
    return navigator.clipboard.writeText(text);
  }

  return new Promise((resolve, reject) => {
    const textarea = document.createElement("textarea");
    textarea.value = text;
    textarea.style.position = "fixed";
    textarea.style.opacity = "0";
    document.body.appendChild(textarea);
    textarea.focus();
    textarea.select();

    try {
      document.execCommand("copy");
      resolve();
    } catch (err) {
      reject(err);
    } finally {
      document.body.removeChild(textarea);
    }
  });
}

const links = document.getElementsByClassName("rss-icon-link");
const message = document.getElementById("copy-message");

if (message) {
  document.addEventListener("mousemove", function (event) {
    const isMobile = window.matchMedia("(max-width: 600px)").matches;

    const offsetX = isMobile ? -150 : 10;
    const offsetY = isMobile ? -55 : 10;

    message.style.left = `${event.clientX + offsetX}px`;
    message.style.top = `${event.clientY + offsetY}px`;
  });
}

Array.from(links).forEach((linkElement) => {
  linkElement.addEventListener("click", function (event) {
    event.preventDefault();

    const link = this.href;

    copyToClipboard(link)
      .then(() => {
        message.style.opacity = "1"; // show message

        // Hide after 2 seconds
        setTimeout(() => {
          message.style.opacity = "0";
        }, 3000);
      })
      .catch((err) => {
        console.error("Failed to copy:", err);
      });
  });
});
