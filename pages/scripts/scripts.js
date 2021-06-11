const typingDiv = document.getElementById("typing");
const sourceDiv = document.getElementById("source")
const startGameBtn = document.getElementById("startGame");
const statsDiv = document.getElementById("stats-div");

// array of texts from database, in form {source: content}
const paragraphs = [];

// function to fetch text from backend
function getTexts() {
  fetch("https://cotype.herokuapp.com/api/text")
    .then((response) => response.json())
    // .then(data=>{ console.log(data); })
    .then((data) => setParagraphs(data))
    .catch((err) => alert(err));
}

// function to store fetched texts to paragraphs
function setParagraphs(arr) {
  for (i = 0; i < arr.length; i++) {
    paragraphs.push(arr[i]);
  }
}

// fetch texts on page load
window.onload = () => {
  getTexts();
};

// helper function to calculate word-per-minute
function wordsPerMinute(startTime, endTime, text) {
  const delta = endTime - startTime;
  const seconds = delta / 1000;
  const numberOfWords = text.split(" ").length;
  const wpm = (numberOfWords / seconds) * 60.0;
  // round the result to one decimal
  const result = Math.round((wpm + Number.EPSILON) * 10) / 10;
  return result;
}

function getAccuracy(total, stroke) {
  const data = (total / stroke) * 100;
  const result = Math.round((data + Number.EPSILON) * 10) / 10;
  return result;
}

// core typing game
const startGame = () => {
  statsDiv.classList.remove("flex");
  statsDiv.classList.add("hidden");
  startGameBtn.innerHTML = "Restart";
  typingDiv.innerHTML = "";

  // randomly choose text object from the database paragraphs
  const sets = paragraphs[parseInt(Math.random() * paragraphs.length)];
  const source = sets.Source
  const text = sets.Content

  // split texts into arrays of characters to iterate through each of the character
  const characters = text.split("").map((char) => {
    const span = document.createElement("span");
    span.innerText = char;
    typingDiv.appendChild(span);
    return span;
  });

  sourceDiv.innerText = "(" + source + ")" ;

  // start from the beginning
  let cursorIndex = 0;
  let cursorCharacter = characters[cursorIndex];
  cursorCharacter.classList.add("cursor");

  let startTime = null;
  const totalKeyStroke = characters.length;
  let keyStroke = 0;

  const keydown = ({ key }) => {
    if (!startTime) {
      // start timer when game starts
      startTime = new Date();
    }
    if (key == cursorCharacter.innerText) {
      // correct key is pressed
      cursorCharacter.classList.remove("cursor");
      cursorCharacter.classList.add("done");
      cursorCharacter = characters[++cursorIndex];
    }
    if (key !== "Shift") {
      keyStroke++;
    }
    if (cursorIndex >= characters.length) {
      // end game when no more characters
      const endTime = new Date();
      const wpm = wordsPerMinute(startTime, endTime, text);
      const accuracy = getAccuracy(totalKeyStroke, keyStroke);
      // display wpm
      document.getElementById("wpm").innerText = `${wpm}`;
      document.getElementById("wpmtext").innerText = `words per minute`;
      document.getElementById("accuracy").innerText = `${accuracy}%`;
      document.getElementById("accuracytext").innerText = `accuracy`;
      document.removeEventListener("keydown", keydown);
      // display start button
      statsDiv.classList.remove("hidden");
      statsDiv.classList.add("flex");
      startGameBtn.innerHTML = "Start Typing";
      return;
    }
    cursorCharacter.classList.add("cursor");
  };

  // wait for key pressed input
  document.addEventListener("keydown", keydown);
};

// to prevent space button scrolling down on click
window.addEventListener("keydown", function (e) {
  if (e.keyCode == 32 && e.target == document.body) {
    e.preventDefault();
  }
  if (e.keyCode == 13 && e.target == document.body) {
    // start game by pressing Enter
    startGame();
  }
});

// stop focusing startGame button after click
document.addEventListener("click", function (e) {
  if (document.activeElement.toString() == "[object HTMLButtonElement]") {
    document.activeElement.blur();
  }
});
