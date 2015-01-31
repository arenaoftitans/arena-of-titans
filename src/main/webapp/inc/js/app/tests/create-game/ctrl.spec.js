'use strict';
describe('create game', function () {
    var $httpBackend, $scope, $rootScope;

    var createGameUrl = '/aot/rest/createGame';
    var createGameMethod = 'POST';

    var gameCreatedData = {
        players: [{
                name: "Toto",
                index: 0
            }],
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

    beforeEach(angular.mock.module('aot.create-game'));

    beforeEach(module('aot.game'));

    beforeEach(inject(function (_$rootScope_, $controller) {
        $rootScope = _$rootScope_;
        $scope = $rootScope.$new();
        $controller('createGame', {$scope: $scope});
    }));

    beforeEach(inject(function (_$httpBackend_) {
        $httpBackend = _$httpBackend_;

        $httpBackend.when(createGameMethod, createGameUrl)
                .respond(gameCreatedData);
    }));

    it('must emit "gameCreated" signal', function () {
        spyOn($rootScope, "$emit");
        $scope.createGame();
        $httpBackend.flush();
        expect($rootScope.$emit).toHaveBeenCalled();
    });

    it('check game parameters are correct', function () {
        var game = gameCreatedData;
        game.winners = [];
        game.trumps = [];
        game.gameOver = false;
        $scope.createGame();
        $httpBackend.flush();
        expect($scope.game).toEqual(game);
    });

    it('$scope.gameCreated must be true', function () {
        expect($scope.gameCreated).toBe(false);
        $scope.createGame();
        $httpBackend.flush();
        expect($scope.gameCreated).toBe(true);
    });

});
