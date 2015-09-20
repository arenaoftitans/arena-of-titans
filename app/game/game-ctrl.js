gameModule.controller("game", ['$scope',
  '$websocket',
  '$rootScope',
  '$window',
  '$http',
  '$q',
  'aotGlobalOptions',
  'handleError',
  'player',
  'ws',
  function ($scope, $websocket, $rootScope, $window, $http, $q,
          aotGlobalOptions, handleError, player, ws) {
    'use strict';

    var maximumNumberOfPlayers = 8;
    var gameAnchor;
    var host = aotGlobalOptions.apiWebsocketScheme + aotGlobalOptions.apiHost;
    var gameApi;
    var gameId;

    var getGameId = function () {
      var anchorParts = $window.location.hash.substring(2).split('/');
      return anchorParts[0];
    };

    var initNewGame = function () {
      if (!!gameApi) {
        gameApi.close();
      }
      gameApi = $websocket(host);

      gameApi.onMessage(function (event) {
        ws.parse(event).then(function (data) {
          switch (data.rt) {
            case rt.game_initialized:
              initializeMe(data);
              initializeSlots(data);
              break;
            case rt.slot_updated:
              refreshSlot(data.slot);
              if (aotGlobalOptions.debug) {
                $scope.createGame();
              }
              break;
            case rt.create_game:
              createGame(data);
              break;
            case rt.view:
              $scope.highlightedSquares = data.possible_squares.map(function (square) {
                return 'square-' + square.x + '-' + square.y;
              });
              break;
            case rt.play:
              updateGameParameters(data);
              break;
            case rt.player_moved:
              var playerPawnId = $scope.activePawns[data.player_index];
              player.move(playerPawnId, data.new_square.x, data.new_square.y);
              break;
          }
        });
      });

      gameApi.onError(handleError.show);

      $scope.me = {
        id: null,
        gameMaster: false,
        name: askMyName()
      };
      $scope.highlightedSquares = []; // Stores the ids of the squares that are highlighted.
      $scope.players = [];
      $scope.activePawns = [];
      $scope.selectedCard = null;
      $scope.trumpTargetedPlayer = {index: -1};
      $scope.gameStarted = false;
      $scope.showNoCardSelectedPopup = false;
      $scope.showDiscardConfirmationPopup = false;
      $scope.showTargetedPlayerForTrumpSelector = false;
      $scope.shareUrl = $window.location;

      gameId = getGameId();
      if (!!gameId) {
        updateGameId();
        gameApi.send({
          rt: rt.init_game,
          game_id: gameId,
          player_name: $scope.me.name
        });
      } else {
        gameApi.send({
          rt: rt.init_game,
          player_name: $scope.me.name
        });
      }
    };

    var askMyName = function () {
      if (aotGlobalOptions.debug) {
        return 'Player 1';
      } else {
        return prompt('Enter your name', 'Player');
      }
    };

    var updateGameId = function () {
      $window.location = '#' + gameId;
      gameAnchor = '#' + gameId + '/game';
    };

    $scope.$on("$routeChangeSuccess", function () {
      var newGameId = getGameId();
      if (!!newGameId && newGameId !== gameId) {
        gameId = newGameId;
        initNewGame();
      }
    });

    // Requests types
    var rt = {
      init_game: 'INIT_GAME',
      game_initialized: 'GAME_INITIALIZED',
      add_slot: 'ADD_SLOT',
      slot_updated: 'SLOT_UPDATED',
      create_game: 'CREATE_GAME',
      view: 'VIEW_POSSIBLE_SQUARES',
      play: 'PLAY',
      play_trump: 'PLAY_TRUMP',
      player_moved: 'PLAYER_MOVED'
    };

    initNewGame();

    $scope.addPlayer = function () {
      if ($scope.players.length < maximumNumberOfPlayers) {
        var newPlayer = player.newPlayer($scope.players.length);

        var slot = {
          index: newPlayer.index,
          state: newPlayer.slotState.toUpperCase(),
          player_name: newPlayer.name
        };
        if (aotGlobalOptions.debug) {
          slot.player_name = 'Player 2';
          slot.state = 'TAKEN';
        }
        addSlot(slot);
      } else {
        alert(maximumNumberOfPlayers.toString() + ' maximum');
      }
    };

    var addSlot = function (slot) {
      var data = {
        rt: rt.add_slot,
        slot: slot
      };
      gameApi.send(data);
    };

    $scope.createGame = function () {
      var players = $scope.players.map(function (player) {
        return {name: player.name, index: player.index};
      });

      var data = {
        rt: rt.create_game,
        create_game_request: players
      };

      gameApi.send(data);
    };

    $scope.slotStateChanged = function (index, state) {
      var slot = {
        index: index,
        state: state.toUpperCase(),
        player_name: $scope.players[index].name
      };
      updateSlot(slot);
    };

    var updateSlot = function (slot) {
      var data = {
        rt: rt.slot_updated,
        slot: slot
      };
      gameApi.send(data);
    };

    function createGame (game) {
      for (var i in game.players) {
        var player = $scope.players[i];
        var playerUpdated = game.players[i];
        player.name = playerUpdated.name;
      }
      // Remove unused player from $scope.players
      var actualNumberOfPlayers = game.players.length;
      $scope.players.splice(actualNumberOfPlayers);

      $scope.gameStarted = true;
      $window.location = gameAnchor;

      updateGameParameters(game);
    }

    /**
     * Update the scope based on the data send by the server when a move was successfull.
     * @param {type} data The data recieved from the server.
     */
    function updateGameParameters (data) {
      $scope.me.hand = data.hand;
      $scope.me.trumps = data.trumps;
      $scope.winners = data.winners;
      $scope.selectedCard = null;
      $scope.highlightedSquares = [];
      $scope.activeTrumps = data.active_trumps;

      updateScopeOnSuccessfulTrump(data);

      isGameOver(data.gameOver);
    }

    var initializeMe = function (data) {
      if (!gameId) {
        gameId = data.game_id;
        updateGameId();
      }
      $scope.me = angular.extend($scope.me, {
        id: data.player_id,
        index: data.index,
        gameMaster: data.is_game_master
      });
    };

    var initializeSlots = function (data) {
      if (data.slots) {
        data.slots.forEach(refreshSlot);
      }

      setMySlot();

      // Automatically open a second slot if I am the game master to ease game creation.
      if ($scope.me.gameMaster) {
        $scope.addPlayer();
      }
    };

    var refreshSlot = function (slot) {
      if (!$scope.players[slot.index]) {
        $scope.players.push({
          index: slot.index
        });
      }
      $scope.players[slot.index].name = slot.player_name;
      $scope.players[slot.index].slotState = slot.state.toLowerCase();
    };

    var setMySlot = function () {
      $scope.players[$scope.me.index].slotState = 'taken';
      $scope.players[$scope.me.index].name = $scope.me.name;
    };

    function isGameOver (gameOver) {
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
          play_request: {
            card_name: $scope.selectedCard.name,
            card_color: $scope.selectedCard.color,
            x: parseInt(squareX, 10),
            y: parseInt(squareY, 10)
          }
        };
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
        return player.index !== $scope.me.index;
      });
      if (trump.must_target_player) {
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
      var targetIndex = $scope.trumpTargetedPlayer.index > -1 ?
              $scope.trumpTargetedPlayer.index : null;
      var data = {
        rt: rt.play_trump,
        play_request: {
          target_index: targetIndex,
          name: $scope.trumpName
        }
      };
      gameApi.send(data);
    };

    $scope.submitSelectTargetedPlayerForm = function () {
      var playerCorrectlyTargeted = $scope.showTargetedPlayerForTrumpSelector &&
              $scope.trumpTargetedPlayer.index > -1;
      if (playerCorrectlyTargeted) {
        playTrump();
      }
    };

    $scope.cancelSelectTargetedPlayerForm = function () {
      $scope.trumpTargetedPlayer.index = -1;
      hiddeTrumpPopup();
    };


    var hiddeTrumpPopup = function () {
      $scope.showTargetedPlayerForTrumpSelector = false;
    };

    var updateScopeOnSuccessfulTrump = function (data) {
      $scope.trumpTargetedPlayer.index = -1;
      hiddeTrumpPopup();
      $scope.activeTrumps = data.active_trumps;
    };
  }
]);
