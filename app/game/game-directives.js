gameModule.directive('slot', function () {
  'use strict';
  return {
    scope: {
      player: '=player',
      stateChanged: '&stateChanged',
      thisPlayer: '=me'
    },
    link: function (scope, element, attributes) {
      scope.possibleStates = ['closed', 'open', 'reserved'];
    },
    templateUrl: '/partials/game/slot.html'
  };
});

gameModule.directive('aotBoard', [
  '$window',
  'aotGlobalOptions',
  function ($window, aotGlobalOptions) {
    'use strict';
    return {
      replace: true,
      link: function (scope, element, attributes) {
        for (var i in scope.players) {
          scope.activePawns.push('player' + i);
        }

        // Set SVG initial dimensions and make sure it is update on window resize
        var updateSvgSize = function () {
          var board = document.getElementById('board');
          var boardContainer = document.getElementById('gameBoardContainer');
          board.setAttribute('height', boardContainer.offsetHeight);
          board.setAttribute('width', boardContainer.offsetWidth);
        };
        updateSvgSize();
        $window.addEventListener('resize', updateSvgSize);
      },
      templateUrl: $window.location.protocol + aotGlobalOptions.apiHost + '/boards/standard'
    };
  }]);
