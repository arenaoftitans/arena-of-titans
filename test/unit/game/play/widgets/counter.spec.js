import '../../../setup';
import { AotCounterCustomElement } from '../../../../../app/game/play/widgets/counter';
import { Wait } from '../../../../../app/game/services/utils';
import { ApiStub } from '../../../utils';


describe('counter', () => {
    let mockedApi;
    let sut;

    beforeEach(() => {
        mockedApi = new ApiStub();
        sut = new AotCounterCustomElement(mockedApi);
    });

    it('should start on your turn', done => {
        spyOn(sut, 'start');

        mockedApi.game.your_turn = true;
        mockedApi.game.game_over = false;
        mockedApi.play();

        Wait.forId('counter').then(() => {
            expect(sut.start).toHaveBeenCalled();
            done();
        });
    });

    it('shouldn\'t start but reset when not your turn', done => {
        spyOn(sut, 'start');
        spyOn(window, 'clearInterval');

        sut.startTime = (new Date()).getTime();
        mockedApi.game.your_turn = false;
        mockedApi.game.game_over = false;
        mockedApi.play();

        Wait.forId('counter').then(() => {
            expect(sut.start).not.toHaveBeenCalled();
            expect(window.clearInterval).toHaveBeenCalled();
            expect(sut.startTime).toBe(null);
            done();
        });
    });

    it('shouldn\'t start on game over', done => {
        spyOn(sut, 'start');
        spyOn(window, 'clearInterval');

        mockedApi.game.your_turn = true;
        mockedApi.game.game_over = true;
        mockedApi.play();

        Wait.forId('counter').then(() => {
            expect(sut.start).not.toHaveBeenCalled();
            done();
        });
    });
});
