import { inject } from 'aurelia-framework';
import Config from '../../../config/application.json';
import ReconnectingWebSocket from '../../../node_modules/reconnectingwebsocket/reconnecting-websocket.js';  // eslint-disable-line max-len


@inject(Config)
export class Ws {
    _ws;
    _waitingOpen = [];

    constructor(config) {
        let api = config.api;

        this._ws = new ReconnectingWebSocket(`${api.scheme}://${api.host}:${api.port}`);
        this._ws.onopen = () => {
            this._waitingOpen.forEach(data => {
                this.send(data);
            });
        };
    }

    send(data) {
        // If the websocket is not opened yet, we delay the transmission of data.
        if (this._ws.readyState === 1) {
            this._ws.send(JSON.stringify(data));
        } else {
            this._waitingOpen.push(data);
        }
    }

    onmessage(cb) {
        this._ws.onmessage = (data) => {
            cb(JSON.parse(data.data));
        };
    }
}
