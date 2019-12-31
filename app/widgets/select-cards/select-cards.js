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

import { bindable, inject } from "aurelia-framework";
import { CssAnimator } from "aurelia-animator-css";
import environment from "../../environment";
import { AssetSource } from "../../services/assets";

const INPUT_NODE_NAMES = ["INPUT", "TEXTAREA"];

@inject(CssAnimator)
export class AotSelectCardsCustomElement {
    @bindable selectedCard = null;
    // Referenced in the template.
    cardImage;

    constructor(animator) {
        this._animator = animator;

        this.assetSource = AssetSource;
        this.cards = [];
        for (let card of environment.cards) {
            this.cards.push({
                name: card,
                next: null,
                previous: this.cards.length > 0 ? this.cards[this.cards.length - 1] : null,
            });
        }
        this.cards[0].previous = this.cards[this.cards.length - 1];
        this.cards.forEach((card, index) => {
            if (index < this.cards.length - 1) {
                let nextIndex = index + 1;
                card.next = this.cards[nextIndex];
            } else {
                card.next = this.cards[0];
            }
        });
    }

    bind() {
        this._updateDisplayedCardFromSelected();

        // Listen to keyup event to change card with keyboard.
        this._keyupEventListener = event => {
            // Don't change card if the user is using arrow keys in an input/textarea.
            if (INPUT_NODE_NAMES.includes(event.target.nodeName)) {
                return;
            }

            // code doesn't exist on IE, we need to use key.
            let keyCode = event.code || event.key;

            // The player must validate the game over popup
            if (keyCode === "ArrowRight") {
                this.viewNextCard();
            } else if (keyCode === "ArrowLeft") {
                this.viewPreviousCard();
            }
        };
        window.addEventListener("keyup", this._keyupEventListener);
    }

    /**
     * Update the _displayedCard property used to navigate between Cards from the selectedCard
     * property.
     *
     * This must be done on component initialization and each time the selectedCard property is
     * changed outside this component so the navigation is correct.
     */
    _updateDisplayedCardFromSelected() {
        for (let card of this.cards) {
            if (card.name === this.selectedCard) {
                this._displayedCard = card;
                break;
            }
        }
    }

    viewNextCard() {
        this._displayedCard = this._displayedCard.next;
        this.selectedCard = this._displayedCard.name;
    }

    /**
     * When we change the card, we use the animator to add the .change-card class to animate the
     * transition between card images. We reduce the opacity of the image, change the image and
     * increase the opacity agin. This is done with the aurelia-animator-css plugin. According
     * to the documentation of the plugin, the cardImage element will have the following classes
     * (each class is removed before the next one is added):
     * - the .change-card-add class to animate the addition of the class, we must fade out to
     *   change the image of the card.
     * - the .change-card class when we change the image.
     * - the .change-card-remove class to animate the removal of the class, we must fade in to
     *   display the image of the new card.
     */
    _animateCard() {
        return this._animator.addClass(this.cardImage, "change-card").then(() => {
            return this._animator.removeClass(this.cardImage, "change-card");
        });
    }

    viewPreviousCard() {
        this._displayedCard = this._displayedCard.previous;
        this.selectedCard = this._displayedCard.name;
    }

    selectedCardChanged() {
        this._animateCard();
        this._updateDisplayedCardFromSelected();
    }

    unbind() {
        window.removeEventListener("keyup", this._keyupEventListener);
    }
}
