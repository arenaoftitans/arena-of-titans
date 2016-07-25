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
import { Wait } from '../../../services/utils';
import { browsers } from '../../../../services/browser-sniffer';


export class AotSelectHeroesCustomElement {
    @bindable done = null;
    @bindable data = null;

    constructor() {
        this.currentHeroIndex = 0;
        this.direction = null;
        this.loadDefered = {};
        this.loadDefered.promise = new Promise(resolve => {
            this.loadDefered.resolve = resolve;
        });
        this.loadTimeoutDefered = {};
        this.loadTimeoutDefered.promise = new Promise(resolve => {
            this.loadTimeoutDefered.resolve = resolve;
        });
        setTimeout(() => {
            this.loadTimeoutDefered.resolve();
        }, 700);

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

    bind() {
        if (this.data !== null && this.data.hero) {
            this.currentHeroIndex = Game.heroes.indexOf(this.data.hero);
        } else if (this.data !== null) {
            this.data.hero = this.currentHero.name;
        }

        let waitForCarousel = Wait.forId('heroes-carousel');

        waitForCarousel.then(heroesCarousel => {
            this.heroesCarousel = heroesCarousel;
            this.setHeroImage(
                this.heroesCarousel.children[0],
                this.currentHero.previous.previous.name);
            this.setHeroImage(this.heroesCarousel.children[1], this.currentHero.previous.name);
            this.setHeroImage(this.heroesCarousel.children[2], this.currentHero.name);
            this.setHeroImage(this.heroesCarousel.children[3], this.currentHero.next.name);
            this.setHeroImage(this.heroesCarousel.children[4], this.currentHero.next.next.name);
        });

        let waitForSelectForm = Wait.forId('select-heroes-form');
        let waitForPlate = Wait.forId('select-heroes-plate');
        let waitForBg = Wait.forId('select-heroes-bg');
        let waitAll = Promise.all([waitForSelectForm, waitForPlate, waitForBg]);
        let resize = () => {
            waitAll.then(elts => this.resize(elts, 2));
        };
        addEventListener('load', () => {
            resize();
            this.loadDefered.resolve();
        });
        addEventListener('resize', resize);
        resize();
    }

    resize(elts, iter) {
        let selectForm = elts[0];
        let saveDiv = selectForm.getElementsByTagName('div')[1];
        let selectedHero = selectForm.getElementsByClassName('main-pos')[0];
        let arrows = browsers.htmlCollection2Array(selectForm.getElementsByClassName('arrow'));
        let plate = elts[1];
        let plateBoundingClientRect = plate.getBoundingClientRect();
        let bg = elts[2];

        // On some screen, if we attempt to center the caroussel, we go outside the plate.
        let centerInPlateValue = plateBoundingClientRect.top +
                plateBoundingClientRect.height / 2 -
                selectForm.getBoundingClientRect().height / 2;
        selectForm.style.top = Math.max(centerInPlateValue, plateBoundingClientRect.top + 10) +
                'px';
        selectForm.style.left = plate.getBoundingClientRect().left + 'px';
        selectForm.style.width = plate.getBoundingClientRect().width + 'px';

        let heightDiff = saveDiv.getBoundingClientRect().bottom -
                bg.getBoundingClientRect().bottom;
        if (heightDiff > 0) {
            bg.style.height = bg.getBoundingClientRect().height + heightDiff + 'px';
        } else {
            bg.style.height = '';
        }

        for (let arrow of arrows) {
            arrow.style.height = selectedHero.getBoundingClientRect().height + 'px';
        }

        if (iter > 0) {
            Promise.race([this.loadDefered.promise, this.loadTimeoutDefered.promise]).then(() => {
                setTimeout(() => {
                    iter--;
                    this.resize(elts, iter);
                }, 6);
            });
        }
    }

    setHeroImage(element, name) {
        element.src = `/assets/game/heroes/${name}.png`;
        element.alt = name;
    }

    updateHeroesDisplay() {
        if (this.data !== null) {
            this.data.hero = this.currentHero.name;
        }

        if (this.direction === 'left') {
            this.heroesCarousel.children[0].className = 'hero-img left-pos';
            this.heroesCarousel.children[1].className = 'hero-img main-pos';
            this.heroesCarousel.children[2].className = 'hero-img right-pos';
            this.heroesCarousel.children[3].className = 'hero-img hidden';
            let newImage = document.createElement('img');
            this.setHeroImage(newImage, this.currentHero.previous.previous.name);
            newImage.className = 'hero-img hidden';
            this.heroesCarousel.removeChild(this.heroesCarousel.children[4]);
            this.heroesCarousel.insertBefore(newImage, this.heroesCarousel.children[0]);
        } else if (this.direction === 'right') {
            this.heroesCarousel.children[1].className = 'hero-img hidden';
            this.heroesCarousel.children[2].className = 'hero-img left-pos';
            this.heroesCarousel.children[3].className = 'hero-img main-pos';
            this.heroesCarousel.children[4].className = 'hero-img right-pos';
            let newImage = document.createElement('img');
            this.setHeroImage(newImage, this.currentHero.next.next.name);
            newImage.className = 'hero-img hidden';
            this.heroesCarousel.appendChild(newImage);
            this.heroesCarousel.removeChild(this.heroesCarousel.children[0]);
        }
    }

    viewNextHero() {
        this.direction = 'right';
        if (this.hasNextHero) {
            this.currentHeroIndex++;
        } else {
            this.currentHeroIndex = 0;
        }

        this.updateHeroesDisplay();
    }

    get hasNextHero() {
        return this.currentHeroIndex < this.heroes.length - 1;
    }

    viewPreviousHero() {
        this.direction = 'left';
        if (this.hasPreviousHero) {
            this.currentHeroIndex--;
        } else {
            this.currentHeroIndex = this.heroes.length - 1;
        }

        this.updateHeroesDisplay();
    }

    get hasPreviousHero() {
        return this.currentHeroIndex > 0;
    }

    get currentHero() {
        return this.heroes[this.currentHeroIndex];
    }

    save() {
        this.done(this.data);
    }
}
