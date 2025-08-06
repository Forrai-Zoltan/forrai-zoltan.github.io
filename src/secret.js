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
