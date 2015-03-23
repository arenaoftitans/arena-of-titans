gameModule.directive('slot', function () {
    'use strict';
    return {
        scope: {
            player: '=player',
            stateChanged: '&stateChanged'
        },
        link: function (scope, element, attributes) {
            scope.possibleStates = ['closed', 'open', 'reserved', 'taken'];
            scope.state = 'closed';
            scope.isDisabled = false;
        },
        templateUrl: '/inc/html/game/create/slot.html'
    };
});
