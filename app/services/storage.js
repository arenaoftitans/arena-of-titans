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


export class Storage {
    _expiresKey = 'expires';

    savePlayerId(gameId, playerId) {
        localStorage.setItem(gameId, playerId);
    }

    retrievePlayerId(gameId) {
        return localStorage.getItem(gameId);
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
