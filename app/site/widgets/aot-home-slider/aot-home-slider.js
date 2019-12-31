/*
* Copyright (C) 2015-2017 by Arena of Titans Contributors.
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

const SLIDE_TOTAL = 3;
const AUTOMATIC_SLIDING_PERIOD = 5000;

export class AotHomeSliderCustomElement {
    activeSlide = 0;
    automaticSlidingTimeOut;

    attached() {
        //start automatic slider
        this.goToSlide(0);
    }

    detached() {
        clearTimeout(this.automaticSlidingTimeOut);
    }

    goToSlide(slideNumber) {
        if (slideNumber >= SLIDE_TOTAL) {
            this.goToSlide(0);
            return;
        }

        clearTimeout(this.automaticSlidingTimeOut);

        // Update active slide
        this.activeSlide = slideNumber;
        // Move slider
        this.homeSlider.style.transform = `translateX(-${slideNumber * 33.333}%)`;

        this.automaticSlidingTimeOut = setTimeout(() => {
            this.goToSlide(this.activeSlide + 1);
        }, AUTOMATIC_SLIDING_PERIOD);
    }
}
