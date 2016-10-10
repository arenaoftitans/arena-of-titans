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

import * as LogManager from 'aurelia-logging';
import { inject, ObserverLocator } from 'aurelia-framework';
import { Storage } from './storage';


export const ASSASSIN_IN_GAME_HELP = 'ASSASSIN_IN_GAME_HELP';


@inject(Storage, ObserverLocator)
export class Options {
    constructor(storage, observerLocator) {
        this._storage = storage;
        this._logger = LogManager.getLogger('AoTOptionsService');
        let savedOptions = storage.loadOptions();
        for (let key of Object.keys(savedOptions)) {
            this[key] = savedOptions[key];
        }

        this.sound = this.sound === undefined ? true : this.sound;
        this.proposeGuidedVisit =
            this.proposeGuidedVisit === undefined ? true : this.proposeGuidedVisit;
        this.proposeInGameHelp =
                this.proposeInGameHelp === undefined ? true : this.proposeInGameHelp;
        this.inGameHelpSeen = this.inGameHelpSeen || [];

        for (let key of Object.keys(this)) {
            observerLocator.getObserver(this, key)
                    .subscribe(() => this._storage.saveOptions(this));
        }
    }

    mustViewInGameHelp(name) {
        switch (name.toLowerCase()) {
            case 'assassination':
                return this.proposeInGameHelp &&
                        !this.inGameHelpSeen.includes(ASSASSIN_IN_GAME_HELP);
            default:
                this._logger.warn(`Unknown name ${name}`);
                return false;
        }
    }

    markInGameOptionSeen(name) {
        let id;
        switch (name.toLowerCase()) {
            case 'assassination':
                id = ASSASSIN_IN_GAME_HELP;
                break;
            default:
                this._logger.warn(`Unknown name ${name}`);
                break;
        }

        if (id && !this.inGameHelpSeen.includes(id)) {
            this.inGameHelpSeen.push(id);
            this._storage.saveOptions(this);
        }
    }
}
