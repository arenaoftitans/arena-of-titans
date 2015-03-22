createGameModule.directive('slot', function () {
    'use strict';
    return {
        scope: {
            player: '=player',
            stateChanged: '&stateChanged'
        },
        link: function (scope, element, attributes) {
            scope.possibleStates = ['closed', 'open', 'reserved', 'taken'];
            if (scope.player.index === 0 || scope.player.index === 1) {
                scope.state = 'open';
            } else {
                scope.state = 'closed';
            }
            scope.isDisabled = false;
        },
        templateUrl: '/inc/html/game/create/slot.html'
    };
});
