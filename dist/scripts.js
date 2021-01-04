"use strict";

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _iterableToArray(iter) { if (typeof Symbol !== "undefined" && Symbol.iterator in Object(iter)) return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) return _arrayLikeToArray(arr); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

// DOM Selection
var tableEl = document.getElementById('tableCards');
var playerEl = document.getElementById('playerCards');
var computerEl = document.getElementById('computerCards');
var playerScoreEl = document.getElementById('playerScore');
var computerScoreEl = document.getElementById('computerScore');
var roundEl = document.getElementById('round');
var turnEl = document.getElementById('turn');
var nameEl = document.getElementById('playerName');
var nameInputEl = document.getElementById('input-name');
var resultEl = document.getElementById('result-modal');
var msgEl = document.getElementById('result-msg');
var newGameEl = document.getElementById('again');
var splashBtnEl = document.getElementById('play');
var splashEl = document.getElementById('splash');
var gameEl = document.getElementById('gameSet'); // Global variables

var tableCardsArr = [],
    playerCardsArr = [],
    computerCardsArr = [],
    cards = [],
    computerScore = 0,
    playerScore = 0;
var clicksActive = true,
    gameIsOn = true;
splashBtnEl.addEventListener('click', function () {
  if (nameInputEl.value) {
    nameEl.textContent = nameInputEl.value;
  } else {
    nameEl.textContent = "you";
  }

  splashEl.style.display = "none";
  gameEl.style.display = "block";
  newGame();
});
newGameEl.addEventListener('click', newGame);

function newGame() {
  // game start setup 
  resultEl.style.display = "none";
  tableEl.innerHTML = "";
  playerEl.innerHTML = "";
  computerEl.innerHTML = "";
  tableCardsArr = [], playerCardsArr = [], computerCardsArr = [], computerScore = 0, playerScore = 0;
  playerScoreEl.textContent = 0;
  computerScoreEl.textContent = 0;
  roundEl.textContent = 1;
  turnEl.textContent = 1;
  gameIsOn = true;
  clicksActive = true;
  cards = createCardObjs();
  getFourCards(cards, {
    el: tableEl,
    arr: tableCardsArr
  });
  getFourCards(cards, {
    el: playerEl,
    arr: playerCardsArr
  });
  getFourCards(cards, {
    el: computerEl,
    arr: computerCardsArr
  });
}

;

function gameLogicStart(cardPlayedObj, playerObj) {
  if (playerObj.playerNo == 2) {
    turnEl.textContent = 2;
    computerEl.children[playerObj.index].setAttribute("src", cardPlayedObj.src);
    sleep(2000).then(function () {
      gameLogicSub(playerObj, cardPlayedObj);
    });
  } else {
    gameLogicSub(playerObj, cardPlayedObj);
    simulateComputerTurn();
  }
}

function gameLogicSub(playerObj, cardPlayedObj) {
  var test = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;
  // calculate score
  var score = 0;

  if ((cardPlayedObj.value == "jack" || cardPlayedObj.joker) && tableCardsArr.length) {
    score += tableCardsArr.length;

    if (cardPlayedObj.joker) {
      score += 9; // or 10
    }
  } else {
    var tableCardValues = [];
    tableCardsArr.forEach(function (card) {
      return tableCardValues.push(card.value);
    });
    var tableCardsCombs = getCombinations(tableCardValues);
    tableCardsCombs.forEach(function (comb) {
      var sum = 0;

      if (comb.length == 1) {
        sum = comb[0];
      } else {
        comb.forEach(function (val) {
          return sum += val;
        });
      }

      if (sum == cardPlayedObj.value) {
        comb.forEach(function (combSingle) {
          score++;
          var idx = tableCardValues.indexOf(combSingle);
          tableCardValues.splice(idx, 1);
        });
      }
    });
    if (score > 0 && !tableCardValues.length) score += 9; // or 10

    console.log(score);
  } // modify DOM and card Arrays


  if (test) {
    return score;
  } else {
    var playedImgEl = document.querySelector("img[src=\"".concat(cardPlayedObj.src, "\"]"));
    tableEl.appendChild(playedImgEl);

    if ((cardPlayedObj.value == "jack" || cardPlayedObj.joker) && tableCardsArr.length) {
      tableCardsArr.splice(0);
      var tableImgs = document.querySelectorAll('#tableCards img');
      tableImgs.forEach(function (elm) {
        elm.style.border = "2px solid red";
      });
      sleep(2000).then(function () {
        tableEl.innerHTML = "";
      });
    } else {
      var _tableCardValues = [];
      tableCardsArr.forEach(function (card) {
        return _tableCardValues.push(card.value);
      });

      var _tableCardsCombs = getCombinations(_tableCardValues);

      _tableCardsCombs.forEach(function (comb) {
        var sum = 0;

        if (comb.length == 1) {
          sum = comb[0];
        } else {
          comb.forEach(function (val) {
            return sum += val;
          });
        }

        if (sum == cardPlayedObj.value) {
          comb.forEach(function (combSingle) {
            var idx = getByValue(tableCardsArr, combSingle);
            console.log("img[src=\"".concat(tableCardsArr[idx].src, "\"]"));
            var combImg = document.querySelector("img[src=\"".concat(tableCardsArr[idx].src, "\"]"));
            tableCardsArr.splice(idx, 1);
            combImg.style.border = "2px solid red";
            sleep(2000).then(function () {
              combImg.remove();
            });
          });
        }
      });
    }

    var splicedCard = playerObj.cardsArr.splice(playerObj.index, 1);

    if (score > 0) {
      playedImgEl.style.border = "2px solid red";
      playerObj.scoreEl.textContent = parseInt(playerObj.scoreEl.textContent) + score + 1;
      sleep(2000).then(function () {
        playedImgEl.remove();
      });
    } else {
      var _tableCardsArr;

      (_tableCardsArr = tableCardsArr).push.apply(_tableCardsArr, _toConsumableArray(splicedCard));
    }

    console.log(playerObj.scoreEl.textContent);

    if (playerObj.scoreEl.textContent > 26) {
      gameEnd();
    }

    if (playerObj.playerNo == 2) {
      sleep(1000).then(function () {
        clicksActive = true;
        turnEl.textContent = 1;
        if (!computerCardsArr.length && gameIsOn) if (cards.length > 0) {
          roundEl.textContent = parseInt(roundEl.textContent) + 1;
          getFourCards(cards, {
            el: playerEl,
            arr: playerCardsArr
          });
          getFourCards(cards, {
            el: computerEl,
            arr: computerCardsArr
          });
          console.log(computerCardsArr);
        } else {
          gameEnd();
        }
      });
    }
  }
}

function evaluatePlayerClick(e) {
  // return the object of the card the player clicked and its index in the playerCardsArr as  parameters for gameLogicStart function
  if (clicksActive) {
    clicksActive = false;
    var clickTarget = e.target.getAttribute('src');
    playerCardsArr.forEach(function (card, idx) {
      if (card.src == clickTarget) {
        var playerObj = {
          index: idx,
          scoreEl: playerScoreEl,
          cardsArr: playerCardsArr,
          playerNo: 1
        };
        gameLogicStart(card, playerObj);
      }
    });
  }
}

function simulateComputerTurn() {
  var chosenCard = {
    score: 0,
    idx: 0
  };
  var playerObj;
  computerCardsArr.forEach(function (cardObj, idx) {
    var newscore = gameLogicSub(cardObj, cardObj, true);

    if (newscore > chosenCard.score) {
      chosenCard.score = newscore;
      chosenCard.idx = idx;
    }
  });

  if (chosenCard.score) {
    playerObj = {
      index: chosenCard.idx,
      scoreEl: computerScoreEl,
      cardsArr: computerCardsArr,
      playerNo: 2
    };
  } else {
    // check if computer has cards other than jacks or the jocker
    var noWasteActive = false;
    computerCardsArr.forEach(function (cardObj) {
      if (cardObj.value != "jack" && !cardObj.jocker) {
        noWasteActive = true;
      }
    });
    var rndCardIdx; // do ... while loop to prevent wasting jacks and the jocker on empty decks unless all its cards are jacks or the jocker

    do {
      rndCardIdx = Math.floor(computerCardsArr.length * Math.random());
    } while ((computerCardsArr[rndCardIdx].value == "jack" || computerCardsArr[rndCardIdx].jocker) && computerCardsArr.length > 1 && noWasteActive);

    playerObj = {
      index: rndCardIdx,
      scoreEl: computerScoreEl,
      cardsArr: computerCardsArr,
      playerNo: 2
    };
  }

  sleep(2000).then(function () {
    if (gameIsOn) gameLogicStart(computerCardsArr[playerObj.index], playerObj);
  });
}

function gameEnd() {
  // game ends here
  gameIsOn = false;
  clicksActive = false;
  resultEl.style.display = "block";
  var playerFinalScore = parseInt(playerScoreEl.textContent);
  var computerFinalScore = parseInt(computerScoreEl.textContent);

  if (playerFinalScore > computerFinalScore) {
    msgEl.textContent = "Congratulation, You Won";
  } else if (playerFinalScore < computerFinalScore) {
    msgEl.textContent = "You lost, Try again";
  } else {
    msgEl.textContent = "It's a draw, Try again";
  }
}

function getCombinations(array) {
  function fork(i, t) {
    if (i === array.length) {
      result.push(t);
      return;
    }

    fork(i + 1, t.concat([array[i]]));
    fork(i + 1, t);
  }

  var result = [];
  fork(0, []);
  result.sort(function (a, b) {
    return b.length - a.length;
  });
  return result;
}

function getFourCards(cardsArr, targetObj) {
  var rndCardIdx = Math.floor(cardsArr.length * Math.random());

  if (targetObj.el == tableEl) {
    while (cardsArr[rndCardIdx].value == "jack") {
      rndCardIdx = Math.floor(cardsArr.length * Math.random());
    }
  }

  targetObj.arr.push(cardsArr[rndCardIdx]);
  createImg(cardsArr[rndCardIdx], targetObj.el);
  cardsArr.splice(rndCardIdx, 1);

  if (targetObj.arr.length < 4) {
    getFourCards(cardsArr, targetObj);
  }
}

function createImg(obj, el) {
  var imgEl = document.createElement('img');
  if (el == computerEl) imgEl.src = 'images/facedown.png';else imgEl.src = obj.src;

  if (el == playerEl) {
    imgEl.addEventListener("click", evaluatePlayerClick);
  }

  el.appendChild(imgEl);
}

function createCardObjs() {
  var cards = [];
  var values = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 'jack', 'queen', 'king'];
  var shapes = ['hearts', 'spades', 'diamonds', 'clubs'];
  values.forEach(function (val) {
    shapes.forEach(function (shp) {
      var card = {
        value: val,
        shape: shp,
        src: "images/".concat(val, "_of_").concat(shp, ".png")
      };

      if (card.value == 7 && card.shape == 'diamonds') {
        card.joker = true;
      }

      cards.push(card);
    });
  });
  return cards;
}

function sleep(ms) {
  return new Promise(function (resolve) {
    return setTimeout(resolve, ms);
  });
}

function getByValue(arr, val) {
  // find index of an object in an array by property (value property) 
  for (var i = 0, iLen = arr.length; i < iLen; i++) {
    if (arr[i].value == val) return i;
  }
}