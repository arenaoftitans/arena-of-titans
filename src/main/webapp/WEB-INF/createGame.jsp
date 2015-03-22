<%--
    Document   : createGame
    Created on : Feb 2, 2015, 8:40:23 PM
    Author     : jenselme
--%>

<%@page contentType="text/html" pageEncoding="UTF-8"%>
<%@ taglib tagdir="/WEB-INF/tags" prefix="t" %>
<!DOCTYPE html>
<html>
    <head>
        <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
        <title>AOT create Game</title>
        <link rel="stylesheet" type="text/css" href="/inc/css/global.css">
        <script src="/inc/js/lib/angular.js" type="text/javascript"></script>
        <script src="/inc/js/lib/angular-websocket.js" type="text/javascript"></script>
        <script src="/inc/js/app.js" type="text/javascript"></script>

        <script src="/inc/js/app/create-game/create-game-module.js"></script>
        <script src="/inc/js/app/create-game/create-game-directives.js"></script>
        <script src="/inc/js/app/create-game/create-game-ctrl.js"></script>

        <script src="/inc/js/app/game/game-module.js" type="text/javascript"></script>
        <script src="/inc/js/app/game/game-services.js" type="text/javascript"></script>
        <script src="/inc/js/app/game/game-ctrl.js" type="text/javascript"></script>

        <script src="/inc/js/app/game-over/game-over-module.js" type="text/javascript"></script>
        <script src="/inc/js/app/game-over/game-over-ctrl.js" type="text/javascript"></script>
    </head>
    <body ng-app="aot">
        <div id="createGame" ng-controller="createGame">
            <form id="crateGameForm">
                <label>Add players</label>
                <div ng-repeat="player in players">
                    <slot player="player" state-changed="slotStateChanged(index, state)" />
                </div>
                <button ng-click="addPlayer()">Add a player</button>
                <button ng-click="createGame()">Create game</button>
            </form>
        </div>

        <t:piwik />
    </body>
</html>
