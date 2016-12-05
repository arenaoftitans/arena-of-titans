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

import { bindable, inject, ObserverLocator } from 'aurelia-framework';
import { Wait } from '../../../services/utils';
import { Api } from '../../../services/api';


const MAX_VALUE = 40;
const MIN_HEIGHT = 100;
const MAX_HEIGHT = 566;

@inject(Api, ObserverLocator)
export class AotTrumpsGaugeCustomElement {
    @bindable hero = null;

    constructor(api, observerLocator) {
        this._api = api;
        this._observerLocator = observerLocator;
        this.currentY = MAX_HEIGHT;
    }

    bind() {
        Wait.forId('gauge-svg').then(gaugeSvg => {
            // Prevent promise rejection on IE11
            if (gaugeSvg.children === undefined) {
                return;
            }

            for (let i = 0; i < gaugeSvg.children.length; i++) {
                let element = gaugeSvg.children[i];
                let fillStyle = element.style.fill;
                element.style.fill = '';
                element.style.fill = fillStyle;
            }

            this._fill();
            this._observerLocator.getObserver(this, 'value').subscribe((newValue, oldValue) => {
                if (newValue !== oldValue) {
                    this._fill();
                }
            });
        });
    }

    _fill() {
        let maxDelta = MAX_HEIGHT - MIN_HEIGHT;
        let percentFill = this.value / MAX_VALUE;
        let newY = MAX_HEIGHT - Math.round(maxDelta * percentFill);

        clearInterval(this._fillInterval);
        this._fillInterval = setInterval(() => {
            if (this.currentY > newY) {
                this.currentY--;
            } else if (this.currentY < newY) {
                this.currentY++;
            } else {
                clearInterval(this._fillInterval);
            }
        }, 50);
    }

    get value() {
        return this._api.game.gauge_value;
    }
}
