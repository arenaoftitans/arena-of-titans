gameModule.controller("game", ['$scope',
    '$http',
    '$websocket',
    '$rootScope',
    'handleError',
    'player',
    'ws',
    function ($scope, $http, $websocket, $rootScope, handleError, player, ws) {
        $scope.highlightedSquares = []; // Stores the ids of the squares that are highlighted.
        $scope.players = player.init(8);
        $scope.activePawns = [];
        $scope.selectedCard = null;
        $scope.currentPlayer = null;
        $scope.trumpTargetedPlayer = null;
        $scope.gameStarted = false;
        $scope.showNoCardSelectedPopup = false;
        $scope.showDiscardConfirmationPopup = false;
        var host = 'ws://localhost:8080';
        var viewPossibleMovementsUrl = '/api/getPossibleSquares';
        var viewPossibleMovementsWs = $websocket(host + viewPossibleMovementsUrl);
        viewPossibleMovementsWs.onMessage(function (event) {
            ws.parse(event).then(function (data) {
                $scope.highlightedSquares = data;
            });
        });
        viewPossibleMovementsWs.onError(handleError.show);

        var playUrl = '/api/play';
        var playWs = $websocket(host + playUrl);
        playWs.onMessage(function (event) {
            ws.parse(event).then(function (data) {
                if (data.hasOwnProperty('newSquare')) {
                    var playerPawn = $scope.currentPlayer.pawn;
                    player.move(playerPawn, data.newSquare.x, data.newSquare.y);
                }

                updateGameParameters(data);
            });
        });
        playWs.onError(handleError.show);

        var getGameUrl = '/rest/createGame';
        $rootScope.$watch('$viewContentLoaded', function () {
            $http.get(getGameUrl)
                    .success(function (game) {
                        createGame(game);
                    })
                    .error(function (data) {
                        handleError.show(data);
                    });
        });

        function createGame(game) {
            // If currentPlayer exists we must not update it or some tests will fail.
            if ($scope.currentPlayer !== null) {
                return;
            }
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

            $scope.gameStarted = true;

            updateGameParameters(game);
        }

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
            $scope.selectedCard = null;
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
            var data = {
                card_name: cardName,
                card_color: cardColor,
                player_id: $scope.currentPlayer.id
            };
            // Stores the selected card.
            $scope.selectedCard = {name: cardName, color: cardColor};
            // TODO: handle errors
            viewPossibleMovementsWs.send(data);
        };

        $scope.isSelected = function (cardName, cardColor) {
            return $scope.selectedCard !== null
                    && $scope.selectedCard.name === cardName
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
                    && $scope.selectedCard !== null) {
                var data = {
                    card_name: $scope.selectedCard.name,
                    card_color: $scope.selectedCard.color,
                    player_id: $scope.currentPlayer.id,
                    x: squareX,
                    y: squareY
                };
                // TODO: handle error.
                playWs.send(data);
            } else if ($scope.selectedCard === null) {
                alert('Please select a card.');
            }
        };

        /**
         * Pass this turn.
         */
        $scope.pass = function () {
            var data = {
                pass: true
            };
            playWs.send(data);
        };

        $scope.discard = function () {
            if ($scope.selectedCard === null) {
                $scope.showNoCardSelectedPopup = true;
            } else {
                $scope.showDiscardConfirmationPopup = true;
            }
        };

        $scope.confirmDiscard = function () {
            var data = {
                discard: true,
                card_name: $scope.selectedCard.name,
                card_color: $scope.selectedCard.color,
                player_id: $scope.currentPlayer.id
            };
            playWs.send(data);
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
