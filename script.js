const totalCards = 16;
let totalCardsFlipped = 0;
let allCards = [];
let testPair = ["", ""];
let lock = false;
let totalMoves = 0;
let timer = 0;

// init():
// - prepare the board
// - create <totalCards> cards
let init = function () {
    let cardHtml = "";
    for (let i=0; i<totalCards; i++) {
        cardHtml = '<div class="memoryCard" onclick="markCard(this);" id="card-'+ i +'"  chosen="false">';
        cardHtml += '<div class="back"></div> <div class="front">';
        cardHtml += '<img id="image-'+ i +'"></div></div>';

        document.getElementById("board").innerHTML += cardHtml;        
    }
    reset();    
};

// reset():
// - scramble the cards
// - flip them all back
// - reset moves, timer, pair counter
let reset = function () {
    lock = true;
    allCards = [];

    for (let i=0; i<totalCards/2; i++) {
        allCards[2*i] = i;
        allCards[2*i+1] = i;
    }
    
    allCards = scrambledArray(allCards);
    
    for (let i=0; i<totalCards; i++) {
        document.getElementById("card-"+i).setAttribute("chosen", "false");
        document.getElementById("card-"+i).setAttribute("flipped", "false");
        document.getElementById("card-"+i).setAttribute("success", "false");
    }    
        
    totalMoves = 0;
    document.getElementById("moves").innerHTML = 0;
    document.getElementById("timer__minutes").innerHTML = "00";
    document.getElementById("timer__seconds").innerHTML = "00";

    totalCardsFlipped = 0;

    document.getElementById("board").style.display = "none";
    for (let i=0; i<totalCards; i++) {
        document.getElementById("image-" + i).setAttribute("src", "./images/"+ allCards[i] +".png");
    }    

    setTimeout(function () {
        document.getElementById("board").style.display = "flex";
    }, 1000);

    clearInterval(timer);
    timer = 0;
    setTimeout(function () {document.getElementById("hooray").setAttribute("isHidden", "true");}, 1000);

    lock = false;
}

// flipCards(el):
// Flip card to reveal the image. If it's the second card - check if it's a pair.
let flipCard = function (el) {
    lock = true;
    el.setAttribute("flipped", "true");
    if (testPair[1] != "") {
        totalMoves += 1;
        document.getElementById("moves").innerHTML = totalMoves;
        setTimeout(function () {checkIfPair(); lock = false;}, 1500);
    } else {
        setTimeout(function () {lock = false;}, 500);
    }
};

// checkIfPair():
// Check if the pair flipped is a match
let checkIfPair = function() {
    if (allCards[testPair[0]] == allCards[testPair[1]]) {
        document.getElementById("card-"+testPair[0]).setAttribute("success", "true");
        document.getElementById("card-"+testPair[1]).setAttribute("success", "true");
        totalCardsFlipped += 2;
        if (totalCardsFlipped == totalCards) {
            document.getElementById("hooray").setAttribute("isHidden", "false");
        }
    } else {
        document.getElementById("card-"+testPair[0]).setAttribute("chosen", "false");
        document.getElementById("card-"+testPair[0]).setAttribute("flipped", "false");
        document.getElementById("card-"+testPair[1]).setAttribute("chosen", "false");
        document.getElementById("card-"+testPair[1]).setAttribute("flipped", "false");
    }
    testPair = ["",""];    
}


// markCard(el):
// Make a card shiny for everyone to see
let markCard = function (el) {
    if (!lock) {
        if (el.getAttribute("chosen") == "false") {
            el.setAttribute("chosen", "true");
            if (testPair[0] != "") {
                testPair[1] = el.getAttribute("id").split("-")[1];
            } else {
                testPair[0] = el.getAttribute("id").split("-")[1];
            }
            flipCard(el);
        }    
    }
    if (timer == 0) {
        timer = setInterval(function(){ setTime(); }, 1000);
    }
}

// scrambleArray(arr):
// Helping function for scrambling the cards array and the images array
let scrambledArray = function (arr) {
    let res = [];
    let totalMixed = 0;
    const len = arr.length;
    let rand = -1;

    while (totalMixed < len) {
        rand = Math.floor(Math.random()*len);
        if (typeof(res[rand]) != "undefined") {
            rand = Math.floor(Math.random()*len);
        }
        while (typeof(res[rand]) != "undefined") {
            rand++;
            if (rand == len) {
                rand = 0;
            }
        }
        res[rand] = arr[totalMixed];
        totalMixed++;
    }
    return res;
}

// setTime():
// advancing the timer, keep leading 0's
let setTime = function () {
    let minutes = parseInt(document.getElementById("timer__minutes").innerHTML, 10);
    let seconds = parseInt(document.getElementById("timer__seconds").innerHTML, 10);
    seconds++;

    if (seconds < 10) {
        seconds = "0"+seconds;
    } else if (seconds == 60) {
        seconds = "00";
        minutes++;
    }
    if (minutes < 10) {
        minutes = "0"+minutes;
    }
    document.getElementById("timer__minutes").innerHTML = minutes;
    document.getElementById("timer__seconds").innerHTML = seconds;
}
