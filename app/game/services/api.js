import { inject } from 'aurelia-framework';
import { Ws } from './ws';


@inject(Ws)
export class Api {
    requestTypes = {
        init_game: 'INIT_GAME',
        game_initialized: 'GAME_INITIALIZED',
        add_slot: 'ADD_SLOT',
        slot_updated: 'SLOT_UPDATED',
        create_game: 'CREATE_GAME',
        view: 'VIEW_POSSIBLE_SQUARES',
        play: 'PLAY',
        play_trump: 'PLAY_TRUMP',
        player_moved: 'PLAYER_MOVED',
    };
    requestTypesValues = [];
    callbacks = {};
    _ws;
    _me = {};
    _game = {};

    constructor(ws) {
        for (let rt of Object.values(this.requestTypes)) {
            this.requestTypesValues.push(rt);
            this.callbacks[rt] = [];
        }
        this._ws = ws;
        this._ws.onmessage((message) => {
            this._handleMessage(message);
        })
    }

    on(requestType, cb) {
        if (requestType in this.callbacks) {
            let index = this.callbacks[requestType].length;
            this.callbacks[requestType].push(cb);
            return index;
        }
    }

    off(requestType, cbIndex) {
        if (requestType in this.requestTypes || this.requestTypesValues.includes(requestType)) {
            if (cbIndex !== undefined) {
                this.callbacks[requestType][cbIndex] = undefined;
            }
        }
    }

    _handleMessage(message) {
        switch (message.rt) {
            case this.requestTypes.game_initialized:
                this._handleGameInitialized(message);
                break;
            case this.requestTypes.slot_updated:
                this._handleSlotUpdated(message);
                break;
        }
        this._callCallbacks(message);
    }

    _handleGameInitialized(message) {
        this._me.index = message.index;
        this._me.is_game_master = message.is_game_master;
        this._me.id = message.player_id;

        this._game.id = message.game_id;
        this._game.slots = message.slots;
    }

    _handleSlotUpdated(message) {
        let slot = message.slot;
        if (slot.index in this._game.slots) {
            this._game.slots[slot.index] = slot;
        } else {
            this._game.slots.push(slot);
        }
    }

    _callCallbacks(message) {
        let rt = message.rt;
        this.callbacks[rt].forEach((fn) => {
            fn(message);
        });
    }

    initializeGame(name) {
        this._me.name = name;
        this._ws.send({
            rt: this.requestTypes.init_game,
            player_name: name,
        });
    }

    addSlot() {
        let slot = {
            index: this.game.slots.length,
            player_name: '',
            state: 'OPEN'
        };

        this._ws.send({
            rt: this.requestTypes.add_slot,
            slot: slot
        });
    }

    updateName(name) {
        this.me.name = name;
        let slot = this._game.slots[this.me.index];
        slot.player_name = name;
        this.updateSlot(slot);
    }

    updateSlot(slot) {
        this._ws.send({
            rt: this.requestTypes.slot_updated,
            slot: slot
        })
    }

    joinGame(id, name) {
        this._me.name = name;
        this._ws.send({
            rt: this.requestTypes.init_game,
            player_name: name,
            game_id: id
        })
    }

    get me() {
        return this._me;
    }

    get game() {
        return this._game;
    }
}
