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

function card(value, number, suit, image) {
    this.value = value;
    this.number = number;
    this.suit = suit;
    this.image = image;
}

var cards = [];

window.onload = deck();

function deck() {
    cards = [];
    var cardNumbers = ["A", 2, 3, 4, 5, 6, 7, 8, 9, 10, "J", "Q", "K"];
    var suits = ["s", "d", "h", "c"];//"Spades", "Diamonds", "Hearts", "Clubs"
    for (var i = 0; i < suits.length; i++) {
        for (var j = 0; j < cardNumbers.length; j++) {
            var value = j + 1;
            if (typeof cardNumbers[j] != "number") {
                if (cardNumbers[j] == "A"){
                    value = 11;
                }
                else {value = 10}
            }

            cards.push(new card(
                value,
                cardNumbers[j],
                suits[i],
                "img/cards/" + cardNumbers[j] + suits[i] +  ".png"
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

    function getCardTotalJohn(arrayIn) {
        var total = 0;
        var acesCount = 0; 
        arrayIn.sort(function (a, b) { return a - b });
        for (var i = 0; i < arrayIn.length; ++i) {
            if (arrayIn[i] == 11) {
                ++acesCount;
                if (total + 11 <= 21)
                    total += 11;
                else
                    total += 1;
            }
            else
                total += arrayIn[i];
        }
        return total;
    }

function getCardTotal(arrayIn) {
    debugger;
    var total = 0;
    arrayIn.sort(function (a, b) { return a.value - b.value });
    for (var i=0; i< arrayIn.length; ++i) {
        if (arrayIn[i].number=="A") {
            if (total+11<=21)
                total += 11; 
            else
                total+=1; 
        }
        else
            total += arrayIn[i].value; 
    }
    return total;
}

function showtotal() {
    $scope.dealerHandTotal = getCardTotal($scope.dealerHand);
    $scope.playerHandTotal = getCardTotal($scope.playerHand);
}

function DealCard(Who) {
          if (Who == "player") {
              $scope.playerHand.push(pullCard());
          } else if (Who == "dealer") {
              $scope.dealerHand.push(pullCard());
              if ($scope.dealerHand.length == 1) {$scope.dealerHand[0].image = "img/cards/back.png"}
          }
}

//function sleep (time) {
//  return new Promise((resolve) => setTimeout(resolve, time));
//}
var GamePhase = "betting";
$scope.blackjackAI = function(order) {
    if (order == "Start" && GamePhase == "betting") {//Deal 2 cards to dealer and player
        Start();
        GamePhase = "During Game"
    } else if (order == "Hit" && GamePhase == "During Game") {//Deal 1 card to player and see busted or not
        Hit();
    } else if (order == "Stand" && GamePhase == "During Game") {
        stand();
    }
}

function Start() {
  clearTable();//Later move to callwinner
  DealCard("dealer");
  DealCard("player");
  DealCard("dealer");
  DealCard("player");
  if(getCardTotal($scope.playerHand) == 21){
      callWinner("win");
  }
    showtotal();
}

function Hit() {
  DealCard("player");
    if (getCardTotal($scope.playerHand) > 21){
      callWinner("lose");
    }
    showtotal();
}

function stand() {
    $scope.dealerHand[0].image = "img/cards/" + $scope.dealerHand[0].number + $scope.dealerHand[0].suit + ".png";
    if (getCardTotal($scope.dealerHand) > getCardTotal($scope.playerHand)) {
        callWinner("lose");
    } else if (getCardTotal($scope.dealerHand) ==  getCardTotal($scope.playerHand) && getCardTotal($scope.dealerHand) > 17) {
        callWinner("Draw");
    } else if (getCardTotal($scope.dealerHand) < getCardTotal($scope.playerHand)) {
        callWinner("win");
    }

    while(getCardTotal($scope.dealerHand) < 17) {
        DealCard("dealer");
        if (getCardTotal($scope.dealerHand) > 21) {
            callWinner("win");
        }
        else if (getCardTotal($scope.dealerHand) > getCardTotal($scope.playerHand)) {
            callWinner("lose");
        }
        else if (getCardTotal($scope.dealerHand) ==  getCardTotal($scope.playerHand) && getCardTotal($scope.dealerHand) > 17) {
            callWinner("Draw");
        }
    }
    showtotal();
}

function callWinner(call) {
    var money = 0;
    switch(call) {
        case "win":
        if (getCardTotal($scope.playerHand) == 21 && $scope.playerHand.length == 2){
            $scope.playerAmount += $scope.playerAmountBet * 2.5;
            money = $scope.playerAmountBet * 2.5;
        } else {
            $scope.playerAmount += $scope.playerAmountBet * 2;
            money = $scope.playerAmountBet * 2;
        }
            break;
        case "lose":
            $scope.playerAmountBet = 0;
            break;
        case "Draw":
            $scope.playerAmount += $scope.playerAmountBet;
            money = $scope.playerAmountBet;
            break;
    }
    overlayDisplay(call, money);
    if (cards.length <= (cards.length / 5)) {//make deck fully when run out of cards at end of the game
        deck();
    }
    GamePhase = "betting";
}

$scope.display = true;
function overlayDisplay(txt, money) {
    $scope.overlayText = txt.toUpperCase();
    if (money == 0) {
        $scope.overlayMoney = "";//change to disable later
    } else {
        $scope.overlayMoney = "$" + money;
    }
    $scope.display = false;
}

function clearTable(){// clear Hends and betting on table
    //$scope.playerAmountBet = 0;
    $scope.playerHand = [];
    $scope.dealerHand = [];
}

});
}) ();
