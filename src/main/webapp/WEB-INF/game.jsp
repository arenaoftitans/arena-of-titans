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

        <script src="inc/js/app/create-game/create-game-module.js"></script>
        <script src="inc/js/app/create-game/create-game-ctrl.js"></script>

        <script src="inc/js/app/game/game-module.js" type="text/javascript"></script>
        <script src="inc/js/app/game/game-services.js" type="text/javascript"></script>
        <script src="inc/js/app/game/game-ctrl.js" type="text/javascript"></script>

        <script src="inc/js/app/play-trump/play-trump-module.js" type="text/javascript"></script>
        <script src="inc/js/app/play-trump/play-trump-ctrl.js" type="text/javascript"></script>

        <script src="inc/js/app/game-over/game-over-module.js" type="text/javascript"></script>
        <script src="inc/js/app/game-over/game-over-ctrl.js" type="text/javascript"></script>
    </head>
    <body ng-app="lastLine">

        <div id="bloc_top">

        </div>

        <div id="bloc_total">

            <div id="bloc_left">

            </div> <!--bloc left-->

            <div id="bloc_middle">

                <div id="createGame" ng-controller="createGame">
                    <form id="crateGameForm">
                        <label>Add players</label>
                        <div ng-repeat="player in players">
                            <label>Name of player {{ player.index}}</label>
                            <input type="text" ng-model="player.name" />
                        </div>
                        <button ng-click="createGame()">Create game</button>
                    </form>
                </div>

                <div ng-controller="game" id="gameController">

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
                                        <button ng-click="discard()">Discard selected card.</button>
                                        <div id="noCardSelectedPopup" class="hidden popup">
                                            You must select a card to discard.<br />
                                            <button ng-click="noCardSelectedPopupHidden()">OK</button>
                                        </div>
                                    </div>
                                    <div id="trumps">
                                        <div ng-repeat="trump in currentPlayerTrumps"
                                             ng-click="playTrump(trump)"
                                             class="trump">
                                            {{trump.name}}: {{trump.description}}
                                        </div>
                                    </div>
                                    <div>
                                        Trumps currently active:
                                        <ul id="activeTrumps">
                                            <li ng-repeat="player in activeTrumps">
                                                For {{player.playerName}}:
                                                <ul ng-repeat="trump in player.trumpNames">
                                                    <li>{{trump}}</li>
                                                </ul>
                                            </li>
                                        </ul>
                                    </div>
                                </div>
                            </center>
                        </div> <!--bloc middle bottom-->

                    </div>

                </div>
            </div> <!--bloc middle-->
            <div id="bloc_right">
                <div id="bloc_right_centre">

                </div>

                <div id="bloc_right_bottom">

                </div>

            </div> <!--bloc right-->
        </div> <!--bloc total-->

        <div ng-controller="playTrump" id="targetedPlayerForTrumpSelector" class="popup hidden">
            <form id="targetedPlayerForTrumpSelectorForm">
                <label>Select the player on which to apply the trump.</label>
                <div ng-repeat="player in players" class="player">
                    <input ng-model="$parent.trumpTargetedPlayer"
                           ng-value="player.index"
                           type="radio"
                           name="targetPlayer" />{{player.name}}
                </div>
                <button ng-click="cancelSelectTargetedPlayerForm()">Cancel</button>
                <button ng-click="submitSelectTargetedPlayerForm()">OK</button>
            </form>
        </div>

        <div ng-controller="gameOver" id="gameOverScreen" class="hidden popup">
            The game is over. The winner are :
            <ol>
                <li ng-repeat="player in winners">{{player}}</li>
            </ol>
        </div>
    </body>
</html>
