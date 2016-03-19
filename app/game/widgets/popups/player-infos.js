import { bindable } from 'aurelia-framework';
import { Game } from '../../game';


export class AotPlayerInfosCustomElement {
    @bindable data = null;
    @bindable done = null;

    constructor() {
        this.heroes = [];
        for (let hero of Game.heroes) {
            this.heroes.push({
                name: hero,
                class: 'hidden',
            });
        }
        this.heroStyles = [];
        this.currentHeroIndex = 0;
    }

    bind() {
        if (this.data !== null && this.data.hero) {
            this.currentHeroIndex = Game.heroes.indexOf(this.data.hero);
        }

        this.updateHeroesDisplay();
    }

    updateHeroesDisplay() {
        if (this.data !== null) {
            this.data.hero = this.heroes[this.currentHeroIndex].name;
        }

        for (let i = 0; i < this.heroes.length; i++) {
            if (i === this.currentHeroIndex) {
                this.heroes[i].class = 'main-pos';
            } else if (i === this.currentHeroIndex - 1) {
                this.heroes[i].class = 'left-pos';
            } else if (i === this.currentHeroIndex + 1) {
                this.heroes[i].class = 'right-pos';
            } else {
                this.heroes[i].class = 'hidden';
            }
        }
    }

    nextHero() {
        if (this.hasNextHero) {
            this.currentHeroIndex++;
            this.updateHeroesDisplay();
        }
    }

    get hasNextHero() {
        return this.currentHeroIndex < this.heroes.length - 1;
    }

    previousHero() {
        if (this.hasPreviousHero) {
            this.currentHeroIndex--;
            this.updateHeroesDisplay();
        }
    }

    get hasPreviousHero() {
        return this.currentHeroIndex > 0;
    }

    save() {
        this.done.resolve(this.data);
    }
}
