/**
 * Post the list of registered players and create the game.
 *
 * Emit a 'gameCreated' signal when done.
 */
app.controller('createGame', ['$scope',
    '$http',
    '$rootScope',
    'showHttpError',
    'player',
    function ($scope, $http, $rootScope, showHttpError, player) {
        var createGameUrl = '/aot/rest/createGame';
        var createGameMethod = 'POST';
        var game = {};
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
                        game.nextPlayer = data.nextPlayer;
                        game.possibleCardsNextPlayer = data.possibleCardsNextPlayer;
                        game.trumpsNextPlayer = data.trumpsNextPlayer;
                        game.players = data.players;
                        game.winners = [];
                        game.trumps = [];
                        game.gameOver = false;
                        $scope.gameCreated = true;
                        $rootScope.$emit('gameCreated', game);
                    })
                    .error(function (data) {
                        showHttpError.show(data);
                    });
        };
    }]);