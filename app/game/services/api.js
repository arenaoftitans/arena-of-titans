import { inject } from 'aurelia-framework';
import { Storage } from './storage';
import { Ws } from './ws';


@inject(Ws, Storage)
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
        player_moved: 'PLAYER_MOVED'
    };
    requestTypesValues = [];
    callbacks = {};
    _errorCallbacks = [];
    _storage;
    _ws;
    _me = {};
    _game = {};

    constructor(ws, storage) {
        for (let rt of Object.values(this.requestTypes)) {
            this.requestTypesValues.push(rt);
            this.callbacks[rt] = [];
        }
        this._storage = storage;
        this._ws = ws;
        this._ws.onmessage((message) => {
            this._handleMessage(message);
        });
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

    onerror(cb) {
        let index = this._errorCallbacks.length;
        this._errorCallbacks.push(cb);

        return index;
    }

    offerror(index) {
        if (index !== undefined) {
            this._errorCallbacks[index] = undefined;
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
            case this.requestTypes.create_game:
                this._handleCreateGame(message);
                break;
            case this.requestTypes.view:
                // Nothing to do beside calling callbacks
                break;
            case this.requestTypes.play:
                this._handlePlay(message);
                break;
            default:
                this._handleErrors(message);
                return;
        }
        this._callCallbacks(message);
    }

    _handleGameInitialized(message) {
        this._storage.savePlayerId(message.game_id, message.player_id);

        this._me.index = message.index;
        this._me.is_game_master = message.is_game_master;
        this._me.id = message.player_id;
        this._me.name = message.slots[this._me.index].player_name;

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

    _handleCreateGame(message) {
        this._createPlayers(message.players);
        this._updateGame(message);
        this._me.trumps = message.trumps;
    }

    _createPlayers(players) {
        this._game.players = {
            indexes: [],
            names: [],
            squares: []
        };

        for (let player of players) {
            this._game.players.indexes.push(player.index);
            this._game.players.names.push(player.name);

            if (player.square) {
                this._game.players.squares.push(player.square);
            } else {
                this._game.players.squares.push({});
            }
        }
    }

    _updateGame(message) {
        this._game.your_turn = message.your_turn;
        this._game.next_player = message.next_player;
        this._game.game_over = message.game_over;
        this._game.winners = message.winners;
        this._game.active_trumps = message.active_trumps;
        this._me.hand = message.hand.map(card => {
            let name = card.name.toLowerCase();
            let color = card.color.toLocaleLowerCase();
            card.img = `/assets/game/cards/movement/${name}_${color}.png`;
            return card;
        });
    }

    _handlePlay(message) {
        this._updateGame(message);

        if (message.reconnect) {
            this._createPlayers(message.reconnect.players);
        }
    }

    _handleErrors(message) {
        if (message.error_to_display) {
            this._errorCallbacks.forEach(cb => {
                cb({message: message.error_to_display});
            });
        } else {
            console.error(message);  //eslint-disable-line no-console
        }
    }

    _callCallbacks(message) {
        let rt = message.rt;
        this.callbacks[rt].forEach((fn) => {
            if (fn) {
                fn(message);
            }
        });
    }

    initializeGame(name) {
        this._ws.send({
            rt: this.requestTypes.init_game,
            player_name: name
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
        });
    }

    joinGame({gameId: gameId, name: name, playerId: playerId}) {
        if (name === undefined && playerId === undefined) {
            playerId = this._storage.retrievePlayerId(gameId);
        }

        this._ws.send({
            rt: this.requestTypes.init_game,
            player_name: name,
            game_id: gameId,
            player_id: playerId
        });
    }

    createGame() {
        let players = this._game.slots.map(slot => {
            return {
                name: slot.player_name,
                index: slot.index
            };
        });

        this._ws.send({
            rt: this.requestTypes.create_game,
            create_game_request: players
        });
    }

    viewPossibleMovements({name: name, color: color}) {
        this._ws.send({
            rt: this.requestTypes.view,
            play_request: {
                card_name: name,
                card_color: color
            }
        });
    }

    play({cardName: cardName, cardColor: cardColor, x: x, y: y}) {
        this._ws.send({
            rt: this.requestTypes.play,
            play_request: {
                card_name: cardName,
                card_color: cardColor,
                x: parseInt(x, 10),
                y: parseInt(y, 10)
            }
        });
    }

    pass() {
        this._ws.send({
            rt: this.requestTypes.play,
            play_request: {
                pass: true
            }
        });
    }

    discard({cardName: cardName, cardColor: cardColor}) {
        this._ws.send({
            rt: this.requestTypes.play,
            play_request: {
                discard: true,
                card_name: cardName,
                card_color: cardColor
            }
        });
    }

    get me() {
        return this._me;
    }

    get game() {
        return this._game;
    }
}
