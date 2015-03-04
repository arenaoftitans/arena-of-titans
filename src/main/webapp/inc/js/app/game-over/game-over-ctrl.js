/* global gameOverModule */

gameOverModule.controller('gameOver', ['$scope',
    '$rootScope',
    function ($scope, $rootScope) {
        $scope.winners = {};
        $scope.gameOver = false;

        var unbindOnGameOver = $rootScope.$on('gameOver', function (event, winners) {
            $scope.winners = winners;
            $scope.gameOver = true;
        });
        $rootScope.$on('destroy', unbindOnGameOver);
    }]);
