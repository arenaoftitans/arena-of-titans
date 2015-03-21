/* global playTrumpModule */

playTrumpModule.controller('playTrump', ['$scope',
    '$rootScope',
    '$websocket',
    'handleError',
    'ws',
    function ($scope, $rootScope, $websocket, handleError, ws) {
        $scope.showTargetedPlayerForTrumpSelector = false;
        $scope.currentPlayerId = null;

        var gameId = location.pathname.split('/').pop();
        var playTrumpUrl = '/api/playTrump/' + gameId;
        var host = 'ws://localhost:8080';
        var playTrumpWs = $websocket(host + playTrumpUrl);
        playTrumpWs.onMessage(function (event) {
            ws.parse(event).then(updateScopeOnSuccessfulTrump);
        });
        playTrumpWs.onError(handleError.show);

        var unbind = $rootScope.$on('wantToPlayTrump', function (event, trump, players,
                currentPlayerIndex, currentPlayerId) {
            $scope.trumpName = trump.name;
            $scope.currentPlayerId = currentPlayerId;
            // We don't apply the trump on the current player.
            $scope.players = players.filter(function (player) {
                return player.index !== currentPlayerIndex;
            });
            if (trump.mustTargetPlayer) {
                selectTargetedPlayer();
            } else {
                play();
            }
        });
        $rootScope.$on('destroy', unbind);

        var selectTargetedPlayer = function () {
            $scope.showTargetedPlayerForTrumpSelector = true;
        };

        /**
         * Play the trump.
         * @returns {undefined}
         */
        var play = function () {
            var targetIndex = $scope.trumpTargetedPlayer === undefined ? null :
                    $scope.trumpTargetedPlayer;
            var data = {
                rt: 'PLAY_TRUMP',
                player_id: $scope.currentPlayerId,
                trump_request: {
                    target_index: targetIndex,
                    name: $scope.trumpName
                }
            };
            playTrumpWs.send(data);
        };

        $scope.submitSelectTargetedPlayerForm = function () {
            var playerCorrectlyTargeted = $scope.showTargetedPlayerForTrumpSelector &&
                    $scope.trumpTargetedPlayer !== undefined;
            if (playerCorrectlyTargeted) {
                play();
            }
        };

        $scope.cancelSelectTargetedPlayerForm = function () {
            $scope.trumpTargetedPlayer = undefined;
            hidde();
        };


        var hidde = function () {
            $scope.showTargetedPlayerForTrumpSelector = false;
        };

        var updateScopeOnSuccessfulTrump = function (data) {
            $rootScope.$emit('trumpPlayed', data);
            $scope.trumpTargetedPlayer = undefined;
            hidde();
        };
    }]);
