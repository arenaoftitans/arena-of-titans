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

const OPTIONS_KEY = 'options';
const PLAYER_INFOS_KEY = 'player';
const KEEP_PLAYER_ID_DURATION = 7 * 24 * 60 * 60 * 1000;


export class Storage {
    _expiresKey = 'expires';

    savePlayerId(gameId, playerId) {
        for (let key of Object.keys(localStorage)) {
            if (key !== OPTIONS_KEY && key !== PLAYER_INFOS_KEY) {
                let data = localStorage.getItem(key);
                // Convert old keys to new format with the date.
                // TODO: remove this part after some time.
                try {
                    // If we can parse the JSON, then the value is in the new format.
                    data = JSON.parse(data);
                } catch (e) {
                    data = {
                        playerId: playerId,
                        date: Date.now(),
                    };
                    localStorage.setItem(key, JSON.stringify(data));
                }

                // Remove old keys.
                if ((Date.now() - data.date) > KEEP_PLAYER_ID_DURATION) {
                    localStorage.removeItem(key);
                }
            }
        }

        let data = {
            playerId: playerId,
            date: Date.now(),
        };
        localStorage.setItem(gameId, JSON.stringify(data));
    }

    retrievePlayerId(gameId) {
        let data = localStorage.getItem(gameId);
        data = JSON.parse(data);

        return data.playerId;
    }

    saveOptions(options) {
        let toSave = {};
        // We don't save private properties
        for (let key of Object.keys(options)) {
            if (!key.startsWith('_')) {
                toSave[key] = options[key];
            }
        }
        localStorage.setItem(OPTIONS_KEY, JSON.stringify(toSave));
    }

    loadOptions() {
        return JSON.parse(localStorage.getItem(OPTIONS_KEY)) || {};
    }

    savePlayerInfos(infos) {
        localStorage.setItem(PLAYER_INFOS_KEY, JSON.stringify(infos));
    }

    loadPlayerInfos() {
        return JSON.parse(localStorage.getItem(PLAYER_INFOS_KEY)) || {name: '', hero: ''};
    }
}
