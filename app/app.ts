export class App {
    router;

    configureRouter(config, router) {
        config.title = 'Arena of Titans';
        config.options.pushState = true;
        config.map([
            {
                route: '',
                name: 'home',
                moduleId: 'home',
                nav: true,
                title: 'Homepage'
            }, {
                route: 'rules',
                name: 'rules',
                moduleId: 'rules',
                nav: true,
                title: 'Rules'
            }, {
                route: 'synopsis',
                name: 'synopsis',
                moduleId: 'synopsis',
                nav: true,
                title: 'Synopsis'
            }
        ]);

        this.router = router;
    }
}
