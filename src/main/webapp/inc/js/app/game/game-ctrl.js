gameModule.controller("game", ['$scope',
    '$websocket',
    '$rootScope',
    'handleError',
    'player',
    'ws',
    function ($scope, $websocket, $rootScope, handleError, player, ws) {
        'use strict';

        var maximumNumberOfPlayers = 8;
        var initialNumberOfOpenedSlot = 2;

        $scope.highlightedSquares = []; // Stores the ids of the squares that are highlighted.
        $scope.players = player.init(initialNumberOfOpenedSlot);
        $scope.activePawns = [];
        $scope.selectedCard = null;
        $scope.me = null;
        $scope.currentPlayer = null;
        $scope.trumpTargetedPlayer = null;
        $scope.gameStarted = false;
        $scope.showNoCardSelectedPopup = false;
        $scope.showDiscardConfirmationPopup = false;
        $scope.showTargetedPlayerForTrumpSelector = false;

        var gameId = location.pathname.split('/').pop();
        var host = 'ws://localhost:8080';
        var gameApiUrl = '/api/game/' + gameId;
        var gameApi = $websocket(host + gameApiUrl);
        // Requests type
        var rt = {
            game_initialized: 'GAME_INITIALIZED',
            add_slot: 'ADD_SLOT',
            slot_updated: 'SLOT_UPDATED',
            create_game: 'CREATE_GAME',
            view: 'VIEW_POSSIBLE_SQUARES',
            play: 'PLAY',
            play_trump: 'PLAY_TRUMP'
        };

        $scope.addPlayer = function () {
            if ($scope.players.length < maximumNumberOfPlayers) {
                var newPlayer = player.newPlayer($scope.players.length);
                $scope.players.push(newPlayer);

                var slot = {
                    index: newPlayer.index,
                    state: newPlayer.slotState.toUpperCase(),
                    player_name: newPlayer.name
                };
                addSlot(slot);
            } else {
                alert(maximumNumberOfPlayers.toString() + ' maximum');
            }
        };

        var addSlot = function (slot) {
            var data = {
                rt: rt.add_slot,
                player_id: $scope.me.id,
                slot_updated: slot
            };
            gameApi.send(data);
        };

        $scope.createGame = function () {
            // JSON.stringify of a player with a pawn can crash on some browsers like Chrome.
            var players = $scope.players.map(function (player) {
                return {name: player.name, index: player.index};
            });

            var data = {
                rt: rt.create_game,
                player_id: $scope.currentPlayer.id,
                create_game_request: players
            };

            gameApi.send(data);
        };

        $scope.slotStateChanged = function (index, state) {
            console.log(index);
            console.log(state);
        };

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
         * @param {type} data The data recieved from the server.
         */
        function updateGameParameters(data) {
            if (data.hasOwnProperty('newSquare')) {
                var playerPawn = $scope.currentPlayer.pawn;
                player.move(playerPawn, data.newSquare.x, data.newSquare.y);
            }

            // The server cannot know about pawns. We get it from $scope.players
            $scope.currentPlayer = $scope.players[data.nextPlayer.id];
            $scope.currentPlayerCards = data.possibleCardsNextPlayer;
            $scope.currentPlayerTrumps = data.trumpsNextPlayer;
            $scope.winners = data.winners;
            $scope.selectedCard = null;
            $scope.highlightedSquares = [];
            $scope.activeTrumps = data.trumps;

            isGameOver(data.gameOver);
        }

        gameApi.onMessage(function (event) {
            ws.parse(event).then(function (data) {
                switch (data.rt) {
                    case rt.game_initialized:
                        initializeMe(data);
                        initializeSlots();
                        break;
                    case rt.create_game:
                        createGame(data);
                        break;
                    case rt.view:
                        $scope.highlightedSquares = data.possible_squares;
                        break;
                    case rt.play:
                        updateGameParameters(data);
                        break;
                    case rt.play_trump:
                        updateScopeOnSuccessfulTrump(data);
                        break;
                }
            });
        });

        gameApi.onError(handleError.show);

        var initializeMe = function (data) {
            $scope.me = {
                id: data.player_id,
                is_game_master: data.is_game_master
            };
        };

        var initializeSlots = function () {
            $scope.players.forEach(function (player) {
                var slot = {
                    index: player.index,
                    state: player.slotState.toUpperCase(),
                    player_name: player.name
                };
                addSlot(slot);
            });
        };

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
                rt: rt.view,
                player_id: $scope.currentPlayer.id,
                play_request: {
                    card_name: cardName,
                    card_color: cardColor
                }
            };
            // Stores the selected card.
            $scope.selectedCard = {name: cardName, color: cardColor};
            gameApi.send(data);
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
                    rt: rt.play,
                    player_id: $scope.currentPlayer.id,
                    play_request: {
                        card_name: $scope.selectedCard.name,
                        card_color: $scope.selectedCard.color,
                        x: squareX,
                        y: squareY
                    }
                };
                // TODO: handle error.
                gameApi.send(data);
            } else if ($scope.selectedCard === null) {
                alert('Please select a card.');
            }
        };

        /**
         * Pass this turn.
         */
        $scope.pass = function () {
            var data = {
                rt: rt.play,
                player_id: $scope.currentPlayer.id,
                play_request: {
                    pass: true
                }
            };
            gameApi.send(data);
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
                rt: rt.play,
                player_id: $scope.currentPlayer.id,
                play_request: {
                    discard: true,
                    card_name: $scope.selectedCard.name,
                    card_color: $scope.selectedCard.color
                }
            };
            gameApi.send(data);
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
            $scope.trumpName = trump.name;
            // We can't apply the trump on the current player.
            $scope.otherPlayers = $scope.players.filter(function (player) {
                return player.index !== $scope.currentPlayer.index;
            });
            if (trump.mustTargetPlayer) {
                selectTrumpTargetedPlayer();
            } else {
                playTrump();
            }
        };

        var selectTrumpTargetedPlayer = function () {
            $scope.showTargetedPlayerForTrumpSelector = true;
        };

        /**
         * Play the trump.
         * @returns {undefined}
         */
        var playTrump = function () {
            var targetIndex = $scope.trumpTargetedPlayer === undefined ? null :
                    $scope.trumpTargetedPlayer;
            var data = {
                rt: rt.play_trump,
                player_id: $scope.currentPlayer.id,
                trump_request: {
                    target_index: targetIndex,
                    name: $scope.trumpName
                }
            };
            gameApi.send(data);
        };

        $scope.submitSelectTargetedPlayerForm = function () {
            var playerCorrectlyTargeted = $scope.showTargetedPlayerForTrumpSelector &&
                    $scope.trumpTargetedPlayer !== undefined;
            if (playerCorrectlyTargeted) {
                playTrump();
            }
        };

        $scope.cancelSelectTargetedPlayerForm = function () {
            $scope.trumpTargetedPlayer = undefined;
            hiddeTrumpPopup();
        };


        var hiddeTrumpPopup = function () {
            $scope.showTargetedPlayerForTrumpSelector = false;
        };

        var updateScopeOnSuccessfulTrump = function (data) {
            $scope.trumpTargetedPlayer = undefined;
            hiddeTrumpPopup();
            $scope.activeTrumps = data.play_trump;
        };
    }
]);
