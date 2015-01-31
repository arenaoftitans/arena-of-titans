playTrumpModule.controller('playTrump', ['$scope',
    '$rootScope',
    '$http',
    'showHttpError',
    function ($scope, $rootScope, $http, showHttpError) {
        $scope.showTargetedPlayerForTrumpSelector = false;
        var playTrumpUrl = '/aot/rest/playTrump';
        var playTrumpMethod = 'GET';

        /**
         * Get the trump the player clicked on and display a pop-up to select the target player and
         * then play the trump or directly play the trump.
         *
         * @type @exp;$rootScope@call;$on
         */
        var unbind = $rootScope.$on('wantToPlayTrump', function (event, trump, players,
                currentPlayerIndex) {
            $scope.trumpName = trump.name;
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
            $http({
                url: playTrumpUrl,
                method: playTrumpMethod,
                params: {
                    targetIndex: $scope.trumpTargetedPlayer,
                    name: $scope.trumpName
                }
            })
                    .success(function (data) {
                        updateScopeOnSuccessfulTrump(data);
                    })
                    .error(function (data) {
                        showHttpError.show(data);
                    });
        };

        $scope.submitSelectTargetedPlayerForm = function () {
            play();
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
