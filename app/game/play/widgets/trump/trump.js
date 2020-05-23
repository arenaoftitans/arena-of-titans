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
import { Store } from "aurelia-store";
import { Popup } from "../../../services/popup";
import { Api } from "../../../services/api";
import { randomInt, EventAggregatorSubscriptions } from "../../../services/utils";
import { browsers } from "../../../../services/browser-sniffer";
import { translationsKey } from "../../../../translations";
import { TrackActions } from "../../../services/TrackActions";

const PLAYABLE_TRUMP_KINDS = ["player", "power"];

@inject(Api, Popup, I18N, DOM.Element, EventAggregatorSubscriptions, Store, TrackActions)
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

    constructor(api, popup, i18n, element, eas, store, trackActions) {
        this._api = api;
        this._popup = popup;
        this._i18n = i18n;
        this._element = element;
        this._eas = eas;
        this._store = store;
        this._trackActions = trackActions;
        this.disabled = false;

        this.playerNames = [];
        this.playerIndexes = [];
        this.me = null;

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
        // Since trump cannot change once the game is started, checking nullity here is enough.
        if (this.trump === null) {
            this.disabled = true;
        }
        this._subscription = this._store.state.subscribe(state => {
            this.me = state.me;
            this.playerIndexes = Object.values(state.game.players).map(player => player.index);
            this.playerNames = Object.values(state.game.players).map(player => player.name);
        });

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
    }

    unbind() {
        this._eas.dispose();
        this._subscription.unsubscribe();
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
        this._store.dispatch("displayTrumpInfos", { infos: this.infos, type: this.infosType });
        this._eas.publish("aot:trump:mouseover", this.trump);
    }

    normalizeTrumpName() {
        let trumpName = this.trump.name.toLowerCase().replace(/ /g, "_");
        if (!this.trump.color) {
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
        this._store.dispatch("displayTrumpInfos", { infos: this.infos, type: this.infosType });
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
        } else if (this.trump.mustTargetPlayer) {
            this._playTrumpThatTargetsPlayer();
        } else if (this.trump.requireSquareTarget) {
            this._playTrumpThatTargetsSquare();
        } else {
            this._playTrumpOnSelf();
        }
    }

    _playTrumpThatTargetsPlayer() {
        let otherPlayerNames = this._getOtherPlayerNames();
        if (otherPlayerNames.length === 0) {
            const popupData = {
                translate: {
                    messages: {
                        message: translationsKey("game.play.no_possible_target_for_trump"),
                    },
                },
            };
            this._popup.display("infos", popupData);
            return;
        }

        let selectedIndex = randomInt(0, otherPlayerNames.length - 1);
        let popupData = {
            selectedChoice: otherPlayerNames[selectedIndex].index,
            choices: otherPlayerNames,
            translate: {
                messages: {
                    title: `trumps.${this.normalizeTrumpName()}`,
                    description: `trumps.${this.normalizeTrumpName()}_description`,
                    message: translationsKey("game.play.select_trump_target"),
                },
                paramsToTranslate: {
                    trumpname: `trumps.${this.normalizeTrumpName()}`,
                },
            },
        };
        this._popup.display("confirm", popupData).then(
            choice => {
                this._trackActions.trackTrumpPlayed();
                this._store.dispatch("playTrump", this.trump, choice);
            },
            () => this._logger.debug("Player canceled trump"),
        );
    }

    _playTrumpThatTargetsSquare() {
        this._popup.display("infos", {
            translate: {
                messages: {
                    title: translationsKey("game.play.board_select_square"),
                },
            },
        });

        this._store.dispatch("selectSquareForTrump", this.trump);
    }

    _playTrumpOnSelf() {
        this._trackActions.trackTrumpPlayed();
        this._store.dispatch("playTrump", this.trump, this.myIndex);
    }

    _getOtherPlayerNames() {
        if (this.me === null) {
            return [];
        }

        const otherPlayerNames = [];
        for (let i = 0; i < this.playerIndexes.length; i++) {
            const index = this.playerIndexes[i];
            const name = this.playerNames[i];

            if (
                index !== null &&
                index !== undefined &&
                index !== this.myIndex &&
                this.me.trumpTargetIndexes.includes(index)
            ) {
                otherPlayerNames.push({
                    index,
                    name,
                });
            }
        }

        return otherPlayerNames;
    }

    get yourTurn() {
        if (this.me === null) {
            return false;
        }

        return this.me.yourTurn;
    }

    get myIndex() {
        if (this.me === null) {
            return -1;
        }

        return this.me.index;
    }
}
