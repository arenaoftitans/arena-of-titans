app.controller("game", ['$scope',
    '$http',
    '$rootScope',
    'showHttpError',
    'squares',
    'player',
    'createGame',
    function ($scope, $http, $rootScope, showHttpError, squares, player, createGame) {
        $scope.highlightedSquares = []; // Stores the ids of the squares that are highlighted.
        $scope.selectedCard = [];
        $scope.curentPlayer = {};
        $scope.gameOver = false;
        $scope.currentPlayer = {};
        $scope.trumpTargetedPlayer = {};
        var targetedPlayerForTrumpSelectorId = '#targetedPlayerForTrumpSelector';
        var viewPossibleMovementsUrl = '/aot/rest/getPossibleSquares';
        var viewPossibleMovementsMethod = 'GET';
        var playUrl = '/aot/rest/play';
        var playMethod = 'GET';
        var playTrumpUrl = '/aot/rest/playTrump';
        var playTrumpMethod = 'GET';

        var unbindOnGameCreatedEvent = $rootScope.$on('gameCreated', function () {
            d3.select('#game').classed('hidden', false);
            var game = createGame.get();
            updateGameParameters(game);
        });
        $rootScope.$on('destroy', unbindOnGameCreatedEvent);

        /**
         * Update the scope based on the data send by the server when a move was successfull.
         * @param {type} game The data recieved from the server.
         */
        function updateGameParameters(game) {
            $scope.currentPlayer = game.nextPlayer;
            $scope.currentPlayerCards = game.possibleCardsNextPlayer;
            $scope.currentPlayerTrumps = game.trumpsNextPlayer;
            $scope.winners = game.winners;
            $scope.gameOver = game.gameOver;
            $scope.selectedCard = {};
            $scope.activeTrumps = game.trumps;
            squares.reset($scope.highlightedSquares);
        }

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
        $scope.play = function (squareName, squareX, squareY) {
            if (d3.select('#' + squareName).classed('highlightedSquare')
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
                            updateGameParameters(data);
                        })
                        .error(function (data) {
                            showHttpError.show(data);
                        });
            } else if (Object.getOwnPropertyNames($scope.selectedCard).length === 0) {
                alert('Please select a card.');
            }
        };

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
                        updateGameParameters(data);
                    })
                    .error(function (data) {
                        showHttpError.show(data);
                    });
        };

        /**
         * Play the clicked trump.
         *
         * @param {type} trumpName The name of the trump.
         * @returns {undefined}
         */
        $scope.playTrump = function (trumpName) {
            $scope.selectedTrumpName = trumpName;
            d3.select(targetedPlayerForTrumpSelectorId).classed('hidden', false);
        };

        $scope.submitSelectTargetedPlayerForm = function () {
            $http({
                url: playTrumpUrl,
                method: playTrumpMethod,
                params: {
                    targetIndex: $scope.trumpTargetedPlayer,
                    name: $scope.selectedTrumpName
                }
            })
                    .success(function (data) {
                        updateScopeOnSuccessfulTrump(data);
                    })
                    .error(function (data) {
                        showHttpError.show(data);
                    });
        };

        $scope.cancelSelectTargetedPlayerForm = function () {
            $scope.selectedTrumpName = '';
            $scope.trumpTargetedPlayer = {};
            d3.select(targetedPlayerForTrumpSelectorId).classed('hidden', true);
        };

        var updateScopeOnSuccessfulTrump = function (data) {
            $scope.activeTrumps = data;
            $scope.selectedTrumpName = '';
            $scope.trumpTargetedPlayer = {};
            d3.select(targetedPlayerForTrumpSelectorId).classed('hidden', true);
        };
    }
]);
