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

import { inject } from 'aurelia-framework';
import { EventAggregator } from 'aurelia-event-aggregator';
import Config from '../../../config/application';
import ReconnectingWebSocket from 'reconnectingwebsocket';


@inject(Config, EventAggregator)
export class Ws {
    _mustReconnect = false;
    _ws;
    // The messages stored in this array are delayed until we reconnect to the API.
    _waitingGameJoined = [];
    // The messages stored in this array are sent as soon as we are connected.
    _waitingOpen = [];

    constructor(config, ea, WebsocketSub) {
        let api = config.api;
        let isHttps = location.protocol === 'https:';
        let wsScheme = isHttps ? 'wss' : 'ws';
        let port = isHttps ? api.tls_port : api.port;
        let path = api.path ? api.path : '';

        // If ReconnectingWebSocket we are in unit tests.
        if (ReconnectingWebSocket) {
            this._ws = new ReconnectingWebSocket(`${wsScheme}://${api.host}:${port}${path}`);
        } else {
            this._ws = new WebsocketSub();
        }
        this._ws.onopen = () => {
            this._sendPending(this._waitingOpen);

            if (this._mustReconnect) {
                this._mustReconnect = false;
                ea.publish('aot:ws:reconnected');
            }
        };
        this._ws.onclose = () => {
            this._mustReconnect = true;
        };
    }

    _sendPending(messages) {
        let numberMessagesToSend = messages.length;
        for (let i = 0; i < numberMessagesToSend; i++) {
            let data = messages.shift();
            this.send(data);
        }
    }

    sendDefered() {
        this._sendPending(this._waitingGameJoined);
    }

    send(data) {
        // If the websocket is not opened yet, we delay the transmission of data.
        if (this._ws.readyState === 1) {
            this._ws.send(JSON.stringify(data));
        } else {
            if (data.rt === 'INIT_GAME') {
                this._waitingOpen.push(data);
            } else {
                this._waitingGameJoined.push(data);
            }
        }
    }

    onmessage(cb) {
        this._ws.onmessage = (data) => {
            cb(JSON.parse(data.data));
        };
    }
}
