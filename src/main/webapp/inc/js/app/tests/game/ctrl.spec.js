'use strict';

describe('game', function () {
    var $scope, controller, $httpBackend;
    var square;

    var cardName = 'King';
    var cardColor = 'Red';

    var player1 = {name: "Toto", id: "0"};
    var player1Cards = [
        {name: "King", color: "Red"}
    ];
    var player2 = {name: "Tata", id: "1"};
    var player2Cards = [
        {name: "Wizard", color: "Yellow"}
    ];

    var createGameUrl = '/aot/rest/createGame';
    var createGameMethod = 'POST';
    var viewPossibleMovementsUrl = '/aot/rest/getPossibleSquares';
    var viewPossibleMovementsMethod = 'GET';
    var playUrl = '/aot/rest/play';
    var playMethod = 'GET';

    function selecteCard() {
        $scope.selectedCard.name = cardName;
        $scope.selectedCard.color = cardColor;
    }

    beforeEach(angular.mock.module('lastLine.game'));

    beforeEach(angular.mock.inject(function ($rootScope, $controller, $compile) {
        $scope = $rootScope.$new();
        controller = $controller;
        controller('game', {$scope: $scope});
        var squareHtml = '<div id="square-0-0"></div>';
        square = angular.element(squareHtml);
        square.attr('ng-class', "{highlightedSquare: highlightedSquares.indexOf('square-0-0') > -1}");
        var compiled = $compile(square);
        compiled($scope);
        $scope.$digest();
    }));

    beforeEach(angular.mock.inject(function ($rootScope, $controller, _$httpBackend_) {
        $httpBackend = _$httpBackend_;

        $httpBackend.when(createGameMethod, createGameUrl)
                .respond({
                    nextPlayer: player1,
                    possibleCardsNextPlayer: player1Cards
                });

        var viewPossibleMovementsParameters = {card_color: cardColor, card_name: cardName};
        var viewPossibleMovementsUrlWithParameters = setUrlParameters(viewPossibleMovementsUrl,
                viewPossibleMovementsParameters);
        $httpBackend.when(viewPossibleMovementsMethod, viewPossibleMovementsUrlWithParameters)
                .respond(["square-0-0", "square-1-1"]);

        var playParameters = {
            card_color: cardColor,
            card_name: cardName,
            player_id: 0,
            x: 0,
            y: 0
        };
        var playUrlWithParameters = setUrlParameters(playUrl, playParameters);
        $httpBackend.when(playMethod, playUrlWithParameters)
                .respond({
                    newSquare: "square-0-0",
                    nextPlayer: player1,
                    possibleCardsNextPlayer: player1Cards
                });

        playUrlWithParameters = setUrlParameters(playUrl, {pass: true});
        $httpBackend.when(playMethod, playUrlWithParameters)
                .respond({
                    newSquare: "square-0-0",
                    nextPlayer: player2,
                    possibleCardsNextPlayer: player2Cards
                });

        playParameters = {
            card_color: player1Cards[0].color,
            card_name: player1Cards[0].name,
            discard: true,
            player_id: player1.id
        };
        playUrlWithParameters = setUrlParameters(playUrl, playParameters);
        $httpBackend.when(playMethod, playUrlWithParameters)
                .respond({
                    possibleCardsNextPlayer: [],
                    trumps: [],
                    winners: [],
                    trumpsNextPlayer: [],
                    nextPlayer: player1
                });
    }));

    beforeEach(function () {
        alert = jasmine.createSpy('alert');
    });


    it('should have scope to be defined', function () {
        expect($scope).toBeDefined();
    });

    describe('viewPossibleMovements', function () {
        it('correct card selected', function () {
            $scope.viewPossibleMovements(cardName, cardColor);
            $httpBackend.flush();
            expect($scope.selectedCard).toEqual(player1Cards[0]);
        });

        it('correct squares are highlighted', function () {
            $scope.viewPossibleMovements(cardName, cardColor);
            $httpBackend.flush();
            expect($scope.highlightedSquares).toEqual(["square-0-0", "square-1-1"]);
            $scope.$digest();
            expect(square.attr('class')).toContain('highlightedSquare');
        });
    });

    describe('isSelected', function () {
        it('card should be selected', function () {
            selecteCard();
            expect($scope.isSelected(cardName, cardColor)).toBe(true);
        });

        it('card should not be selected', function () {
            // No card selected
            expect($scope.isSelected('cardName', 'cardColor')).toBe(false);
            // Inexistant card selected
            selecteCard();
            expect($scope.isSelected('cardName', 'cardColor')).toBe(false);
        });
    });

    describe('play', function () {
        it('cannot, no card selected', function () {
            $scope.highlightedSquares = ['square-0-0'];
            $scope.play('square-0-0', '0', '0');
            expect(alert).toHaveBeenCalledWith('Please select a card.');
        });

        it('cannot, no highlightedSquares and card selected', function () {
            selecteCard();
            $scope.play('square-0-0', '0', '0');
            expect(alert).not.toHaveBeenCalled();
        });

        it('play', function () {
            selecteCard();
            $scope.highlightedSquares = ['square-0-0'];
            $scope.currentPlayer.id = 0;
            //$scope.play('square-0-0', '0', '0');
            //$httpBackend.flush();
            //console.error(angular.element('#square-0-0').attr('class'))
        });
    });

    describe('pass', function () {
        it('pass', function () {
            $scope.pass();
            $httpBackend.flush();
            expect($scope.currentPlayer).toEqual(player2);
            expect($scope.currentPlayerCards).toEqual(player2Cards);
            expect($scope.selectedCard).toEqual({});
            expect($scope.highlightedSquares).toEqual([]);
        });
    });

    describe('discard', function () {
        var popup;

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
            $scope.selectedCard = player1Cards[0];
        });

        it('no card selected', function () {
            $scope.selectedCard = {};
            expect($scope.selectedCard).toEqual({});
            $scope.discard();
            $scope.$digest();
            expect($scope.currentPlayer).toEqual(player1);
            expect($scope.currentPlayerCards).toEqual(player1Cards);
            expect($scope.selectedCard).toEqual({});
            expect($scope.highlightedSquares).toEqual([]);
        });

        it('popup must appear when no card is selected', function () {
            $scope.selectedCard = {};
            expect(popup.attr('class')).toContain('hidden');
            $scope.discard();
            $scope.$digest();
            expect(popup.attr('class')).not.toContain('hidden');
        });

        it('discard a card', function () {
            expect(Object.getOwnPropertyNames($scope.selectedCard).length === 0).toBe(false);
            $scope.discard();
            $httpBackend.flush();
            expect($scope.showNoCardSelectedPopup).toBe(false);
            expect($scope.currentPlayer).toEqual(player1);
            expect($scope.currentPlayerCards).toEqual([]);
            expect($scope.selectedCard).toEqual({});
            expect($scope.highlightedSquares).toEqual([]);
        });

        it('popup must not appear if a card is selected', function () {
            expect(popup.attr('class')).toContain('hidden');
            $scope.discard();
            $httpBackend.flush();
            expect(popup.attr('class')).toContain('hidden');
        });
    });

});