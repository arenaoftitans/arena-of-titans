
/**
 * Use alert to print errors.
 *
 * @param {Object} data the response of the server.
 *
 * @returns {undefined}
 */
function showHttpError(data) {
  if (data.hasOwnProperty('error')) {
    alert(data.error);
  }
}

var nameSpace = angular.module("lastLine", []);

nameSpace.controller("game", ['$scope', '$http', function ($scope, $http) {
    $scope.highlightedSquares = []; // Stores the ids of the squares that are highlighted.
    $scope.currentCard = {};
    $scope.currentPlayerIndex = 0;
    $scope.squareX = '';
    $scope.squareY = '';

    // Card names and colors. Generate buttons for all combination of cards and
    // colors thanks to ng-repeat.
    $scope.colors = ['blue', 'red', 'black', 'yellow'];
    $scope.cards = ['warrior', 'wizard', 'rider', 'bishop', 'queen', 'king', 'assassin'];

    // Function called when a button is clicked.
    $scope.viewPossibleMovements = function (card, color) {

      // Do a GET on a rest URL. Transmit the name of the card, its color and
      // the current position of the player. Get a list of the ids of the
      // squares on which the player can move.
      $http({
        url: '/DerniereLigneGameEngine/rest/getPossibleSquares',
        method: "GET",
        params: {
          card_name: card,
          card_color: color,
          player_id: $scope.currentPlayerIndex
        }
      })
              .success(function (data) {
                // Clean highlighted squares.
                for (var index in $scope.highlightedSquares) {
                  var id = $scope.highlightedSquares[index];
                  angular.element(id).removeAttr('style', $scope.squaresDefaultStyle);
                }

                $scope.highlightedSquares = data;

                // Highlight new squares.
                for (var index in $scope.highlightedSquares) {
                  var id = $scope.highlightedSquares[index];
                  angular.element(id).attr("style", "fill:green");
                }
                // Stores the selected card.
                $scope.currentCard = {card_name: card, card_color: color};
              })
              .error(function (data) {
                showHttpError(data);
                $scope.currentCard = {};
              });
    };

    $scope.play = function () {
      if ($scope.currentCard !== {}) {
        $http({
          url: '/DerniereLigneGameEngine/rest/play',
          method: 'GET',
          params: {
            card_name: $scope.currentCard.card_name,
            card_color: $scope.currentCard.card_color,
            player_id: $scope.currentPlayerIndex,
            x: $scope.squareX,
            y: $scope.squareY
          }
        })
                .success(function (data) {
                  $scope.currentPlayerIndex = ($scope.currentPlayerIndex + 1) % $scope.players.length;
                })
                .error(function (data) {
                  showHttpError(data);
                });
      } else {
        alert('Please select a card.');
      }
    };

    $scope.players = [];
    $scope.numberMaximumOfPlayers = 8;
    for (var i = 0; i < $scope.numberMaximumOfPlayers; i++) {
      $scope.players.push({
        index: i + 1,
        name: ''
      });
    }

    $scope.createGame = function () {
      $http({
        url: '/DerniereLigneGameEngine/rest/createGame',
        method: 'POST',
        data: $scope.players
      })
              .success(function (data) {
                angular.element('#createGame').hide();
                angular.element('#game').show();
                $scope.players = data;
                $scope.currentPlayerIndex = 0;
              })
              .error(showHttpError);
    };
  }]);
