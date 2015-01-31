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
    'aot.game',
    'aot.create-game',
    'aot.game-over',
    'aot.play-trump'
]);