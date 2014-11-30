angular.module('lastLine.game').factory('showHttpError', [
    function () {
        /**
         * Use alert to print errors.
         *
         * @param {Object} data the response of the server.
         *
         * @returns {undefined}
         */
        var show = function (data) {
            if (data.hasOwnProperty('error_to_display')) {
                alert(data.error_to_display);
            } else {
                console.log(data.error);
            }
        };
        return {
            show: show
        };
    }
]);

angular.module('lastLine.game').factory('squares', [
    function () {
        var reset = function (highlightedSquares) {
            for (var index in highlightedSquares) {
                var id = highlightedSquares[index];
                d3.select('#' + id).classed('highlightedSquare', false);
            }
        };

        var highlight = function (highlightedSquares) {
            for (var index in highlightedSquares) {
                var id = highlightedSquares[index];
                d3.select('#' + id).classed('highlightedSquare', true);
            }
        };

        return {
            reset: reset,
            highlight: highlight
        };
    }
]);

angular.module('lastLine.game').factory('player', [
    function () {
        var playerIdKey = 'id';
        var xCoordCircleKey = 'cx';
        var yCoordCircleKey = 'cy';
        var radiusKey = 'r';
        var transformKey = 'transform';
        var boardLayer = 'boardLayer';

        var move = function (playerIndex, squareId) {
            var playerId = 'player' + playerIndex;
            deletePlayer(playerId);
            createNewCircle(playerId, squareId);
        };

        var deletePlayer = function (playerId) {
            var circleToDelete = document.getElementById(playerId);
            if (circleToDelete) {
                circleToDelete.parentNode.removeChild(circleToDelete);
            }
        };

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

        return {
            move: move
        };
    }
]);