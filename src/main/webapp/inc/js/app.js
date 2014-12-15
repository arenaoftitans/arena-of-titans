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
var app = angular.module("lastLine", [
    'lastLine.game',
    'lastLine.create-game',
    'lastLine.game-over',
    'lastLine.play-trump'
]);