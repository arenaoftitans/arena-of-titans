<%@page contentType="text/html" pageEncoding="UTF-8"%>
<%@taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core"%>
<%@ taglib tagdir="/WEB-INF/tags" prefix="t" %>
<!DOCTYPE html>
<html>
    <head>
        <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
        <title>Arena Of Titans</title>
        <link rel="stylesheet" type="text/css" href="/inc/css/board.css">
        <link rel="stylesheet" type="text/css" href="/inc/css/global.css">
        <script src="/inc/js/lib/angular.js" type="text/javascript"></script>
        <script src="/inc/js/lib/angular-route.js"></script>
        <script src="/inc/js/lib/angular-websocket.js" type="text/javascript"></script>
        <script src="/inc/js/app.js" type="text/javascript"></script>

        <script src="/inc/js/app/game/game-module.js" type="text/javascript"></script>
        <script src="/inc/js/app/game/game-directives.js"></script>
        <script src="/inc/js/app/game/game-services.js" type="text/javascript"></script>
        <script src="/inc/js/app/game/game-ctrl.js" type="text/javascript"></script>

        <script src="/inc/js/app/game-over/game-over-module.js" type="text/javascript"></script>
        <script src="/inc/js/app/game-over/game-over-ctrl.js" type="text/javascript"></script>
    </head>
    <body ng-app="aot" ng-controller="game">

        <div id="bloc_top">
            {{me.name}}
        </div>

        <div ng-view=""></div>

        <div ng-controller="gameOver" id="gameOverScreen" class="popup" ng-class="{hidden: !gameOver}">
            The game is over. The winner are :
            <ol>
                <li ng-repeat="player in winners">{{player}}</li>
            </ol>
        </div>

        <t:piwik />
    </body>
</html>
