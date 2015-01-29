'use strict';

describe('game', function () {
    var $scope, controller, $httpBackend;
    var square;

    var cardName = 'King';
    var cardColor = 'Red';

    var createGameUrl = '/aot/rest/createGame';
    var createGameMethod = 'POST';
    var viewPossibleMovementsUrl = '/aot/rest/getPossibleSquares';
    var viewPossibleMovementsMethod = 'GET';
    var playUrl = '/aot/rest/play';
    var playMethod = 'GET';

    function selecteCard() {
        $scope.selectedCard.card_name = cardName;
        $scope.selectedCard.card_color = cardColor;
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
                    nextPlayer: {
                        name: "Toto",
                        id: "0"
                    },
                    possibleCardsNextPlayer: [
                        {
                            name: "King",
                            color: "Red"
                        }
                    ]
                });

        var viewPossibleMovementsParameters = {card_color: cardColor, card_name: cardName};
        var viewPossibleMovementsUrlWithParameters = setUrlParameters(viewPossibleMovementsUrl,
                viewPossibleMovementsParameters);
        $httpBackend.when(viewPossibleMovementsMethod, viewPossibleMovementsUrlWithParameters)
                .respond(["square-0-0", "square-1-1"]);

        $httpBackend.when(playMethod, playUrl)
                .respond({
                    newSquare: "#0-8",
                    nextPlayer: {
                        name: "Toto",
                        id: "0"
                    },
                    possibleCardsNextPlayer: [
                        {
                            name: "King",
                            color: "Red"
                        }
                    ]
                });
    }));


    it('should have scope to be defined', function () {
        expect($scope).toBeDefined();
    });

    describe('viewPossibleMovements', function () {
        it('correct card selected', function () {
            $scope.viewPossibleMovements(cardName, cardColor);
            $httpBackend.flush();
            expect($scope.selectedCard).toEqual({card_name: cardName, card_color: cardColor});
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

    });

});