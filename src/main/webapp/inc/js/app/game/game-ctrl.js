gameModule.controller("game", ['$scope',
    '$http',
    '$rootScope',
    'showHttpError',
    'player',
    function ($scope, $http, $rootScope, showHttpError, player) {
        $scope.highlightedSquares = []; // Stores the ids of the squares that are highlighted.
        $scope.players = player.init(8);
        $scope.activePawns = [];
        $scope.selectedCard = {};
        $scope.currentPlayer = {};
        $scope.trumpTargetedPlayer = {};
        $scope.gameStarted = false;
        $scope.showNoCardSelectedPopup = false;
        $scope.showDiscardConfirmationPopup = false;
        var viewPossibleMovementsUrl = '/aot/rest/getPossibleSquares';
        var viewPossibleMovementsMethod = 'GET';
        var playUrl = '/aot/rest/play';
        var playMethod = 'GET';

        var unbindOnGameCreatedEvent = $rootScope.$on('gameCreated', function (event, game) {
            $scope.gameStarted = true;
            for (var i in game.players) {
                var player = $scope.players[i];
                var playerUpdated = game.players[i];
                $scope.activePawns.push(player.pawn.attr('id'));
                player.id = playerUpdated.id;
                player.name = playerUpdated.name;
            }
            // Remove unused player from $scope.players
            var actualNumberOfPlayers = game.players.length;
            $scope.players.splice(actualNumberOfPlayers);

            updateGameParameters(game);
        });
        $rootScope.$on('destroy', unbindOnGameCreatedEvent);

        /**
         * Update the scope based on the data send by the server when a move was successfull.
         * @param {type} game The data recieved from the server.
         */
        function updateGameParameters(game) {
            // The server cannot know about pawns. We get it from $scope.players
            $scope.currentPlayer = $scope.players[game.nextPlayer.id];
            $scope.currentPlayerCards = game.possibleCardsNextPlayer;
            $scope.currentPlayerTrumps = game.trumpsNextPlayer;
            $scope.winners = game.winners;
            $scope.selectedCard = {};
            $scope.highlightedSquares = [];
            $scope.activeTrumps = game.trumps;

            isGameOver(game.gameOver);
        }

        function isGameOver(gameOver) {
            if (gameOver) {
                $rootScope.$emit('gameOver', $scope.winners);
            }
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
                        $scope.highlightedSquares = data;

                        // Stores the selected card.
                        $scope.selectedCard = {name: cardName, color: cardColor};
                    })
                    .error(function (data) {
                        showHttpError.show(data);
                        $scope.selectedCard = {};
                    });
        };

        $scope.isSelected = function (cardName, cardColor) {
            return $scope.selectedCard.name === cardName
                    && $scope.selectedCard.color === cardColor;
        };

        /**
         * Play the move with the selected card.
         *
         * @param {type} squareX The x coordinate of the square on which the player wants to go.
         * @param {type} squareY The y coordinate of the square on which the player wants to go.
         */
        $scope.play = function (squareName, squareX, squareY) {
            if ($scope.highlightedSquares.indexOf(squareName) > -1
                    && Object.getOwnPropertyNames($scope.selectedCard).length !== 0) {
                $http({
                    url: playUrl,
                    method: playMethod,
                    params: {
                        card_name: $scope.selectedCard.name,
                        card_color: $scope.selectedCard.color,
                        player_id: $scope.currentPlayer.id,
                        x: squareX,
                        y: squareY
                    }
                })
                        .success(function (data) {
                            var playerPawn = $scope.currentPlayer.pawn;
                            player.move(playerPawn, data.newSquare.x, data.newSquare.y);
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

        $scope.discard = function () {
            if (Object.getOwnPropertyNames($scope.selectedCard).length === 0) {
                $scope.showNoCardSelectedPopup = true;
            } else {
                $scope.showDiscardConfirmationPopup = true;
            }
        };

        $scope.confirmDiscard = function () {
            $http({
                url: playUrl,
                method: playMethod,
                params: {
                    discard: true,
                    card_name: $scope.selectedCard.name,
                    card_color: $scope.selectedCard.color,
                    player_id: $scope.currentPlayer.id
                }
            })
                    .success(function (data) {
                        updateGameParameters(data);
                    })
                    .error(function (data) {
                        showHttpError.show(data);
                    });
            $scope.hiddeDiscardPopup();
        };

        $scope.hiddeDiscardPopup = function () {
            $scope.showDiscardConfirmationPopup = false;
        };

        $scope.noCardSelectedPopupHidden = function () {
            $scope.showNoCardSelectedPopup = false;
        };

        /**
         * Play the clicked trump.
         *
         * @param {type} trumpName The name of the trump.
         * @returns {undefined}
         */
        $scope.playTrump = function (trump) {
            $rootScope.$emit('wantToPlayTrump', trump, $scope.players, $scope.currentPlayer.index);
        };

        var unbindTrumpPlayed = $rootScope.$on('trumpPlayed', function (event, response) {
            $scope.activeTrumps = response;
        });
        $rootScope.$on('destroy', unbindTrumpPlayed);
    }
]);
