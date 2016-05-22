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
