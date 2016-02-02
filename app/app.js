export class App {
    _router;

    configureRouter(config, router) {
        this._router = router;
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
                moduleId: 'rules/rules',
                nav: true,
                title: 'Rules'
            }, {
                route: 'synopsis',
                name: 'synopsis',
                moduleId: 'synopsis/synopsis',
                nav: true,
                title: 'Synopsis'
            }, {
                route: 'game',
                name: 'game',
                moduleId: 'game/game',
                nav: true,
                title: 'Game'
            }
        ]);
        config.mapUnknownRoutes(instruction => {
            instruction.moduleId = 'not-found';

            return instruction;
        });
    }
}
