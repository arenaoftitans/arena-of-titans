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

const OPTIONS_KEY = "options";
const PLAYER_INFOS_KEY = "player";
const KEEP_PLAYER_ID_DURATION = 7 * 24 * 60 * 60 * 1000;

export class Storage {
    saveGameData(gameId, gameData) {
        for (let key of Object.keys(localStorage)) {
            if (key !== OPTIONS_KEY && key !== PLAYER_INFOS_KEY) {
                let data = localStorage.getItem(key);
                data = JSON.parse(data);

                // Remove old keys.
                if (Date.now() - data.date > KEEP_PLAYER_ID_DURATION) {
                    localStorage.removeItem(key);
                }
            }
        }

        // We don't want to update the data if it is already present.
        // This is mostly to prevent a user defined value in the cache.
        if (localStorage.getItem(gameId) === null) {
            gameData.date = Date.now();
            localStorage.setItem(gameId, JSON.stringify(gameData));
        }
    }

    retrievePlayerId(gameId) {
        let data = localStorage.getItem(gameId);
        data = JSON.parse(data);

        return data === null ? data : data.playerId;
    }

    clearGameData(gameId) {
        localStorage.removeItem(gameId);
    }

    saveOptions(options) {
        let toSave = {};
        // We don't save private properties
        for (let key of Object.keys(options)) {
            if (!key.startsWith("_")) {
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
        return JSON.parse(localStorage.getItem(PLAYER_INFOS_KEY)) || { name: "", hero: "" };
    }
}
