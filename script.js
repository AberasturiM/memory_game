const gameContainer = document.querySelector(".game");
let card1 = null;
let card2 = null;
let score = 0;
let matched = 0;
let lowScore = localStorage.getItem("lowScore");
let updateScore = document.querySelector("#score");
let updateLowScore = document.querySelector("#lowscore");
let updateMessage = document.querySelector("#message");
let resetGame = document.querySelector("#reset");
updateLowScore.textContent = lowScore;

const COLORS = [
  "red",
  "blue",
  "green",
  "orange",
  "purple",
  "red",
  "blue",
  "green",
  "orange",
  "purple",
];

// shuffle function
function shuffle(array) {
  let counter = array.length;
  while (counter > 0) {
    let index = Math.floor(Math.random() * counter);
    counter--;
    let temp = array[counter];
    array[counter] = array[index];
    array[index] = temp;
  }
  return array;
}

let shuffledColors = shuffle(COLORS);

// function for creating divs when page loads
function createDivsForColors(colorArray) {
  for (let color of colorArray) {
    const newDiv = document.createElement("div");
    newDiv.classList.add(color);
    newDiv.addEventListener("click", handleCardClick);
    gameContainer.append(newDiv);
  }
}
// event handler for createDivsForColors function
function handleCardClick(e) {
  // if card1 and card2 are truthy, exit to avoid too many clicks
  if (card1 && card2) {
    return;
  }
  // if the clicked card is already matched, exit
  if (e.target.classList.contains("matched")) {
    updateMessage.textContent = "You already matched that card.";
    return;
  }
  // exit to avoid clicking on the same card twice
  if (e.target.classList.contains("flipped")) {
    updateMessage.textContent = "Pick a different card.";
    return;
  }
  // assign the clicked card to currentCard, add class 'flipped', and update score
  let currentCard = e.target;
  currentCard.classList.add("flipped");
  score++;
  updateScore.textContent = score;
  // assign currentCard to card1 if null and add inline style
  if (card1 === null) {
    card1 = currentCard;
    currentCard.style.backgroundColor = currentCard.classList[0];
    // assign currentCard to card2 if null adn add inline style
  } else if (card2 === null) {
    card2 = currentCard;
    currentCard.style.backgroundColor = currentCard.classList[0];
  }
  // if both card1 and card2 are truthy, check if they have the same class name
  if (card1 && card2) {
    // if they do, change className to 'matched' and set to null
    if (card1.className === card2.className) {
      card1.className = "matched";
      card2.className = "matched";
      card1 = null;
      card2 = null;
      matched += 2;
      updateMessage.textContent = "A match!";
      if (matched === shuffledColors.length) {
        if (lowScore === null || score < lowScore) {
          lowScore = score;
        }
        matched = 0;
        localStorage.setItem("lowScore", lowScore);
        updateLowScore.textContent = lowScore;
        updateMessage.textContent = "You win!!!";
      }
      // if not a match, reset backgroundColor with timeout function set for 1 sec, remove flipped class, and reset to null
    } else {
      setTimeout(function () {
        card1.style.backgroundColor = "";
        card2.style.backgroundColor = "";
        card1.classList.remove("flipped");
        card2.classList.remove("flipped");
        card1 = null;
        card2 = null;
      }, 1000);
      updateMessage.textContent = "Try again";
    }
  }
}

// when the DOM loads
createDivsForColors(shuffledColors);

// reset button
resetGame.addEventListener("click", function () {
  gameContainer.innerHTML = "";
  shuffledColors = shuffle(COLORS);
  createDivsForColors(shuffledColors);
  score = 0;
  updateScore.textContent = score;
  updateMessage.textContent = "Pick a pair of cards";
});
