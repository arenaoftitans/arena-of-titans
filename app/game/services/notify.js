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

import * as LogManager from "aurelia-logging";
import { inject } from "aurelia-framework";
import { I18N } from "aurelia-i18n";
import { Sounds } from "./sounds";
import { EventAggregatorSubscriptions } from "./utils";

import favicon from "../../../assets/favicon.png";
import faviconNotify from "../../../assets/favicon-notify.png";

@inject(I18N, EventAggregatorSubscriptions, Sounds)
export class Notify {
    constructor(i18n, eas, sounds) {
        this._logger = LogManager.getLogger("NotifyService");
        this._i18n = i18n;
        this._eas = eas;
        this._eas.subscribe("router:navigation:complete", () => {
            // While navigation is not complete, document.title may be the default value in
            // index.html
            this._originalTitle = document.title;
        });
        this._sounds = sounds;
        this._head = document.head || (document.head = document.getElementsByTagName("head")[0]);
        this._originalFaviconHref = favicon;
        this._notifyFavicon = faviconNotify;
        this._body = document.body || document.getElementByTagName("body")[0];

        document.addEventListener("visibilitychange", () => this._handleVisibilityChange());
        this._askConsentForNotifications().catch(() => this._logger.debug("Promise was rejected."));
    }

    _askConsentForNotifications() {
        if (!("Notification" in window)) {
            return Promise.reject();
        }

        return Notification.requestPermission(result => {
            this._logger.info(`Notification choice ${result}`);
            return result === "granted";
        }).then(isNotificationRequestGranted =>
            isNotificationRequestGranted ? Promise.resolve() : Promise.reject(),
        );
    }

    _handleVisibilityChange() {
        if (!document.hidden) {
            this.clearNotifications();
        }
    }

    notifyYourTurn() {
        this._playYourTurnSound();
        if (document.hidden) {
            this._swapFavicon();
            this._swapTitle();
            this._pushNotification();
        }
    }

    _pushNotification() {
        this._askConsentForNotifications().then(
            () => new Notification(this._i18n.tr("game.play.your_turn")),
        );
    }

    _swapFavicon() {
        let oldLink = document.getElementById("favicon");
        // Versions may differ between the two. Only test the file name.
        let src = oldLink.href.endsWith("favicon.png")
            ? this._notifyFavicon
            : this._originalFaviconHref;
        this._createFavicon(src, oldLink);
    }

    _createFavicon(src, oldLink) {
        oldLink = oldLink || document.getElementById("favicon");
        let link = document.createElement("link");
        link.id = "favicon";
        link.rel = "shortcut icon";
        link.type = "image/png";
        link.href = src;

        if (oldLink) {
            this._head.removeChild(oldLink);
        }
        this._head.appendChild(link);
    }

    _swapTitle() {
        if (document.title === this._originalTitle) {
            document.title = this._i18n.tr("game.play.your_turn");
        } else if (this._originalTitle) {
            // originalTitle is not defined until at least one navigation is complete.
            // This may occur after this function is called.
            document.title = this._originalTitle;
        }
    }

    _playYourTurnSound() {
        this._sounds.play("your-turn");
    }

    _playVoice() {
        this._sounds.play("your-turn-voice");
    }

    notifyGameOver() {}

    clearNotifications() {
        // originalTitle is not defined until at least one navigation is complete.
        // This may occur after this function is called.
        if (this._originalTitle) {
            document.title = this._originalTitle;
        }
        this._createFavicon(this._originalFaviconHref);
    }
}
