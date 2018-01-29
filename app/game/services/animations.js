/*
* Copyright (C) 2015-2018 by Arena of Titans Contributors.
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
import { AssetSource } from '../../services/assets';
import { Options } from '../../services/options';
import { EventAggregatorSubscriptions } from './utils';
import { Popup } from '../widgets/popups/popup';
import { State } from './state';


const PLAYER_TRANSITION_POPUP_DISPLAY_TIME = 2800;


@inject(Options, Popup, EventAggregatorSubscriptions, State)
export class Animations {
    constructor(options, popup, eas, state) {
        this._options = options;
        this._popup = popup;
        this._eas = eas;
        this._state = state;

        this._currentPlayerIndex = null;
        this._tutorialInProgress = false;
    }

    enable() {
        // We disable just to be sure there are no listeners registered.
        // If we don't, we may register them twice.
        this.disable();

        this._enableTrumpAnimation();
        this._enableSpecialActionAnimation();
        this._enableTransitionAnimation();
    }

    _enableSpecialActionAnimation() {
        this._eas.subscribe('aot:api:special_action_play', message => {
            let popupData = {
                translate: {
                    messages: {},
                },
            };

            let initiatorHero = this._state.game.players.heroes[message.player_index];
            popupData.initiatorHeroImg = AssetSource.forHero(initiatorHero);
            popupData.translate.messages.playerName =
                this._state.game.players.names[message.player_index];
            popupData.assassinImg = AssetSource.forAnimation({
                name: 'assassination',
                color: message.new_square.color,
            });

            let targetHero = this._state.game.players.heroes[message.target_index];
            popupData.targetedHeroImg = AssetSource.forHero(targetHero);
            popupData.translate.messages.targetName =
                    this._state.game.players.names[message.target_index];

            let options = {
                timeout: PLAYER_TRANSITION_POPUP_DISPLAY_TIME,
            };

            this._popup.display('assassination-animation', popupData, options).then(() => {
                this._eas.publish(
                    'aot:game:assassin-animation:done',
                    message.special_action_assassination);
            });
        });
    }

    _enableTransitionAnimation() {
        this._eas.subscribe('aot:notifications:start_guided_visit', () => {
            this._tutorialInProgress = true;
        });

        this._eas.subscribe('aot:notifications:end_guided_visit', () => {
            this._tutorialInProgress = false;
        });

        this._eas.subscribeMultiple(['aot:api:create_game', 'aot:api:play'], message => {
            if (!this._canDisplayTransitionPopup(message)) {
                // We update the current player index nonetheless. This way, after viewing or
                // skipping the tutorial and playing a card, the player won't see the transition
                // popup display "it's your turn".
                this._currentPlayerIndex = this._state.game.next_player;
                this._currentNbTurns = this._state.game.nb_turns;
                return;
            }

            if (this._state.game.next_player !== this._currentPlayerIndex ||
                    this._currentNbTurns !== this._state.game.nb_turns) {
                this._currentPlayerIndex = this._state.game.next_player;
                this._currentNbTurns = this._state.game.nb_turns;
                let popupData = {
                    translate: {
                        messages: {},
                    },
                };
                if (this._currentPlayerIndex !== this._state.me.index) {
                    popupData.translate.messages.message = 'game.play.whose_turn_message';
                    popupData.htmlMessage = true;
                } else {
                    popupData.translate.messages.message = 'game.play.your_turn';
                }
                let hero = this._state.game.players.heroes[this._state.game.next_player];
                popupData.img = AssetSource.forChestHero(hero);
                popupData.translate.params = {
                    playerName: this._state.game.players.names[this._currentPlayerIndex],
                };

                let options = {
                    timeout: PLAYER_TRANSITION_POPUP_DISPLAY_TIME,
                };
                this._popup.display('transition', popupData, options);
            }
        });
    }

    _enableTrumpAnimation() {
        this._eas.subscribe('aot:api:play_trump', message => {
            let popupData = {
                translate: {
                    messages: {},
                },
            };

            let initiatorHero = this._state.game.players.heroes[message.player_index];
            popupData.initiatorHeroImg = AssetSource.forHero(initiatorHero);
            popupData.translate.messages.playerName =
                this._state.game.players.names[this._currentPlayerIndex];
            let trump1 = message.last_action.trump;
            popupData.trumpImg = AssetSource.forTrump(trump1);
            popupData.translate.messages.trumpName = message.last_action.trump.title;

            // Power-ups are when a trump is played on the initiator (ie player == target)
            if (message.player_index === message.target_index) {
                popupData.kind = 'powerup';
            } else {
                popupData.kind = 'smash';

                let targetHero = this._state.game.players.heroes[message.target_index];
                popupData.targetedHeroImg = AssetSource.forHero(targetHero);
                popupData.translate.messages.targetName =
                    this._state.game.players.names[message.last_action.target_index];
            }

            let options = {
                timeout: PLAYER_TRANSITION_POPUP_DISPLAY_TIME,
            };

            this._popup.display('trump-animation', popupData, options);
        });
    }

    _canDisplayTransitionPopup(message) {
        // We are displaying the tutorial, don't display the transition popup.
        let tutorialPopupDisplayed = message.rt === 'CREATE_GAME' &&
            this._options.proposeGuidedVisit;
        return !tutorialPopupDisplayed &&
            !this._tutorialInProgress &&
            !this._state.game.game_over;
    }

    disable() {
        this._eas.dispose();
    }
}
