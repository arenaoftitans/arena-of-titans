/*
 * Copyright (C) 2015-2020 by Last Run Contributors.
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

import { inject, BindingEngine, PLATFORM } from "aurelia-framework";
import { EventAggregator } from "aurelia-event-aggregator";

// Make sure all popups are included in the webpack bundles. For details, see:
// https://discourse.aurelia.io/t/dynamically-loading-compose-viewmodels-using-webpack/173
PLATFORM.moduleName("./assassination-animation", "game");
PLATFORM.moduleName("./back-home", "game");
PLATFORM.moduleName("./confirm", "game");
PLATFORM.moduleName("./error", "game");
PLATFORM.moduleName("./game-over", "game");
PLATFORM.moduleName("./infos", "game");
PLATFORM.moduleName("./options", "game");
PLATFORM.moduleName("./player-box", "game");
PLATFORM.moduleName("./transition", "game");
PLATFORM.moduleName("./trump-animation", "game");
PLATFORM.moduleName("./yes-no", "game");

@inject(BindingEngine, EventAggregator)
export class AotPopupCustomElement {
    data = null;
    type = null;
    deferred = null;
    popupModel = {};

    background = "";

    constructor(bindingEngine, ea) {
        this._bindingEngine = bindingEngine;
        this._ea = ea;
        // This will contain the reference to the container element.
        this.container = null;
        this._focusSubscription = null;

        this._eaSubscription = this._ea.subscribe("aot:popup:display", message => {
            this.type = message.type;
            this.viewModel = `./${this.type}`;
            this.popupModel.data = message.data;
            this.popupModel.deferred = message.deferred;

            this._open();

            message.deferred.promise.then(
                () => {
                    this._close();
                },
                () => {
                    this._close();
                },
            );
        });
    }

    attached() {
        this._ea.publish("aot:popup:ready");
    }

    _open() {
        switch (this.type) {
            case "assassination-animation":
                this.background = "popup-assassination-animation";
                break;
            case "game-over":
                this.background = "game-over";
                break;
            case "player-box":
                this.background = "popup-player-box";
                break;
            case "transition":
                this.background = "popup-transition";
                break;
            case "trump-animation":
                this.background = "popup-trump-animation";
                break;
            default:
                this.background = "default";
                break;
        }

        this._focusOnPopup();
    }

    _focusOnPopup() {
        // Since the container is only displayed if type is not null, this.container may be null
        // the first time we enter this function
        // (the time the variable is correctly bound to the element).
        // So we wait for it to change so we can correctly focus on the popup.
        if (this.container === null) {
            this._focusSubscription = this._bindingEngine
                .propertyObserver(this, "container")
                .subscribe(() => {
                    this._focusOnPopup();
                });
            return;
        }

        this.container.focus();
        if (this._focusSubscription) {
            this._focusSubscription.dispose();
            this._focusSubscription = null;
        }
    }

    _close() {
        this.type = null;
        this.popupModel = {};
    }

    bind() {
        this._keyupEventListener = event => {
            // code doesn't exist on IE, we need to use key.
            let keyCode = event.code || event.key;
            keyCode = keyCode.toLowerCase();

            // The player must validate the game over popup
            // keyupEventListener can be called before popupModel.deferred is defined.
            if (
                (keyCode === "escape" || keyCode === "esc") &&
                this.type !== "game-over" &&
                this.popupModel.deferred
            ) {
                this.popupModel.deferred.reject();
            }
        };
        window.addEventListener("keyup", this._keyupEventListener);
    }

    unbind() {
        window.removeEventListener("keyup", this._keyupEventListener);
        this._eaSubscription.dispose();
    }
}
