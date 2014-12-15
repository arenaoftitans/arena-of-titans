app.controller('gameOver', ['$scope',
    '$rootScope',
    function ($scope, $rootScope) {
        $scope.winners = {};
        var gameOverScreenId = '#gameOverScreen';

        var unbindOnGameOver = $rootScope.$on('gameOver', function (event, winners) {
            $scope.winners = winners;
            d3.select(gameOverScreenId).classed('hidden', false);
        });
        $rootScope.$on('destroy', unbindOnGameOver);
    }]);
