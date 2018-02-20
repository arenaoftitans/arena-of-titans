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

import { inject } from 'aurelia-framework';
import { I18N } from 'aurelia-i18n';
import { AssetSource } from '../../services/assets';
import { Sounds } from './sounds';
import { EventAggregatorSubscriptions } from '../services/utils';


const PLAY_VOICE_TIMEOUT = 45000;


@inject(I18N, EventAggregatorSubscriptions, Sounds)
export class Notify {
    constructor(i18n, eas, sounds) {
        this._i18n = i18n;
        this._eas = eas;
        this._eas.subscribe('router:navigation:complete', () => {
            // While navigation is not complete, document.title may be the default value in
            // index.html
            this._originalTitle = document.title;
        });
        this._sounds = sounds;
        this._head = document.head || (document.head = document.getElementsByTagName('head')[0]);
        this._originalFaviconHref = AssetSource.forMiscImage('favicon');
        this._notifyFavicon = AssetSource.forMiscImage('favicon-notify');
        this._body = document.body || document.getElementByTagName('body')[0];

        document.addEventListener('visibilitychange', () => this._handleVisibilityChange());
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
        }

        let playVoiceTimer = setTimeout(() => this._playVoice(), PLAY_VOICE_TIMEOUT);
        let cancelPlayVoice = () => {
            clearTimeout(playVoiceTimer);
            this._body.removeEventListener('mousemove', cancelPlayVoice);
        };
        this._body.addEventListener('mousemove', cancelPlayVoice);
    }

    _swapFavicon() {
        let oldLink = document.getElementById('favicon');
        // Versions may differ between the two. Only test the file name.
        let src = oldLink.href.endsWith('favicon.png') ?
            this._notifyFavicon : this._originalFaviconHref;
        this._createFavicon(src, oldLink);
    }

    _createFavicon(src, oldLink) {
        oldLink = oldLink || document.getElementById('favicon');
        let link = document.createElement('link');
        link.id = 'favicon';
        link.rel = 'shortcut icon';
        link.type = 'image/png';
        link.href = src;

        if (oldLink) {
            this._head.removeChild(oldLink);
        }
        this._head.appendChild(link);
    }

    _swapTitle() {
        if (document.title === this._originalTitle) {
            document.title = this._i18n.tr('game.play.your_turn');
        } else if (this._originalTitle) {
            // originalTitle is not defined until at least one navigation is complete.
            // This may occur after this function is called.
            document.title = this._originalTitle;
        }
    }

    _playYourTurnSound() {
        this._sounds.play('your-turn');
    }

    _playVoice() {
        this._sounds.play('your-turn-voice');
    }

    notifyGameOver() {
        this._sounds.play('game-over');
    }

    clearNotifications() {
        // originalTitle is not defined until at least one navigation is complete.
        // This may occur after this function is called.
        if (this._originalTitle) {
            document.title = this._originalTitle;
        }
        this._createFavicon(this._originalFaviconHref);
    }
}
