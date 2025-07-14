// ICON
const favicon = document.createElement("link");
favicon.rel = "icon";
favicon.type = "image/png";
favicon.href = "/assets/media/img/socrates-middle-finger.png";
document.head.appendChild(favicon);

// MAIN
const header = document.querySelector("header");
const headerHeight = header.offsetHeight;

const main = document.querySelector("main");
const viewportHeight = window.innerHeight;

main.style.minHeight = `${viewportHeight - headerHeight - 25}px`;

window.addEventListener("resize", () => {
  const viewportHeight = window.innerHeight;
  const header = document.querySelector("header");
  const headerHeight = header.offsetHeight;
  main.style.minHeight = `${viewportHeight - headerHeight - 25}px`;
});

if (main) {
  const div = document.createElement("div");
  div.style.height = "0.01px";
  main.insertAdjacentElement("afterend", div);
}

//SECRET GAME PASSWORD
const riddlePassword = document.getElementById("riddle-password");
const feedback = document.getElementById("secret-feedback");
const responses = [
  "Nice try...",
  "Incorrect...",
  "Not quite...",
  "Wrong password...",
  "Clue: look harder!",
  "The answer is: gullible",
  "Nope, sorry. Try again!",
  "Incorrect... Try again!",
  "Maybe a few more tries...",
  "That one was almost right...",
  "I think you misspelled that one...",
  "You can't brute force this one mate...",
  "The answer is closer than you think...",
  "That was correct! Wait, no it wasn't...",
  "The dolphin of the east only wakes once...",
];

const secretForm = document.getElementById("secret-form");
if (secretForm) {
  secretForm.addEventListener("submit", function (e) {
    e.preventDefault();

    const input = riddlePassword.value.trim().toLowerCase();
    let randomResponse =
      responses[Math.floor(Math.random() * responses.length)];

    if (input === "gullible") {
      randomResponse = "You really tried that?";
      feedback.style.visibility = "visible";
    }
    if (input === "sound") {
      randomResponse = "Clever! But no, that ain't it.";
      feedback.style.visibility = "visible";
    }

    feedback.textContent = randomResponse;
    feedback.style.visibility = "visible";
  });

  riddlePassword.addEventListener("input", function () {
    if (riddlePassword.value.trim() === "") {
      feedback.style.visibility = "hidden";
    }
  });
}

// TWITTER //
document.querySelectorAll(".tweet-box").forEach((box) => {
  const time = box.querySelector("time");
  const text = box.querySelector(".tweet-text");
  text.querySelectorAll("img").forEach((img) => {
    img.classList.add("zoomable");
    img.setAttribute("tabindex", "0");
  });

  box.innerHTML = "";
  box.style.position = "relative"; // So the RSS icon can be absolutely positioned

  const profilePic = document.createElement("img");
  profilePic.className = "profile-pic";
  profilePic.src = "/assets/media/img/profile_bw_sq.png";
  profilePic.alt = "profile pic";
  profilePic.width = 50;

  const tweeterSpan = document.createElement("span");
  tweeterSpan.className = "tweeter";
  tweeterSpan.textContent = "Zoltán Forrai";

  const verified = document.createElement("object");
  verified.data = "/assets/media/svg/Twitter_Verified_Badge.svg";
  verified.type = "image/svg+xml";
  verified.width = 20;
  verified.setAttribute("tabindex", "-1");

  const handleSpan = document.createElement("span");
  handleSpan.className = "tweet-handle";
  handleSpan.textContent = "@gildrom · ";

  const greySpan = document.createElement("span");
  greySpan.className = "tweet-grey";
  greySpan.appendChild(handleSpan);
  greySpan.appendChild(time);

  const nameAndMeta = document.createElement("span");
  nameAndMeta.appendChild(tweeterSpan);
  nameAndMeta.appendChild(verified);
  nameAndMeta.appendChild(greySpan);

  const rightDiv = document.createElement("div");
  rightDiv.appendChild(nameAndMeta);
  rightDiv.appendChild(text);

  const rssLink = document.createElement("a");
  rssLink.href = "https://forrai-zoltan.github.io/rss-tweets.xml";
  rssLink.className = "rss-icon-link";

  const rssIcon = document.createElement("img");
  rssIcon.src = "/assets/media/svg/rss.svg";
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

const links = document.getElementsByClassName("rss-icon-link");
const message = document.getElementById("copy-message");

if (message) {
  document.addEventListener("mousemove", function (event) {
    message.style.left = `${event.clientX + 10}px`;
    message.style.top = `${event.clientY + 10}px`;
  });
}

Array.from(links).forEach((linkElement) => {
  linkElement.addEventListener("click", function (event) {
    event.preventDefault();

    const link = this.href;
    navigator.clipboard
      .writeText(link)
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

// Card Tab Index

document.querySelectorAll(".obsession-card").forEach((card) => {
  card.setAttribute("tabindex", "0");
});
