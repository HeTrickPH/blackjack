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
$scope.betMoney = function(betamount) {
    $scope.playerAmount -= betamount;
    $scope.playerAmountBet += betamount;
}

$scope.playerHand = [];
$scope.dealerHand = [];
                                         
    
function card(value, value_opt, number, suit, image) {
    this.value = value;
    this.value_opt = value_opt;
    this.number = number;
    this.suit = suit;
    this.image = image;
}
    
var cards = [];

window.onload = deck();

function deck() {
    cards = [];
    var cardNumbers = ["A", 2, 3, 4, 5, 6, 7, 8, 9, 10, "J", "Q", "K"];
    var suits = ["S", "D", "H", "C"];//"Spades", "Diamonds", "Hearts", "Clubs"
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
                else {value = 10}
            }

            cards.push(new card(
                value,
				value_opt,
                cardNumbers[j],
                suits[i],
                "img/" + suits[i] + cardNumbers[j] +  ".png"
            ));
        }
    }
}

function pullCard() {
    var num = Math.floor(Math.random() * (cards.length));
    var ChosenCard = cards[num];
    cards.splice(num, 1);

    return ChosenCard;
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
    
function DealCard(Who) {

    if (Who == "player") {
        $scope.playerHand.push(pullCard());
    } else if (Who == "dealer") {
        $scope.dealerHand.push(pullCard());
        if ($scope.dealerHand.length == 1) {$scope.dealerHand[0].image = "img/back.png"}
    }
}

$scope.blackjackAI = function(phase) {
    if (cards.length <= (cards.length / 5)) {
        deck();
    }
    if (phase == "Start") {//Deal 2 cards to dealer and player
        clearTable();
        DealCard("dealer");
        DealCard("player"); 
        DealCard("dealer");
        DealCard("player");
        
    } else if (phase == "Hit") {//Deal 1 card to player and see busted or not
        DealCard("player");
        if (getCardTotal($scope.playerHand) > 21){
            callWinner("loose");
        }
    } else if (phase == "Stand") {
        stand();
    }
    
}

function stand() {
    $scope.dealerHand[0].image = "img/" + $scope.dealerHand[0].suit + $scope.dealerHand[0].number + ".png";
    if (getCardTotal($scope.dealerHand) > getCardTotal($scope.playerHand)) {
        callWinner("loose");
    } else if (getCardTotal($scope.dealerHand) == 21 && getCardTotal($scope.playerHand) == 21) {
        callWinner("Draw");
    }
    
    while(getCardTotal($scope.dealerHand) < 17) {
        DealCard("dealer");
        if (getCardTotal($scope.dealerHand) > 21) {
            callWinner("win");
        } 
        else if (getCardTotal($scope.dealerHand) < getCardTotal($scope.playerHand)) {
            callWinner("loose");
        }
        else if (getCardTotal($scope.dealerHand) == 21 && getCardTotal($scope.playerHand) == 21) {
            callWinner("Draw");
        }
    }
}
    
function callWinner(call) {
    var money = 0;
    switch(call) {
        case "win":
            $scope.playerAmount += $scope.playerAmountBet * 2;
            money = $scope.playerAmountBet * 2
            break;
        case "loose":
            $scope.playerAmountBet = 0;
            break;
        case "Draw":
            $scope.playerAmount += $scope.playerAmountBet;
            money = $scope.playerAmountBet;
            break;
    }
    overlayDisplay(call, money);
    //clearTable();
}

$scope.display = true;
function overlayDisplay(txt, money) {
    debugger;
    $scope.overlayText = txt.toUpperCase(); 
    if (money == 0) {
        $scope.overlayMoney = "";//change to disable later
    } else {
        $scope.overlayMoney = "$" + money;
    }
    $scope.display = false;
}

function clearTable(){
    debugger;
    $scope.playerHand = [];
    $scope.dealerHand = [];
}

});
}) ();
