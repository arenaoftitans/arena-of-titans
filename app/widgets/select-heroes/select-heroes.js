/*
 * Copyright (C) 2015-2020 by Last Run Contributors.
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

import { bindable, inject } from "aurelia-framework";
import { CssAnimator } from "aurelia-animator-css";
import environment from "../../../config/environment.json";
import { AssetSource } from "../../services/assets";
import leftArrow from "../../../assets/game/misc/arrow-left.png";
import rightArrow from "../../../assets/game/misc/arrow-right.png";

const INPUT_NODE_NAMES = ["INPUT", "TEXTAREA"];

@inject(CssAnimator)
export class AotSelectHeroesCustomElement {
    @bindable selectedHero = null;
    // Referenced in the template.
    heroImage;

    constructor(animator) {
        this._animator = animator;

        this.assetSource = AssetSource;
        this.assetSources = {
            leftArrow,
            rightArrow,
        };
        this.heroes = [];
        for (let hero of environment.heroes) {
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
        this._updateDisplayedHeroFromSelected();

        // Listen to keyup event to change hero with keyboard.
        this._keyupEventListener = event => {
            // Don't change hero if the user is using arrow keys in an input/textarea.
            if (INPUT_NODE_NAMES.includes(event.target.nodeName)) {
                return;
            }

            // code doesn't exist on IE, we need to use key.
            let keyCode = event.code || event.key;

            // The player must validate the game over popup
            if (keyCode === "ArrowRight") {
                this.viewNextHero();
            } else if (keyCode === "ArrowLeft") {
                this.viewPreviousHero();
            }
        };
        window.addEventListener("keyup", this._keyupEventListener);
    }

    /**
     * Update the _displayedHero property used to navigate between heroes from the selectedHero
     * property.
     *
     * This must be done on component initialization and each time the selectedHero property is
     * changed outside this component so the navigation is correct.
     */
    _updateDisplayedHeroFromSelected() {
        for (let hero of this.heroes) {
            if (hero.name === this.selectedHero) {
                this._displayedHero = hero;
                break;
            }
        }
    }

    viewNextHero() {
        this._displayedHero = this._displayedHero.next;
        this.selectedHero = this._displayedHero.name;
    }

    /**
     * When we change the hero, we use the animator to add the .change-hero class to animate the
     * transition between hero images. We reduce the opacity of the image, change the image and
     * increase the opacity agin. This is done with the aurelia-animator-css plugin. According
     * to the documentation of the plugin, the heroImage element will have the following classes
     * (each class is removed before the next one is added):
     * - the .change-hero-add class to animate the addition of the class, we must fade out to
     *   change the image of the hero.
     * - the .change-hero class when we change the image.
     * - the .change-hero-remove class to animate the removal of the class, we must fade in to
     *   display the image of the new hero.
     */
    _animateHero() {
        return this._animator.addClass(this.heroImage, "change-hero").then(() => {
            return this._animator.removeClass(this.heroImage, "change-hero");
        });
    }

    viewPreviousHero() {
        this._displayedHero = this._displayedHero.previous;
        this.selectedHero = this._displayedHero.name;
    }

    selectedHeroChanged() {
        this._animateHero();
        this._updateDisplayedHeroFromSelected();
    }

    unbind() {
        window.removeEventListener("keyup", this._keyupEventListener);
    }
}
