/**
 * Service containing functions to log the AJAX error messages.
 *
 * Exported function:
 * - show
 */
gameModule.factory('showHttpError', [
    function () {
        /**
         * Log errors to the console and display the errors to display.
         *
         * @param {Object} data the response of the server.
         *
         * @returns {undefined}
         */
        var show = function (data) {
            if (data.hasOwnProperty('error_to_display')) {
                alert(data.error_to_display);
            }
            if (data.hasOwnProperty('error')) {
                console.log(data.error);
            }
        };
        return {
            show: show
        };
    }
]);

/**
 * Service containing functions to interact with the player.
 *
 * Exported functions:
 * - move
 * - init
 */
gameModule.factory('player', [
    function () {
        var move = function (player, x, y) {
            player.attr('cx', x);
            player.attr('cy', y);
        };

        /**
         * Initialize a new array of players.
         *
         * @param {type} numberMaximumOfPlayers
         * @returns {Array}
         */
        var init = function (numberMaximumOfPlayers) {
            var players = [];
            for (var i = 0; i < numberMaximumOfPlayers; i++) {
                players.push({
                    index: i,
                    name: ''
                });
            }

            return players;
        };

        return {
            move: move,
            init: init
        };
    }
]);
