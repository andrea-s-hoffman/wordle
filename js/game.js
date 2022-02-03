"use strict";

const guessForm = document.querySelector(".guess-form");

const todaysSolution = "smile";

const finalResults = [];

const wordle = (guess, solution) => {
  const response = [];
  const lineResults = [];
  for (let i = 0; i < guess.length; i++) {
    if (solution[i] === guess[i].toLowerCase()) {
      response.push("G");
      lineResults.push("🟩");
    } else if (solution.includes(guess[i].toLowerCase())) {
      response.push("Y");
      lineResults.push("🟨");
    } else {
      response.push("B");
      lineResults.push("⬛");
    }
  }
  finalResults.push(lineResults.join(""));
  if (guess.toLowerCase() === solution) {
    finalResults.unshift(`${finalResults.length}/6`);
    finalResults.unshift(`dre's wordle #1:`);
    alert(finalResults.join("\n"));
    console.log(finalResults);
  }
  if (finalResults.length === 6 && guess !== solution) {
    finalResults.push(`better luck next time!`);
    finalResults.unshift(`word was: ${todaysSolution}`);
    finalResults.unshift(`dre's wordle #1:`);
    alert(finalResults.join("\n"));
  }
  return response;
};
// console.log(wordle("apple", todaysSolution));
// console.log(wordle("bread", todaysSolution));

guessForm.addEventListener("click", (e) => {
  const guessInput = e.target.previousElementSibling;
  const guessInputValue = e.target.previousElementSibling.value;
  const guessLabel = guessInput.previousElementSibling;
  if (e.target.classList.contains("check")) {
    guessLabel.innerHTML = "";
    guessInput.remove();
    let response = wordle(guessInputValue, todaysSolution);
    for (let i = 0; i < 5; i++) {
      const box = document.createElement("div");
      box.textContent = guessInputValue[i];
      if (response[i] === "G") {
        box.classList.add("green", "box");
        guessLabel.append(box);
      } else if (response[i] === "Y") {
        box.classList.add("yellow", "box");
        guessLabel.append(box);
      } else {
        box.classList.add("black", "box");
        guessLabel.append(box);
      }
    }
  }
});
