/* global by, element, browser, expect, $$ */

describe('create game', function () {
    var createGameUrl = '/game';
    var notEnoughPlayersMessage = 'Not enough players. 2 Players at least are required to start a game';
    var numberPlayers = 8;
    var initialNumberOfPlayers = 2;
    var createGameForm = element(by.buttonText('Create game'));

    function submitFormNotEngouthPlayers() {
        var alertBox;
        createGameForm.click().then(function () {
            browser.sleep(500);
            alertBox = browser.driver.switchTo().alert();
            expect(alertBox.getText()).toEqual(notEnoughPlayersMessage);
        }).then(function () {
            alertBox.dismiss();
        });
    }

    beforeEach(function () {
        browser.get(createGameUrl);
        browser.sleep(500);
        browser.driver.switchTo().alert().accept();
    });

    it('should redirect to game page', function () {
        expect(browser.getCurrentUrl()).toMatch(/\/game\/[0-9a-zA-Z]+#\/?$/);
    });

    it('should have exacly 1 create game form', function () {
        expect($$('#createGameForm').count()).toBe(1);
    });

    it('should present only 2 field by default', function () {
        var playerInput = element.all(by.repeater('player in players'));
        expect(playerInput.count()).toBe(initialNumberOfPlayers);
    });

    it('should not create game with only 1 player', function () {
        submitFormNotEngouthPlayers();
    });

    it('should create game with 2 players', function () {
        var browserPlayer2 = browser.forkNewDriverInstance(true, true);
        browserPlayer2.driver.switchTo().alert().accept();
        browser.sleep(500);

        createGameForm.click();

        browser.sleep(500);
        expect(browser.getCurrentUrl()).toMatch(/\/game\/[0-9a-zA-Z]+#\/?game$/);
    });

});