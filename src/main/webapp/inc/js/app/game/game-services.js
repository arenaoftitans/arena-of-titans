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
        var playerIdKey = 'id';
        var xCoordCircleKey = 'cx';
        var yCoordCircleKey = 'cy';
        var radiusKey = 'r';
        var transformKey = 'transform';
        var boardLayer = 'boardLayer';

        /**
         * Move the player to a new square.
         *
         * @param {type} playerIndex The id of the player who plays.
         * @param {type} squareId The id of the square on which we want to move.
         */
        var move = function (playerIndex, squareId) {
            var playerId = 'player' + playerIndex;
            deletePlayer(playerId);
            createNewCircle(playerId, squareId);
        };

        /**
         * Remove the player on its current square.
         *
         * @param {type} playerId The id of the player.
         */
        var deletePlayer = function (playerId) {
            var circleToDelete = document.getElementById(playerId);
            if (circleToDelete) {
                circleToDelete.parentNode.removeChild(circleToDelete);
            }
        };

        /**
         * Recreate the circle for the current player.
         *
         * @param {type} playerId The id of the player.
         * @param {type} squareId The id of the square.
         */
        var createNewCircle = function (playerId, squareId) {
            var player = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
            var parameters = getNewCircleParameters(squareId);

            player.setAttribute(playerIdKey, playerId);
            player.setAttribute(xCoordCircleKey, parameters.x);
            player.setAttribute(yCoordCircleKey, parameters.y);
            player.setAttribute(radiusKey, parameters.radius);
            player.setAttribute(transformKey, parameters.transform);
            document.getElementById(boardLayer).appendChild(player);
        };

        /**
         * Get the parameters of the new circle based on the size and position of the square on
         * which the player wants to move.
         *
         * @param {type} squareId The id of the square.
         * @returns {game-services_L57.getNewCircleParameters.parameters}
         */
        var getNewCircleParameters = function (squareId) {
            var parameters = {};
            var square = document.getElementById(squareId);
            var boundingBox = square.getBBox();
            var height = Number(boundingBox.height);
            var width = Number(boundingBox.width);
            parameters.x = Number(boundingBox.x) + width / 2;
            parameters.y = Number(boundingBox.y) + height / 2;
            parameters.radius = width / 4;
            parameters.transform = square.getAttribute('transform');

            return parameters;
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
