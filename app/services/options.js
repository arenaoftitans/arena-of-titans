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

import { inject, ObserverLocator } from 'aurelia-framework';
import { Storage } from './storage';


@inject(Storage, ObserverLocator)
export class Options {
    constructor(storage, observerLocator) {
        let savedOptions = storage.loadOptions();
        for (let key of Object.keys(savedOptions)) {
            this[key] = savedOptions[key];
        }

        this.sound = this.sound === undefined ? true : this.sound;
        this.proposeGuidedVisit =
            this.proposeGuidedVisit === undefined ? true : this.proposeGuidedVisit;

        for (let key of Object.keys(this)) {
            observerLocator.getObserver(this, key).subscribe(() => storage.saveOptions(this));
        }
    }
}
