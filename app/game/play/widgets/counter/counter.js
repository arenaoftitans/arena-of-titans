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
import { Api } from '../../../services/api';
import { Wait } from '../../../services/utils';
import Config from '../../../../../config/application';


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


@inject(Api, Config, EventAggregator)
export class AotCounterCustomElement {
    _api;

    constructor(api, config, ea) {
        this._api = api;
        this._config = config;
        this._ea = ea;
        this._paused = false;
        this.specialActionInProgress = false;
        this._pausedDuration = 0;
        this._logger = LogManager.getLogger('AotCounterCustomElement');
        this.startTime = null;
        this.timerInterval = null;
        this.canvas = null;
        this.specialActionCanvas = null;
        this.timeLeft = TIME_FOR_TURN;
        this.angle = 0;
        this.waitForCounter = Wait.forId('counter');
        this.waitForSpecialActionCounter = Wait.forId('counter-special-action');

        this.init();
        this._api.on(this._api.requestTypes.play, () => {
            clearInterval(this.timerIntervalForSpecialAction);
            this._handlePlayRequest();
        });

        this._api.on(this._api.requestTypes.special_action_notify, message => {
            this._handleSpecialActionNotify(message);
        });

        this._api.onReconnectDefered.then(message => {
            if (message.special_action !== null) {
                this._handleSpecialActionNotify(message);
            }
        });

        this._ea.subscribe('aot:notifications:start_guided_visit', () => {
            this.pause();
        });
        this._ea.subscribe('aot:notifications:end_guided_visit', () => {
            this.resume();
        });
    }

    _handlePlayRequest() {
        if (this.specialActionInProgress) {
            this.specialActionInProgress = false;
            this.resume();
        } else {
            this.init();
        }
    }

    _handleSpecialActionNotify(message) {
        this.specialActionName = message.name || message.special_action;
        this.pause();
        this.specialActionInProgress = true;
        this.initSpecialActionCounter();
    }

    init() {
        if (this._api.game.your_turn && !this._api.game.game_over && this.startTime === null) {
            this._paused = false;
            this.specialActionInProgress = false;
            this.waitForCounter.then(canvas => {
                this.canvas = canvas;
                this.start();
            });
        } else if (!this._api.game.your_turn) {
            clearInterval(this.timerInterval);
            this.startTime = null;
        }
    }

    initSpecialActionCounter() {
        this.waitForSpecialActionCounter.then(canvas => {
            this.specialActionCanvas = canvas;
            this.startSpecialActionCounter();
        });
    }

    pause() {
        this._paused = true;
    }

    resume() {
        this._paused = false;
    }

    start() {
        let elapsedTime = this._api.me.elapsed_time || 0;
        this.maxTime = TIME_FOR_TURN - elapsedTime;
        // Round max time to upper second
        this.maxTime = Math.floor(this.maxTime / 1000) * 1000;
        this.startTime = (new Date()).getTime();
        this._pausedDuration = 0;

        this.timerInterval = setInterval(() => {
            if (this._paused) {
                this._pausedDuration += COUNTER_REFRESH_TIME;
            } else {
                this.countDownClock();
            }

            if (this.timeLeft <= 0 && !this._config.test.debug) {
                clearInterval(this.timerInterval);
                this.startTime = null;
                this._api.pass();
            }
        }, COUNTER_REFRESH_TIME);
    }

    countDownClock() {
        // Inspired by http://codepen.io/onge/pen/JoYEZo

        // Time started, minus time now, subtracked from maxTime seconds
        let currentTime = (new Date()).getTime();
        this.timeLeft = this.maxTime - (currentTime - this.startTime) + this._pausedDuration;

        // Angle to use, defined by 1 millisecond
        this.angle = 2 * Math.PI / (TIME_FOR_TURN * 0.001) *
            (this.timeLeft * 0.001);
        if (this.timeLeft === TIME_FOR_TURN) {
            this.angle -= 0.0001;
        }

        if (this.canvas && this.canvas.getContext) {
            let ctx = this.canvas.getContext('2d');

            // Clear canvas before re-drawing
            ctx.clearRect(0, 0, COUNTER_WIDTH, COUNTER_HEIGHT);

            // Black background ring
            ctx.beginPath();
            ctx.globalAlpha = 1;
            ctx.arc(COUNTER_X, COUNTER_Y, COUNTER_RADIUS, 0, 6.283, false);
            ctx.arc(COUNTER_X, COUNTER_Y, 105, 6.283, Math.PI * 2, true);
            ctx.fillStyle = '#000000';
            ctx.fill();
            ctx.closePath();

            // Clock face ring
            ctx.beginPath();
            ctx.globalAlpha = 1;
            ctx.arc(COUNTER_X, COUNTER_Y, COUNTER_RADIUS + 0.1, - 1.57, - 1.57 + this.angle, false);
            ctx.arc(COUNTER_X, COUNTER_Y, 105, - 1.57 + this.angle, Math.PI * 2 - 1.57, true);
            ctx.fillStyle = this.colourChanger();
            ctx.fill();
            ctx.closePath();

            // Draw time.
            let fontSize = 120;
            ctx.font = `${fontSize}pt Old English Text MT`;
            ctx.textAlign = 'center';
            ctx.fillStyle = 'black';
            ctx.fillText(this.formatedTimeLeft, COUNTER_X, COUNTER_Y + fontSize / 2);
        } else {
            this._logger.error('Browser doesn\'t support canvas');
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
            color = 'rgb(' +
                Math.floor(72 + 55 * angle) + ',' +
                Math.floor(214 + 14 * angle) + ',0)';
        } else {
            // Animate from amber to red
            color = 'rgb(' + Math.floor(255) + ',' + Math.floor(597 - (90 * angle)) + ',0)';
        }

        return color;
    }

    startSpecialActionCounter() {
        this.timeLeftForSpecialAction = TIME_FOR_SPECIAL_ACTION;

        this.timerIntervalForSpecialAction = setInterval(() => {
            this.countDownClockForSpecialAction();

            if (this.timeLeftForSpecialAction <= 0 && !this._config.test.debug) {
                clearInterval(this.timerIntervalForSpecialAction);
                this._api.cancelSpecialAction(this.specialActionName);
            }
        }, COUNTER_REFRESH_TIME);
    }

    countDownClockForSpecialAction() {
        this.timeLeftForSpecialAction -= COUNTER_REFRESH_TIME;
        if (this.specialActionCanvas && this.specialActionCanvas.getContext) {
            let ctx = this.specialActionCanvas.getContext('2d');

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
                - COUNTER_RADIUS * 2 * r
            );
            ctx.lineWidth = 5;
            ctx.strokeStyle = 'black';
            ctx.stroke();
            ctx.restore();

            // Draw time
            let fontSize = 120;
            ctx.font = `${fontSize}pt Old English Text MT`;
            ctx.textAlign = 'center';
            ctx.fillStyle = 'black';
            let text = this.formatTimeLeft(this.timeLeftForSpecialAction);
            ctx.fillText(text, COUNTER_X, COUNTER_Y + fontSize / 2);
        } else {
            this._logger.error('Browser doesn\'t support canvas');
        }
    }

    colourChangerForSpecialAction(r) {
        // RGB values
        // Green: 	 51 153  0
        // Orange:	244 138  0
        // Red:		255   0  0

        return `rgb(${Math.floor(204 * (1 - r) + 51)},${Math.floor(153 * r)},0)`;
    }

    get formatedTimeLeft() {
        return this.formatTimeLeft(this.timeLeft);
    }

    formatTimeLeft(time) {
        return Math.max(Math.round(time / 1000), 0);
    }

    get displayCounter() {
        return this._api.game.your_turn && !this._api.game.game_over;
    }
}
