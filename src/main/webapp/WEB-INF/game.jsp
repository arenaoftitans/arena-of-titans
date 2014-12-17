<%@page contentType="text/html" pageEncoding="UTF-8"%>
<%@taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core"%>
<!DOCTYPE html>
<html>
    <head>
        <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
        <title>Last Line</title>
        <link rel="stylesheet" type="text/css" href="inc/css/board.css">
        <link rel="stylesheet" type="text/css" href="inc/css/global.css">
        <script src="inc/js/lib/angular.js" type="text/javascript"></script>
        <script src="inc/js/lib/d3.js" charset="utf-8" type="text/javascript"></script>
        <script src="inc/js/app.js" type="text/javascript"></script>
        <script src="inc/js/app/game/game-module.js" type="text/javascript"></script>
        <script src="inc/js/app/game/game-services.js" type="text/javascript"></script>
        <script src="inc/js/app/game/game-ctrl.js" type="text/javascript"></script>
    </head>
    <body ng-app="lastLine">

        <div id="bloc_top"> 

        </div>

        <div id="bloc_total"> 

            <div id="bloc_left">

            </div> <!--bloc left-->	

            <div id="bloc_middle">

                <div ng-controller="game" id="gameController">
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




                    <div id="game" class="hidden" ng-class="{hidden: gameOver}">

                        <div id="bloc_middle_centre">

                            <div id="gameBoardContainer">
                                ${svgBoard}
                            </div>


                        </div> <!--bloc middle center -->

                        <div id="bloc_middle_bottom">
                            <center>
                            <div>
                                <div>Player: {{currentPlayer.name}}</div>
                                <div id="movementsCardsInHand">
                                    <div ng-repeat="card in currentPlayerCards" class="movementsCardContainer">
                                        <img class="movementsCard"
                                             ng-class="{selectedCard: isSelected(card.name, card.color)}"
                                             ng-click="viewPossibleMovements(card.name, card.color)"
                                             ng-src="/aot/inc/img/cards/movement/{{card.name| lowercase}}_{{card.color| lowercase}}.png"
                                             />
                                    </div>
                                    <button ng-click="pass()">Pass</button>
                                </div>
                            </div>
                            </center>
                        </div> <!--bloc middle bottom-->

                    </div>

                    <div ng-class="{hidden: !gameOver}">
                        The game is over. The winner are :
                        <ol>
                            <li ng-repeat="player in winners">{{player}}</li>
                        </ol>
                    </div> <!--game over-->


                </div>

            </div> <!--bloc middle-->

            <div id="bloc_right">
                <div id="bloc_right_centre">

                </div>

                <div id="bloc_right_bottom">

                </div>

            </div> <!--bloc right-->
        </div> <!--bloc total-->
    </body>
</html>
