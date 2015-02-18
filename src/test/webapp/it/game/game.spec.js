describe('game', function () {
    var createGameForm = element(by.buttonText('Create game'));
    var createGameUrl = '/createGame';

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
});
