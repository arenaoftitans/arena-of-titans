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
        templateUrl: '/inc/html/game/create/slot.html'
    };
});

gameModule.directive('aotSvg', function () {
    'use strict';
    return {
        replace: true,
        templateUrl: '/getBoard/standard'
    };
});
