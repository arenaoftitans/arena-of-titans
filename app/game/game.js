export class Game {
    data = null;
    type = null;
    popupDefered = {
        promise: null,
        resolve: null,
        reject: null
    };

    configureRouter(config, router) {
        config.options.pushState = true;
        router.baseUrl = 'game';
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

    popup(type, data) {
        this.data = data;
        this.type = type;
        this.popupDefered.promise = new Promise((resolve, reject) => {
            this.popupDefered.resolve = resolve;
            this.popupDefered.reject = reject;
        });

        this.popupDefered.promise.then(() => {
            this.data = null;
            this.type = null;
        });

        return this.popupDefered.promise;
    }

    get maxNumberPlayers() {
        return 8;
    }
}
