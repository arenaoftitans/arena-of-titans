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

import { bindable, inject } from "aurelia-framework";
import { I18N } from "aurelia-i18n";
import { Store } from "aurelia-store";
import { Api } from "../../../services/api";
import { AssetSource, ImageName } from "../../../../services/assets";
import { EventAggregatorSubscriptions } from "../../../services/utils";
import { Options } from "../../../../services/options";
import { Popup } from "../../../services/popup";

@inject(Api, I18N, Options, Popup, EventAggregatorSubscriptions, Store)
export class AotNotificationsCustomElement {
    @bindable players = {};
    @bindable currentPlayerName = "";
    specialActionInProgress = false;
    specialActionText;
    _specialActionName;
    _api;
    _lastAction = {};
    _i18n;
    _ea;
    _lastActionFromGame;

    constructor(api, i18n, options, popup, eas, store) {
        this._api = api;
        this._i18n = i18n;
        this._options = options;
        this._popup = popup;
        this._eas = eas;
        this._store = store;

        this._eas.subscribe("i18n:locale:changed", () => {
            if (this._lastAction) {
                this._updateLastAction();
            }

            if (this._specialActionName) {
                this._translateSpecialActionText();
            }
        });
    }

    bind() {
        this._subscription = this._store.state.subscribe(state => {
            if (!state.game.actions) {
                return;
            }

            this._lastActionFromGame = state.game.actions[state.game.actions.length - 1];
            this._updateLastAction();

            if (state.me.specialAction) {
                this._notifySpecialAction(state.me.specialAction);
            } else if (!state.me.specialAction && this.specialActionInProgress) {
                this._handleSpecialActionPlayed();
            }
        });
    }

    unbind() {
        this._eas.dispose();
        this._subscription.unsubscribe();
    }

    _updateLastAction() {
        let lastAction = this._lastActionFromGame;
        let description;
        if (lastAction.description) {
            description = this._i18n.tr(`actions.${lastAction.description}`, {
                playerName: (lastAction.initiator || {}).name,
                targetName: (lastAction.target || {}).name,
            });
        }
        this._lastAction = {
            description: description,
        };

        if (lastAction.card) {
            this._lastAction.card = lastAction.card;
            let cardName = lastAction.card.name;
            let cardColor = lastAction.card.color.toLowerCase();
            this._lastAction.card.title = this._i18n.tr(
                `cards.${cardName.toLowerCase()}_${cardColor}`,
            );
            this._lastAction.card.description = this._i18n.tr(`cards.${cardName.toLowerCase()}`);
            this._lastAction.card.complementaryDescription = this._i18n.tr(
                `cards.${cardName.toLowerCase()}_complementary_description`,
            );

            this._lastAction.img = AssetSource.forCard(lastAction.card);
        }

        if (lastAction.trump) {
            let trump = lastAction.trump;
            this._lastAction.trump = trump;
            this._lastAction.img = AssetSource.forTrump(trump);
            let trumpName = ImageName.forTrump(trump).replace("-", "_");
            this._lastAction.trump.title = this._i18n.tr(`trumps.${trumpName}`);
            this._lastAction.trump.description = this._i18n.tr(`trumps.${trumpName}_description`);
        }

        if (lastAction.specialAction) {
            let action = lastAction.specialAction;
            this._lastAction.specialAction = action;
            let actionName = action.trumpArgs.name.toLowerCase();
            this._lastAction.specialAction.title = this._i18n.tr(`trumps.${actionName}`);
            this._lastAction.specialAction.description = this._i18n.tr(
                `trumps.${actionName}_description`,
            );
        }
    }

    _handleSpecialActionPlayed() {
        this.specialActionInProgress = false;
        this._specialActionName = undefined;
    }

    _notifySpecialAction(specialActionName) {
        this.specialActionInProgress = true;
        this._specialActionName = specialActionName.toLowerCase();
        this._translateSpecialActionText();
        if (this._options.mustViewInGameHelp(this._specialActionName)) {
            let popupData = {
                translate: {
                    messages: {
                        title: "actions.special_action_info_popup",
                        message: this.specialActionText,
                    },
                    paramsToTranslate: {
                        action: `trumps.${this._specialActionName}`,
                    },
                },
            };
            this._popup.display("infos", popupData).then(() => {
                this._eas.publish("aot:notifications:special_action_in_game_help_seen");
                this._options.markInGameOptionSeen(this._specialActionName);
            });
        } else {
            this._eas.publish("aot:notifications:special_action_in_game_help_seen");
        }
    }

    _translateSpecialActionText() {
        this.specialActionText = this._i18n.tr(`actions.special_action_${this._specialActionName}`);
    }

    get lastAction() {
        return this._lastAction;
    }
}
