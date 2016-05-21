import { bindable } from 'aurelia-framework';
import { Game } from '../../game';
import { Wait } from '../../services/utils';


export class AotPlayerInfosCustomElement {
    @bindable data = null;
    @bindable done = null;

    constructor() {
        this.currentHeroIndex = 0;
        this.direction = null;

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
        this.done.resolve(this.data);
    }
}
