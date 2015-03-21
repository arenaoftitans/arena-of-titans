/* global angular, expect */

'use strict';

describe('play trump', function () {
    var $scope, $rootScope, $httpBackend;

    beforeEach(angular.mock.module('ngWebSocket', 'ngWebSocketMock', 'aot.game'));

    beforeEach(inject(function (_$rootScope_, $controller) {
        $rootScope = _$rootScope_;
        $scope = $rootScope.$new();
        $controller('game', {$scope: $scope});
    }));

    beforeEach(inject(function (_$httpBackend_) {
        $httpBackend = _$httpBackend_;
        var createGameUrl = '/rest/createGame';

        var gameCreatedData = {
            players: [player1, player2],
            nextPlayer: {
                name: "Toto",
                id: "0"
            },
            possibleCardsNextPlayer: [
                {
                    name: "King",
                    color: "Red"
                }
            ],
            trumpsNextPlayer: [
                {
                    name: "Reinforcement",
                    description: "Allow the player to play one more move.",
                    mustTargetPlayer: false
                }
            ]
        };

        $httpBackend.when('GET', createGameUrl)
                .respond(gameCreatedData);
    }));

    var players, trump, currentPlayerIndex;
    var player1 = {name: 'Toto', index: 0};
    var player2 = {name: 'Tata', index: 1};

    beforeEach(function () {
        trump = {name: 'trump', mustTargetPlayer: false};
        players = [
            player1,
            player2
        ];
        currentPlayerIndex = 0;
    });

    beforeEach(function () {
        $scope.players = players;
        $scope.currentPlayer = player1;
        $scope.playTrump(trump);
    });

    it('must target player', function () {
        trump.mustTargetPlayer = true;
        expect($scope.showTargetedPlayerForTrumpSelector).toBe(false);
        $scope.playTrump(trump);
        expect($scope.trumpName).toBe(trump.name);
        expect($scope.otherPlayers).toEqual([player2]);
        expect($scope.showTargetedPlayerForTrumpSelector).toBe(true);
    });

    it('must not target player', function () {
        $scope.playTrump(trump);
        expect($scope.showTargetedPlayerForTrumpSelector).toBe(false);
        expect($scope.trumpName).toBe(trump.name);
        expect($scope.otherPlayers).toEqual([player2]);
        expect($scope.showTargetedPlayerForTrumpSelector).toBe(false);
    });

    describe('play', function () {
        var $websocketBackend;
        var playTrumpUrl = 'ws://localhost:8080/api/game/context.html';

        beforeEach(inject(function (_$websocketBackend_) {
            $websocketBackend = _$websocketBackend_;
            $websocketBackend.mock();
            $websocketBackend.expectConnect(playTrumpUrl);

            var event = data2event({play_trump: [trump]});
            $websocketBackend.expectSend(event);
        }));

        it('success', function () {
            trump.mustTargetPlayer = false;
            $scope.playTrump(trump);
            expect($scope.trumpTargetedPlayer).not.toBeDefined();
            expect($scope.showTargetedPlayerForTrumpSelector).toBe(false);
            expect($scope.activeTrumps).toEqual([trump]);
        });
    });

});
