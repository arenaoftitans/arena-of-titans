describe('create game', function () {
    var player1Input, player2Input;
    var createGameUrl = '/createGame';
    var notEnoughPlayersMessage = 'Not enough players. 2 Players at least are required to start a game';
    var numberPlayers = 8;
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
        submitFormNotEngouthPlayers();
    });

    it('should not create game with only 1 player', function () {
        player1Input.sendKeys('player1').then(submitFormNotEngouthPlayers);
    });

    it('should create game with 2 players', function () {
        enterPlayer1()
                .then(enterPlayer2)
                .then(submitForm)
                .then(check);

        function enterPlayer1() {
            return player1Input.sendKeys('player1');
        }

        function enterPlayer2() {
            return player2Input.sendKeys('player2');
        }

        function submitForm() {
            return createGameForm.click();
        }

        function check() {
            // We must wait for the browser to go to the right page.
            browser.sleep(500);
            expect(browser.getCurrentUrl()).toMatch(/\/game$/);
        }
    });

});