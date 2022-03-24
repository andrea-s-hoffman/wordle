"use strict";

const guessFormContainer = document.querySelector(".guess-form-container");
const resultsDiv = document.querySelector(".results");
const resultsDivContainer = document.querySelector(".results-container");
const inputs = document.querySelectorAll("input");
const buttons = document.querySelectorAll("button");

const creedThoughts = [
  ,
  `Just pretend like we’re talking until the cops leave.`,
  `I’ve been involved in a number of cults, both as a leader and a follower. You have more fun as a follower, but you make more money as a leader.`,
  `I’ve never owned a refrigerator before.`,
  `Cool beans, man! I live by the quarry. We should hang out by the quarry and throw things down there.`,
  `Nobody steals from Creed Bratton and gets away with it. The last person to do this disappeared. His name is Creed Bratton.`,
  `The Taliban’s the worst. Great Heroin, though.`,
  `You ever see a guy with four toes?`,
  `A lot of jazz cats are blind. But they can play the piano like nobody’s business. I’d like to put the piano in front of Pam, without her glasses, and see what happens. I’d also like to see her topless.`,
  `Creed Bratton has never declared bankruptcy. When Creed Bratton gets into trouble, he transfers his debt to William Charles Schneider.`,
  `I’m a pretty normal guy. I do one weird thing. I like to go in the women’s room for number two. I’ve been caught several times, and I have paid dearly.`,
  `When Pam gets Michael’s old chair, I get Pam’s old chair. Then I’ll have two chairs. Only one more to go.`,
  `The only difference between me and a homeless man is this job. I will do whatever it takes to survive, just like I did when I was a homeless man.`,
  `I run a small fake I.D. company from my car with a laminating machine that I swiped from the sheriff’s station.`,
  `Have you ever noticed you can only ooze two things? Sexuality and pus. Man, I tell ya.`,
  `Did one of you tell Stanley that I have asthma? Cause I don’t. If this gets out, they won’t let me scuba. And if I can’t scuba, what am I working towards?`,
  `A beautiful morning at Dunder Mifflin, or like I like to call it, Great Bratton.`,
  `Guys, I’m starting to think Pam’s not even pregnant.`,
  `I am not offended by homosexuality. In the sixties, I made love to many, many, many women, often outdoors in the mud and the rain. It’s possible a man could’ve slipped in there. There would be no way of knowing.`,
  `He’s been trashing us relentlessly on Twitter. Now it’s funny stuff, but mean.`,
  `I already won the lottery. I was born in the US of A baby! And as a backup, I have a Swiss passport.`,
  `You know a human can go on living for several hours after being decapitated.`,
  `Hey, brah. I have been meaning to ask you. Can we get some Red Bull for these things? Sometimes your guy’s gotta rude the bull. Later skater.`,
  `It’s Halloween? That is really, really good timing.`,
  `If my parents see this, I’m toast.`,
  `That is Northern Lights Cannabis Indica,`,
  `Darnell’s a chump. Andrea’s the office bitch; you’ll get used to her. Which one is Pam? Have I ever steered you wrong Jim? (to Andy). Goodnight, Mary-Beth.`,
  `You deal with this, or you, me Sammy, Phyllis, the chick you hit with the car…we’re goners.`,
  `I sprout mung beans on a damp paper towel in my desk drawer. Very nutritious, but they smell like death.`,
  `Jinx, buy me some coke.`,
  `A wheel wants to spin, Pam.`,
  `It’s Creed. FYI I’m starting my own paper company looking to poach some chumps. You in?
, Let’s keep this on the QT, okay? I want to be a dead mama JAMA.`,
  `Two eyes, two ears, a chin, a mouth, 10 fingers, two nipples, a butt, two kneecaps, a penis. I have just described to you the Lochness Monster and the reward for its capture…all the riches in Scotland. So I have one question, why are you her?`,
  `My tombstone has been already made, thank you.`,
  `I vant to sell your blood.`,
  `Be cool, Michael. I saw this guy kill a bunch of people.`,
  `All right, all right. Say no more. So, this is how I got Squeaky Fromme. No small talk. Just show her who’s the boss. Just go right in and kiss her.`,
  `What’s a text?`,
  `The ball’s on you, man.`,
  `It’s pronounced Ker-nell. It’s the highest rank in the army.`,
  `I can bring these to my shelter.`,
  `What is wrong with this woman? She’s asking about stuff that’s nobody’s business. What do I do? Really, what do I do here? I should’ve written it down. Qua something, uh…qua…quar…quibo, qual…quir-qubity. Uabity assurance! No, no, no, no, no, but I’m getting close.`,
  `You’re over 40; that’s the cut-off. Are you listening to what he’s saying? Re-training. New system. Youth. I’m telling you, this kid is the grim reaper.`,
  `Was any of this real?`,
];

const getCreedThought = () => {
  return creedThoughts[Math.floor(Math.random() * creedThoughts.length)];
};

const finalResults = [];

let wordleNumber;

let todaysSolution;

let gameEnd = false;

document.querySelector("#guess1").focus();

const getWordleNumber = () => {
  // one day is 86400000 ms
  // 1644001201378 feb 4 at 2pm
  // 223200000 62 hours
  const startTime = 1643778001378;
  // ^^ feb 2 at 12am apparently
  const date = new Date();
  const time = date.getTime();
  const daysSpanned = Math.floor((time - startTime) / 86400000);
  // console.log(daysSpanned);
  wordleNumber = daysSpanned;
};

getWordleNumber();

const getWordle = async () => {
  await fetch(
    `https://us-central1-wordle-8c67e.cloudfunctions.net/api/dres-wordle`
  )
    .then((response) => response.json())
    .then((data) => {
      data.sort((a, b) => a.index - b.index);
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
  const creedThoughtP = document.createElement("p");
  const creedThoughtH = document.createElement("p");
  creedThoughtH.classList.add("creed-thought-h");
  creedThoughtP.classList.add("creed-thought-p");
  creedThoughtH.textContent = `Creed Thought of the day:`;
  creedThoughtP.textContent = `"${getCreedThought()}"`;

  textDiv.append(creedThoughtH, creedThoughtP);
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
      lineResults.push("💚");
      // } else {
      //   lineResults.push("⚫️");
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
          lineResults.push("⚫️");
        } else {
          lineResults.push("🟡");
        }
      } else {
        lineResults.push("⚫️");
      }
    } else {
      lineResults.push("⚫️");
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

    finalResults.push(`word was: ${todaysSolution}`);
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
              if (response[i] === "💚") {
                box.classList.add("green", "box");
                guessLabel.append(box);
              } else if (response[i] === "🟡") {
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
