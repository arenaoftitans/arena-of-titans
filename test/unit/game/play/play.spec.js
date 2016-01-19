import { Play } from '../../../../app/game/play/play';
import { ApiStub } from '../../utils';


describe('play', () => {
    let sut;
    let mockedApi;

    beforeEach(() => {
        mockedApi = new ApiStub();
        sut = new Play(mockedApi);
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
});
