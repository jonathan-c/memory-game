/*
 * Create a list that holds all of your cards
 */
const card = [
	"diamond", "paper-plane-o", "anchor", "bolt", 
	"cube", "leaf", "bicycle", "bomb"
];

const cards = [...card, ...card];

/*
 * Display the cards on the page
 *   - shuffle the list of cards using the provided "shuffle" method below
 *   - loop through each card and create its HTML
 *   - add each card's HTML to the page
 */
const TOTAL_LIVES = 6;
let openCards = [];
let cardsClicked = [];
let moveCounter = 0;
let livesCounter = TOTAL_LIVES;
let shuffledCards = shuffle(cards);

const deckElement = document.getElementById('game-deck');
const deckFragment = document.createDocumentFragment();
const moveCounterElement = document.getElementById('move-counter');
const restartButton = document.getElementById('restart-button');
const modal = document.getElementById('myModal');
const modalContent = document.getElementById('modal-p-content');
const modalSpan = document.getElementsByClassName("close")[0];

shuffledCards.forEach(function(card) {
	const newListElement = document.createElement('li');
	newListElement.classList.add('card');

	const newIconElement = document.createElement('i');
	newListElement.classList.add('fa');
	newIconElement.classList.add(`fa-${card}`);

	newListElement.appendChild(newIconElement);
	deckFragment.appendChild(newListElement);
});

deckElement.appendChild(deckFragment);
resetLives();
restartTimer();

// Shuffle function from http://stackoverflow.com/a/2450976
function shuffle(array) {
    var currentIndex = array.length, temporaryValue, randomIndex;

    while (currentIndex !== 0) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }
    return array;
}


/*
 * set up the event listener for a card. If a card is clicked:
 *  - display the card's symbol (put this functionality in another function that you call from this one)
 *  - add the card to a *list* of "open" cards (put this functionality in another function that you call from this one)
 *  - if the list already has another card, check to see if the two cards match
 *    + if the cards do match, lock the cards in the open position (put this functionality in another function that you call from this one)
 *    + if the cards do not match, remove the cards from the list and hide the card's symbol (put this functionality in another function that you call from this one)
 *    + increment the move counter and display it on the page (put this functionality in another function that you call from this one)
 *    + if all cards have matched, display a message with the final score (put this functionality in another function that you call from this one)
 */

const cardList = document.getElementsByClassName('card');

Array.from(cardList).forEach(function(element) {
	element.addEventListener('click', function() {
		if (element.classList.contains('show')) {
			return;
		}
		showCard(element);
		addToOpenList(element);
	});
});

restartButton.addEventListener('click', function() {
	restart();
})

function restart () {
	const matchedCards = document.querySelectorAll('.card')
	matchedCards.forEach(function(card) {
		card.classList.remove('match');
		card.classList.remove('show');	
	})
	resetCounter();
	resetLives();
	restartTimer();
}

function showCard (card) {
	card.classList.add('show');	
}

function hideCard (card) {
	card.classList.remove('show');
}

function matchCard (card) {
	card.classList.add('match');
	card.classList.remove('show');
}

function incrementCounter() {
	moveCounter+=1;
	moveCounterElement.textContent = moveCounter;
}

function resetCounter() {
	moveCounter = 0;
	moveCounterElement.textContent = moveCounter;
}

function loseLife () {
	livesCounter-=1;
	const stars = document.getElementById('stars-list');
	stars.removeChild(stars.children[0]);
	if (livesCounter == 0) {
		gameOver();
		restart();
	}
	console.log("livesCounter", livesCounter);
}

function resetLives () {
	livesCounter = TOTAL_LIVES;
	const starElementCount = [...Array(livesCounter).keys()];
	const stars = document.getElementById('stars-list');
	while( stars.firstChild ){
  		stars.removeChild( stars.firstChild );
	}
	starElementCount.forEach(function(i) {
		let starElement = document.createElement('li');
		let starElementIcon = document.createElement('i');
		starElementIcon.classList.add('fa');
		starElementIcon.classList.add('fa-star');
		starElement.appendChild(starElementIcon);
		stars.appendChild(starElement);
	});
}

function matchBothCards(card) {
	const matchingCards = document.getElementsByClassName(card.firstChild.className)
	matchCard(matchingCards[0].parentElement)
	matchCard(matchingCards[1].parentElement)
	const totalMatchedCards = document.getElementsByClassName('match');
	if (totalMatchedCards.length == 16) {
		setTimeout(function () {
			gameOver();
		}, 200);
	}
}

function addToOpenList (card) {
	if (openCards.length == 0 && cardsClicked.length >= 2) {
		hideCard(cardsClicked[cardsClicked.length-1]);
		hideCard(cardsClicked[cardsClicked.length-2]);
	}
	openCards.push(card.firstChild.className);
	cardsClicked.push(card);
	if (openCards.length == 2) {
		incrementCounter();
	}
	if (openCards.length > 1) {
		if (openCards[0] == openCards[1]) {
			matchBothCards(card);
			openCards = [];
		} else {
			loseLife()
		}
		openCards = [];
	}
		
}

function gameOver () {
	modal.style.display = "block";
	if (livesCounter == 0) {
		modalContent.textContent = 'You lose! You ran out of lives.';
	} else {
		modalContent.textContent = `You win! Your final score was ${moveCounter}`;
	}
}

modalSpan.onclick = function() {
    modal.style.display = "none";
    restart();
}

window.onclick = function(event) {
    if (event.target == modal) {
        modal.style.display = "none";
	    restart();
    }
}

function restartTimer () {
	// Set the date we're counting down to
	var countDownDate = new Date().getTime() + 300000;

	// Update the count down every 1 second
	var x = setInterval(function() {

	  // Get todays date and time
	  var now = new Date().getTime();

	  // Find the distance between now an the count down date
	  var distance = countDownDate - now;

	  // Time calculations for days, hours, minutes and seconds
	  var minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
	  var seconds = Math.floor((distance % (1000 * 60)) / 1000);

	  // Display the result in the element with id="demo"
	  document.getElementById("demo").innerHTML = minutes + "m " + seconds + "s ";

	  // If the count down is finished, write some text 
	  if (distance < 0) {
	    clearInterval(x);
	    document.getElementById("demo").innerHTML = "EXPIRED";
	    modal.style.display = "block";
	    modalContent.textContent = `You lose! You ran out of time!`;
	  }
	}, 1000);	
}