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
        $scope.gameOver = false;
        var createGameUrl = '/aot/rest/createGame';
        var createGameMethod = 'POST';
        var viewPossibleMovementsUrl = '/aot/rest/getPossibleSquares';
        var viewPossibleMovementsMethod = 'GET';
        var playUrl = '/aot/rest/play';
        var playMethod = 'GET';

        /**
         * Post the list of registered players and create the game.
         */
        $scope.createGame = function () {
            $http({
                url: createGameUrl,
                method: createGameMethod,
                data: $scope.players
            })
                    .success(function (data) {
                        d3.select('#createGame').classed('hidden', true);
                        d3.select('#game').classed('hidden', false);
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
         * @param {string} cardName The name of card the player wants to play.
         * @param {string} cardColor The color of the card the player want to play.
         */
        $scope.viewPossibleMovements = function (cardName, cardColor) {
            $http({
                url: viewPossibleMovementsUrl,
                method: viewPossibleMovementsMethod,
                params: {
                    card_name: cardName,
                    card_color: cardColor,
                    player_id: $scope.currentPlayer.id
                }
            })
                    .success(function (data) {
                        squares.reset($scope.highlightedSquares);

                        $scope.highlightedSquares = data;

                        squares.highlight($scope.highlightedSquares);

                        // Stores the selected card.
                        $scope.selectedCard = {card_name: cardName, card_color: cardColor};
                    })
                    .error(function (data) {
                        showHttpError.show(data);
                        $scope.selectedCard = {};
                    });
        };

        $scope.isSelected = function (cardName, cardColor) {
            return $scope.selectedCard.card_name === cardName
                    && $scope.selectedCard.card_color === cardColor;
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
                    method: playMethod,
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
                            updateScopeOnSuccessMove(data);
                        })
                        .error(function (data) {
                            showHttpError.show(data);
                        });
            } else if (Object.getOwnPropertyNames($scope.selectedCard).length === 0) {
                alert('Please select a card.');
            }
        };

        /**
         * Update the scope based on the data send by the server when a move was successfull.
         * @param {type} data The data recieved from the server.
         */
        function updateScopeOnSuccessMove(data) {
            $scope.currentPlayer = data.nextPlayer;
            $scope.currentPlayerCards = data.possibleCardsNextPlayer;
            $scope.winners = data.winners;
            $scope.gameOver = data.gameOver;
            $scope.selectedCard = {};
            squares.reset($scope.highlightedSquares);
        }

        /**
         * Pass this turn.
         */
        $scope.pass = function () {
            $http({
                url: playUrl,
                method: playMethod,
                params: {
                    pass: true
                }
            })
                    .success(function (data) {
                        updateScopeOnSuccessMove(data);
                    })
                    .error(function (data) {
                        showHttpError.show(data);
                    });
        };
    }
]);
