describe('create game', function () {
    var player1Input, player2Input;
    var createGameUrl = '/createGame';
    var notEnoughPlayersMessage = 'Not enough players. 2 Players at least are required to start a game';
    var numberPlayers = 8;
    var submitForm = element(by.buttonText('Create game'));

    function submitFormNotEngouthPlayers(alertBox) {
        submitForm.click().then(function () {
            alertBox = browser.driver.switchTo().alert();
            expect(alertBox.getText()).toEqual(notEnoughPlayersMessage);
        }).then(function () {
            alertBox.dismiss();
        });
    }

    beforeEach(function () {
        browser.get(createGameUrl);
    });

    beforeEach(function () {
        player1Input = $$('input').get(0);
        player2Input = $$('input').get(1);
    });

    it('should have exacly 1 create game form', function () {
        expect($$('#crateGameForm').count()).toBe(1);
    });

    it('should have exactly 8 input for player names', function () {
        var playerInput = element.all(by.repeater('player in players'));
        expect(playerInput.count()).toBe(numberPlayers);
    });

    it('should not create game without players', function () {
        var alertBox;
        submitFormNotEngouthPlayers(alertBox);
    });

    it('should not create game with only 1 player', function () {
        var alertBox;

        player1Input.sendKeys('player1').then(function () {
            submitFormNotEngouthPlayers(alertBox);
        });
    });

    it('should create game with 2 players', function () {
        player1Input.sendKeys('player1').then(function () {
            player2Input.sendKeys('player2').then(function () {
                submitForm.click().then(function () {
                    // We must wait for the browser to go to the right page.
                    browser.sleep(500);
                    expect(browser.getCurrentUrl()).toMatch(/\/game$/);
                });
            });
        });
    });

});