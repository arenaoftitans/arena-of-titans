/* global by, element, browser, expect, $$ */

var utils = require(it_root + 'utils')

describe('create game', function () {
  var notEnoughPlayersMessage = 'Not enough players. 2 Players at least are required to start a game';
  var initialNumberOfPlayers = 2;

  beforeEach(function () {
    utils.createPlayer1();
  });

  it('should have exacly 1 create game form', function () {
    expect($$('#createGameForm').count()).toBe(1);
  });

  it('should present only 2 field by default', function () {
    var playerInput = element.all(by.repeater('player in players'));
    expect(playerInput.count()).toBe(initialNumberOfPlayers);
  });

  it('should not create game with only 1 player', function () {
    var alertBox;
    utils.createGameForm.click().then(function () {
      browser.sleep(500);
      alertBox = browser.driver.switchTo().alert();
      expect(alertBox.getText()).toEqual(notEnoughPlayersMessage);
    }).then(function () {
      alertBox.dismiss();
    });
  });

  it('should create game with 2 players', function () {
    var browserPlayer2 = utils.createGameWith2Players();
    expect(browser.getCurrentUrl()).toMatch(/\/game\/[0-9a-zA-Z]+#\/?game$/);
    browserPlayer2.close();
  });

});
