/**
 * Signals list:
 * <ul>
 * <li>gameCreated</li>
 * <li>gameOver</li>
 * </ul>
 * @type @exp;angular@call;module
 */
var app = angular.module("lastLine", [
    'lastLine.game',
    'lastLine.create-game',
    'lastLine.game-over'
]);