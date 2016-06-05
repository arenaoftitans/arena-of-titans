/*
* Copyright (C) 2015-2016 by Arena of Titans Contributors.
*
* This file is part of Arena of Titans.
*
* Arena of Titans is free software: you can redistribute it and/or modify
* it under the terms of the GNU Affero General Public License as published by
* the Free Software Foundation, either version 3 of the License, or
* (at your option) any later version.
*
* Arena of Titans is distributed in the hope that it will be useful,
* but WITHOUT ANY WARRANTY; without even the implied warranty of
* MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
* GNU Affero General Public License for more details.
*
* You should have received a copy of the GNU Affero General Public License
* along with Arena of Titans. If not, see <http://www.GNU Affero.org/licenses/>.
*/

import { inject } from 'aurelia-framework';
import { EventAggregator } from 'aurelia-event-aggregator';
import { Notify } from './notify';
import { Storage } from '../../services/storage';
import { ImageClass, ImageSource, Wait } from './utils';
import { Ws } from './ws';
import Config from '../../../config/application.json';


@inject(Ws, Storage, Config, Notify, EventAggregator)
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
        player_played: 'PLAYER_PLAYED',
    };
    requestTypesValues = [];
    callbacks = {};
    _ea;
    _reconnectDefered = {};
    _gameOverDefered = {};
    _errorCallbacks = [];
    _storage;
    _ws;
    _me;
    _game;
    _config;
    _hasPlayedOnced = false;

    constructor(ws, storage, config, notify, ea) {
        this._storage = storage;
        this._ws = ws;
        this._ws.onmessage((message) => {
            this._handleMessage(message);
        });
        this._config = config;
        this._notify = notify;
        this._ea = ea;
        this._reconnectDefered.promise = new Promise((resolve, reject) => {
            this._reconnectDefered.resolve = resolve;
            this._reconnectDefered.reject = reject;
        });

        this.init();
    }

    init() {
        this._me = {
            trumps: [],
        };
        this._game = {
            players: {
                names: [],
                squares: [],
                indexes: [],
            },
        };
        for (let rt of Object.values(this.requestTypes)) {
            this.requestTypesValues.push(rt);
            this.callbacks[rt] = [];
        }

        this._gameOverDefered.promise = new Promise(resolve => {
            this._gameOverDefered.resolve = resolve;
        });
    }

    on(requestType, cb) {
        if (requestType in this.callbacks) {
            let index = this.callbacks[requestType].length;
            this.callbacks[requestType].push(cb);
            return index;
        }

        return -1;
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
            case this.requestTypes.player_played:
                this._handlePlayerPlayed(message);
                break;
            case this.requestTypes.play_trump:
                this._handlePlayTrump(message);
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
        if (this._me.index === -1) {
            this._reconnectDefered.reject();
            return;
        } else {  // eslint-disable-line no-else-return
            this._reconnectDefered.resolve(message);
        }
        this._me.is_game_master = message.is_game_master;
        this._me.id = message.player_id;
        this._me.hero = message.slots[this._me.index].hero;
        this._me.name = message.slots[this._me.index].player_name;

        this._game.id = message.game_id;
        this._game.slots = message.slots;

        if (this.debug) {
            this.addSlot();
        }
    }

    _handleSlotUpdated(message) {
        let slot = message.slot;
        if (slot.index in this._game.slots) {
            this._game.slots[slot.index] = slot;
        } else {
            this._game.slots.push(slot);
        }

        if (this.debug) {
            this.createGame();
        }
    }

    _handleCreateGame(message) {
        this._createPlayers(message.players);
        this._me.trumps = this._createTrumps(message.trumps);
        this._updateGame(message);
        this._initBoard();
    }

    _createPlayers(players) {
        this._game.players = {
            heroes: [],
            indexes: [],
            names: [],
            squares: [],
        };

        for (let player of players) {
            this._game.players.heroes.push(player.hero);
            this._game.players.indexes.push(player.index);
            this._game.players.names.push(player.name);

            if (player.square) {
                this._game.players.squares.push(player.square);
            } else {
                this._game.players.squares.push({});
            }
        }
    }

    _createTrumps(trumps) {
        return trumps.map(trump => {
            trump.img = ImageSource.forTrump(trump);
            return trump;
        });
    }

    _updateGame(message) {
        this._game.was_your_turn = this._game.your_turn;
        this._game.your_turn = message.your_turn;
        this._game.next_player = message.next_player;
        this._game.active_trumps = message.active_trumps;
        this._me.hand = message.hand.map(card => {
            card.img = ImageClass.forCard(card);
            return card;
        });
        this._me.has_won = message.has_won;
        this._me.rank = message.rank;
        this._me.elapsed_time = message.elapsed_time;
        this._updateAffectingTrumps(message.active_trumps);
    }

    _updateAffectingTrumps(activeTrumps) {
        this._me.affecting_trumps = this._createTrumps(activeTrumps[this._me.index].trumps);
    }

    _handlePlay(message) {
        if (message.reconnect) {
            this._cancelGuidedVisit();
            this._handleReconnect(message.reconnect);
        }

        this._updateGame(message);

        if (this._game.your_turn && !this._game.was_your_turn) {
            this._notify.notifyYourTurn();
        } else {
            this._notify.clearNotifications();
        }
    }

    _handlePlayerPlayed(message) {
        this._movePlayer({
            playerIndex: message.player_index,
            newSquare: message.new_square,
        });

        this._handleGameOverMessage(message);
    }

    _handleGameOverMessage(message) {
        this._game.game_over = message.game_over;
        this._game.winners = message.winners;

        if (message.game_over) {
            this._gameOverDefered.resolve(message.winners);
            this._notify.notifyGameOver();
        }
    }

    _handlePlayTrump(message) {
        this._updateAffectingTrumps(message.active_trumps);
    }

    _handleReconnect(reconnectMessage) {
        this._createPlayers(reconnectMessage.players);
        this._me.trumps = this._createTrumps(reconnectMessage.trumps);
        this._me.index = reconnectMessage.index;
        this._me.hero = this._game.players.heroes[this._me.index];
        this._me.name = this._game.players.names[this._me.index];

        this._initBoard();
        this._reconnectDefered.resolve(reconnectMessage);
        this._handleGameOverMessage(reconnectMessage);
    }

    _initBoard() {
        // When reconnecting, we must wait for the board to be loaded before trying to move
        // the pawns.
        let waitForBoard = Wait.forId('player0');

        waitForBoard.then(() => {
            this._game.players.squares.forEach((square, index) => {
                if (square && Object.keys(square).length > 0) {
                    this._movePlayer({playerIndex: index, newSquare: square});
                }
            });
            this._rotateBoard();
        }).catch(error => {
            if (!window.jasmine || !(error instanceof TypeError)) {
                console.error(error);  // eslint-disable-line no-console
            }
        });
    }

    _movePlayer({playerIndex: playerIndex, newSquare: newSquare}) {
        let pawnId = `player${playerIndex}`;
        let pawn = document.getElementById(pawnId);
        let pawnContainer = document.getElementById(`${pawnId}Container`);
        let square = document.getElementById('square-' + newSquare.x + '-' + newSquare.y);
        let boundingBox = square.getBBox();
        let transform = square.getAttribute('transform');

        pawnContainer.setAttribute('transform', transform);
        pawn.setAttribute('height', boundingBox.height);
        pawn.setAttribute('width', boundingBox.width);
        pawn.setAttribute('x', boundingBox.x);

        if (square.tagName === 'rect') {
            pawn.setAttribute('y', boundingBox.y);
        } else {
            pawn.setAttribute('y', boundingBox.y + 0.25 * boundingBox.height);
        }
    }

    _rotateBoard() {
        let boardLayer = document.getElementById('boardLayer');
        let pawnLayer = document.getElementById('pawnLayer');
        let angle = 45 * this._me.index;
        boardLayer.setAttribute('transform', `rotate(${angle} 990 990)`);
        pawnLayer.setAttribute('transform', `rotate(${angle} 990 990)`);
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

    initializeGame(name, hero) {
        this._ws.send({
            rt: this.requestTypes.init_game,
            player_name: name,
            hero: hero,
        });
    }

    addSlot() {
        let slot = {
            index: this.debug ? 1 : this.game.slots.length,
            player_name: this.debug ? 'Player 2' : '',
            state: this.debug ? 'TAKEN' : 'OPEN',
        };

        this._ws.send({
            rt: this.requestTypes.add_slot,
            slot: slot,
        });
    }

    updateMe(name, hero) {
        this.me.name = name;
        this.me.hero = hero;
        let slot = this._game.slots[this.me.index];
        slot.player_name = name;
        slot.hero = hero;
        this.updateSlot(slot);
    }

    updateSlot(slot) {
        this._ws.send({
            rt: this.requestTypes.slot_updated,
            slot: slot,
        });
    }

    joinGame({gameId: gameId, name: name, playerId: playerId, hero: hero}) {
        if (name === undefined && playerId === undefined) {
            playerId = this._storage.retrievePlayerId(gameId);
        }

        this._ws.send({
            rt: this.requestTypes.init_game,
            player_name: name,
            game_id: gameId,
            player_id: playerId,
            hero: hero,
        });

        return this.onReconnectDefered;
    }

    createGame() {
        let players = this._game.slots.map(slot => {
            return {
                name: slot.player_name,
                index: slot.index,
                hero: slot.hero,
            };
        });

        this._ws.send({
            rt: this.requestTypes.create_game,
            create_game_request: players,
        });
    }

    createGameDebug() {
        this.initializeGame('Player 1');
    }

    viewPossibleMovements({name: name, color: color}) {
        this._ws.send({
            rt: this.requestTypes.view,
            play_request: {
                card_name: name,
                card_color: color,
            },
        });
    }

    play({cardName: cardName, cardColor: cardColor, x: x, y: y}) {
        if (!this._hasPlayedOnced) {
            this._cancelGuidedVisit();
            this._hasPlayedOnced = true;
        }
        this._ws.send({
            rt: this.requestTypes.play,
            play_request: {
                card_name: cardName,
                card_color: cardColor,
                x: parseInt(x, 10),
                y: parseInt(y, 10),
            },
        });
    }

    _cancelGuidedVisit() {
        this._ea.publish('aot:api:cancel_guided_visit');
    }

    playTrump({trumpName, targetIndex}) {
        this._ws.send({
            rt: this.requestTypes.play_trump,
            play_request: {
                name: trumpName,
                target_index: targetIndex === undefined ? null : targetIndex,
            },
        });
    }

    pass() {
        this._ws.send({
            rt: this.requestTypes.play,
            play_request: {
                pass: true,
            },
        });
    }

    discard({cardName: cardName, cardColor: cardColor}) {
        this._ws.send({
            rt: this.requestTypes.play,
            play_request: {
                discard: true,
                card_name: cardName,
                card_color: cardColor,
            },
        });
    }

    get onReconnectDefered() {
        return this._reconnectDefered.promise;
    }

    get onGameOverDefered() {
        return this._gameOverDefered.promise;
    }

    get me() {
        return this._me;
    }

    get game() {
        return this._game;
    }

    get debug() {
        return this._config.test.debug;
    }

    get hasPlayedOnce() {
        return this._hasPlayedOnced;
    }
}
