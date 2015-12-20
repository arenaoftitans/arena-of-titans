import { App } from '../../app/app';

class RouterStub {
    options = {};

    configure(handler) {
        handler(this);
    }

    map(routes) {
        this.routes = routes;
    }
}


describe('the App module', () => {
    var sut;
    var mockedRouter;

    beforeEach(() => {
        mockedRouter = new RouterStub();
        sut = new App();
        sut.configureRouter(mockedRouter, mockedRouter);
    });

    it('contains a router property', () => {
        expect(sut.router).toBeDefined();
    });

    it('configures the router title', () => {
        expect(sut.router.title).toEqual('Arena of Titans');
    });

    it('configures the pushState', () => {
        expect(sut.router.options.pushState).toBe(true);
    })
});


