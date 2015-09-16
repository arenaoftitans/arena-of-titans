/* global angular, jasmine, expect */

'use strict';

describe('game', function () {
  var handleError;

  beforeEach(angular.mock.module('aot.game'));

  beforeEach(angular.mock.inject(function (_handleError_) {
    handleError = _handleError_;
  }));

  beforeEach(function () {
    console.log = jasmine.createSpy('log');
    console.error = jasmine.createSpy('error');
    alert = jasmine.createSpy('alert');
  });

  it('Check that an error is logged', function () {
    var errorMessage = 'An error';
    var error = {'error': errorMessage};
    handleError.show(error);
    expect(console.log).toHaveBeenCalledWith(errorMessage);
  });

  it('Check that errors are logged', function () {
    var errorMessage = ['Error 1', 'Error 2'];
    var error = {error: errorMessage};
    handleError.show(error);
    expect(console.log).toHaveBeenCalledWith(errorMessage);
  });

  it('Display error', function () {
    var displayedError = 'Error displayed';
    var error = {error_to_display: displayedError};
    handleError.show(error);
    expect(alert).toHaveBeenCalledWith(displayedError);
  });

  it('Display and log error', function () {
    var loggedMessage = 'Error logged';
    var displayedError = 'Error displayed';
    var error = {error: loggedMessage, error_to_display: displayedError};
    handleError.show(error);
    expect(console.log).toHaveBeenCalledWith(loggedMessage);
    expect(alert).toHaveBeenCalledWith(displayedError);
  });

  it('Log unknow object to console.error', function () {
    var data = {hello: 'world'};
    handleError.show(data);
    expect(console.error).toHaveBeenCalledWith(data);
  });

});

describe('player', function () {
  var playerService, $scope, $compile;
  var player;

  beforeEach(angular.mock.module('aot.game'));

  beforeEach(angular.mock.inject(function ($rootScope, _$compile_, _player_) {
    playerService = _player_;
    $compile = _$compile_;
    $scope = $rootScope.$new();
  }));

  beforeEach(inject(function () {
    var playerHtml = '<circle cx="0" cy="0" radius="90" width="90"/>';
    player = angular.element(playerHtml);
    var compiled = $compile(player);
    compiled($scope);
    $scope.$digest();
  }));

  it('init', function () {
    var numberOfPlayers = 8;
    var players = playerService.init(numberOfPlayers);
    expect(players.length).toBe(numberOfPlayers);
    var player = players[0];
    expect(player.index).toBe(0);
    expect(player.name).toBe('');
    expect(player.slotState).toBe('closed');
  });

  it('newPlayer', function () {
    var currentNumberOfPlayers = 4;
    var player = playerService.newPlayer(currentNumberOfPlayers);

    expect(player.index).toBe(currentNumberOfPlayers);
    expect(player.name).toBe('');
    expect(player.slotState).toBe('closed');
  });

  it('move', function () {
    var x = '10';
    var y = '30';

    expect(player.attr('cx')).toBe('0');
    expect(player.attr('cy')).toBe('0');

    playerService.move(player, x, y);

    expect(player.attr('cx')).toBe(x);
    expect(player.attr('cy')).toBe(y);
  });

});