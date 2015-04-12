/* global angular, jasmine, expect */

'use strict';

describe('game', function () {
    var $scope, $websocketBackend, controller;

    var cardName = 'King';
    var cardColor = 'Red';

    var player1 = {name: "Toto", id: "0", index: 0, pawn: angular.element()};
    var player1Cards = [
        {name: "King", color: "Red"}
    ];
    var player2 = {name: "Tata", id: "1", index: 1, pawn: angular.element()};
    var player2Cards = [
        {name: "Wizard", color: "Yellow"}
    ];

    var host = 'ws://localhost:8080';
    var gameApiUrl = host + '/api/game/context.html';

    function selectCard() {
        $scope.selectedCard = {};
        $scope.selectedCard.name = cardName;
        $scope.selectedCard.color = cardColor;
    }

    beforeEach(angular.mock.module('ngWebSocket', 'ngWebSocketMock', 'aot.game'));

    beforeEach(inject(function (_$websocketBackend_) {
        $websocketBackend = _$websocketBackend_;
        $websocketBackend.mock();
        $websocketBackend.expectConnect(gameApiUrl);
    }));

    beforeEach(angular.mock.inject(function ($rootScope, $controller) {
        $scope = $rootScope.$new();
        controller = $controller;
        controller('game', {$scope: $scope});
        $scope.$digest();
    }));

    beforeEach(function () {
        var createGameData = {
            rt: 'CREATE_GAME',
            players: [player1, player2],
            nextPlayer: player1,
            possibleCardsNextPlayer: player1Cards,
            trumpsNextPlayer: [
                {
                    name: "Reinforcement",
                    description: "Allow the player to play one more move.",
                    mustTargetPlayer: false
                }
            ]
        };

        $websocketBackend.expectSend(data2event(createGameData));
        $scope.createGame();
    });

    beforeEach(function () {
        alert = jasmine.createSpy('alert');
    });


    it('should have scope to be defined', function () {
        expect($scope).toBeDefined();
    });

    it('should be created', function () {
        expect($scope.currentPlayer).not.toBe(null);
    });

    describe('viewPossibleMovements', function () {
        var square;

        beforeEach(function () {
            var event = data2event({
                rt: 'VIEW_POSSIBLE_SQUARES',
                possible_squares: ["square-0-0", "square-1-1"]
            });
            $websocketBackend.expectSend(event);
        });

        beforeEach(inject(function ($compile) {
            var squareHtml = '<div id="square-0-0"></div>';
            square = angular.element(squareHtml);
            square.attr('ng-class', "{highlightedSquare: highlightedSquares.indexOf('square-0-0') > -1}");
            var compiled = $compile(square);
            compiled($scope);
        }));

        beforeEach(function () {
            selectCard();
        });

        beforeEach(function () {
            $scope.currentPlayer = player1;
        });

        it('correct card selected', function () {
            $scope.viewPossibleMovements(cardName, cardColor);
            expect($scope.selectedCard).toEqual(player1Cards[0]);
        });

        it('correct squares are highlighted', function () {
            $scope.viewPossibleMovements(cardName, cardColor);
            expect($scope.highlightedSquares).toEqual(["square-0-0", "square-1-1"]);
            $scope.$digest();
            expect(square.attr('class')).toContain('highlightedSquare');
        });
    });

    describe('isSelected', function () {
        it('card should be selected', function () {
            selectCard();
            expect($scope.isSelected(cardName, cardColor)).toBe(true);
        });

        it('card should not be selected', function () {
            // No card selected
            expect($scope.isSelected('cardName', 'cardColor')).toBe(false);
            // Inexistant card selected
            selectCard();
            expect($scope.isSelected('cardName', 'cardColor')).toBe(false);
        });
    });

    describe('play', function () {
        beforeEach(function () {
            var event = data2event({rt: 'PLAY',
                nextPlayer: player1,
                possibleCardsNextPlayer: player1Cards
            });
            $websocketBackend.expectSend(event);

            var event = data2event({rt: 'PLAY',
                nextPlayer: player2,
                possibleCardsNextPlayer: player2Cards
            });
            $websocketBackend.expectSend(event);
        });

        it('cannot, no card selected', function () {
            $scope.highlightedSquares = ['square-0-0'];
            $scope.play('square-0-0', '0', '0');
            expect(alert).toHaveBeenCalledWith('Please select a card.');
        });

        it('cannot, no highlightedSquares and card selected', function () {
            selectCard();
            $scope.play('square-0-0', '0', '0');
            expect(alert).not.toHaveBeenCalled();
        });

        it('play', function () {
            expect($scope.currentPlayer.name).toEqual(player1.name);
            expect($scope.currentPlayer.index).toEqual(player1.index);

            selectCard();
            $scope.highlightedSquares = ['square-0-0'];
            $scope.play('square-0-0', '0', '0');

            expect($scope.currentPlayer.name).toEqual(player1.name);
            expect($scope.currentPlayer.index).toEqual(player1.index);
            expect($scope.currentPlayerCards).toEqual(player1Cards);

            selectCard();
            $scope.highlightedSquares = ['square-0-0'];
            $scope.play('square-0-0', '0', '0');

            expect($scope.currentPlayer.name).toEqual(player2.name);
            expect($scope.currentPlayer.index).toEqual(player2.index);
            expect($scope.currentPlayerCards).toEqual(player2Cards);
        });
    });

    describe('pass', function () {
        beforeEach(function () {
            var event = data2event({
                rt: 'PLAY',
                nextPlayer: player2,
                possibleCardsNextPlayer: player2Cards
            });
            $websocketBackend.expectSend(event);
        });

        it('pass', function () {
            expect($scope.currentPlayer.name).toEqual(player1.name);
            expect($scope.currentPlayer.index).toEqual(player1.index);
            $scope.pass();
            expect($scope.currentPlayer.name).toEqual(player2.name);
            expect($scope.currentPlayer.index).toEqual(player2.index);
            expect($scope.currentPlayerCards).toEqual(player2Cards);
            expect($scope.selectedCard).toEqual(null);
            expect($scope.highlightedSquares).toEqual([]);
        });
    });

    describe('discard', function () {
        var popup;

        beforeEach(function () {
            var event = data2event({rt: 'PLAY',
                possibleCardsNextPlayer: [],
                trumps: [],
                winners: [],
                trumpsNextPlayer: [],
                nextPlayer: player1
            });
            $websocketBackend.expectSend(event);
        });

        beforeEach(inject(function ($compile) {
            var popupHtml = '<div></div>';
            popup = angular.element(popupHtml);
            popup.attr('ng-class', "{hidden: !showNoCardSelectedPopup}");
            var compiled = $compile(popup);
            compiled($scope);
            $scope.$digest();
        }));

        beforeEach(function () {
            $scope.currentPlayer = player1;
            $scope.currentPlayerCards = player1Cards;
            $scope.players = [player1, player2];
            $scope.selectedCard = player1Cards[0];
        });

        it('no card selected', function () {
            $scope.selectedCard = null;
            expect($scope.selectedCard).toEqual(null);
            $scope.discard();
            $scope.$digest();
            expect($scope.currentPlayer).toEqual(player1);
            expect($scope.currentPlayerCards).toEqual(player1Cards);
            expect($scope.selectedCard).toEqual(null);
            expect($scope.highlightedSquares).toEqual([]);
        });

        it('popup must appear when no card is selected', function () {
            $scope.selectedCard = null;
            expect(popup.attr('class')).toContain('hidden');
            $scope.discard();
            $scope.$digest();
            expect(popup.attr('class')).not.toContain('hidden');
        });

        it('discard a card', function () {
            expect($scope.selectedCard).not.toBe(null);
            $scope.confirmDiscard();
            expect($scope.showNoCardSelectedPopup).toBe(false);
            expect($scope.currentPlayer).toEqual(player1);
            expect($scope.currentPlayerCards).toEqual([]);
            expect($scope.selectedCard).toEqual(null);
            expect($scope.highlightedSquares).toEqual([]);
        });

        it('popup must not appear if a card is selected', function () {
            expect(popup.attr('class')).toContain('hidden');
            $scope.confirmDiscard();
            expect(popup.attr('class')).toContain('hidden');
        });

        it('confirm popup must appear when asked to discard a card', function () {
            expect($scope.showDiscardConfirmationPopup).toBe(false);
            $scope.discard();
            expect($scope.showDiscardConfirmationPopup).toBe(true);
        });
    });

});
