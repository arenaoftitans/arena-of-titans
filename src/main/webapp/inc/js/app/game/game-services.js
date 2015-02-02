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
        var move = function (pawn, x, y) {
            try {
                var square = document.getElementById('square-' + x + '-' + y);
                var boundingBox = square.getBBox();
                var height = Number(boundingBox.height);
                var width = Number(boundingBox.width);
                var x = Number(boundingBox.x) + width / 2;
                var y = Number(boundingBox.y) + height / 2;
                var radius = width / 4;
                var transform = square.getAttribute('transform');
                pawn.attr('cx', x);
                pawn.attr('cy', y);
                pawn.attr('r', radius);
                pawn.attr('transform', transform);
            } catch (err) {
                pawn.attr('cx', x);
                pawn.attr('cy', y);
            }
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
                var pawnElement = document.getElementById('player' + i);
                var pawn = angular.element(pawnElement);
                players.push({
                    index: i,
                    name: '',
                    pawn: pawn
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
