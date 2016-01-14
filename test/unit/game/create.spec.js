import { Create } from '../../../app/game/create/create';
import { ApiStub, RouterStub } from '../utils';


class Game {
    popupPromise;

    popup(type, data) {
        this.popupPromise = new Promise((resolve, reject) => {
            resolve({name: 'Tester'});
        });

        return this.popupPromise;
    }
}


describe('game/create', () => {
    let sut;
    let mockedRouter;
    let mockedGame;
    let mockedApi;

    beforeEach(() => {
        mockedRouter = new RouterStub();
        mockedGame = new Game();
        mockedApi = new ApiStub();
        sut = new Create(mockedRouter, mockedGame, mockedApi);
    });

    it('should register api callbacks on activation', () => {
        spyOn(mockedApi, 'on');

        sut.activate();

        expect(mockedApi.on).toHaveBeenCalled();
    });

    it('should deregister api callbacks on deactivation', () => {
        spyOn(mockedApi, 'off');

        sut.deactivate();

        expect(mockedApi.off).toHaveBeenCalled();
    });

    it('should not create a popup if it has an id param', () => {
        spyOn(mockedGame, 'popup').and.callThrough();

        sut.activate({id: 'toto'});

        expect(mockedGame.popup).not.toHaveBeenCalled();
    });

    it('should navigate to initialize the game if no id param', done => {
        spyOn(mockedGame, 'popup').and.callThrough();
        spyOn(mockedApi, 'initializeGame');
        sut.activate();

        expect(mockedGame.popup).toHaveBeenCalledWith('create-game', {name: ''});
        mockedGame.popupPromise.then(() => {
            expect(mockedApi.initializeGame).toHaveBeenCalledWith({name: 'Tester'});
            done();
        });
    });

    it('should edit name', () => {
        spyOn(mockedGame, 'popup').and.callThrough();
        spyOn(mockedApi, 'updateName');
        sut._api._me = {
            name: 'Player 1'
        };

        sut.editMe();
        expect(mockedGame.popup).toHaveBeenCalledWith('create-game', {name: 'Player 1'});
        mockedGame.popupPromise.then(() => {
            expect(mockedApi.updateName).toHaveBeenCalledWith({name: 'Tester'});
        });
    });

    it('should navigate to create/{id} after game initialization', () => {
        let gameInitializedData = {game_id: 'the_game_id'};
        spyOn(mockedRouter, 'navigateToRoute');

        sut.activate();
        mockedApi.initializeGame(gameInitializedData);

        expect(mockedRouter.navigateToRoute).toHaveBeenCalledWith(
            'create',
            {id: gameInitializedData.game_id});
    });

    it('should add slot after game initilization', () => {
        spyOn(mockedApi, 'addSlot');

        sut.activate({id: 'the_game'});

        expect(mockedApi.addSlot).toHaveBeenCalled();
    });
});
