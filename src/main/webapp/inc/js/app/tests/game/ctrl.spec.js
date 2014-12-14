'use strict';

describe('game', function () {
    var scope, $httpBackend;

    var cardName = 'King';
    var cardColor = 'Red';

    var createGameUrl = '/aot/rest/createGame';
    var createGameMethod = 'POST';
    var viewPossibleMovementsUrl = '/aot/rest/getPossibleSquares?card_color=' + cardColor + '&card_name=' + cardName;
    var viewPossibleMovementsMethod = 'GET';
    var playUrl = '/aot/rest/play';
    var playMethod = 'GET';

    beforeEach(angular.mock.module('lastLine'));

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

        $httpBackend.when(viewPossibleMovementsMethod, viewPossibleMovementsUrl)
                .respond(["square-0-0", "square-1-1"]);

        $httpBackend.when(playMethod, playUrl)
                .respond({
                    "newSquare": "#0-8",
                    "nextPlayer": {
                        "name": "Toto",
                        "id": "0"
                    },
                    "possibleCardsNextPlayer": [
                        {
                            "name": "King",
                            "color": "Red"
                        }
                    ]
                });

        scope = $rootScope.$new();
        $controller('game', {$scope: scope});
    }));

    it('create game', function () {
        scope.createGame();
        $httpBackend.flush();
        expect(scope.currentPlayer).toEqual({
            name: "Toto",
            id: "0"
        });
    });

    it('view possible movements', function () {
        scope.viewPossibleMovements(cardName, cardColor);
        $httpBackend.flush();
        expect(scope.highlightedSquares).toEqual(["square-0-0", "square-1-1"]);
        expect(scope.selectedCard).toEqual({card_name: cardName, card_color: cardColor});
    });

    it('play', function () {
        var squareId = 'square-0-0';
        var x = '0';
        var y = '0';
        scope.viewPossibleMovements(cardName, cardColor);
        //scope.play(squareId, x, y);
    });

});