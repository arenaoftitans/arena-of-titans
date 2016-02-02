import { AotTrumpsCustomElement } from '../../../../../app/game/play/widgets/trumps';
import { ApiStub, GameStub } from '../../../utils';


describe('trumps', () => {
    let sut;
    let mockedApi;
    let mockedGame;

    beforeEach(() => {
        mockedApi = new ApiStub();
        mockedGame = new GameStub();
        sut = new AotTrumpsCustomElement(mockedApi, mockedGame);
    });

    it('should play trump with a target after a popup', done => {
        let defered = {};
        defered.promise = new Promise(resolve => defered.resolve = resolve);
        spyOn(mockedGame, 'popup').and.returnValue(defered.promise);
        spyOn(mockedApi, 'playTrump');
        mockedApi._game = {
            players: {
                names: ['Player 1', 'Player 2'],
                indexes: [0, 1]
            },
            your_turn: true
        };
        mockedApi._me = {
            index: 0
        };

        sut.play({name: 'Trump', must_target_player: true});

        expect(mockedGame.popup).toHaveBeenCalledWith(
            'confirm',
            {
                message: 'Who should be the target of Trump?', choices: [
                {
                    name: 'Player 2',
                    index: 1
                }
            ]
            }
        );
        defered.resolve(1);
        defered.promise.then(() => {
            expect(mockedApi.playTrump).toHaveBeenCalledWith({
                trumpName: 'Trump',
                targetIndex: 1
            });
            done();
        });
    });

    it('should play trump without a target directly', () => {
        spyOn(mockedGame, 'popup');
        spyOn(mockedApi, 'playTrump');
        mockedApi._game = {
            your_turn: true
        };

        sut.play({name: 'Trump', must_target_player: false});

        expect(mockedGame.popup).not.toHaveBeenCalled();
        expect(mockedApi.playTrump).toHaveBeenCalledWith({trumpName: 'Trump'});
    });

    it('should not play a trump if not your turn', () => {
        spyOn(mockedApi, 'playTrump');
        mockedApi._game = {
            your_turn: false
        };

        sut.play({name: 'Trump'});

        expect(mockedApi.playTrump).not.toHaveBeenCalled();
    });
});
