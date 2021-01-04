// DOM Selection
const tableEl = document.getElementById('tableCards');
const playerEl = document.getElementById('playerCards');
const computerEl = document.getElementById('computerCards');
const playerScoreEl = document.getElementById('playerScore');
const computerScoreEl = document.getElementById('computerScore');
const roundEl = document.getElementById('round');
const turnEl = document.getElementById('turn');
const nameEl = document.getElementById('playerName');
const nameInputEl = document.getElementById('input-name');
const resultEl = document.getElementById('result-modal');
const msgEl = document.getElementById('result-msg');
const newGameEl = document.getElementById('again');
const splashBtnEl = document.getElementById('play');
const splashEl = document.getElementById('splash');
const gameEl = document.getElementById('gameSet');

// Global variables
let tableCardsArr = [], playerCardsArr = [], computerCardsArr = [], cards = [], computerScore = 0, playerScore = 0;
let clicksActive = true, gameIsOn = true;

splashBtnEl.addEventListener('click', () => {
	if(nameInputEl.value){
		nameEl.textContent = nameInputEl.value;
	} else {
		nameEl.textContent = "you";
	}
	splashEl.style.display = "none";
	gameEl.style.display = "block";
	newGame();
});

newGameEl.addEventListener('click', newGame);
function newGame(){
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
	clicksActive = true
	cards = createCardObjs();
	getFourCards(cards, {el: tableEl, arr: tableCardsArr});
	getFourCards(cards, {el: playerEl, arr: playerCardsArr});
	getFourCards(cards, {el: computerEl, arr: computerCardsArr});
};

function gameLogicStart(cardPlayedObj, playerObj){
	if (playerObj.playerNo == 2) {
		turnEl.textContent = 2;
		computerEl.children[playerObj.index].setAttribute("src", cardPlayedObj.src);
		sleep(2000).then(() => {
			gameLogicSub(playerObj, cardPlayedObj);
		});
	} else {
		gameLogicSub(playerObj, cardPlayedObj);
		simulateComputerTurn();
	}
}
function gameLogicSub(playerObj, cardPlayedObj, test = false){
	// calculate score
	let score = 0;
	if((cardPlayedObj.value == "jack" || cardPlayedObj.joker) && tableCardsArr.length) {
		score += tableCardsArr.length;
		if(cardPlayedObj.joker){
			score += 9; // or 10
		}
	} else {
		let tableCardValues = [];
		tableCardsArr.forEach((card) => tableCardValues.push(card.value));
		const tableCardsCombs = getCombinations(tableCardValues);
		tableCardsCombs.forEach((comb) => {
			let sum = 0;
			if(comb.length == 1){
				sum = comb[0];
			} else {
				comb.forEach((val) => sum += val);
			}
			if(sum == cardPlayedObj.value) {
				comb.forEach((combSingle) => {
					score++;
					const idx = tableCardValues.indexOf(combSingle);
					tableCardValues.splice(idx,1);
				});
			}
		});
		if(score>0 && !tableCardValues.length) score += 9; // or 10
		console.log(score)
	}
	// modify DOM and card Arrays
	if(test){
		return score;
	}else{
		const playedImgEl =  document.querySelector(`img[src="${cardPlayedObj.src}"]`);
		tableEl.appendChild(playedImgEl);
		if((cardPlayedObj.value == "jack" || cardPlayedObj.joker) && tableCardsArr.length) {
			tableCardsArr.splice(0);
			const tableImgs = document.querySelectorAll('#tableCards img')
			tableImgs.forEach((elm)=>{
				elm.style.border = "2px solid red";
			});
			sleep(2000).then(() => {
				tableEl.innerHTML = "";
			});
		} else {
			let tableCardValues = [];
			tableCardsArr.forEach((card) => tableCardValues.push(card.value));
			const tableCardsCombs = getCombinations(tableCardValues);
			tableCardsCombs.forEach((comb) => {
				let sum = 0;
				if(comb.length == 1){
					sum = comb[0];
				} else {
					comb.forEach((val) => sum += val);
				}
				if(sum == cardPlayedObj.value) {
					comb.forEach((combSingle) => {
						const idx = getByValue(tableCardsArr, combSingle);
						console.log(`img[src="${tableCardsArr[idx].src}"]`)
						const combImg = document.querySelector(`img[src="${tableCardsArr[idx].src}"]`);
						tableCardsArr.splice(idx,1);
						combImg.style.border = "2px solid red";
						sleep(2000).then(() => {
							combImg.remove();
						});
					});
				}
			});
		}
		const splicedCard = playerObj.cardsArr.splice(playerObj.index,1);
		if(score>0) {
			playedImgEl.style.border="2px solid red";
			playerObj.scoreEl.textContent = parseInt(playerObj.scoreEl.textContent) + score +1;
			sleep(2000).then(() => {
				playedImgEl.remove();
			});
		} else {
			tableCardsArr.push(...splicedCard)
		}
		console.log(playerObj.scoreEl.textContent)
		if(playerObj.scoreEl.textContent > 26) {
			gameEnd();
		}
		if(playerObj.playerNo == 2) {
			sleep(1000).then(() => {
				clicksActive = true;
				turnEl.textContent = 1;
				if(!computerCardsArr.length && gameIsOn)
					if(cards.length > 0){
						roundEl.textContent = parseInt(roundEl.textContent) + 1;
						getFourCards(cards, {el: playerEl, arr: playerCardsArr});
						getFourCards(cards, {el: computerEl, arr: computerCardsArr});
						console.log(computerCardsArr)
					} else {
					gameEnd();
				}
			});
		}
	}
}
function evaluatePlayerClick(e){
	// return the object of the card the player clicked and its index in the playerCardsArr as  parameters for gameLogicStart function
	if(clicksActive){
		clicksActive = false;
		const clickTarget = e.target.getAttribute('src');
		playerCardsArr.forEach((card, idx) => {
			if(card.src == clickTarget){
				const playerObj = {
					index: idx,
					scoreEl: playerScoreEl,
					cardsArr: playerCardsArr,
					playerNo: 1
				}
				gameLogicStart(card, playerObj);
			}
		});
	}
}
function simulateComputerTurn(){
	let chosenCard = {
		score: 0,
		idx: 0
	}
	let playerObj;
	computerCardsArr.forEach((cardObj, idx) => {
		let newscore = gameLogicSub(cardObj, cardObj, true);
		if(newscore> chosenCard.score) {
			chosenCard.score = newscore;
			chosenCard.idx = idx;
		}
	});
	if(chosenCard.score){
		playerObj = {
			index: chosenCard.idx,
			scoreEl: computerScoreEl,
			cardsArr: computerCardsArr,
			playerNo: 2
		}	
	}else{
		// check if computer has cards other than jacks or the jocker
		let noWasteActive = false; 
		computerCardsArr.forEach((cardObj) => {
			if (cardObj.value != "jack" && !cardObj.jocker){
				noWasteActive = true;
			}
		});
		let rndCardIdx;
		// do ... while loop to prevent wasting jacks and the jocker on empty decks unless all its cards are jacks or the jocker
		do {
			rndCardIdx = Math.floor(computerCardsArr.length * Math.random());
		}
		while((computerCardsArr[rndCardIdx].value == "jack" || computerCardsArr[rndCardIdx].jocker) 
			&& computerCardsArr.length > 1 && noWasteActive);
		playerObj = {
			index: rndCardIdx,
			scoreEl: computerScoreEl,
			cardsArr: computerCardsArr,
			playerNo: 2
		}
	}
	sleep(2000).then(() => {
		if(gameIsOn) gameLogicStart(computerCardsArr[playerObj.index], playerObj);
	});
}
function gameEnd(){
	// game ends here
	gameIsOn = false;
	clicksActive = false;
	resultEl.style.display = "block";
	const playerFinalScore = parseInt(playerScoreEl.textContent);
	const computerFinalScore = parseInt(computerScoreEl.textContent);
	if(playerFinalScore > computerFinalScore) {
		msgEl.textContent = "Congratulation, You Won";
	} else if(playerFinalScore < computerFinalScore) {
		msgEl.textContent = "You lost, Try again";
	} else{
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

	result.sort(function(a, b){
		return b.length - a.length;
   });
    return result;
}

function getFourCards(cardsArr, targetObj){
	let rndCardIdx = Math.floor(cardsArr.length * Math.random());
	if(targetObj.el == tableEl){
		while(cardsArr[rndCardIdx].value == "jack") {
			rndCardIdx = Math.floor(cardsArr.length * Math.random());
		}
	}
	targetObj.arr.push(cardsArr[rndCardIdx]);
	createImg(cardsArr[rndCardIdx], targetObj.el);
	cardsArr.splice(rndCardIdx,1);
	if(targetObj.arr.length < 4){
		getFourCards(cardsArr, targetObj);
	}
}
function createImg(obj, el){
	const imgEl = document.createElement('img');
	if(el == computerEl) imgEl.src = 'images/facedown.png';
	else imgEl.src = obj.src;
	if(el == playerEl) {
		imgEl.addEventListener("click", evaluatePlayerClick);
	}
	el.appendChild(imgEl);
}
function createCardObjs() {
	let cards = [];
	const values = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 'jack', 'queen', 'king'];
	const shapes = ['hearts', 'spades', 'diamonds', 'clubs'];
	values.forEach((val) => {
		shapes.forEach((shp) => {
			let card = {
				value: val,
				shape: shp,
				src: `images/${val}_of_${shp}.png`
			}
			if(card.value == 7 && card.shape == 'diamonds') {
				card.joker = true;
			}
			cards.push(card);
		});
	});
	return cards;
}
function sleep(ms) {
	return new Promise(resolve => setTimeout(resolve, ms));
}
function getByValue(arr, val) {
	// find index of an object in an array by property (value property) 
	for (var i=0, iLen=arr.length; i<iLen; i++) {
		  if (arr[i].value == val) return i;
	}
}