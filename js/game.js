"use strict";

const guessFormContainer = document.querySelector(".guess-form-container");
const resultsDiv = document.querySelector(".results");
const resultsDivContainer = document.querySelector(".results-container");
const inputs = document.querySelectorAll("input");
const buttons = document.querySelectorAll("button");

const finalResults = [];

let wordleNumber;

let todaysSolution;

let gameEnd = false;

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
      // console.log(data);
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

const endGame = () => {
  const showResults = document.createElement("button");
  showResults.textContent = "my results";
  showResults.classList.add("show-results");
  document.querySelector("header").append(showResults);
  guessFormContainer.style.marginTop = "25px";
  window.addEventListener("click", (e) => {
    if (e.target.classList.contains("show-results")) {
      document.querySelector(".results-container").classList.remove("hide");
      document.querySelector(".guess-form-container").classList.add("hide");
    }
  });
  inputs.forEach((i) => {
    i.disabled = true;
  });
  buttons.forEach((b) => {
    b.disabled = true;
  });
  if (finalResults.length < 6) {
    buttons[finalResults.length - 1].classList.add("disabled");
  }
  guessFormContainer.removeEventListener("submit", submitHandler);
  resultsDiv.innerHTML = "";
  resultsDivContainer.classList.remove("hide");
  guessFormContainer.classList.add("hide");
  const textDiv = document.createElement("div");
  textDiv.classList.add("results-text");
  // const copyBtn = document.createElement("button");
  // copyBtn.textContent = "copy";
  // copyBtn.classList.add("copy");
  // copyBtn.addEventListener("click", (e) => {
  //   console.dir(e.target.previousElementSibling);
  //   e.target.textContent = "copied!";
  //   navigator.clipboard.writeText(e.target.previousElementSibling.innerText);
  //   console.log(e.target.previousElementSibling.innerText);
  // });
  // console.log(finalResults);
  finalResults.forEach((line, index) => {
    const newLine = document.createElement("p");
    newLine.textContent = line;
    newLine.style.textAlign = "center";
    if (index) {
      newLine.classList.add("box-result-p");
    } else {
      newLine.classList.add("box-result-p-space");
    }
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
const wordle = (input, solution) => {
  const guess = input.toLowerCase();
  const lineResults = [];
  const checked = [];
  for (let i = 0; i < guess.length; i++) {
    checked.push(guess[i]);
    if (solution[i] === guess[i]) {
      // let howManySolution = 0;
      // let howManyChecked = 0;

      // solution.split("").forEach((letter) => {
      //   if (guess[i] === letter) {
      //     howManySolution++;
      //   }
      // });
      // checked.forEach((letter) => {
      //   if (guess[i] === letter) {
      //     howManyChecked++;
      //   }
      // });
      // console.log(
      //   "equals one",
      //   guess[i],
      //   "solution:",
      //   howManySolution,
      //   "checked",
      //   howManyChecked
      // );
      // if (howManyChecked <= howManySolution) {
      lineResults.push("🟩");
      // } else {
      //   lineResults.push("⬛");
      // }
    } else if (solution.includes(guess[i])) {
      let howManySolution = 0;
      let howManyChecked = 0;
      solution.split("").forEach((letter) => {
        if (guess[i] === letter) {
          howManySolution++;
        }
      });
      checked.forEach((letter) => {
        if (guess[i] === letter) {
          howManyChecked++;
        }
      });
      console.log(
        "includes one",
        guess[i],
        "solution:",
        howManySolution,
        "checked",
        howManyChecked
      );
      if (howManyChecked <= howManySolution) {
        // console.log(guess[i]);
        let isThereAnotherGuessedOfTheSameLetterThatWillBeGreen = false;
        for (let j = 0; j < solution.length; j++) {
          if (guess[j] === solution[j] && guess[j] === guess[i]) {
            // console.log("test", guess[i]);
            isThereAnotherGuessedOfTheSameLetterThatWillBeGreen = true;
          }
        }
        if (isThereAnotherGuessedOfTheSameLetterThatWillBeGreen) {
          lineResults.push("⬛");
        } else {
          lineResults.push("🟨");
        }
      } else {
        lineResults.push("⬛");
      }
    } else {
      lineResults.push("⬛");
    }
  }
  finalResults.push(lineResults.join(""));
  if (guess.toLowerCase() === solution) {
    gameEnd = true;

    finalResults.unshift(
      `dre's wordle #${wordleNumber + 1}: ${finalResults.length}/6`
    );
    endGame();
  }
  if (finalResults.length === 6 && guess !== solution) {
    gameEnd = true;

    finalResults.push(`better luck next time!`);
    finalResults.unshift(`dre's wordle #${wordleNumber + 1}:   x/6`);
    endGame();
  }
  return lineResults;
};

const submitHandler = (e) => {
  e.preventDefault();
  const guessInput = e.target[0];
  const guessInputValue = e.target[0].value;
  const guessLabel = e.target.firstElementChild;
  if (guessInputValue.length === 5) {
    if (e.target.classList.contains("form")) {
      getDef(guessInputValue).then((data) => {
        if (data) {
          if (!e.target.classList.contains("six") && !gameEnd) {
            e.target.nextElementSibling[0].disabled = false;
            e.target.nextElementSibling[0].focus();
            e.target.nextElementSibling[1].disabled = false;
            e.target.nextElementSibling[1].classList.remove("disabled");
          }
          guessLabel.innerHTML = "";
          guessInput.remove();
          e.target.childNodes[4].disabled = true;
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
};
guessFormContainer.addEventListener("submit", submitHandler);
