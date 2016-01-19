import { AotCardsCustomElement } from '../../../../../app/game/play/widgets/cards';
import { ApiStub, GameStub } from '../../../utils';


describe('cards', () => {
    let sut;
    let mockedApi;
    let mockedGame;

    beforeEach(() => {
        mockedApi = new ApiStub();
        mockedGame = new GameStub();
        sut = new AotCardsCustomElement(mockedApi, mockedGame);
    });

    it('should view possible movements', () => {
        let card = {name: 'King', color: 'red'};
        spyOn(mockedApi, 'viewPossibleMovements');
        sut.yourTurn = true;

        sut.viewPossibleMovements(card);

        expect(sut.selectedCard).toBe(card);
        expect(mockedApi.viewPossibleMovements).toHaveBeenCalledWith(card);
    });

    it('should not view possible movement if not your turn', () => {
        let card = {name: 'King', color: 'red'};
        spyOn(mockedApi, 'viewPossibleMovements');
        sut.yourTurn = false;
        sut.selectedCard = null;

        sut.viewPossibleMovements(card);

        expect(sut.selectedCard).toBe(null);
        expect(mockedApi.viewPossibleMovements).not.toHaveBeenCalledWith();
    });

    it('should pass', done => {
        spyOn(mockedGame, 'popup').and.callThrough();
        spyOn(mockedApi, 'pass');
        sut.selectedCard = {name: 'King', color: 'red'};

        sut.pass();

        expect(mockedGame.popup).toHaveBeenCalledWith(
            'confirm',
            {message: 'Are you sure you want to pass your turn?'});
        mockedGame.popupPromise.then(() => {
            expect(sut.selectedCard).toBe(null);
            expect(mockedApi.pass).toHaveBeenCalled();
            done();
        });
    });

    it('should not pass on cancel', done => {
        let promise = new Promise((resolve, reject) => {
            reject();
        });
        spyOn(mockedGame, 'popup').and.returnValue(promise);
        spyOn(mockedApi, 'pass');

        sut.pass();

        expect(mockedGame.popup).toHaveBeenCalledWith(
            'confirm',
            {message: 'Are you sure you want to pass your turn?'});
        promise.then(() => {
            expect(false).toBe(true);
            done();
        }, () => {
            expect(mockedApi.pass).not.toHaveBeenCalled();
            done();
        });
    });

    it('should discard a card', done => {
        spyOn(mockedApi, 'discard');
        spyOn(mockedGame, 'popup').and.callThrough();
        sut.selectedCard = {
            name: 'King',
            color: 'red'
        };

        sut.discard();

        expect(mockedGame.popup).toHaveBeenCalledWith(
            'confirm',
            {message: 'Are you sure you want to discard King red?'});

        mockedGame.popupPromise.then(() => {
            expect(mockedApi.discard).toHaveBeenCalledWith({
                cardName: 'King',
                cardColor: 'red'
            });
            expect(sut.selectedCard).toBe(null);
            done();
        });
    });

    it('should display a popup if no card is selected', () => {
        spyOn(mockedApi, 'discard');
        spyOn(mockedGame, 'popup');

        sut.discard();

        expect(mockedApi.discard).not.toHaveBeenCalled();
        expect(mockedGame.popup).toHaveBeenCalledWith('infos', {message: 'You must select a card'});
    });
});
