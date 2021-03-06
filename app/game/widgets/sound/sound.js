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

import { bindable, inject } from "aurelia-framework";
import { EventAggregator } from "aurelia-event-aggregator";
import { AssetSource } from "../../../services/assets";

import gameOverMp3 from "../../../../assets/game/sounds/game-over.mp3";
import gameOverOgg from "../../../../assets/game/sounds/game-over.ogg";
import yourTurnSoundMp3 from "../../../../assets/game/sounds/your-turn-sound.mp3";
import yourTurnSoundOgg from "../../../../assets/game/sounds/your-turn-sound.ogg";
import yourTurnVoiceMp3 from "../../../../assets/game/sounds/your-turn-voice.mp3";
import yourTurnVoiceOgg from "../../../../assets/game/sounds/your-turn-voice.ogg";

const sounds = {
    "game-over": {
        mp3: gameOverMp3,
        ogg: gameOverOgg,
    },
    "your-turn": {
        mp3: yourTurnSoundMp3,
        ogg: yourTurnSoundOgg,
    },
    "your-turn-voice": {
        mp3: yourTurnVoiceMp3,
        ogg: yourTurnVoiceOgg,
    },
};

@inject(EventAggregator)
export class AotSoundCustomElement {
    @bindable sound;

    constructor(ea) {
        this._ea = ea;
        this.assetSource = AssetSource;
        // This will contain the audio element.
        this.audio = null;
    }

    forSound(soundName, format) {
        return sounds[soundName][format];
    }

    bind() {
        this.audio.addEventListener("ended", () => {
            this._ea.publish("aot:sound:ended", this.sound);
        });

        try {
            const promise = this.audio.play();
            if (promise && promise.then) {
                promise.then(null, e => {
                    /* eslint-disable no-console */
                    // This problem is expected on some browsers.
                    // So we just console.warn here and don't rely on the logger which may send
                    // the error to the error tracking solution.
                    console.warn("Your browser cannot playCard sounds");
                    console.warn(e);
                    /* eslint-enable */
                });
            }
        } catch (e) {
            /* eslint-disable no-console */
            // This problem is expected on some browsers.
            // So we just console.warn here and don't rely on the logger which may send
            // the error to the error tracking solution.
            console.warn("Your browser cannot playCard sounds");
            console.warn(e);
            /* eslint-enable */
        }
    }
}
