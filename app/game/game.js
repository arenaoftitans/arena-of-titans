export class Game {
    configureRouter(config, router) {
        config.options.pushState = true;
        config.map([
            {
                route: '',
                redirect: 'create'
            },
            {
                route: ['create', 'create/:id'],
                name: 'create',
                moduleId: './create/create',
                nav: false,
                title: 'Create game'
            }
        ]);
    }
}
