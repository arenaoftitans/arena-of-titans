/*
 * Copyright (C) 2017 by Arena of Titans Contributors.
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

import * as LogManager from "aurelia-logging";
import { bindable, inject } from "aurelia-framework";
import { I18N } from "aurelia-i18n";
import { DOM } from "aurelia-pal";
import { Popup } from "../../../services/popup";
import { Api } from "../../../services/api";
import { State } from "../../../services/state";
import { randomInt, EventAggregatorSubscriptions } from "../../../services/utils";
import { browsers } from "../../../../services/browser-sniffer";

const PLAYABLE_TRUMP_KINDS = ["player", "power"];

@inject(Api, Popup, I18N, DOM.Element, EventAggregatorSubscriptions, State)
export class AotTrumpCustomElement {
    _api;
    _logger;
    infos = {};
    @bindable trump = {};
    /**
     * Use the index of the trump so the image is correct `url(#trump-${index})`. If we don't on
     * some browsers (eg FireFox), all the trumps have the same image because the pattern id is
     * duplicated.
     */
    @bindable canBePlayed;
    /**
     * Used to know the proper class on the SVG ('player' or 'affecting')
     */
    @bindable kind;

    constructor(api, popup, i18n, element, eas, state) {
        this._api = api;
        this._popup = popup;
        this._i18n = i18n;
        this._element = element;
        this._eas = eas;
        this._state = state;
        this.disabled = false;

        this._logger = LogManager.getLogger("AotTrumps");
    }

    attached() {
        // Rewrite gradient ids to make them specific to this component.
        let gradientIdTemplate = "trump-gradient-{i}";
        let i = 1;
        let svg = this._element.getElementsByTagName("svg")[0];
        let gradientId = gradientIdTemplate.replace("{i}", i);
        let gradient = svg.getElementById(gradientId);

        while (gradient !== null) {
            let newId = `${gradientId}-${this.kind}-${this.index}`;
            gradient.id = newId;
            for (let svgElement of this._getSvgElementsWithGradient(svg, gradientId)) {
                svgElement.style.fill = `url(#${newId})`;
            }

            i++;
            gradientId = gradientIdTemplate.replace("{i}", i);
            gradient = svg.getElementById(gradientId);
        }
    }

    _getSvgElementsWithGradient(svg, gradientId) {
        let elementsWithgradients = svg.querySelectorAll(`[style*="${gradientId}"]`);
        if (browsers.msie || browsers.mac) {
            elementsWithgradients = browsers.htmlCollection2Array(elementsWithgradients);
        }

        return elementsWithgradients;
    }

    bind() {
        // Disable the trump is it doesn't exist. This is useful since we don't have all the
        // powers implemented yet, therefore this.trump can be null.
        // Since trump cannot change once the game is started, checking nullity eher is enought.
        if (this.trump === null) {
            this.disabled = true;
        }

        switch (this.kind) {
            case "player":
                this.svgClass = "player-trump";
                this.infosType = "trumps";
                break;
            case "affecting":
                this.svgClass = "trump-affecting-player";
                this.infosType = "affecting-trumps";
                break;
            case "power":
                this.svgClass = "power-trump";
                this.infosType = "power";
                break;
            default:
                this.svgClass = undefined;
                break;
        }

        this._eas.subscribe("aot:api:special_action_notify", () => {
            this.disabled = true;
        });
        // If the special action is passed or the player passes his/her turn, special_action_play
        // is never fired. But in all cases a play request is made to update the position of the
        // players on the board.
        this._eas.subscribe("aot:api:play", () => {
            this.disabled = false;
        });
    }

    unbind() {
        this._eas.dispose();
    }

    displayInfos(event) {
        // Don't display infos for an unexisting trump (eg a power that is not implemented).
        if (this.trump === null) {
            return;
        }

        this.infos = {
            title: this.getTranslatedTrumpTitle(),
            description: this.getTranslatedTrumpDescription(),
            visible: true,
            event: event,
        };
        this._eas.publish("aot:trump:mouseover", this.trump);
    }

    normalizeTrumpName() {
        let trumpName = this.trump.name.toLowerCase().replace(/ /g, "_");
        if (this.trump.color === null) {
            return trumpName;
        }

        let trumpColor = this.trump.color.toLowerCase();
        return `${trumpName}_${trumpColor}`;
    }

    getTranslatedTrumpDescription() {
        let ns = this._getTranslationNamespace();
        return this._i18n.tr(`${ns}.${this.normalizeTrumpName()}_description`);
    }

    _getTranslationNamespace() {
        switch (this.infosType) {
            case "power":
                return "powers";
            default:
                return "trumps";
        }
    }

    getTranslatedTrumpTitle() {
        let ns = this._getTranslationNamespace();
        return this._i18n.tr(`${ns}.${this.normalizeTrumpName()}`);
    }

    hideInfos() {
        this.infos = {
            visible: false,
        };
        this._eas.publish("aot:trump:mouseout");
    }

    play() {
        if (
            !this.yourTurn ||
            !this.canBePlayed ||
            this.disabled ||
            !PLAYABLE_TRUMP_KINDS.includes(this.kind) ||
            (this.kind === "power" && this.trump.passive)
        ) {
            return;
        } else if (this.trump.must_target_player) {
            let otherPlayerNames = this._getOtherPlayerNames();
            let selectedIndex = randomInt(0, otherPlayerNames.length - 1);
            let popupData = {
                selectedChoice: otherPlayerNames[selectedIndex],
                choices: otherPlayerNames,
                translate: {
                    messages: {
                        title: `trumps.${this.normalizeTrumpName()}`,
                        description: `trumps.${this.normalizeTrumpName()}_description`,
                        message: "game.play.select_trump_target",
                    },
                    paramsToTranslate: {
                        trumpname: `trumps.${this.normalizeTrumpName()}`,
                    },
                },
            };
            this._popup.display("confirm", popupData).then(
                choice => {
                    this._eas.publish("aot:trump:wish_to_play", {
                        trumpName: this.trump.name,
                        trumpColor: this.trump.color,
                        targetIndex: choice.index,
                    });
                },
                () => this._logger.debug("Player canceled trump"),
            );
        } else {
            this._eas.publish("aot:trump:wish_to_play", {
                trumpName: this.trump.name,
                trumpColor: this.trump.color,
            });
        }
    }

    _getOtherPlayerNames() {
        let otherPlayerNames = [];
        for (let playerIndex of this.playerIndexes) {
            // We need to check that playerIndex is neither null nor undefined.
            // Just relying on "falsyness" isn't enough since 0 is valid but false.
            // prettier-ignore
            if (playerIndex != null && playerIndex !== this.myIndex) { // eslint-disable-line
                let player = {
                    index: playerIndex,
                    name: this.playerNames[playerIndex],
                };
                otherPlayerNames.push(player);
            }
        }

        return otherPlayerNames;
    }

    get yourTurn() {
        return this._state.game.your_turn;
    }

    get playerNames() {
        return this._state.game.players.names;
    }

    get playerIndexes() {
        return this._state.game.players.indexes;
    }

    get myIndex() {
        return this._state.me.index;
    }
}
