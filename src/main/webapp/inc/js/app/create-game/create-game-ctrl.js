/* global createGameModule */

/**
 * Post the list of registered players and create the game.
 *
 * Emit a 'gameCreated' signal when done.
 */
createGameModule.controller('createGame', ['$window',
    '$scope',
    '$http',
    'handleError',
    'player',
    function ($window, $scope, $http, handleError, player) {
        'use strict';
        var createGameUrl = '/rest/createGame';
        var createGameMethod = 'POST';
        var gameUrlRoot = '/game/';
        $scope.game = {};
        var maximumNumberOfPlayers = 8;
        var initialNumberOfOpenedSlot = 2;
        $scope.players = player.init(initialNumberOfOpenedSlot);

        $scope.addPlayer = function () {
            if ($scope.players.length < maximumNumberOfPlayers) {
                $scope.players.push(player.newPlayer($scope.players.length));
            } else {
                alert(maximumNumberOfPlayers.toString() + ' maximum');
            }
        };

        $scope.createGame = function () {
            // JSON.stringify of a player with a pawn can crash on some browsers like Chrome.
            var players = $scope.players.map(function (player) {
                return {name: player.name, index: player.index};
            });

            $http({
                url: createGameUrl,
                method: createGameMethod,
                data: players
            })
                    .success(function (data) {
                        var gameId = data.game_id;
                        $window.location = gameUrlRoot + gameId;
                    })
                    .error(function (data) {
                        handleError.show(data);
                    });

        $scope.slotStateChanged = function (index, state) {
            console.log(index);
            console.log(state);
        };
    }]);