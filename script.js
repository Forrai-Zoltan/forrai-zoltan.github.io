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

main.style.minHeight = `${viewportHeight - headerHeight - 23}px`;

window.addEventListener("resize", () => {
  const viewportHeight = window.innerHeight;
  const header = document.querySelector("header");
  const headerHeight = header.offsetHeight;
  main.style.minHeight = `${viewportHeight - headerHeight - 23}px`;
});

//SECRET GAME PASSWORD
const riddlePassword = document.getElementById("riddle-password");
const feedback = document.getElementById("secret-feedback");
const responses = [
  "Nice try...",
  "Incorrect...",
  "Not quite...",
  "Wrong password...",
  "Clue: look harder!",
  "The aswer is: gullible",
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
}

riddlePassword.addEventListener("input", function () {
  if (riddlePassword.value.trim() === "") {
    feedback.style.visibility = "hidden";
  }
});
