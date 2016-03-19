import { Api } from '../../app/game/services/api';


export class RouterStub {
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

    mapUnknownRoutes() {
    }
}


export class ApiStub {
    _api;
    _cbs = {};
    _errorCbs = [];
    _game = {
        slots: []
    };
    _me = {};
    _gameOverDefered = {};

    constructor() {
        this._api = new Api(new WsStub);
        this.onReconnectDefered = new Promise(() => {});
        this._gameOverDefered.promise = new Promise(resolve => {
            this._gameOverDefered.resolve = resolve;
        });
    }

    initializeGame(data) {
        let cbs = this._cbs[this.requestTypes.game_initialized];
        this._game.slots.push({
            index: 0,
            player_name: 'Player 1',
            state: 'TAKEN'
        });
        if (cbs) {
            cbs.forEach(cb => {
                cb(data);
            });
        }
    }

    addSlot() {
    }

    updateMe() {
    }

    joinGame() {
    }

    createGame() {
        let cbs = this._cbs[this.requestTypes.create_game];
        if (cbs) {
            cbs.forEach(cb => {
                cb();
            });
        }
    }

    viewPossibleMovements() {
    }

    play() {
    }

    playTrump() {
    }

    pass() {
    }

    discard() {
    }

    on(rt, fn) {
        if (!(rt in this._cbs)) {
            this._cbs[rt] = [];
        }
        this._cbs[rt].push(fn);
    }

    off() {
    }

    onerror(cb) {
        this._errorCbs.push(cb);
    }

    get requestTypes() {
        return this._api.requestTypes;
    }

    get me() {
        return this._me;
    }


    get game() {
        return this._game;
    }

    get onGameOverDefered() {
        return this._gameOverDefered.promise;
    }

    createGameDebug() {
    }
}


export class GameStub {
    popupPromise;

    popup(type, data) {
        this.popupPromise = new Promise((resolve, reject) => {
            resolve({name: 'Tester', hero: 'daemon'});
        });

        return this.popupPromise;
    }
}


export class I18nStub {
    tr(key) {
        let translations = {
            'game.play.select_trump_target': 'Who should be the target of Trump?',
            'game.play.pass_confirm_message': 'Are you sure you want to pass your turn?',
            'game.play.discard_no_selected_card': 'You must select a card',
            'tower_blue_description': 'played',
            'tower_blue': 'played',
            'cards.king_red': 'played',
            'cards.king': 'played'
        };

        return translations[key];
    }
}


export class StorageStub {
    savePlayerId() {
    }

    retrievePlayerId() {
    }
}


export class WsStub {
    send(data) {
    }

    onmessage(cb) {
    }
}
