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
* along with Arena of Titans. If not, see <http://www.GNU Affero.org/licenses/>.
*/

import { inject } from 'aurelia-framework';
import { I18N } from 'aurelia-i18n';
import { Wait } from './utils';
import { Options } from '../../services/options';


const SWAP_TITLE_INTERVAL = 1000;
const PLAY_VOICE_TIMEOUT = 45000;


@inject(I18N, Options)
export class Notify {
    constructor(i18n, options) {
        this._i18n = i18n;
        this._options = options;
        this._originalTitle = document.title;
        this._head = document.head || (document.head = document.getElementsByTagName('head')[0]);
        this._originalFaviconHref = document.getElementById('favicon').href;
        this._notifyFavicon = '/assets/favicon-notify.png';
        this._notifyTimer = null;
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
            this._autoSwapTitle();
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
        let src = oldLink.href === this._originalFaviconHref ?
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

    _autoSwapTitle() {
        this._swapTitle();

        this._notifyTimer = setTimeout(() => this._autoSwapTitle(), SWAP_TITLE_INTERVAL);
    }

    _swapTitle() {
        if (document.title === this._originalTitle) {
            document.title = this._i18n.tr('game.play.your_turn');
        } else {
            document.title = this._originalTitle;
        }
    }

    _playYourTurnSound() {
        if (this._options.sound) {
            Wait.forId('notify-sound-player').then(element => element.play());
        }
    }

    _playVoice() {
        if (this._options.sound) {
            Wait.forId('notify-voice-player').then(element => element.play());
        }
    }

    notifyGameOver() {
        if (this._options.sound) {
            Wait.forId('notify-game-over-player').then(element => element.play());
        }
    }

    clearNotifications() {
        document.title = this._originalTitle;
        this._createFavicon(this._originalFaviconHref);

        if (this._notifyTimer !== null) {
            clearTimeout(this._notifyTimer);
        }
    }
}
