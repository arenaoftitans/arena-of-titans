/* global module, browser, by */

var createGameForm = element(by.buttonText('Create game'));

var createPlayer1 = function () {
    var createGameUrl = '/game';

    browser.get(createGameUrl);
    browser.sleep(500);
    browser.driver.switchTo().alert().accept();
};

var openSlot2 = function () {
    $$('select').get(1).element(by.cssContainingText('option', 'open')).click();
    var browserPlayer2 = browser.forkNewDriverInstance(true, true);
    browserPlayer2.driver.switchTo().alert().accept();

    return browserPlayer2;
};

var createGameWith2Players = function () {
    createPlayer1();

    var browserPlayer2 = openSlot2();

    createGameForm.click();
    browser.sleep(500);

    return browserPlayer2;
};

module.exports.createGameForm = createGameForm;
module.exports.createPlayer1 = createPlayer1;
module.exports.createGameWith2Players = createGameWith2Players;
