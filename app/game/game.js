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

import { inject, NewInstance } from 'aurelia-framework';
import { I18N } from 'aurelia-i18n';
import { History } from './services/history';
import { Api } from './services/api';
import { EventAggregatorSubscriptions } from './services/utils';


@inject(History, I18N, Api, NewInstance.of(EventAggregatorSubscriptions))
export class Game {
    static MAX_NUMBER_PLAYERS = 8;
    static heroes = [
        'daemon',
        'orc',
        'reaper',
        'thief',
    ];

    data = null;
    type = null;
    popupDefered = {
        promise: null,
        resolve: null,
        reject: null,
    };

    constructor(history, i18n, api, eas) {
        this._i18n = i18n;
        this._api = api;
        this._eas = eas;

        this._currentPlayerIndex = null;

        this._popupMessageId;
        this._popupMessage = {};
        this._eas.subscribe('i18n:locale:changed', () => this._translatePopupMessage());
        // Init history here: if the page is reloaded on the game page, the history may not be
        // setup until the player click on the player box. This may result in some actions not
        // being displayed. For instance, create a game, refresh, play a card. Without the line
        // below, it will not appear in the player box.
        history.init();
    }

    _translatePopupMessage(options = {}) {
        if (this._popupMessageId) {
            this._popupMessage.message = this._i18n.tr(this._popupMessageId, options);
        }
    }

    configureRouter(config, router) {
        router.baseUrl = 'game';
        config.options.pushState = true;
        config.map([
            {
                route: ['', 'play', ':version', ':version/play'],
                redirect: 'create',
            },
            {
                route: ['create', ':version/create', ':version/create/:id'],
                name: 'create',
                moduleId: './create/create',
                nav: false,
                title: 'Create game',
            },
            {
                route: ':version/play/:id',
                name: 'play',
                moduleId: './play/play',
                nav: false,
                title: 'Play',
            },
        ]);
        config.mapUnknownRoutes(instruction => {
            instruction.moduleId = 'not-found';

            return instruction;
        });
    }

    activate() {
        this._eas.subscribe('aot:api:error', data => {
            this._popupMessageId = data.message;
            this._translatePopupMessage();
            this.popup('error', this._popupMessage).then(() => {
                if (/\/game\/create\/.+/.test(location.pathname)) {
                    location.reload();
                }
            });
        });
        this._eas.subscribe('aot:api:play', () => {
            if (this._api.game.next_player !== this._currentPlayerIndex) {
                this._currentPlayerIndex = this._api.game.next_player;
                if (this._currentPlayerIndex !== this._api.me.index) {
                    this._popupMessageId = 'game.play.whose_turn_message';
                    this._popupMessage.htmlMessage = true;
                } else {
                    this._popupMessageId = 'game.play.your_turn';
                }
                this._translatePopupMessage({
                    playerName: this._api.game.players.names[this._currentPlayerIndex],
                });

                this.popup('infos', this._popupMessage, {timeout: 5000}).then(() => {
                    this._popupMessageId = undefined;
                    this._popupMessage = {};
                });
            }
        });
    }

    deactivate() {
        this._eas.dispose();
    }

    popup(type, data, {timeout = 0} = {}) {
        this.data = data;
        this.type = type;
        this.popupDefered.promise = new Promise((resolve, reject) => {
            this.popupDefered.resolve = resolve;
            this.popupDefered.reject = reject;
        });

        this.popupDefered.promise.then(() => {
            this.data = null;
            this.type = null;
        }, () => {
            this.data = null;
            this.type = null;
        });

        if (timeout) {
            let closeTimeout = setTimeout(() => {
                this.popupDefered.resolve();
            }, timeout);
            let cancelCloseTimout = () => {
                clearTimeout(closeTimeout);
            };
            this.popupDefered.promise.then(cancelCloseTimout, cancelCloseTimout);
        }

        let startCounter = () => {
            this._eas.publish('aot:game:counter_start');
        };
        this.popupDefered.promise.then(startCounter, startCounter);

        return this.popupDefered.promise;
    }

    navigateWithRefresh(location) {
        window.location.replace(location);
    }
}
