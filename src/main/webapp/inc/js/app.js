/**
 * Signals list:
 * <ul>
 * <li>gameCreated</li>
 * <li>gameOver</li>
 * <li>wantToPlayTrump</li>
 * <li>trumpPlayed</li>
 * </ul>
 * @type @exp;angular@call;module
 */
var app = angular.module("aot", [
    'ngRoute',
    'ngWebSocket',
    'aot.game',
    'aot.game-over'
]);

app.config(['$routeProvider',
    function ($routeProvider) {
        $routeProvider
                .when('/', {
                    templateUrl: '/partials/create.html'
                })
                .when('/game', {
                    templateUrl: '/partials/game.html'
                })
                .otherwise({redirectTo: '/'});
    }
]);
