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
    AotSelectHeroesCustomElement,
} from '../../../app/widgets/select-heroes/select-heroes';
import environment from '../../../app/environment';
import {
    CssAnimatorStub,
} from '../../../app/test-utils';


describe('create/select-heroes', () => {
    let sut;
    let animator;

    beforeEach(() => {
        animator = new CssAnimatorStub();
        sut = new AotSelectHeroesCustomElement(animator);
    });

    it('should initialize', () => {
        expect(sut.heroes.length).toBeGreaterThan(1);
        expect(sut._displayedHero).toBeUndefined();
        let hero = sut.heroes[0];
        expect(hero.name).toBeDefined();
        expect(hero.next).toBe(sut.heroes[1]);
        expect(hero.previous).toBe(sut.heroes[sut.heroes.length - 1]);
    });

    it('should update displayed hero on bind', () => {
        sut.selectedHero = environment.heroes[0];
        expect(sut._displayedHero).toBeUndefined();

        sut.bind();

        expect(sut._displayedHero).toBeDefined();
        expect(sut._displayedHero.name).toBe(environment.heroes[0]);
    });

    it('should update displayed hero on selectedHero change', () => {
        sut.selectedHero = environment.heroes[0];
        expect(sut._displayedHero).toBeUndefined();

        sut.selectedHeroChanged();

        expect(sut._displayedHero).toBeDefined();
        expect(sut._displayedHero.name).toBe(environment.heroes[0]);
    });

    it('should run the animation on selectedHero change', () => {
        sut.selectedHero = environment.heroes[0];
        jest.spyOn(sut, '_animateHero');

        sut.selectedHeroChanged();

        expect(sut._animateHero).toHaveBeenCalled();
    });
});
