/**
 * Post the list of registered players and create the game.
 *
 * Emit a 'gameCreated' signal when done.
 */
createGameModule.controller('createGame', ['$scope',
    '$http',
    '$rootScope',
    'showHttpError',
    'player',
    function ($scope, $http, $rootScope, showHttpError, player) {
        var createGameUrl = '/aot/rest/createGame';
        var createGameMethod = 'POST';
        $scope.game = {};
        var numberMaximumOfPlayers = 8;
        $scope.players = player.init(numberMaximumOfPlayers);
        $scope.gameCreated = false;

        $scope.createGame = function () {
            $http({
                url: createGameUrl,
                method: createGameMethod,
                data: $scope.players
            })
                    .success(function (data) {
                        $scope.game.nextPlayer = data.nextPlayer;
                        $scope.game.possibleCardsNextPlayer = data.possibleCardsNextPlayer;
                        $scope.game.trumpsNextPlayer = data.trumpsNextPlayer;
                        $scope.game.players = data.players;
                        $scope.game.winners = [];
                        $scope.game.trumps = [];
                        $scope.game.gameOver = false;
                        $scope.gameCreated = true;
                        $rootScope.$emit('gameCreated', $scope.game);
                    })
                    .error(function (data) {
                        showHttpError.show(data);
                    });
        };
    }]);