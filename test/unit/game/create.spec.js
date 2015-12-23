import { Create } from '../../../app/game/create/create';
import { RouterStub } from '../utils';


class Game {
    popup(type, data) {
        return new Promise((resolve, reject) => {
            resolve(data);
        });
    }
}


describe('game/create', () => {
    let sut;
    let mockedRouter;
    let mockedGame;

    beforeEach(() => {
        mockedRouter = new RouterStub();
        mockedGame = new Game();
        sut = new Create(mockedRouter, mockedGame);
    });

    it('should create a popup if it has an id param', () => {
        spyOn(mockedGame, 'popup').and.callThrough();

        sut.activate({id: 'toto'});

        expect(mockedGame.popup).toHaveBeenCalledWith('create-game', {name: ''});
    });

    it('should navigate to route if no id param', () => {
        spyOn(mockedRouter, 'navigateToRoute');
        sut.activate({});

        expect(mockedRouter.navigateToRoute).toHaveBeenCalledWith('create', {id: 'toto'});
    });
});
