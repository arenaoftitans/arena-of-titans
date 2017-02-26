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


export class AotHomeSliderCustomElement {
    activeSlide = 0;
    slideTotal = 3;
    automaticSlidingInterval;
    automaticSlidingPeriod = 50000;

    constructor() {
        this.createAutomaticSlidingInterval();
    }

    createAutomaticSlidingInterval = function() {
        this.automaticSlidingInterval = window.setInterval(()=>{
            this.goToSlide(this.activeSlide + 1);
        }, this.automaticSlidingPeriod);
    };

    goToSlide = function(slideNumber) {
        if (slideNumber >= this.slideTotal) {
            this.goToSlide(0);
            return;
        }

        clearInterval(this.automaticSlidingInterval);

        //update active slide
        this.activeSlide = slideNumber;
        //move slider
        this.homeSlider.style.transform = 'translateX(-' + slideNumber * 33.333 + '%)';

        this.createAutomaticSlidingInterval();
    };
}

