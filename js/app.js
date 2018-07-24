/* List of items */
let cardLists = ["fab fa-android", "fab fa-apple", "fab fa-google", "fab fa-amazon", "fab fa-react", "fab fa-angular", "fas fa-heart", "fas fa-trophy"];

// game started flag
let game_started = false;

let moves = 0;
let match_found = 0;

// timer
let timer = new Timer();
timer.addEventListener('secondsUpdated', function (e) {                   $('#timer').html(timer.getTimeValues().toString());
});

//reset button
$('#reset-button').click(resetGame);

// create and insert card html in loop
function createCard(card) {
    $('#deck').append(`<li class="card animated"><i class="${card}"></i></li>`);
}
// generate random cards on the deck
function generateCards() {
    for (let i = 0; i < 2; i++) {
        cardLists = shuffle(cardLists);
        cardLists.forEach(createCard);
    }
}

function shuffle(array) {
    let currentIndex = array.length
        , temporaryValue, randomIndex;
    while (currentIndex !== 0) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }
    return array;
}
//keep track of open cards
let openCards = [];

// card functionality
function toggleCard() {
    
    // start the timer when first card is opened
    if (game_started == false) {
        game_started = true;
        timer.start();
    }
    
    if (openCards.length === 0) {
        $(this).toggleClass("show open").animateCss('flipInY');
        openCards.push($(this));
        disableCLick();
    }
    else if (openCards.length === 1) {
        updateMoves();
        $(this).toggleClass("show open").animateCss('flipInY');
        openCards.push($(this));
        setTimeout(matchOpenCards, 1100);
    }
}

// enable click on the open card
function enableClick() {
    openCards[0].click(toggleCard);
}
// Disable click of the open Cards
function disableCLick() {
    openCards.forEach(function (card) {
        card.off('click');
    });
}
// check open cards for match
function matchOpenCards() {
    if (openCards[0][0].firstChild.className == openCards[1][0].firstChild.className) {
        openCards[0].addClass("match").animateCss('pulse');
        openCards[1].addClass("match").animateCss('pulse');
        disableCLick();
        removeOpenCards();
        setTimeout(checkWin, 1000);
    }
    else {
        openCards[0].toggleClass("show open").animateCss('flipInY');
        openCards[1].toggleClass("show open").animateCss('flipInY');
        enableClick();
        removeOpenCards();
    }
}
// function to remove open cards
function removeOpenCards() {
    openCards = [];
}
// function to add animations
$.fn.extend({
    animateCss: function (animationName) {
        let animationEnd = 'webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend';
        this.addClass(animationName).one(animationEnd, function () {
            $(this).removeClass(animationName);
        });
        return this;
    }
});
// update moves
function updateMoves() {
    moves += 1;
    $('#moves').html(`${moves} Moves`);
    if (moves == 24) {
        addBlankStar();
    }
    else if (moves == 15) {
        addBlankStar();
    }
}
// check whether the game is finished 
function checkWin() {
    match_found += 1;
    if (match_found == 8) {
        showResults();
    }
}

// add initial stars
function addStars() {
    for (let i = 0; i < 3; i++) {
        $('#stars').append('<li><i class="fas fa-star"></i></li>');
    }
}
// add blank stars
function addBlankStar() {
    $('#stars').children()[0].remove();
    $('#stars').append('<li><i class="far fa-star"></i></li>');
}
// reset the game
function resetGame() {
    moves = 0;
    match_found = 0;
    $('#deck').empty();
    $('#stars').empty();
    $('#game-deck')[0].style.display = "";
    $('#sucess-result')[0].style.display = "none";
    game_started=false;
    timer.stop();
    $('#timer').html("00:00:00");
    openCards = [];
    play();
}
// Init function
function play() {
    generateCards();
    $('.card').click(toggleCard);
    $('#moves').html("0 Moves");
    addStars(3);
}
// shows result on end game
function showResults() {
    $('#sucess-result').empty();
    timer.pause();
    let scoreBoard = `
        <i class="fas fa-thumbs-up fa-5x d-block text-center"></i>
        <p class="success"> Congratulations !!! </p>
        <p>
            <span class="score-titles">Moves:</span>
            <span class="score-values">${moves}</span>
            <span class="score-titles">Time:</span>
            <span class="score-values">${timer.getTimeValues().toString()}</span>
        </p>
        <div class="text-center margin-top-2">
             <div class="star">
                <i class="fas fa-star fa-3x"></i>    
             </div>
             <div class="star">
                <i class="${ (moves > 23) ? "far fa-star" : "fas fa-star"}  fa-3x"></i>    
             </div>
            <div class="star">
                <i class="${ (moves > 14) ? "far fa-star" : "fas fa-star"} fa-3x"></i>    
             </div>
        </div>
        <div class="text-center margin-top-2" id="restart">
            <i class="fas fa-redo fa-2x"></i>
          </div>
    `;
    $('#game-deck')[0].style.display = "none";
    $('#sucess-result')[0].style.display = "block";
    $('#sucess-result').append($(scoreBoard));
    $('#restart').click(resetGame);
}

//let's begin
play();