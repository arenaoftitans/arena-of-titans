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

import { inject } from "aurelia-framework";
import { EventAggregator } from "aurelia-event-aggregator";
import environment from "../../environment";
import { Popover } from "./popover";
import ReconnectingWebSocket from "reconnectingwebsocket";

@inject(environment, EventAggregator, Popover)
export class Ws {
    _mustReconnect = false;
    _ws;
    // The messages stored in this array are delayed until we reconnect to the API.
    _waitingGameJoined = [];
    // The messages stored in this array are sent as soon as we are connected.
    _waitingOpen = [];

    constructor(env, ea, popover, WebsocketSub) {
        this.popover = popover;

        let api = env.api;
        let isHttps = location.protocol === "https:";
        let wsScheme = isHttps ? "wss" : "ws";
        let port = isHttps ? api.tls_port : api.port;
        let path = api.path ? api.path : "";
        let wsUri = `${wsScheme}://${api.host}:${port}${path}${api.version}`;

        // If ReconnectingWebSocket is not defined we are in unit tests.
        if (ReconnectingWebSocket) {
            this._ws = new ReconnectingWebSocket(wsUri);
        } else {
            this._ws = new WebsocketSub();
        }
        this._ws.onopen = () => {
            this._sendPending(this._waitingOpen);

            if (this._mustReconnect) {
                this._mustReconnect = false;
                this._closePopover();
                ea.publish("aot:ws:reconnected");
            }
        };
        this._ws.onclose = () => {
            this._mustReconnect = true;
            this._closePopover = this.popover.display("danger", "game.connection_lost");
        };
    }

    _sendPending(messages) {
        while (messages.length > 0) {
            let data = messages.shift();
            this.send(data);
        }
    }

    sendDeferred() {
        this._sendPending(this._waitingGameJoined);
    }

    send(data) {
        // If the websocket is not opened yet, we delay the transmission of data.
        if (this._ws.readyState === 1) {
            this._ws.send(JSON.stringify(data));
        } else {
            if (data.rt === "INIT_GAME") {
                this._waitingOpen.push(data);
            } else {
                this._waitingGameJoined.push(data);
            }
        }
    }

    onmessage(cb) {
        this._ws.onmessage = data => {
            cb(JSON.parse(data.data));
        };
    }
}
