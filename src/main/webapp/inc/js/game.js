var nameSpace = angular.module("lastLine", []);

nameSpace.controller("playButtons", ['$scope', '$http', function ($scope, $http) {
    $scope.squaresDefaultStyle = "opacity:0.25422764;stroke:#000000;stroke-width:2.24024391;stroke-miterlimit:4;stroke-opacity:1;stroke-dasharray:none";
    $scope.squaresHighlightedStyle = "opacity:1;stroke:#FF0000;stroke-width:2.24024391;stroke-miterlimit:4;stroke-opacity:1;stroke-dasharray:none";
    $scope.highlightedSquares = []; // Stores the ids of the squares that are highlighted.
    $scope.x = 0;
    $scope.y = 0;
    $scope.colors = ['blue', 'red', 'black', 'yellow'];
    $scope.cards = ['warrior', 'wizard', 'rider', 'bishop', 'queen', 'king', 'assassin'];
    /* $scope.play = function (cardName) {
      $http.get('/derniereligne/rest/play?card=' + cardName + '&color=yellow')
              .success(function (data) {
                angular.element("#rect2985bis").attr("style", "fill: " + data['color']);
              }); */
    $scope.play = function (card, color) {
      $http({
        url: '/DerniereLigneGameEngine/rest/play',
        method: "GET",
        params: {card: card, color: color, x: $scope.x, y: $scope.y}
      }).success(function (data) {
        // Clean highlighted squares.
        for (var index in $scope.highlightedSquares) {
          var id = $scope.highlightedSquares[index];
          angular.element(id).attr('style', $scope.squaresDefaultStyle);
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