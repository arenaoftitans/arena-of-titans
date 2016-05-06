import '../../../setup';
import { AotNotificationsCustomElement } from '../../../../../app/game/play/widgets/notifications';
import { ApiStub, I18nStub } from '../../../utils';


describe('notifications', () => {
    let mockedApi;
    let mockedI18n;
    let sut;

    beforeEach(() => {
        mockedApi = new ApiStub();
        mockedI18n = new I18nStub();
        sut = new AotNotificationsCustomElement(mockedApi, mockedI18n);
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
                },
                player_name: 'Player 1'
            }
        };

        cb(message);

        expect(sut.playerName).toBe('Player 1');
        expect(sut.lastAction.description).toBe('played');
        expect(sut.lastAction.card).toEqual(message.last_action.card);
        expect(sut.lastAction.img).toBe('/assets/game/cards/movement/king-red.png');
    });

    it('should update last action when a trump is played', () => {
        let cb = mockedApi._cbs[mockedApi.requestTypes.play_trump][0];
        let message = {
            last_action: {
                description: 'Someone played a trump',
                trump: {
                    name: 'Tower Blue',
                    description: 'Block player.'
                },
                player_name: 'Player 1'
            }
        };

        cb(message);

        expect(sut.playerName).toBe('Player 1');
        expect(sut.lastAction.description).toBe(message.last_action.description);
        expect(sut.lastAction.trump).toEqual(message.last_action.trump);
        expect(sut.lastAction.img).toBe('/assets/game/cards/trumps/tower-blue.png');
    });
});
