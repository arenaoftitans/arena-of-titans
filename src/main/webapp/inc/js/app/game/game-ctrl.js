app.controller("game", ['$scope',
    '$http',
    'showHttpError',
    'squares',
    'player',
    function ($scope, $http, showHttpError, squares, player) {
        $scope.highlightedSquares = []; // Stores the ids of the squares that are highlighted.
        $scope.selectedCard = [];
        $scope.curentPlayer = {};
        $scope.numberMaximumOfPlayers = 8;
        $scope.players = player.init($scope.numberMaximumOfPlayers);
        var createGameUrl = '/DerniereLigneGameEngine/rest/createGame';
        var viewPossibleMovements = '/DerniereLigneGameEngine/rest/getPossibleSquares';
        var playUrl = '/DerniereLigneGameEngine/rest/play';

        /**
         * Post the list of registered players and create the game.
         */
        $scope.createGame = function () {
            $http({
                url: createGameUrl,
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

        /**
         * Do a GET on a rest URL. Transmit the name of the card, its color and the current position
         * of the player. Get a list of the ids of the squares on which the player can move.
         *
         * @param {string} card The name of card the player wants to play.
         * @param {string} color The color of the card the player want to play.
         */
        $scope.viewPossibleMovements = function (card, color) {
            $http({
                url: viewPossibleMovements,
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
                        $scope.selectedCard = {card_name: card, card_color: color};
                    })
                    .error(function (data) {
                        showHttpError.show(data);
                        $scope.selectedCard = {};
                    });
        };

        /**
         * Play the move with the selected card.
         *
         * @param {type} squareX The x coordinate of the square on which the player wants to go.
         * @param {type} squareY The y coordinate of the square on which the player wants to go.
         */
        $scope.play = function (squareId, squareX, squareY) {
            if (d3.select('#' + squareId).classed('highlightedSquare')
                    && Object.getOwnPropertyNames($scope.selectedCard).length !== 0) {
                $http({
                    url: playUrl,
                    method: 'GET',
                    params: {
                        card_name: $scope.selectedCard.card_name,
                        card_color: $scope.selectedCard.card_color,
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
            } else if (Object.getOwnPropertyNames($scope.selectedCard).length === 0) {
                alert('Please select a card.');
            }
        };
    }
]);
