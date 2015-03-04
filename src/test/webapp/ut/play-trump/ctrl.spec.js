/* global angular, expect */

'use strict';

describe('play trump', function () {
    var $scope, $rootScope;

    beforeEach(angular.mock.module('aot.play-trump'));

    beforeEach(module('aot.game'));

    beforeEach(inject(function (_$rootScope_, $controller) {
        $rootScope = _$rootScope_;
        $scope = $rootScope.$new();
        $controller('playTrump', {$scope: $scope});
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

    describe('correctly react on "wantToPlayTrump" signal', function () {
        it('must target player', function () {
            trump.mustTargetPlayer = true;
            expect($scope.showTargetedPlayerForTrumpSelector).toBe(false);
            $rootScope.$emit('wantToPlayTrump', trump, players, currentPlayerIndex);
            expect($scope.trumpName).toBe(trump.name);
            expect($scope.players).toEqual([player2]);
            expect($scope.showTargetedPlayerForTrumpSelector).toBe(true);
        });

        it('must not target player', function () {
            expect($scope.showTargetedPlayerForTrumpSelector).toBe(false);
            $rootScope.$emit('wantToPlayTrump', trump, players, currentPlayerIndex);
            expect($scope.trumpName).toBe(trump.name);
            expect($scope.players).toEqual([player2]);
            expect($scope.showTargetedPlayerForTrumpSelector).toBe(false);
        });
    });

    describe('play', function () {
        var $httpBackend;
        var playTrumpUrl = '/rest/playTrump';
        var playTrumpMethod = 'GET';

        beforeEach(inject(function (_$httpBackend_) {
            $httpBackend = _$httpBackend_;

            var playTrumpParameters = {name: 'trump'};
            var playTrumpUrlWithParameters = setUrlParameters(playTrumpUrl, playTrumpParameters);
            $httpBackend.when(playTrumpMethod, playTrumpUrlWithParameters)
                    .respond(["square-0-0", "square-1-1"]);
        }));

        it('success', function () {
            $rootScope.$emit('wantToPlayTrump', trump, players, currentPlayerIndex);
            $httpBackend.flush();
            expect($scope.trumpTargetedPlayer).not.toBeDefined();
            expect($scope.showTargetedPlayerForTrumpSelector).toBe(false);
        });
    });

});
