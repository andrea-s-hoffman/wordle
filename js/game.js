"use strict";

const guessFormContainer = document.querySelector(".guess-form-container");
const resultsDiv = document.querySelector(".results");
const resultsDivContainer = document.querySelector(".results-container");

const finalResults = [];

let wordleNumber;

let todaysSolution;

const getWordleNumber = () => {
  // one day is 86400000 ms
  // 1644001201378 feb 4 at 2pm
  // 223200000 62 hours
  const startTime = 1643778001378;
  // ^^ feb 2 at 12am apparently
  const date = new Date();
  const time = date.getTime();
  const daysSpanned = Math.floor((time - startTime) / 86400000);
  wordleNumber = daysSpanned;
};

getWordleNumber();

const getWordle = async () => {
  await fetch(
    `https://us-central1-wordle-8c67e.cloudfunctions.net/api/dres-wordle`
  )
    .then((response) => response.json())
    .then((data) => {
      todaysSolution = data[wordleNumber].wordle;
      // console.log(todaysSolution);
    });
};

getWordle();

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

const endGame = () => {
  resultsDiv.innerHTML = "";
  resultsDivContainer.classList.remove("hide");
  guessFormContainer.classList.add("hide");
  const textDiv = document.createElement("div");
  textDiv.classList.add("results-text");
  const copyBtn = document.createElement("button");
  copyBtn.textContent = "copy";
  copyBtn.classList.add("copy");
  copyBtn.addEventListener("click", (e) => {
    // console.dir(e.target.previousElementSibling);
    e.target.textContent = "copied!";
    navigator.clipboard.writeText(e.target.previousElementSibling.innerText);
    // console.log(e.target.previousElementSibling.innerText);
  });
  finalResults.forEach((line) => {
    const newLine = document.createElement("p");
    newLine.textContent = line;
    newLine.style.textAlign = "center";
    textDiv.append(newLine);
  });
  const closeBtn = document.createElement("p");
  closeBtn.textContent = "close";
  closeBtn.classList.add("close-results");
  resultsDiv.append(textDiv);
  // resultsDiv.append(copyBtn);
  resultsDiv.append(closeBtn);
  closeBtn.addEventListener("click", () => {
    resultsDivContainer.classList.add("hide");
    guessFormContainer.classList.remove("hide");
  });
};

const wordle = (guess, solution) => {
  const lineResults = [];
  const checked = [];
  for (let i = 0; i < guess.length; i++) {
    checked.push(guess[i]);
    if (solution[i] === guess[i].toLowerCase()) {
      lineResults.push("🟩");
    } else if (solution.includes(guess[i].toLowerCase())) {
      let howManySolution = 0;
      let howManyChecked = 0;
      solution.split("").forEach((letter) => {
        if (guess.includes(letter)) {
          howManySolution++;
        }
      });
      checked.forEach((letter) => {
        if (guess.includes(letter)) {
          howManyChecked++;
        }
      });
      if (howManyChecked < howManySolution) {
        lineResults.push("🟨");
      } else {
        lineResults.push("⬛");
      }
    } else {
      lineResults.push("⬛");
    }
  }
  finalResults.push(lineResults.join(""));
  if (guess.toLowerCase() === solution) {
    finalResults.unshift(`${finalResults.length}/6`);
    finalResults.unshift(`dre's wordle #${wordleNumber}:`);
    endGame();
  }
  if (finalResults.length === 6 && guess !== solution) {
    finalResults.push(`better luck next time!`);
    finalResults.unshift(`word was: ${todaysSolution}`);
    finalResults.unshift(`dre's wordle #${wordleNumber}:`);
    endGame();
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
          if (!e.target.classList.contains("six")) {
            e.target.nextElementSibling[0].disabled = false;
            e.target.nextElementSibling[0].focus();
            e.target.nextElementSibling[1].disabled = false;
            e.target.nextElementSibling[1].classList.remove("disabled");
          }
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
