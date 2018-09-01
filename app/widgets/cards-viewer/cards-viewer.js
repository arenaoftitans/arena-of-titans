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

import { bindable } from 'aurelia-framework';
import environment from '../../environment';
import { AssetSource } from '../../services/assets';


const NB_CARDS_PER_LINE = 4;

export class AotCardsViewerCustomElement {
    @bindable selectedCard;

    constructor() {
        this.assetSource = AssetSource;
        this.cardsRows = [[], []];
        let line = this.cardsRows[0];

        for (let i = 0; i < environment.cards.length; i++) {
            let card = environment.cards[i];
            line.push(card);

            // Index start at 0, so if i === 3, we have NB_cardS_PER_LINE.
            if (i === NB_CARDS_PER_LINE - 1) {
                line = this.cardsRows[1];
            }
        }

        while (line.length < NB_CARDS_PER_LINE) {
            line.push('placeholder');
        }
    }

    selectCard(card) {
        this.selectedCard = card;
    }
}
