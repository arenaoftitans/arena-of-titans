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
import { I18N } from 'aurelia-i18n';
import { History } from './services/history';
import { Api } from './services/api';
import { Options } from '../services/options';
import { EventAggregatorSubscriptions, ImageSource } from './services/utils';
import { Popup } from './widgets/popups/popup';


const PLAYER_TRANSITION_POPUP_DISPLAY_TIME = 2800;


@inject(History, I18N, Api, Options, Popup, EventAggregatorSubscriptions)
export class Game {
    static MAX_NUMBER_PLAYERS = 8;
    static heroes = [
        'daemon',
        'elf',
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

    constructor(history, i18n, api, options, popup, eas) {
        this._i18n = i18n;
        this._api = api;
        this._options = options;
        this._popup = popup;
        this._eas = eas;

        this._logger = LogManager.getLogger('AotGame');
        this._currentPlayerIndex = null;
        this._tutorialInProgress = false;

        this._popupMessageId;
        this._popupMessage = {};
        this._eas.subscribe('i18n:locale:changed', () => this._translatePopupMessage());
        // Init history here: if the page is reloaded on the game page, the history may not be
        // setup until the player click on the player box. This may result in some actions not
        // being displayed. For instance, create a game, refresh, play a card. Without the line
        // below, it will not appear in the player box.
        history.init();
    }

    _translatePopupMessage() {
        if (this._popupMessageId) {
            this._popupMessage.message = this._i18n.tr(
                this._popupMessageId,
                this._popupMessageOptions
            );
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
            this._popup.display('error', this._popupMessage).then(() => {
                if (/\/game\/create\/.+/.test(location.pathname)) {
                    location.reload();
                }
            });
        });

        this._eas.subscribe('aot:notifications:start_guided_visit', () => {
            this._tutorialInProgress = true;
        });

        this._eas.subscribe('aot:notifications:end_guided_visit', () => {
            this._tutorialInProgress = false;
        });

        this._eas.subscribeMultiple(['aot:api:create_game', 'aot:api:play'], message => {
            if (!this.canDisplayTransitionPopup(message)) {
                // We update the current player index nonetheless. This way, after viewing or
                // skiping the tutorial and playing a card, the player won't see the transition
                // popup display "it's your turn".
                this._currentPlayerIndex = this._api.game.next_player;
                return;
            }

            if (this._api.game.next_player !== this._currentPlayerIndex) {
                this._currentPlayerIndex = this._api.game.next_player;
                if (this._currentPlayerIndex !== this._api.me.index) {
                    this._popupMessageId = 'game.play.whose_turn_message';
                    this._popupMessage.htmlMessage = true;
                } else {
                    this._popupMessageId = 'game.play.your_turn';
                }
                let hero = this._api.game.players.heroes[this._api.game.next_player];
                this._popupMessage.img = ImageSource.forChestHero(hero);
                this._popupMessageOptions = {
                    playerName: this._api.game.players.names[this._currentPlayerIndex],
                };
                this._translatePopupMessage();

                let options = {
                    timeout: PLAYER_TRANSITION_POPUP_DISPLAY_TIME,
                };
                this._popup.display('transition', this._popupMessage, options).then(() => {
                    this._popupMessageId = undefined;
                    this._popupMessage = {};
                    this._popupMessageOptions = {};
                });
            }
        });
    }

    canDisplayTransitionPopup(message) {
        // We are displaying the tutorial, don't display the transition popup.
        let tutorialPopupDisplayed = message.rt === 'CREATE_GAME' &&
            this._options.proposeGuidedVisit;
        return !tutorialPopupDisplayed &&
            !this._tutorialInProgress &&
            !this._api.game.game_over;
    }

    deactivate() {
        this._eas.dispose();
    }

    navigateWithRefresh(location) {
        window.location.replace(location);
    }
}
