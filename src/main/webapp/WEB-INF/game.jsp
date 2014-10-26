<%@page contentType="text/html" pageEncoding="UTF-8"%>
<%@taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core"%>
<!DOCTYPE html>
<html>
    <head>
        <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
        <title>Last Line</title>
        <script src="inc/js/lib/jquery-2.1.1.js" type="text/javascript"></script>
        <script src="inc/js/lib/angular.js" type="text/javascript"></script>
        <script src="inc/js/game.js" type="text/javascript"></script>
    </head>
    <body ng-app="lastLine">
        <div ng-controller="playButtons">
            <button ng-click="play('queen')">Queen</button>
            <button ng-click="play('king')">King</button>
            <button ng-click="play('warrior')">Warrior</button>
            <button ng-click="play('assassin')">Assassin</button>
            <button ng-click="play('wizard')">Wizard</button>
            <button ng-click="play('bishop')">Bishop</button>
        </div>

        <c:import url="standard_board.svg" />
    </body>
</html>
