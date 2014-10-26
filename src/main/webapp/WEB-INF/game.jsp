<%@page contentType="text/html" pageEncoding="UTF-8"%>
<%@taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core"%>
<!DOCTYPE html>
<html>
    <head>
        <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
        <title>Last Line</title>
        <link rel="stylesheet" type="text/css" href="inc/css/board.css"></link>
        <script src="inc/js/lib/jquery-2.1.1.js" type="text/javascript"></script>
        <script src="inc/js/lib/angular.js" type="text/javascript"></script>
        <script src="inc/js/game.js" type="text/javascript"></script>
    </head>
    <body ng-app="lastLine">
        <div ng-controller="playButtons">
            <label>x : </label>
            <input type="text" ng-model="x" />
            <label>y :  </label>
            <input type="text" ng-model="y" />
            <div ng-repeat="color in colors">
                   <button ng-repeat="card in cards" ng-click="play(card, color)">{{ card }} {{ color }}</button>
        </div>
    </div>

        <c:import url="standard_board.svg" />
    </body>
</html>
