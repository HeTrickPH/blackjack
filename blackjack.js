(function() {
var app = angular.module('blackjackApp', [])
app.controller('blackjackCtrl', function($scope) {

$scope.playerAmount = 5000;
$scope.playerAmountBet = 0;
$scope.betAmnt = 5;
$scope.betAmnt2 = 25;
$scope.betAmnt3 = 50;
$scope.betAmnt4 = 100;
$scope.betAmnt5 = 500;

function card(value, value_opt, number, suit, image) {
    this.value = value;
    this.value_opt = value_opt;
    this.number = number;
    this.suit = suit;
    this.image = image;
}
var cards = [];
var cardNumbers = ["A", 2, 3, 4, 5, 6, 7, 8, 9, 10, "J", "Q", "K"];
var suits = ["Spades", "Diamonds", "Hearts", "Clubs"];

window.onload = deck();

function deck() {
    for (var i = 0; i < suits.length; i++) {
        for (var j = 0; j < cardNumbers.length; j++) {
            // Var 2 - value_opt
            var value_opt = null;
            if (cardNumbers[j] == "A") value_opt = 11;
            var value = j + 1;
            if (typeof cardNumbers[j] != "number") {
                if (cardNumbers[j] == "A"){
                    value = 1;

                }
                else {value = 10};
            }

            cards.push(new card(
                value,
				value_opt,
                cardNumbers[j],
                suits[i],
                getImageName(cardNumbers[j], suits[i])
            ));
        }
    }
}

function getImageName(cardNum, suit) {
    var cardSuit = "";
     switch (suit) {
        case "Spades":
            cardSuit = "s";
            break;

        case "Diamonds":
            cardSuit = "d";
            break;

        case "Hearts":
            cardSuit = "h";
            break;

        case "Clubs":
            cardSuit = "c";
            break;

        default:
            console.log("Error in suit");
            break;
    }
    return "img/cards/" + cardNum + cardSuit + ".png";
}

function pullCard() {
    var num = Math.floor(Math.random() * (cards.length));
    var ChosenCard = cards[num];
    cards.splice(num, 1);

    return ChosenCard;
}

function getNewDeck() {
	var deck = [];
	for (var i = 0; i < 52; i++) {
        var c1 = pullCard();
		deck.push(c1);
	}
	return deck;
}

$scope.playerHand = [];
$scope.dealPlayer = function() {
    while($scope.playerHand.length < 2) {
        $scope.hitPlayer();
    }
    document.getElementById("betAmnt").disabled = true;
    document.getElementById("betAmnt2").disabled = true;
    document.getElementById("betAmnt3").disabled = true;
    document.getElementById("betAmnt4").disabled = true;
    document.getElementById("betAmnt5").disabled = true;
    $scope.dealDealer();
}

$scope.dealerHand = [];
$scope.dealDealer = function() {
    while($scope.dealerHand.length < 2) {
        hitDealer();
    }
}

$scope.hitPlayer = function() {
	$scope.playerHand.push(pullCard());
}

function hitDealer() {
    $scope.dealerHand.push(pullCard());
}

//$scope.standPlayer = function() {
//    document.getElementById('hit').disabled = true;
//    if (card3.value + card4.value <= 17){
//        hitDealer();
//    }
//    if (card3.value + card4.value <= 17){
//        hitDealer();
//    }
//    else(card3.value + card4.value > 17)
//
//}


$scope.betMoney = function(betamount) {
    $scope.playerAmount -= betamount;
    $scope.playerAmountBet += betamount;
    checkWallet();
}

$scope.disableBtn = function(call) {
    if(call == true) {
        return true;
    }
    else {
        return false;
    }
}

function programAI(){
    while(cards.length > 0) {
        //player got blackjack
        if(getCardTotal($scope.playerHand) == 21) {
            determineWinner();
        }
        //player busted
        else if(getCardTotal($scope.playerHand) > 21) {
            callWinner("loose");
        }

        dealer();
        //check dealer busted
        if(getCardTotal($scope.dealer) < 21) {
            determineWinner();
        }
        else {
            callWinner("win");
        }

    }
}

function dealer() {
    while(getCardTotal($scope.dealerHand) < 17) {
        hitDealer();
    }
}

function getCardTotal(arrayIn) {
    var total = 0, totalMax = 0;
    for (var i = 0; i< arrayIn.length; i++ ) {
        if (arrayIn[i].number == "A") {
            totalMax += 11;
        }
        else {
            totalMax += arrayIn[i].value;
        }
        total += arrayIn[i].value ;
        if (totalMax > total && totalMax <= 21)
            total = totalMax;
    }
	return total;
}

function compare(a, b) {
    var result = "null"
    if(a > b) {
        result = 0;
    }

    else if(a < b) {
        result = 1;
    }
    else if(a == b) {
        result = 2;
    }
    return result;
}

function determineWinner() {
    switch(compare(getCardTotal($scope.playerHand), getCardTotal($scope.dealerHand))) {
        case 0:
            callWinner("win");
            break;
        case 1:
            callWinner("loose");
            break;
        case 2:
            callWinner("push");
            break;
    }
}


function callWinner(call) {
    if(call == "win") {
        return true;
    }
    else if(call == "loose"){
        return false;
    }
    else if(call == "push"){
        return "push";
    }
}





});
}) ();
