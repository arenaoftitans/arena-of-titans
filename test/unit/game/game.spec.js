import { Game } from '../../../app/game/game';
import { RouterStub } from '../utils';


class Popup {
}


describe('the Game module', () => {
    var sut;

    beforeEach(() => {
        sut = new Game();
    });

    describe('popups', () => {
        it('creates a popup', () => {
            sut.popup('test', {test: true});
            expect(sut.type).toBe('test');
            expect(sut.data.test).toBe(true);
        });

        it('close the popup on resolve', done => {
            sut.popup('test', {test: true}).then(data => {
                expect(data.test).toBe(true);
                expect(sut.type).toBe(null);
                expect(sut.data).toBe(null);
                done();
            });

            sut.popupDefered.resolve({test: true});
        });
    });

    describe('router', () => {
        let mockedRouter;

        beforeEach(() => {
            mockedRouter = new RouterStub();
            sut.configureRouter(mockedRouter, mockedRouter);
        });

        it('should have a baseUrl', () => {
            expect(mockedRouter.baseUrl).toBe('game');
        });

        it('should be configured as pushState', () => {
            expect(mockedRouter.options.pushState).toBe(true);
        });
    });
});
