import { Game } from '../../../app/game/game';
import { ApiStub, RouterStub } from '../utils';


class Popup {
}


describe('the Game module', () => {
    let mockedApi;
    let sut;

    beforeEach(() => {
        mockedApi = new ApiStub();
        sut = new Game(mockedApi);
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

    describe('errors', () => {
        it('should register error callback', () => {
            spyOn(mockedApi, 'onerror');

            sut.activate();

            expect(mockedApi.onerror).toHaveBeenCalled();
        });

        it('should display error popup on error', () => {
            let message = {message: 'error'};
            spyOn(sut, 'popup');

            sut.activate();
            mockedApi._errorCbs.forEach(cb => {
                cb(message);
            });

            expect(sut.popup).toHaveBeenCalledWith('error', message);
        });
    });
});
