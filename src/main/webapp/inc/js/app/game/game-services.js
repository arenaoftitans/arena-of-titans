/* global gameModule, angular */

/**
 * Service containing functions to log the AJAX error messages.
 *
 * Exported function:
 * - show
 */
gameModule.factory('handleError', [
    function () {
        var hasError = function (data, type) {
            if (type) {
                return data.hasOwnProperty(type);
            }

            var hasErrorToDisplay = data.hasOwnProperty('error_to_display');
            var hasError = data.hasOwnProperty('error');
            return hasError || hasErrorToDisplay;
        };

        /**
         * Log errors to the console and display the errors to display.
         *
         * @param {Object} data the response of the server.
         *
         * @returns {undefined}
         */
        var show = function (data) {
            if (data.hasOwnProperty('data')) {
                data = data.data;
            }

            if (hasError(data, 'error_to_display')) {
                alert(data.error_to_display);
            }
            if (hasError(data, 'error')) {
                console.log(data.error);
            }
            if (!hasError(data)) {
                console.error(data);
            }
        };

        return {
            show: show,
            hasError: hasError
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
        var move = function (pawnId, x, y) {
            try {
                var pawn = angular.element(document.getElementById(pawnId));
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
                players.push(newPlayer(i));
            }

            return players;
        };

        var newPlayer = function (currentNumberOfPlayers) {
            var player = {
                index: currentNumberOfPlayers,
                name: '',
                slotState: 'closed',
            };

            return player;
        };

        return {
            move: move,
            init: init,
            newPlayer: newPlayer
        };
    }
]);


/**
 * Exported function:
 * - parse(event, callback): callback is called only if event.data doesn't contain any error.
 */
gameModule.factory('ws', ['$q', 'handleError',
    function ($q, handleError) {
        var parse = function (event) {
            var deferred = $q.defer();
            var data = JSON.parse(event.data);
            if (data === null) {
                deferred.reject('Empty response');
            } else if (handleError.hasError(data)) {
                handleError.show(data);
                deferred.reject('data has own property error or error_to_display');
            } else {
                deferred.resolve(data);
            }

            return deferred.promise;
        };

        return {
            parse: parse
        };
    }
]);
