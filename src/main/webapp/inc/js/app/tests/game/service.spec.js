'use strict';

describe('game', function () {
    var showHttpError;

    beforeEach(angular.mock.module('lastLine.game'));

    beforeEach(angular.mock.inject(function (_showHttpError_) {
        showHttpError = _showHttpError_;
    }));

    beforeEach(function () {
        console.log = jasmine.createSpy('log');
        alert = jasmine.createSpy('alert');
    });

    it('Check that an error is logged', function () {
        var errorMessage = 'An error';
        var error = {'error': errorMessage};
        showHttpError.show(error);
        expect(console.log).toHaveBeenCalledWith(errorMessage);
    });

    it('Check that errors are logged', function () {
        var errorMessage = ['Error 1', 'Error 2'];
        var error = {error: errorMessage};
        showHttpError.show(error);
        expect(console.log).toHaveBeenCalledWith(errorMessage);
    });

    it('Display error', function () {
        var displayedError = 'Error displayed';
        var error = {error_to_display: displayedError};
        showHttpError.show(error);
        expect(alert).toHaveBeenCalledWith(displayedError);
    });

    it('Display and log error', function () {
        var loggedMessage = 'Error logged';
        var displayedError = 'Error displayed';
        var error = {error: loggedMessage, error_to_display: displayedError};
        showHttpError.show(error);
        expect(console.log).toHaveBeenCalledWith(loggedMessage);
        expect(alert).toHaveBeenCalledWith(displayedError);
    });

});

describe('game', function () {
    var squares, scope, compile, dom;

    beforeEach(angular.mock.module('lastLine.game'));

    beforeEach(angular.mock.inject(function ($rootScope, $compile, _squares_) {
        squares = _squares_;
        compile = $compile;
        scope = $rootScope.$new();
    }));

    beforeEach(function () {
        dom = angular.element('<div id="square-0-0"></div>');
        compile(dom)(scope);
        scope.$apply();
    });

    it('Highlight', function () {
        dom = angular.element('<div id="square-0-0"></div>');
        compile(dom)(scope);
        scope.$apply();
        var squareName = 'square-0-0';
        squares.highlight([squareName]);
        scope.$apply();
    });

});

describe('player', function () {
    var playerService, scope, square, compiled;

    beforeEach(angular.mock.module('lastLine.game'));

    beforeEach(angular.mock.inject(function ($rootScope, $compile, _player_) {
        playerService = _player_;
        var squareHtml = '<svg><rect id="square-0-0" x="0" y="0" height="90" width="90"/></svg>';
        square = angular.element(squareHtml);
        scope = $rootScope.$new();
        compiled = $compile(square);
        compiled(scope);
        scope.$digest();
    }));

    it('init', function () {
        var numberOfPlayers = 8;
        var players = playerService.init(numberOfPlayers);
        expect(players.length).toBe(numberOfPlayers);
        var player = players[0];
        expect(player.index).toBe(0);
        expect(player.name).toBe('');
    });

    it('move', function () {
       var playerIndex = '0';
       var squareId = '#square-0-0';
       //playerService.move(playerIndex, squareId);
    });

});