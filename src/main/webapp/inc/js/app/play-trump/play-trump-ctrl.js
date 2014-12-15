app.controller('playTrump', ['$scope',
    '$rootScope',
    '$http',
    'showHttpError',
    function ($scope, $rootScope, $http, showHttpError) {
        var targetedPlayerForTrumpSelectorId = '#targetedPlayerForTrumpSelector';
        var playTrumpUrl = '/aot/rest/playTrump';
        var playTrumpMethod = 'GET';

        var unbind = $rootScope.$on('wantToPlayTrump', function (event, trumpName, players) {
            $scope.trumpName = trumpName;
            $scope.players = players;
            selectTargetedPlayer();
        });
        $rootScope.$on('destroy', unbind);

        var selectTargetedPlayer = function () {
            d3.select(targetedPlayerForTrumpSelectorId).classed('hidden', false);
        };

        $scope.submitSelectTargetedPlayerForm = function () {
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

        $scope.cancelSelectTargetedPlayerForm = function () {
            $scope.trumpTargetedPlayer = {};
            hidde();
        };


        var hidde = function () {
            d3.select(targetedPlayerForTrumpSelectorId).classed('hidden', true);
        };

        var updateScopeOnSuccessfulTrump = function (data) {
            $rootScope.$emit('trumpPlayed', data);
            $scope.trumpTargetedPlayer = {};
            hidde();
        };
    }]);
