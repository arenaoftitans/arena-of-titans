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
      //try {
        var pawn = document.getElementById(pawnId);
        var pawnContainer = document.getElementById(pawnId + 'Container');
        var square = document.getElementById('square-' + x + '-' + y);
        var boundingBox = square.getBBox();
        var transform = square.getAttribute('transform');

        pawnContainer.setAttribute('transform', transform);
        pawn.setAttribute('height', boundingBox.height);
        pawn.setAttribute('width', boundingBox.width);
        pawn.setAttribute('x', boundingBox.x);

        if (square.tagName === 'rect') {
          pawn.setAttribute('y', boundingBox.y);
        } else {
          pawn.setAttribute('y', boundingBox.y + 0.25 * boundingBox.height);
        }
      /*} catch (err) {
        // If we fail to get pawn with pawnId, we are likely in a unit test and pawnId is an
        // angular.element.
        pawnId.attr('cx', x);
        pawnId.attr('cy', y);
      }*/
    };

    var newPlayer = function (currentNumberOfPlayers) {
      var player = {
        index: currentNumberOfPlayers,
        name: '',
        slotState: 'open'
      };

      return player;
    };

    return {
      move: move,
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
