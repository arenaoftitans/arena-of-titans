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
* along with Arena of Titans. If not, see <http://www.gnu.org/licenses/>.
*/

import * as LogManager from 'aurelia-logging';
import { inject } from 'aurelia-framework';
import { EventAggregator } from 'aurelia-event-aggregator';
import { Notify } from './notify';
import { Storage } from '../../services/storage';
import { ImageClass, ImageSource, Wait } from './utils';
import { Ws } from './ws';
import environment from '../../environment';
import Config from '../../../config/application';


@inject(Ws, Storage, Config, Notify, EventAggregator)
export class Api {
    // Keep in sync with test-utils.
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
        special_action_notify: 'SPECIAL_ACTION_NOTIFY',
        special_action_play: 'SPECIAL_ACTION_PLAY',
        special_action_view_possible_actions: 'SPECIAL_ACTION_VIEW_POSSIBLE_ACTIONS',
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
    _logger;
    _gameId;

    constructor(ws, storage, config, notify, ea) {
        this._storage = storage;
        this._ws = ws;
        this._ws.onmessage((message) => {
            this._handleMessage(message);
        });
        this._config = config;
        this._notify = notify;
        this._ea = ea;
        this._logger = LogManager.getLogger('AoTApi');

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
        this._createReconnectDefered();

        this._ea.subscribe('aot:ws:reconnected', () => {
            this._createReconnectDefered();
            // We must send the gameId in joinGame to avoid an error: joinGame expect an object,
            // if we call it with undefined it crashes.
            this.joinGame({gameId: this._gameId}).then(() => {
                this._ws.sendDefered();
            });
        });
    }

    _createReconnectDefered() {
        this._reconnectDefered.promise = new Promise((resolve, reject) => {
            this._reconnectDefered.resolve = resolve;
            this._reconnectDefered.reject = reject;
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
            case this.requestTypes.special_action_notify:
                // Nothing to do beside calling callbacks
                break;
            case this.requestTypes.special_action_view_possible_actions:
                // Nothing to do beside calling callbacks
                break;
            case this.requestTypes.special_action_play:
                this._handleSpecialActionPlayed(message);
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
            this._ws.send({
                rt: this.requestTypes.slot_updated,
                slot: {index: 1,
                    player_name: 'Debug AI',
                    hero: 'orc',
                    state: 'AI',
                },
            });
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
            this._game.players.heroes.push(player ? player.hero : null);
            this._game.players.indexes.push(player ? player.index : null);
            this._game.players.names.push(player ? player.name : null);

            if (player && player.square) {
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
        this._me.hand = message.hand.map(card => {
            card.img = ImageClass.forCard(card);
            return card;
        });
        this._me.has_won = message.has_won;
        this._me.on_last_line = message.on_last_line;
        this._me.rank = message.rank;
        this._me.elapsed_time = message.elapsed_time;
        this._updateAffectingTrumps(message.active_trumps);
    }

    _updateAffectingTrumps(activeTrumps) {
        this._game.active_trumps = activeTrumps;
        this._me.affecting_trumps = this._createTrumps(activeTrumps[this._me.index].trumps);
    }

    _handlePlay(message) {
        if (message.reconnect) {
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

    _handleSpecialActionPlayed(message) {
        let actionName = message.special_action_name;
        // If player canceled the action, the name is null
        if (actionName === null) {
            return;
        }

        switch (actionName.toLowerCase()) {
            case 'assassination':
                this._movePlayer({
                    playerIndex: message.player_index,
                    newSquare: message.new_square,
                });
                break;
            default:
                message.info = 'Unknow special action';
                this._logger.error(message);
                break;
        }
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
                this._logger.error(error);
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
        } else if (message.debug) {
            this._logger.debug(message.debug);
        } else {
            this._logger.error(message);
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

        // When we reconnect after a failure of the API, joinGame is called in the API. So we
        // save the gameId to transmit it in that case. In all the other cases, joinGame is
        // called from a view which has the gameId as parameter.
        if (gameId) {
            this._gameId = gameId;
        }

        this._ws.send({
            rt: this.requestTypes.init_game,
            player_name: name,
            game_id: this._gameId,
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
            debug: this.debug || environment.debug,
            create_game_request: players,
        });
    }

    createGameDebug() {
        this.initializeGame('Player 1', 'daemon');
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

    viewPossibleActions({name, targetIndex}) {
        this._ws.send({
            rt: this.requestTypes.special_action_view_possible_actions,
            play_request: {
                special_action_name: name,
                target_index: targetIndex,
            },
        });
    }

    play({cardName: cardName, cardColor: cardColor, x: x, y: y}) {
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

    playSpecialAction({x, y, name, targetIndex}) {
        this._ws.send({
            rt: this.requestTypes.special_action_play,
            play_request: {
                special_action_name: name,
                x: parseInt(x, 10),
                y: parseInt(y, 10),
                target_index: targetIndex,
            },
        });
    }

    cancelSpecialAction(actionName) {
        this._ws.send({
            rt: this.requestTypes.special_action_play,
            play_request: {
                special_action_name: actionName,
                cancel: true,
                // We must send and non null index for the API to comply with the request.
                target_index: -1,
            },
        });
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
}
