// ICON
const favicon = document.createElement("link");
favicon.rel = "icon";
favicon.type = "image/png";
favicon.href = "/assets/socrates-middle-finger.png";
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
  });

  box.innerHTML = "";
  box.style.position = "relative"; // So the RSS icon can be absolutely positioned

  const profilePic = document.createElement("img");
  profilePic.className = "profile-pic";
  profilePic.src = "/assets/profile_bw_sq.png";
  profilePic.alt = "profile pic";
  profilePic.width = 50;

  const tweeterSpan = document.createElement("span");
  tweeterSpan.className = "tweeter";
  tweeterSpan.textContent = "Zoltán Forrai";

  const verified = document.createElement("object");
  verified.data = "/assets/Twitter_Verified_Badge.svg";
  verified.type = "image/svg+xml";
  verified.width = 20;

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
  rssLink.href = "/rss-tweets.xml";
  rssLink.className = "rss-icon-link";

  const rssIcon = document.createElement("img");
  rssIcon.src = "/assets/rss.svg";
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
});

// Add click handler to all .zoomable images
document.addEventListener("click", (e) => {
  if (e.target.classList.contains("zoomable")) {
    overlayImg.src = e.target.src;
    overlay.style.display = "flex";
  }
});
