import { inject } from 'aurelia-framework';
import { Api } from '../../services/api';
import { Wait } from '../../services/utils';
import Config from '../../../../config/application.json';


@inject(Api, Config)
export class AotCounterCustomElement {
    _api;

    // In milliseconds to ease calculations.
    static TIME_FOR_TURN = 60000;

    constructor(api, config) {
        this._api = api;
        this._config = config;
        this.startTime = null;
        this.timerInterval = null;
        this.canvas = null;
        this.timeLeft = this.maxTime;
        this.angle = 0;
        this.waitForCounter = Wait.forId('counter');

        this.init();
        this._api.on(this._api.requestTypes.play, () => {
            this.init();
        });
    }

    init() {
        if (this._api.game.your_turn && !this._api.game.game_over && this.startTime === null) {
            this.waitForCounter.then(canvas => {
                this.canvas = canvas;
                this.start();
            });
        } else if (!this._api.game.your_turn) {
            clearInterval(this.timerInterval);
            this.startTime = null;
        }
    }

    start() {
        let elapsedTime = Math.round(Date.now()) - this._api.me.turn_start_time || 0;
        this.maxTime = AotCounterCustomElement.TIME_FOR_TURN - elapsedTime;
        // Round max time to upper second
        this.maxTime = Math.floor(this.maxTime / 1000) * 1000;
        this.startTime = (new Date()).getTime();

        this.timerInterval = setInterval(() => {
            this.countDownClock();
            if (this.timeLeft <= 0 && !this._config.test.debug) {
                clearInterval(this.timerInterval);
                this.startTime = null;
                this._api.pass();
            }
        }, 50);
    }

    countDownClock() {
        // Inspired by http://codepen.io/onge/pen/JoYEZo

        // Time started, minus time now, subtracked from 60 seconds
        let currentTime = (new Date()).getTime();
        this.timeLeft = this.maxTime - (currentTime - this.startTime);

        // Angle to use, defined by 1 millisecond
        this.angle = 0.1048335 * 0.001 * this.timeLeft;

        if (this.canvas && this.canvas.getContext) {
            let ctx = this.canvas.getContext('2d');

            // Clear canvas before re-drawing
            ctx.clearRect(0, 0, 300, 300);

            // Black background ring
            ctx.beginPath();
            ctx.globalAlpha = 1;
            ctx.arc(150, 150, 140, 0, 6.283, false);
            ctx.arc(150, 150, 105, 6.283, Math.PI * 2, true);
            ctx.fillStyle = '#000000';
            ctx.fill();
            ctx.closePath();

            // Clock face ring
            ctx.beginPath();
            ctx.globalAlpha = 1;
            ctx.arc(150, 150, 140.1, -1.57, -1.57 + this.angle, false);
            ctx.arc(150, 150, 105, -1.57 + this.angle, Math.PI * 2 - 1.57, true);
            ctx.fillStyle = this.colourChanger();
            ctx.fill();
            ctx.closePath();
        } else {
            console.error('Browser doesn\'t support canvas');  //eslint-disable-line no-console
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

    get formatedTimeLeft() {
        return Math.max(Math.round(this.timeLeft / 1000), 0);
    }

    get displayCounter() {
        return this._api.game.your_turn && !this._api.game.game_over;
    }
}
