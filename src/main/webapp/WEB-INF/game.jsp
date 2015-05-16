<%@page contentType="text/html" pageEncoding="UTF-8"%>
<%@taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core"%>
<%@ taglib tagdir="/WEB-INF/tags" prefix="t" %>
<!DOCTYPE html>
<html>
    <head>
        <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
        <title>Arena Of Titans</title>
        <link rel="stylesheet" type="text/css" href="/inc/css/global.css">
        <link rel="stylesheet" type="text/css" href="/inc/css/gamepage.css">
        <link rel="stylesheet" type="text/css" href="/inc/css/createGame.css">

        <script src="/dist/myapp.js" type="text/javascript"></script>

    </head>
    <body ng-app="aot" ng-controller="game">

        <div id="bloc_top">
            <div id="logo">
            </div>
            {{me.name}}
        </div>

        <div ng-view=""></div>

        <div ng-controller="gameOver" id="gameOverScreen" class="popup" ng-class="{hidden: !gameOver}">
            <p class="textPopup">The game is over. The winner are :</p>
            <ol>
                <li class="textPopup" ng-repeat="player in winners">{{player}}</li>
            </ol>
        </div>

        <t:piwik />
    </body>
</html>
