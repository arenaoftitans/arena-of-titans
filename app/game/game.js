import { Api } from './services/api';
import { inject } from 'aurelia-framework';

import '../../style/game/create.css';
import '../../style/game/counter.css';
import '../../style/game/play.css';
import '../../style/board.css';
import '../../style/sprites/movement.css';


@inject(Api)
export class Game {
    static heroes = [
        'daemon',
        'orc',
        'reaper',
        'thief',
    ];

    data = null;
    type = null;
    popupDefered = {
        promise: null,
        resolve: null,
        reject: null,
    };

    constructor(api) {
        this._api = api;
    }

    configureRouter(config, router) {
        router.baseUrl = 'game';
        config.options.pushState = true;
        config.map([
            {
                route: ['', 'play'],
                redirect: 'create',
            },
            {
                route: ['create', 'create/:id'],
                name: 'create',
                moduleId: './create/create',
                nav: false,
                title: 'Create game',
            },
            {
                route: 'play/:id',
                name: 'play',
                moduleId: './play/play',
                nav: false,
                title: 'Play',
            },
        ]);
        config.mapUnknownRoutes(instruction => {
            instruction.moduleId = 'not-found';

            return instruction;
        });
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
        }, () => {
            this.data = null;
            this.type = null;
        });

        return this.popupDefered.promise;
    }

    get maxNumberPlayers() {
        return 8;
    }
}
