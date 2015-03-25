/* global by, element, expect, $$, browser */

describe('game', function () {
    var createGameForm = element(by.buttonText('Create game'));
    var createGameUrl = '/createGame';
    // Firefox seems to only be able to click on items that are buttons or have a ng-click
    // Thus selecting by by.repeater('card in currentPlayerCards') won't work (we get the containers
    // that don't have the ng-click attribute
    var cards = $$('.movementsCard');
    var cardOne = cards.get(0);
    var cardTwo = cards.get(1);
    var passButton = element(by.buttonText('Pass'));
    var discardButton = element(by.buttonText('Discard selected card.'));
    var highlightedSquares = $$('.highlightedSquare');
    var trumps = element.all(by.repeater('trump in currentPlayerTrumps'));

    var hasClass = function (element, cls) {
        return element.getAttribute('class').then(function (classes) {
            return classes.split(' ').indexOf(cls) !== -1;
        });
    };

    beforeEach(function () {
        browser.get(createGameUrl);
    });

    beforeEach(function () {
        var player1Input = $$('input').get(0);
        var player2Input = $$('input').get(1);

        enterPlayer1()
                .then(enterPlayer2)
                .then(submitForm)
                .then(function () {
                    browser.sleep(500);
                });

        function enterPlayer1() {
            return player1Input.sendKeys('player1');
        }

        function enterPlayer2() {
            return player2Input.sendKeys('player2');
        }

        function submitForm() {
            return createGameForm.click();
        }
    });

    it('should have exacly 5 cards', function () {
        var cards = element.all(by.repeater('card in currentPlayerCards'));
        expect(cards.count()).toBe(5);
    });

    it('if no card is clicked, no card should be marked as selected', function () {
        var selectedCards = element.all(by.css('.selectedCard'));
        expect(selectedCards.count()).toBe(0);
    });

    it('clicked card should be marked as selected', function () {
        cardOne.click()
                .then(function () {
                    var selectedCards = element.all(by.css('.selectedCard'));
                    expect(selectedCards.count()).toBe(1);
                });
    });

    it('only one card should be marked as selected', function () {
        cardOne.click()
                .then(cardTwo.click)
                .then(function () {
                    var selectedCards = element.all(by.css('.selectedCard'));
                    expect(selectedCards.count()).toBe(1);
                });
    });

    it('player name should change when the player click on pass', function () {
        var playerName = element(by.binding('currentPlayer.name'));
        var currentPlayerName = playerName.getText();
        passButton.click()
                .then(function () {
                    expect(currentPlayerName).not.toEqual(playerName.getText());
                });
    });

    it('new player should have 5 cards', function () {
        passButton.click()
                .then(function () {
                    expect(cards.count()).toBe(5);
                    return passButton.click();
                })
                .then(function () {
                    expect(cards.count()).toBe(5);
                });
    });

    it('should have 4 cards after discarding a card', function () {
        var confirmButton = $('#discardConfirmationPopup .ok-button');
        cardOne.click()
                .then(discardButton.click)
                .then(confirmButton.click)
                .then(function () {
                    expect(cards.count()).toBe(4);
                });
    });

    it('should have 5 cards if cancel card discard', function () {
        var cancelButton = $('#discardConfirmationPopup .cancel-button');
        cardOne.click()
                .then(discardButton.click)
                .then(cancelButton.click)
                .then(function () {
                    expect(cards.count()).toBe(5);
                });
    });

    it('should have 5 cards when it is again the player\'s turn after discarding a card', function () {
        var confirmButton = $('#discardConfirmationPopup .ok-button');
        cardOne.click()
                .then(discardButton.click)
                .then(confirmButton.click)
                .then(passButton.click)
                .then(passButton.click)
                .then(function () {
                    expect(cards.count()).toBe(5);
                });
    });

    it('should display popup if click on discard without any card selected', function () {
        var noCardSelectedPopup = $('#noCardSelectedPopup');
        expect(hasClass(noCardSelectedPopup, 'hidden')).toBe(true);
        discardButton.click()
                .then(function () {
                    expect(hasClass(noCardSelectedPopup, 'hidden')).toBe(false);
                });
    });

    it('no squares should be highlighted in the beginning', function () {
        expect(highlightedSquares.count()).toBe(0);
    });

    it('active trump list should match the number of players', function () {
        var activeTrumps = element.all(by.repeater('player in activeTrumps'));
        expect(activeTrumps.count()).toBe(2);
    });

    it('not trump should be active at first', function () {
        var activeTrumps = element.all(by.repeater('player in player.trumpNames'));
        expect(activeTrumps.count()).toBe(0);
    });

    it('trump that must not target a player should be played directly', function () {
        var trump = trumps.get(0);
        trump.click()
                .then(function () {
                    var selectPlayerPopup = $('#targetedPlayerForTrumpSelector');
                    var trumpList = element.all(by.repeater('trump in player.trumpNames'));
                    expect(hasClass(selectPlayerPopup, 'hidden')).toBe(true);
                    expect(trumpList.count()).toBe(1);
                });
    });

    describe('trump that must target a player', function () {
        var trump = trumps.get(1);
        var selectPlayerPopup = $('#targetedPlayerForTrumpSelector');
        var trumpList = element.all(by.repeater('trump in player.trumpNames'));
        var submitButton = $$('#targetedPlayerForTrumpSelector .ok-button').get(0);
        var cancelButton = $$('#targetedPlayerForTrumpSelector .cancel-button').get(0);
        var trumpList = element.all(by.repeater('trump in player.trumpNames'));
        var playerSelect = $$('#targetedPlayerForTrumpSelector input').get(0);

        it('should ask for a target player', function () {
            trump.click()
                    .then(function () {
                        expect(hasClass(selectPlayerPopup, 'hidden')).toBe(false);
                        expect(trumpList.count()).toBe(0);
                    });
        });

        it('should activate if we confirm', function () {
            trump.click()
                    .then(playerSelect.click)
                    .then(submitButton.click)
                    .then(function () {
                        expect(hasClass(selectPlayerPopup, 'hidden')).toBe(true);
                        expect(trumpList.count()).toBe(1);
                    });
        });

        it('should do nothing if no player is selected', function () {
            trump.click()
                    .then(submitButton.click)
                    .then(function () {
                        expect(hasClass(selectPlayerPopup, 'hidden')).toBe(false);
                        expect(trumpList.count()).toBe(0);
                    });
        });

        it('should not activate if we cancel', function () {
            trump.click()
                    .then(cancelButton.click)
                    .then(function () {
                        expect(hasClass(selectPlayerPopup, 'hidden')).toBe(true);
                        expect(trumpList.count()).toBe(0);
                    });
        });

        it('should not activate if we cancel with a player selected', function () {
            trump.click()
                    .then(playerSelect.click)
                    .then(cancelButton.click)
                    .then(function () {
                        expect(hasClass(selectPlayerPopup, 'hidden')).toBe(true);
                        expect(trumpList.count()).toBe(0);
                    });
        });
    });
});
