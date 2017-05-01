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

import { bindable } from 'aurelia-framework';
import { Game } from '../../../game';
import { AssetSource } from '../../../../services/assets';


export class AotSelectHeroesCustomElement {
    @bindable selectedHero = null;

    constructor() {
        this.assetSource = AssetSource;
        this.heroes = [];
        for (let hero of Game.heroes) {
            this.heroes.push({
                name: hero,
                next: null,
                previous: this.heroes.length > 0 ? this.heroes[this.heroes.length - 1] : null,
            });
        }
        this.heroes[0].previous = this.heroes[this.heroes.length - 1];
        this.heroes.forEach((hero, index) => {
            if (index < this.heroes.length - 1) {
                let nextIndex = index + 1;
                hero.next = this.heroes[nextIndex];
            } else {
                hero.next = this.heroes[0];
            }
        });
    }

    attached() {
        this._displayedHero = this.heroes[0];
        this.selectedHero = this._displayedHero.name;
    }

    viewNextHero() {
        this._displayedHero = this._displayedHero.next;
        this.selectedHero = this._displayedHero.name;
    }

    viewPreviousHero() {
        this._displayedHero = this._displayedHero.previous;
        this.selectedHero = this._displayedHero.name;
    }
}
