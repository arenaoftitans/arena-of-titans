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

import {
    AotSelectCardsCustomElement,
} from '../../../app/widgets/select-cards/select-cards';
import environment from '../../../app/environment';
import {
    CssAnimatorStub,
} from '../../../app/test-utils';


describe('create/select-cards', () => {
    let sut;
    let animator;

    beforeEach(() => {
        animator = new CssAnimatorStub();
        sut = new AotSelectCardsCustomElement(animator);
    });

    it('should initialize', () => {
        expect(sut.cards.length).toBeGreaterThan(1);
        expect(sut._displayedCard).toBeUndefined();
        let card = sut.cards[0];
        expect(card.name).toBeDefined();
        expect(card.next).toBe(sut.cards[1]);
        expect(card.previous).toBe(sut.cards[sut.cards.length - 1]);
    });

    it('should update displayed card on bind', () => {
        sut.selectedCard = environment.cards[0];
        expect(sut._displayedCard).toBeUndefined();

        sut.bind();

        expect(sut._displayedCard).toBeDefined();
        expect(sut._displayedCard.name).toBe(environment.cards[0]);
    });

    it('should update displayed card on selectedCard change', () => {
        sut.selectedCard = environment.cards[0];
        expect(sut._displayedCard).toBeUndefined();

        sut.selectedCardChanged();

        expect(sut._displayedCard).toBeDefined();
        expect(sut._displayedCard.name).toBe(environment.cards[0]);
    });

    it('should run the animation on selectedCard change', () => {
        sut.selectedCard = environment.cards[0];
        spyOn(sut, '_animateCard');

        sut.selectedCardChanged();

        expect(sut._animateCard).toHaveBeenCalled();
    });
});
