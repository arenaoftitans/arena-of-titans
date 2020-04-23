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

import * as LogManager from "aurelia-logging";
import { inject } from "aurelia-framework";
import { Store } from "aurelia-store";
import { Api } from "../../../services/api";
import { EventAggregatorSubscriptions } from "../../../services/utils";

// In milliseconds to ease calculations.
const TIME_FOR_TURN = 90000;
const COUNTER_REFRESH_TIME = 50;
const TIME_FOR_SPECIAL_ACTION = 15000;

// Canvas variables
const COUNTER_RADIUS = 140;
const COUNTER_X = 150;
const COUNTER_Y = 150;
const COUNTER_WIDTH = 300;
const COUNTER_HEIGHT = 300;

@inject(Api, EventAggregatorSubscriptions, Store)
export class AotCounterCustomElement {
    _api;
    // Filled by ref.
    counterCanvas = null;
    specialActionCounterCanvas = null;

    constructor(api, eas, store) {
        this._api = api;
        this._eas = eas;
        this.game = {};
        this._store = store;
        this._paused = false;
        this.specialActionInProgress = false;
        this._pausedDuration = 0;
        this.yourTurn = false;
        this._elapsedTime = 0;
        this._logger = LogManager.getLogger("AotCounterCustomElement");
        this.startTime = null;
        this.timerInterval = null;
        this.timeLeft = TIME_FOR_TURN;
        this.angle = 0;

        this._eas.subscribe("aot:game:counter_start", () => {
            if (this._canStart()) {
                this.start();
            }
        });

        this._eas.subscribe("aot:api:special_action_notify", message => {
            this._notifySpecialAction(message);
        });

        this._eas.subscribe("aot:notifications:special_action_in_game_help_seen", () => {
            this.startSpecialActionCounter();
        });
    }

    attached() {
        this.init();
    }

    _canStart() {
        return this.yourTurn && !this.game.isOver && this.startTime === null;
    }

    bind() {
        this._subscription = this._store.state.subscribe(state => {
            this.game = state.game;
            this._elapsedTime = state.me.elapsedTime;
            if ((this.yourTurn && !state.me.yourTurn) || (!this.yourTurn && state.me.yourTurn)) {
                this.init();
            }
            this.yourTurn = state.me.yourTurn;

            if (state.me.specialAction) {
                this._notifySpecialAction(state.me.specialAction);
            } else if (!state.me.specialAction && this.specialActionInProgress) {
                this._endSpecialAction();
            }
        });
    }

    unbind() {
        this._subscription.unsubscribe();
        this._eas.dispose();
    }

    _notifySpecialAction(specialActionName) {
        this.specialActionName = specialActionName;
        this.pause();
        this.specialActionInProgress = true;
    }

    _endSpecialAction() {
        this.specialActionInProgress = false;
        this.specialActionName = null;
        this.resume();
    }

    init() {
        if (this.counterCanvas === null) {
            this._logger.debug("Counter canvas is not in the DOM yet. Init was called too soon.");
            return;
        }

        clearInterval(this.timerInterval);

        if (!this.yourTurn || this.game.isOver || this.startTime !== null) {
            this.startTime = null;
        }

        this._paused = false;
        this.specialActionInProgress = false;
        let elapsedTime = this._elapsedTime || 0;
        this.maxTime = TIME_FOR_TURN - elapsedTime;
        // Round max time to upper second
        this.maxTime = Math.floor(this.maxTime / 1000) * 1000;
        this._pausedDuration = 0;
        // Draw the counter.
        this.countDownClock();
    }

    pause() {
        this._paused = true;
    }

    resume() {
        this._paused = false;
    }

    start() {
        this.startTime = new Date().getTime();

        this.timerInterval = setInterval(() => {
            if (this._paused) {
                this._pausedDuration += COUNTER_REFRESH_TIME;
            } else {
                this.countDownClock();
            }

            if (this.timeLeft <= 0) {
                clearInterval(this.timerInterval);
                this.startTime = null;
                this._store.dispatch("passTurn", { auto: true });
            }
        }, COUNTER_REFRESH_TIME);
    }

    countDownClock() {
        // Inspired by http://codepen.io/onge/pen/JoYEZo

        // Time started, minus time now, subtracked from maxTime seconds
        let currentTime = new Date().getTime();
        if (this.startTime === null) {
            // This is the initial drawing with the counter at max time
            this.timeLeft = this.maxTime;
        } else {
            this.timeLeft = this.maxTime - (currentTime - this.startTime) + this._pausedDuration;
        }

        // Angle to use, defined by 1 millisecond
        this.angle = ((2 * Math.PI) / (TIME_FOR_TURN * 0.001)) * (this.timeLeft * 0.001);
        if (this.timeLeft === TIME_FOR_TURN) {
            this.angle -= 0.0001;
        }

        if (this.counterCanvas && this.counterCanvas.getContext) {
            let ctx = this.counterCanvas.getContext("2d");

            // Clear canvas before re-drawing
            ctx.clearRect(0, 0, COUNTER_WIDTH, COUNTER_HEIGHT);

            // Black background ring
            ctx.beginPath();
            ctx.globalAlpha = 1;
            ctx.arc(COUNTER_X, COUNTER_Y, COUNTER_RADIUS, 0, 6.283, false);
            ctx.arc(COUNTER_X, COUNTER_Y, 105, 6.283, Math.PI * 2, true);
            ctx.fillStyle = "#000000";
            ctx.fill();
            ctx.closePath();

            // Clock face ring
            ctx.beginPath();
            ctx.globalAlpha = 1;
            /* eslint-disable */
            ctx.arc(COUNTER_X, COUNTER_Y, COUNTER_RADIUS + 0.1, -1.57, -1.57 + this.angle, false);
            ctx.arc(COUNTER_X, COUNTER_Y, 105, -1.57 + this.angle, Math.PI * 2 - 1.57, true);
            /* eslint-enable */
            ctx.fillStyle = this.colourChanger();
            ctx.fill();
            ctx.closePath();

            // Draw time.
            let fontSize = 120;
            ctx.font = `${fontSize}pt Old English Text MT`;
            ctx.textAlign = "center";
            ctx.fillStyle = "black";
            ctx.fillText(this.formattedTimeLeft, COUNTER_X, COUNTER_Y + fontSize / 2);
        } else {
            this._logger.error("Browser doesn't support canvas");
        }
    }

    colourChanger() {
        // RGB values
        // Green: 	 51 153  0
        // Orange:	244 138  0
        // Red:		255   0  0

        let angle = 6.29 - this.angle;
        let color;

        if (Math.floor(72 + 55 * angle) < 255 || Math.floor(214 + 14 * angle) < 255) {
            // Animate from green to amber
            color =
                "rgb(" + Math.floor(72 + 55 * angle) + "," + Math.floor(214 + 14 * angle) + ",0)";
        } else {
            // Animate from amber to red
            color = "rgb(" + Math.floor(255) + "," + Math.floor(597 - 90 * angle) + ",0)";
        }

        return color;
    }

    startSpecialActionCounter(elapsedTime = 0) {
        this.timeLeftForSpecialAction = TIME_FOR_SPECIAL_ACTION - elapsedTime;

        if (this.timerIntervalForSpecialAction !== undefined) {
            // If the player is reconnected before validating the special action help popup
            // he/she will have multiple special actions counter that will cause not your
            // turn messages to be displayed.
            clearInterval(this.timerIntervalForSpecialAction);
        }

        this.timerIntervalForSpecialAction = setInterval(() => {
            this.countDownClockForSpecialAction();

            if (this.timeLeftForSpecialAction <= 0) {
                clearInterval(this.timerIntervalForSpecialAction);
                this._api.passSpecialAction(this.specialActionName, { auto: true });
            }
        }, COUNTER_REFRESH_TIME);
    }

    countDownClockForSpecialAction() {
        this.timeLeftForSpecialAction -= COUNTER_REFRESH_TIME;
        if (this.specialActionCounterCanvas && this.specialActionCounterCanvas.getContext) {
            let ctx = this.specialActionCounterCanvas.getContext("2d");

            // Clear canvas before re-drawing
            ctx.clearRect(0, 0, COUNTER_WIDTH, COUNTER_HEIGHT);

            // Black stroke.
            let r = this.timeLeftForSpecialAction / TIME_FOR_SPECIAL_ACTION;
            ctx.beginPath();
            ctx.arc(COUNTER_X, COUNTER_Y, COUNTER_RADIUS, 0, 2 * Math.PI, false);
            ctx.clip();
            ctx.fillStyle = this.colourChangerForSpecialAction(r);
            ctx.fillRect(
                COUNTER_X - COUNTER_RADIUS,
                COUNTER_Y + COUNTER_RADIUS,
                COUNTER_RADIUS * 2,
                -COUNTER_RADIUS * 2 * r,
            );
            ctx.lineWidth = 5;
            ctx.strokeStyle = "black";
            ctx.stroke();
            ctx.restore();

            // Draw time
            let fontSize = 120;
            ctx.font = `${fontSize}pt Old English Text MT`;
            ctx.textAlign = "center";
            ctx.fillStyle = "black";
            let text = this.formatTimeLeft(this.timeLeftForSpecialAction);
            ctx.fillText(text, COUNTER_X, COUNTER_Y + fontSize / 2);
        } else {
            this._logger.error("Browser doesn't support canvas");
        }
    }

    colourChangerForSpecialAction(r) {
        // RGB values
        // R: 63 -> 7
        // G: 188 -> 17
        // B: 180 -> 92
        let rr = 1 - r;
        let R = Math.floor(63 * r + 7 * rr);
        let G = Math.floor(188 * r + 17 * rr);
        let B = Math.floor(180 * r + 92 * rr);

        return `rgb(${R},${G},${B})`;
    }

    get formattedTimeLeft() {
        return this.formatTimeLeft(this.timeLeft);
    }

    formatTimeLeft(time) {
        return Math.max(Math.round(time / 1000), 0);
    }

    get displayCounter() {
        return this.yourTurn && !this.game.isOver;
    }
}
