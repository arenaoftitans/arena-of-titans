/**
 * Angular application and controllers which controls the JS part of the game.
 * @type @exp;angular@call;module
 */

var nameSpace = angular.module("lastLine", []);

nameSpace.controller("playButtons", ['$scope', '$http', function ($scope, $http) {
    $scope.highlightedSquares = []; // Stores the ids of the squares that are highlighted.

    // Card names and colors. Generate buttons for all combination of cards and
    // colors thanks to ng-repeat.
    $scope.colors = ['blue', 'red', 'black', 'yellow'];
    $scope.cards = ['warrior', 'wizard', 'rider', 'bishop', 'queen', 'king', 'assassin'];

    // Function called when a button is clicked.
    $scope.play = function (card, color) {
      // Do a GET on a rest URL. Transmit the name of the card, its color and
      // the current position of the player. Get a list of the ids of the
      // squares on which the player can move.
      $http({
        url: '/DerniereLigneGameEngine/rest/getPossibleSquares',
        method: "GET",
        params: {
          card_name: card,
          card_color: color,
          player_id: "player"
        }
      }).success(function (data) {
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
      });
    };
  }]);

nameSpace.controller('createGame', ['$scope', '$http', function ($scope, $http) {
    $scope.players = [];
    $scope.numberMaximumOfPlayers = 8;
    for (var i = 0; i < $scope.numberMaximumOfPlayers; i++) {
      $scope.players.push({
        index: i + 1,
        name: ''
      });
    }

    $scope.createGame = function () {
      var players = {items: $scope.players};
      $http({
        url: '/DerniereLigneGameEngine/rest/createGame',
        method: 'POST',
        data: $scope.players
      })
              .success(function (data) {
                angular.element('#createGame').hide();
                angular.element('#game').show();
              })
              .error(function (data, status) {
                if (status >= 400 && status < 500) {
                  if (data.hasOwnProperty("error")) {
                    alert(data.error);
                  }
                }
              });
    };
  }]);
