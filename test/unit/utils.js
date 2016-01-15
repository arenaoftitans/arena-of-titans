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
}


export class ApiStub {
    _api;
    _cbs = {};
    _game = {
        slots: []
    };
    _me = {};

    constructor() {
        this._api = new Api(new WsStub);
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

    updateName() {
    }

    joinGame() {
    }

    on(rt, fn) {
        if (!(rt in this._cbs)) {
            this._cbs[rt] = [];
        }
        this._cbs[rt].push(fn);
    }

    off() {
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
