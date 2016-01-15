import { Create } from '../../../app/game/create/create';
import { ApiStub, RouterStub, StorageStub } from '../utils';


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
    let mockedStorage;

    beforeEach(() => {
        mockedRouter = new RouterStub();
        mockedGame = new Game();
        mockedApi = new ApiStub();
        mockedStorage = new StorageStub();
        sut = new Create(mockedRouter, mockedGame, mockedApi, mockedStorage);
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

    it('should not create a popup if it knows the player name', () => {
        spyOn(mockedGame, 'popup').and.callThrough();

        mockedApi._me = {
            name: 'Player 1'
        };
        sut.activate({id: 'toto'});

        expect(mockedGame.popup).not.toHaveBeenCalled();
    });

    it('should ask the player name when joining a game', done => {
        spyOn(mockedGame, 'popup').and.callThrough();
        spyOn(mockedApi, 'joinGame');

        sut.activate({id: 'game_id'});

        expect(mockedGame.popup).toHaveBeenCalledWith('create-game', {name: ''});
        mockedGame.popupPromise.then(() => {
            expect(mockedApi.joinGame).toHaveBeenCalledWith({gameId: 'game_id', name: 'Tester'});
            done();
        });
    });

    it('should join the game from a cookie', () => {
        spyOn(mockedStorage, 'retrievePlayerId').and.returnValue('player_id');
        spyOn(mockedGame, 'popup');

        sut.activate({id: 'game_id'});

        expect(mockedStorage.retrievePlayerId).toHaveBeenCalledWith('game_id');
        expect(mockedGame.popup).not.toHaveBeenCalled();
    });

    it('should navigate to initialize the game if no id param', done => {
        spyOn(mockedGame, 'popup').and.callThrough();
        spyOn(mockedApi, 'initializeGame');
        sut.activate();

        expect(mockedGame.popup).toHaveBeenCalledWith('create-game', {name: ''});
        mockedGame.popupPromise.then(() => {
            expect(mockedApi.initializeGame).toHaveBeenCalledWith('Tester');
            done();
        });
    });

    it('should edit name', done => {
        spyOn(mockedGame, 'popup').and.callThrough();
        spyOn(mockedApi, 'updateName');
        sut._api._me = {
            name: 'Player 1'
        };

        sut.editMe();
        expect(mockedGame.popup).toHaveBeenCalledWith('create-game', {name: 'Player 1'});
        mockedGame.popupPromise.then(() => {
            expect(mockedApi.updateName).toHaveBeenCalledWith('Tester');
            done();
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

        mockedApi._me = {
            name: 'Player 1',
            is_game_master: true
        };
        sut.activate({id: 'the_game'});

        expect(mockedApi.addSlot).toHaveBeenCalled();
    });
});
