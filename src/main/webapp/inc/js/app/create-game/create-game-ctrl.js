/**
 * Post the list of registered players and create the game.
 *
 * Emit a 'gameCreated' signal when done.
 */
createGameModule.controller('createGame', ['$scope',
    '$http',
    'showHttpError',
    'player',
    function ($scope, $http, showHttpError, player) {
        var createGameUrl = '/aot/rest/createGame';
        var createGameMethod = 'POST';
        var gameUrl = '/aot/game';
        $scope.game = {};
        var numberMaximumOfPlayers = 8;
        $scope.players = player.init(numberMaximumOfPlayers);

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
                    .success(function () {
                        window.location = gameUrl;
                    })
                    .error(function (data) {
                        showHttpError.show(data);
                    });
        };
    }]);