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
import { History } from './services/history';
import { Api } from './services/api';
import { AssetSource } from '../services/assets';
import { Options } from '../services/options';
import { EventAggregatorSubscriptions } from './services/utils';
import { Popup } from './widgets/popups/popup';


const PLAYER_TRANSITION_POPUP_DISPLAY_TIME = 2800;


@inject(History, Api, Options, Popup, EventAggregatorSubscriptions)
export class Game {
    static MAX_NUMBER_PLAYERS = 8;
    static heroes = [
        'arline',
        'garez',
        'kharliass',
        'luni',
        'mirindrel',
        'razbrak',
        'ulya',
    ];

    data = null;
    type = null;
    popupDefered = {
        promise: null,
        resolve: null,
        reject: null,
    };

    constructor(history, api, options, popup, eas) {
        this._api = api;
        this._options = options;
        this._popup = popup;
        this._eas = eas;

        this._logger = LogManager.getLogger('AotGame');
        this._currentPlayerIndex = null;
        this._tutorialInProgress = false;

        // Init history here: if the page is reloaded on the game page, the history may not be
        // setup until the player click on the player box. This may result in some actions not
        // being displayed. For instance, create a game, refresh, play a card. Without the line
        // below, it will not appear in the player box.
        history.init();

        AssetSource.preloadImages('game');
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
            let popupData = {
                isFatal: data.isFatal,
                translate: {
                    messages: {
                        message: data.message,
                    },
                },
            };
            this._popup.display('error', popupData).then(() => {
                if (/\/game\/.+\/create\/.+/.test(location.pathname)) {
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

        // Trump animation
        this._eas.subscribe('aot:api:play_trump', message => {
            let popupData = {
                translate: {
                    messages: {},
                },
            };

            let initiatorHero = this._api.game.players.heroes[this._api.game.next_player];
            popupData.initiatorHeroImg = AssetSource.forHero(initiatorHero);
            popupData.translate.messages.playerName =
                this._api.game.players.names[this._currentPlayerIndex];
            let trump1 = message.last_action.trump;
            popupData.trumpImg = AssetSource.forTrump(trump1);
            popupData.translate.messages.trumpName = message.last_action.trump.title;

            if (message.last_action.target_index === this._api.me.index ) {
                popupData.kind = 'powerup';
            } else {
                popupData.kind = 'smash';

                let targetHero = this._api.game.players.heroes[message.last_action.target_index];
                popupData.targetedHeroImg = AssetSource.forHero(targetHero);
                popupData.translate.messages.targetName =
                    this._api.game.players.names[message.last_action.target_index];
            }

            let options = {
                timeout: PLAYER_TRANSITION_POPUP_DISPLAY_TIME,
            };

            this._popup.display('trump-animation', popupData, options);
        });

        this._eas.subscribeMultiple(['aot:api:create_game', 'aot:api:play'], message => {
            if (!this.canDisplayTransitionPopup(message)) {
                // We update the current player index nonetheless. This way, after viewing or
                // skiping the tutorial and playing a card, the player won't see the transition
                // popup display "it's your turn".
                this._currentPlayerIndex = this._api.game.next_player;
                this._currentNbTurns = this._api.game.nb_turns;
                return;
            }

            if (this._api.game.next_player !== this._currentPlayerIndex ||
                    this._currentNbTurns !== this._api.game.nb_turns) {
                this._currentPlayerIndex = this._api.game.next_player;
                this._currentNbTurns = this._api.game.nb_turns;
                let popupData = {
                    translate: {
                        messages: {},
                    },
                };
                if (this._currentPlayerIndex !== this._api.me.index) {
                    popupData.translate.messages.message = 'game.play.whose_turn_message';
                    popupData.htmlMessage = true;
                } else {
                    popupData.translate.messages.message = 'game.play.your_turn';
                }
                let hero = this._api.game.players.heroes[this._api.game.next_player];
                popupData.img = AssetSource.forChestHero(hero);
                popupData.translate.params = {
                    playerName: this._api.game.players.names[this._currentPlayerIndex],
                };

                let options = {
                    timeout: PLAYER_TRANSITION_POPUP_DISPLAY_TIME,
                };
                this._popup.display('transition', popupData, options);
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
}
