import { inject } from 'aurelia-framework';
import { Api } from '../../services/api';
import { Wait } from '../../services/utils';


@inject(Api, Wait)
export class AotCounterCustomElement {
    _api;

    constructor(api, wait) {
        this._api = api;
        this.maxTime = 60000;
        this.startTime = null;
        this.timeLeft = this.maxTime;
        this.angle = 0;

        let waitForCounter = wait.forId('counter');

        this._api.on(this._api.requestTypes.play, () => {
            if (this._api.game.your_turn && this.startTime === null) {
                waitForCounter.then(() => this.start());
            }
        });
    }

    start() {
        this.startTime = (new Date()).getTime();

        let interval = setInterval(() => {
            this.countDownClock();
            if (this.timeLeft <= 0) {
                clearInterval(interval);
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

        // Set up our canvas
        let canvas = document.getElementById('counter');

        if (canvas.getContext) {
            let ctx = canvas.getContext('2d');

            // Clear canvas before re-drawing
            ctx.clearRect(0, 0, 300, 300);

            // Grey background ring
            ctx.beginPath();
            ctx.globalAlpha = 1;
            ctx.arc(150, 150, 140, 0, 6.283, false);
            ctx.arc(150, 150, 105, 6.283, Math.PI * 2, true);
            ctx.fillStyle = '#bbb';
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
        return this._api.game.your_turn;
    }
}
