import './setup';
import { App } from '../../app/app';
import { RouterStub } from './utils';


describe('the App module', () => {
    var sut;
    var mockedRouter;

    beforeEach(() => {
        mockedRouter = new RouterStub();
        sut = new App();
        sut.configureRouter(mockedRouter, mockedRouter);
    });

    it('contains a router property', () => {
        expect(sut._router).toBeDefined();
    });

    it('configures the router title', () => {
        expect(sut._router.title).toEqual('Arena of Titans');
    });

    it('configures the pushState', () => {
        expect(sut._router.options.pushState).toBe(true);
    })
});
