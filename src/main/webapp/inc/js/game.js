
/**
 * Use alert to print errors.
 *
 * @param {Object} data the response of the server.
 *
 * @returns {undefined}
 */
function showHttpError(data) {
    if (data.hasOwnProperty('error_to_display')) {
        alert(data.error_to_display);
    } else {
        console.log(data.error);
    }
}

var nameSpace = angular.module("lastLine", []);

nameSpace.controller("game", ['$scope', '$http', function ($scope, $http) {
        $scope.highlightedSquares = []; // Stores the ids of the squares that are highlighted.
        $scope.currentCard = {};
        $scope.currentPlayerIndex = 0;

        // Card names and colors. Generate buttons for all combination of cards and
        // colors thanks to ng-repeat.
        $scope.colors = ['blue', 'red', 'black', 'yellow'];
        $scope.cards = ['warrior', 'wizard', 'rider', 'bishop', 'queen', 'king', 'assassin'];

        function resetHighlightedSquares() {
            for (var index in $scope.highlightedSquares) {
                var id = $scope.highlightedSquares[index];
                d3.select('#' + id).classed('highlightedSquare', false);
            }
        }

        function highlightSquares() {
            for (var index in $scope.highlightedSquares) {
                var id = $scope.highlightedSquares[index];
                d3.select('#' + id).classed('highlightedSquare', true);
            }
        }

        function movePlayerTo(playerIndex, squareId) {
            var playerId = 'player' + playerIndex;
            var circleToDelete = document.getElementById(playerId);
            if (circleToDelete) {
                circleToDelete.parentNode.removeChild(circleToDelete);
            }
            var square = document.getElementById(squareId);
            var boundingBox = square.getBBox();
            var height = Number(boundingBox.height);
            var width = Number(boundingBox.width);
            var x = Number(boundingBox.x) + width / 2;
            var y = Number(boundingBox.y) + height / 2;
            var radius = width / 4;
            var transform = square.getAttribute('transform');
            var player = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
            player.setAttribute('id', playerId);
            player.setAttribute('cx', x);
            player.setAttribute('cy', y);
            player.setAttribute('r', radius);
            player.setAttribute('transform', transform);
            document.getElementById('boardLayer').appendChild(player);
        }

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
                        resetHighlightedSquares();

                        $scope.highlightedSquares = data;

                        highlightSquares();

                        // Stores the selected card.
                        $scope.currentCard = {card_name: card, card_color: color};
                    })
                    .error(function (data) {
                        showHttpError(data);
                        $scope.currentCard = {};
                    });
        };

        $scope.play = function (squareX, squareY) {
            if ($scope.currentCard !== {}) {
                $http({
                    url: '/DerniereLigneGameEngine/rest/play',
                    method: 'GET',
                    params: {
                        card_name: $scope.currentCard.card_name,
                        card_color: $scope.currentCard.card_color,
                        player_id: $scope.currentPlayerIndex,
                        x: squareX,
                        y: squareY
                    }
                })
                        .success(function (data) {
                            movePlayerTo($scope.currentPlayerIndex, data[0]);
                            $scope.currentPlayerIndex = ($scope.currentPlayerIndex + 1) % $scope.players.length;
                            resetHighlightedSquares();
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
                index: i,
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
