import '../../setup';
import { Play } from '../../../../app/game/play/play';
import { ApiStub, GameStub } from '../../utils';


describe('play', () => {
    let sut;
    let mockedApi;
    let mockedGame;

    beforeEach(() => {
        mockedApi = new ApiStub();
        mockedGame = new GameStub();
        sut = new Play(mockedApi, mockedGame);
    });

    it('should ask to join game in no name', () => {
        spyOn(mockedApi, 'joinGame');
        mockedApi._me = {};

        sut.activate({id: 'game_id'});

        expect(mockedApi.joinGame).toHaveBeenCalledWith({gameId: 'game_id'});
    });

    it('should not ask to join the game if a name is supplied', () => {
        spyOn(mockedApi, 'joinGame');
        mockedApi._me = {name: 'Player 1'};

        sut.activate({id: 'game_id'});

        expect(mockedApi.joinGame).not.toHaveBeenCalled();
    });

    it('should display the game over popup on game over', done => {
        spyOn(mockedGame, 'popup');
        mockedApi._gameOverDefered.resolve(['Player 1', 'Player 2']);

        sut.activate();

        mockedApi.onGameOverDefered.then(() => {
            expect(mockedGame.popup).toHaveBeenCalledWith(
                'game-over',
                {message: ['Player 1', 'Player 2']});
            done();
        });
    });
});
