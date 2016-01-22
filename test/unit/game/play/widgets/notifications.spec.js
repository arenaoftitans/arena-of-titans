import { AotNotificationsCustomElement } from '../../../../../app/game/play/widgets/notifications';
import { ApiStub } from '../../../utils';


describe('notifications', () => {
    let mockedApi;
    let sut;

    beforeEach(() => {
        mockedApi = new ApiStub();
        sut = new AotNotificationsCustomElement(mockedApi);
    });

    it('should update last action on player played', () => {
        let cb = mockedApi._cbs[mockedApi.requestTypes.player_played][0];
        let message = {
            player_index: 0,
            last_action: {
                description: 'played',
                card: {
                    name: 'King',
                    color: 'RED',
                    description: 'A card'
                }
            }
        };
        sut.players = {
            names: ['Player 1']
        };

        cb(message);

        expect(sut.lastAction.playerName).toBe('Player 1');
        expect(sut.lastAction.description).toBe('played');
        expect(sut.lastAction.card).toEqual(message.last_action.card);
        expect(sut.lastAction.img).toBe('/assets/game/cards/movement/king_red.png');
    });
});
