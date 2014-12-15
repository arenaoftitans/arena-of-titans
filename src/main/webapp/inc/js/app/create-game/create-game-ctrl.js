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
    'createGame',
    function ($scope, $http, $rootScope, showHttpError, player, createGame) {
        var createGameUrl = '/aot/rest/createGame';
        var createGameMethod = 'POST';
        var createGameDivId = '#createGame';
        var game = {};
        var numberMaximumOfPlayers = 8;
        $scope.players = player.init(numberMaximumOfPlayers);

        $scope.createGame = function () {
            $http({
                url: createGameUrl,
                method: createGameMethod,
                data: $scope.players
            })
                    .success(function (data) {
                        d3.select(createGameDivId).classed('hidden', true);
                        game.nextPlayer = data.nextPlayer;
                        game.possibleCardsNextPlayer = data.possibleCardsNextPlayer;
                        game.trumpsNextPlayer = data.trumpsNextPlayer;
                        game.players = data.players;
                        createGame.create(game);
                        $rootScope.$emit('gameCreated');
                    })
                    .error(function (data) {
                        showHttpError.show(data);
                    });
        };
    }]);