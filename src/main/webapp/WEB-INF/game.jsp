<%@page contentType="text/html" pageEncoding="UTF-8"%>
<%@taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core"%>
<!DOCTYPE html>
<html>
    <head>
        <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
        <title>Last Line</title>
        <link rel="stylesheet" type="text/css" href="inc/css/board.css">
        <link rel="stylesheet" type="text/css" href="inc/css/global.css">
        <script src="inc/js/lib/jquery-2.1.1.js" type="text/javascript"></script>
        <script src="inc/js/lib/angular.js" type="text/javascript"></script>
        <script src="inc/js/lib/d3.js" charset="utf-8" type="text/javascript"></script>
        <script src="inc/js/app.js" type="text/javascript"></script>
        <script src="inc/js/app/game/game-module.js" type="text/javascript"></script>
        <script src="inc/js/app/game/game-services.js" type="text/javascript"></script>
        <script src="inc/js/app/game/game-ctrl.js" type="text/javascript"></script>
    </head>
    <body ng-app="lastLine">
        <div ng-controller="game">
            <div id="createGame">
                <form id="crateGameForm">
                    <label>Add players</label>
                    <div ng-repeat="player in players">
                        <label>Name of player {{ player.index}}</label>
                        <input type="text" ng-model="player.name" />
                    </div>
                    <button ng-click="createGame()">Create game</button>
                </form>
            </div>

            <div id="game" class="hidden">
                <div>
                    <div>Player: {{currentPlayer.name}}</div>
                    <div ng-repeat="card in currentPlayerCards">
                        <button ng-click="viewPossibleMovements(card.name, card.color)">
                            {{card.name}} {{card.color}}
                        </button>
                    </div>
                </div>

                <div id="gameBoardContainer">
                    ${svgBoard}
                </div>
            </div>
        </div>
    </body>
</html>
