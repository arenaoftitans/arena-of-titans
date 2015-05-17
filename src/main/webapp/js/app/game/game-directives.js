gameModule.directive('slot', function () {
    'use strict';
    return {
        scope: {
            player: '=player',
            stateChanged: '&stateChanged',
            thisPlayer: '=me'
        },
        link: function (scope, element, attributes) {
            scope.possibleStates = ['closed', 'open', 'reserved', 'taken'];
        },
        templateUrl: '/partials/slot.html'
    };
});

gameModule.directive('aotBoard', function () {
    'use strict';
    return {
        replace: true,
        link: function (scope, element, attributes) {
            for (var i in scope.players) {
                scope.activePawns.push('player' + i);
            }
        },
        templateUrl: '/api/getBoard/standard'
    };
});
