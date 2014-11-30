app.controller("game", ['$scope',
    '$http',
    'showHttpError',
    'squares',
    'player',
    function ($scope, $http, showHttpError, squares, player) {
        $scope.highlightedSquares = []; // Stores the ids of the squares that are highlighted.
        $scope.currentCards = [];
        $scope.curentPlayer = {};

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
                    player_id: $scope.currentPlayer.id
                }
            })
                    .success(function (data) {
                        squares.reset($scope.highlightedSquares);

                        $scope.highlightedSquares = data;

                        squares.highlight($scope.highlightedSquares);

                        // Stores the selected card.
                        $scope.currentCards = {card_name: card, card_color: color};
                    })
                    .error(function (data) {
                        showHttpError.show(data);
                        $scope.currentCards = {};
                    });
        };

        $scope.play = function (squareX, squareY) {
            if ($scope.currentCards !== {}) {
                $http({
                    url: '/DerniereLigneGameEngine/rest/play',
                    method: 'GET',
                    params: {
                        card_name: $scope.currentCards.card_name,
                        card_color: $scope.currentCards.card_color,
                        player_id: $scope.currentPlayer.id,
                        x: squareX,
                        y: squareY
                    }
                })
                        .success(function (data) {
                            player.move($scope.currentPlayer.id, data.newSquare);
                            $scope.currentPlayer = data.nextPlayer;
                            $scope.currentPlayerCards = data.possibleCardsNextPlayer;
                            squares.reset($scope.highlightedSquares);
                        })
                        .error(function (data) {
                            showHttpError.show(data);
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
                        $scope.currentPlayer = data.nextPlayer;
                        $scope.currentPlayerCards = data.possibleCardsNextPlayer;
                    })
                    .error(function (data) {
                        showHttpError.show(data);
                    });
        };
    }]);
