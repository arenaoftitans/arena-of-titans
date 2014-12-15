angular.module('lastLine.create-game').factory('createGame', [
    function () {
        var game;
        var create = function (newGame) {
            game = newGame;
            game.winners = [];
            game.trumps = [];
            game.gameOver = false;
        };

        var get = function () {
            return game;
        };

        return {
            create: create,
            get: get
        };
    }
]);