/*
 * Copyright (C) 2017 by Arena of Titans Contributors.
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

import { bindable } from "aurelia-framework";
import environment from "../../environment";
import { AssetSource } from "../../services/assets";

const NB_HEROES_PER_LINE = 4;

export class AotHeroesViewerCustomElement {
    @bindable selectedHero;

    constructor() {
        this.assetSource = AssetSource;
        this.heroesRows = [[], []];
        let line = this.heroesRows[0];

        for (let i = 0; i < environment.heroes.length; i++) {
            let hero = environment.heroes[i];
            line.push(hero);

            // Index start at 0, so if i === 3, we have NB_HEROES_PER_LINE.
            if (i === NB_HEROES_PER_LINE - 1) {
                line = this.heroesRows[1];
            }
        }

        while (line.length < NB_HEROES_PER_LINE) {
            line.push("placeholder");
        }
    }

    selectHero(hero) {
        this.selectedHero = hero;
    }
}
