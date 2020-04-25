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

import { inject } from "aurelia-framework";
import { Store } from "aurelia-store";
import { AssetSource } from "../../services/assets";
import { EventAggregatorSubscriptions } from "./utils";
import { Popup } from "./popup";
import { Notify } from "./notify";

const PLAYER_TRANSITION_POPUP_DISPLAY_TIME = 2800;

@inject(Popup, EventAggregatorSubscriptions, Store, Notify)
export class Animations {
    constructor(popup, eas, store, notify) {
        this._popup = popup;
        this._eas = eas;
        this._store = store;
        this._notify = notify;
        this.game = {};
        this.myIndex = -1;

        this._playedAnimationForAction = 0;
        this._currentPlayerIndex = null;
    }

    enable() {
        // We disable just to be sure there are no listeners registered.
        // If we don't, we may register them twice.
        this.disable();

        this._subscription = this._store.state.subscribe(state => {
            this.game = state.game;
            this.myIndex = state.me.index;
            if (
                this.game.players &&
                !this.game.isOver &&
                (this.game.currentPlayerIndex !== this._currentPlayerIndex ||
                    this._currentNbTurns !== this.game.nbTurns)
            ) {
                this._currentPlayerIndex = this.game.currentPlayerIndex;
                this._currentNbTurns = this.game.nbTurns;
                this._playTransitionAnimation();
            } else if (
                this.game.actions &&
                this.game.actions[this.game.actions.length - 1].trump &&
                this.game.actions.length > this._playedAnimationForAction
            ) {
                this._playedAnimationForAction = this.game.actions.length;
                this._playTrumpAnimation(this.game.actions[this.game.actions.length - 1]);
            } else if (
                this.game.actions &&
                this.game.actions[this.game.actions.length - 1].specialAction &&
                this.game.actions.length > this._playedAnimationForAction
            ) {
                this._playedAnimationForAction = this.game.actions.length;
                this._playSpecialActionAnimation(this.game.actions[this.game.actions.length - 1]);
            }
        });
    }

    _playSpecialActionAnimation(action) {
        let popupData = {
            translate: {
                messages: {},
            },
        };

        let initiatorHero = this.game.players[action.initiator.index].hero;
        popupData.initiatorHeroImg = AssetSource.forHero(initiatorHero);
        popupData.translate.messages.playerName = this.game.players[this._currentPlayerIndex].name;
        popupData.assassinImg = AssetSource.forAnimation({
            name: action.specialAction.trumpArgs.name,
            color: action.specialAction.trumpArgs.color,
        });

        let targetHero = this.game.players[action.target.index].hero;
        popupData.targetedHeroImg = AssetSource.forHero(targetHero);
        popupData.translate.messages.targetName = this.game.players[action.target.index].name;

        let options = {
            timeout: PLAYER_TRANSITION_POPUP_DISPLAY_TIME,
        };

        this._popup.display("assassination-animation", popupData, options);
    }

    _playTransitionAnimation() {
        let popupData = {
            translate: {
                messages: {},
            },
        };
        if (this._currentPlayerIndex !== this.myIndex) {
            popupData.translate.messages.message = "game.play.whose_turn_message";
            popupData.htmlMessage = true;
        } else {
            popupData.translate.messages.message = "game.play.your_turn";
            this._notify.notifyYourTurn();
        }
        let hero = this.game.players[this.game.currentPlayerIndex].hero;
        popupData.img = AssetSource.forChestHero(hero);
        popupData.translate.params = {
            playerName: this.game.players[this._currentPlayerIndex].name,
        };

        let options = {
            timeout: PLAYER_TRANSITION_POPUP_DISPLAY_TIME,
        };
        this._popup.display("transition", popupData, options);
    }

    _playTrumpAnimation(action) {
        let popupData = {
            translate: {
                messages: {},
            },
        };

        let initiatorHero = this.game.players[action.initiator.index].hero;
        popupData.initiatorHeroImg = AssetSource.forHero(initiatorHero);
        popupData.translate.messages.playerName = this.game.players[this._currentPlayerIndex].name;
        let trump1 = action.trump;
        if (trump1.passive !== undefined) {
            popupData.trumpImg = AssetSource.forPower(trump1.trumpArgs);
        } else {
            popupData.trumpImg = AssetSource.forTrump(trump1);
        }
        popupData.translate.messages.trumpName = action.trump.name;

        // Power-ups are when a trump is played on the initiator (ie player == target)
        if (action.description === "played_trump_no_effect") {
            popupData.kind = "failed";
        } else if (action.initiator.index === action.target.index) {
            popupData.kind = "powerup";
        } else {
            popupData.kind = "smash";

            let targetHero = this.game.players[action.target.index].hero;
            popupData.targetedHeroImg = AssetSource.forHero(targetHero);
            popupData.translate.messages.targetName = this.game.players[action.target.index].name;
        }

        let options = {
            timeout: PLAYER_TRANSITION_POPUP_DISPLAY_TIME,
        };

        this._popup.display("trump-animation", popupData, options);
    }

    disable() {
        this._eas.dispose();

        if (this._subscription) {
            this._subscription.unsubscribe();
        }
    }
}
