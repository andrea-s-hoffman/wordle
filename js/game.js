"use strict";

const guessFormContainer = document.querySelector(".guess-form-container");

const todaysSolution = "smile";

const finalResults = [];

const getDef = (word) => {
  const response = fetch(
    `https://dictionaryapi.com/api/v3/references/collegiate/json/${word}?key=ba34fa53-d819-4c69-b5a2-36b2cb31924e`
  )
    .then((res) => {
      return res.json();
    })
    .then((data) => {
      // console.log(data);
      if (data) {
        if (data[0]) {
          if (data[0].shortdef) {
            return true;
          } else {
            return false;
          }
        }
      }
    })
    .catch((err) => {
      console.log("error", err);
    });
  return response;
};

// getDef("hjhl").then((data) => {
//   console.log(data);
// });
// getDef("hello").then((data) => {
//   console.log(data);
// });

const wordle = (guess, solution) => {
  const lineResults = [];
  for (let i = 0; i < guess.length; i++) {
    if (solution[i] === guess[i].toLowerCase()) {
      lineResults.push("🟩");
    } else if (solution.includes(guess[i].toLowerCase())) {
      lineResults.push("🟨");
    } else {
      lineResults.push("⬛");
    }
  }
  finalResults.push(lineResults.join(""));
  if (guess.toLowerCase() === solution) {
    finalResults.unshift(`${finalResults.length}/6`);
    finalResults.unshift(`dre's wordle #1:`);
    alert(finalResults.join("\n"));
  }
  if (finalResults.length === 6 && guess !== solution) {
    finalResults.push(`better luck next time!`);
    finalResults.unshift(`word was: ${todaysSolution}`);
    finalResults.unshift(`dre's wordle #1:`);
    alert(finalResults.join("\n"));
  }
  return lineResults;
};

guessFormContainer.addEventListener("submit", (e) => {
  e.preventDefault();
  // console.dir(e.target);
  const guessInput = e.target[0];
  const guessInputValue = e.target[0].value;
  const guessLabel = e.target.firstElementChild;
  if (guessInputValue.length === 5) {
    if (e.target.classList.contains("form")) {
      getDef(guessInputValue).then((data) => {
        if (data) {
          e.target.nextElementSibling[0].disabled = false;
          e.target.nextElementSibling[0].focus();
          e.target.nextElementSibling[1].disabled = false;
          e.target.nextElementSibling[1].classList.remove("disabled");
          guessLabel.innerHTML = "";
          guessInput.remove();
          let response = wordle(guessInputValue, todaysSolution);
          if (response) {
            for (let i = 0; i < 5; i++) {
              const box = document.createElement("div");
              box.textContent = guessInputValue[i];
              if (response[i] === "🟩") {
                box.classList.add("green", "box");
                guessLabel.append(box);
              } else if (response[i] === "🟨") {
                box.classList.add("yellow", "box");
                guessLabel.append(box);
              } else {
                box.classList.add("black", "box");
                guessLabel.append(box);
              }
            }
          }
        } else {
          alert("not a word!");
        }
      });
    }
  } else {
    alert("please guess a 5 letter word");
  }
});
