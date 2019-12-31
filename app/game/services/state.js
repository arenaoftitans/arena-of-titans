/*
 * Copyright (C) 2015-2018 by Arena of Titans Contributors.
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

import * as LogManager from "aurelia-logging";
import { inject } from "aurelia-framework";
import { EventAggregator } from "aurelia-event-aggregator";
import { Popup } from "./popup";
import { AssetSource, ImageClass } from "../../services/assets";
import { BOARD_MOVE_MODE, BOARD_SELECT_SQUARE_MODE, COLOR_CHOICES } from "../constants";

@inject(EventAggregator, Popup)
export class State {
    constructor(ea, popup) {
        this._logger = LogManager.getLogger("AoTState");

        ea.subscribe("aot:trump:wish_to_play", trump => {
            if (trump.trumpName === "Terraforming") {
                this._board.mode = BOARD_SELECT_SQUARE_MODE;
                ea.publish("aot:state:set_board_mode", this._board.mode);
                popup.display("infos", {
                    translate: {
                        messages: {
                            title: "game.play.board_select_square",
                        },
                    },
                });
                const subscription = ea.subscribe("aot:board:selected_square", square => {
                    popup
                        .display("confirm", {
                            choices: COLOR_CHOICES,
                            translate: {
                                messages: {
                                    title: "game.play.board_select_square_color",
                                },
                            },
                        })
                        .then(chosenColor => {
                            this._board.mode = BOARD_MOVE_MODE;
                            ea.publish("aot:state:set_board_mode", this._board.mode);
                            square.color = chosenColor.name;
                            trump.square = square;
                            ea.publish("aot:trump:play", trump);
                            subscription.dispose();
                        });
                });
            } else {
                ea.publish("aot:trump:play", trump);
            }
        });

        this.reset();
    }

    createGame(message) {
        this._createPlayers(message.players);
        this._me.power = this._createPower(message.power);
        this._me.trumps = this._createTrumps(message.trumps);
        this.updateAfterPlay(message);
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

    _createPower(power) {
        if (power) {
            power.img = AssetSource.forPower(power);
        }

        return power;
    }

    _createTrumps(trumps) {
        return trumps.map(trump => {
            // Affecting trumps can be power. We rely on their 'passive' property to detect them.
            if ("passive" in trump) {
                return this._createPower(trump);
            }

            trump.img = AssetSource.forTrump(trump);
            return trump;
        });
    }

    _handleGameOverMessage(message) {
        this._game.game_over = message.game_over;
        this._game.winners = message.winners;
    }

    initializeGame(message) {
        this._me.index = message.index;
        this._me.is_game_master = message.is_game_master;
        this._me.id = message.player_id;
        this._me.hero = message.slots[this._me.index].hero;
        this._me.name = message.slots[this._me.index].player_name;

        this._game.id = message.game_id;
        this._game.slots = message.slots;
    }

    reconnect(message) {
        this._createPlayers(message.players);
        this._me.power = this._createPower(message.power);
        this._me.trumps = this._createTrumps(message.trumps);
        this._me.index = message.index;
        this._me.hero = this._game.players.heroes[this._me.index];
        this._me.name = this._game.players.names[this._me.index];

        this._handleGameOverMessage(message);
    }

    reset() {
        this._me = {
            trumps: [],
            power: null,
        };
        this._game = {
            players: {
                names: [],
                squares: [],
                indexes: [],
            },
        };
        this._board = {
            mode: BOARD_MOVE_MODE,
        };
    }

    _updateAffectingTrumps(activeTrumps) {
        this._game.active_trumps = activeTrumps;
        this._me.affecting_trumps = this._createTrumps(activeTrumps[this._me.index].trumps);
    }

    updateAfterPlay(message) {
        this._game.was_your_turn = this._game.your_turn;
        this._game.your_turn = message.your_turn;
        this._game.next_player = message.next_player;
        this._game.has_remaining_moves_to_play = message.has_remaining_moves_to_play;
        // This value may be undefined on game creation. In this case, there were 0 turn.
        this._game.nb_turns = message.nb_turns || 0;
        this._me.hand = message.hand.map(card => {
            card.img = ImageClass.forCard(card);
            return card;
        });
        if (message.power) {
            this._me.power = this._createPower(message.power);
        }
        this._me.has_won = message.has_won;
        this._me.on_last_line = message.on_last_line;
        this._me.rank = message.rank;
        this._me.elapsed_time = message.elapsed_time;
        this._updateAffectingTrumps(message.active_trumps);
        this._game.trumps_statuses = message.trumps_statuses;
        this._game.can_power_be_played = message.can_power_be_played;
        this._game.gauge_value = message.gauge_value;
        this._logger.debug(`Gauge value: ${this._game.gauge_value}`);
    }

    updateAfterPlayerPlayed(message) {
        this._game.trumps_statuses = message.trumps_statuses;
        this._game.can_power_be_played = message.can_power_be_played;
        this._handleGameOverMessage(message);
    }

    updateAfterTrumpPlayed(message) {
        this._game.trumps_statuses = message.trumps_statuses;
        this._game.can_power_be_played = message.can_power_be_played;
        if (message.power) {
            this._me.power = this._createPower(message.power);
        }
        if (Number.isInteger(message.gauge_value)) {
            this._game.gauge_value = message.gauge_value;
            this._logger.debug(`Gauge value: ${this._game.gauge_value}`);
        }
        this._updateAffectingTrumps(message.active_trumps);
    }

    updateMe(name, hero) {
        this.me.name = name;
        this.me.hero = hero;

        const slot = this.game.slots[this.me.index];
        slot.player_name = name;
        slot.hero = hero;
    }

    updateSlot(message) {
        let slot = message.slot;
        if (slot.index in this._game.slots) {
            this._game.slots[slot.index] = slot;
        } else {
            this._game.slots.push(slot);
        }
    }

    get board() {
        return this._board;
    }

    get me() {
        return this._me;
    }

    get game() {
        return this._game;
    }

    get players() {
        return this._game.players;
    }
}
