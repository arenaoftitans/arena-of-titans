import { Api } from './services/api';
import { inject } from 'aurelia-framework';


@inject(Api)
export class Game {
    data = null;
    type = null;
    popupDefered = {
        promise: null,
        resolve: null,
        reject: null
    };

    constructor(api) {
        this._api = api;
    }

    configureRouter(config, router) {
        router.baseUrl = 'game';
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

    activate() {
        this._api.onerror(data => {
            this.popup('error', data);
        });
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
