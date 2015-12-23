class RouterStub {
    options = {};
    baseUrl = '';

    configure(handler) {
        handler(this);
    }

    map(routes) {
        this.routes = routes;
    }

    navigateToRoute(route, params) {
    }
}
