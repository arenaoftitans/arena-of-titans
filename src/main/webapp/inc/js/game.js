/**
 * Angular application and controllers which controls the JS part of the game.
 * @type @exp;angular@call;module
 */

var nameSpace = angular.module("lastLine", []);

nameSpace.controller("playButtons", ['$scope', '$http', function ($scope, $http) {
    $scope.highlightedSquares = []; // Stores the ids of the squares that are highlighted.

    // Current square.
    $scope.currentSquare = {x: 0, y: 0};

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
        url: '/DerniereLigneGameEngine/rest/play',
        method: "GET",
        params: {
          card: card,
          color: color,
          x: $scope.currentSquare.x,
          y: $scope.currentSquare.y
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
