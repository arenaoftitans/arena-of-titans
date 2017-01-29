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
const MAX_DELTA = MAX_HEIGHT - MIN_HEIGHT;
const FILL_REFRESH_TIME = 50;

@inject(Api, ObserverLocator)
export class AotTrumpsGaugeCustomElement {
    @bindable hero = null;
    @bindable cost = 0;

    constructor(api, observerLocator) {
        this._api = api;
        this._observerLocator = observerLocator;
        this.currentY = MAX_HEIGHT;
        this.heightForCost = 0;
        // We don't display the value directly in order for it increase/decrease while the gauge
        // is filling.
        this.displayedValue = 0;
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

            this._fill(this.value, 0);
            this._valueObserverCb = (newValue, oldValue) => {
                if (newValue !== oldValue) {
                    this._fill(newValue, oldValue);
                }
            };
            this._observerLocator.getObserver(this, 'value').subscribe(this._valueObserverCb);
            this._costObserverCb = (newValue, oldValue) => {
                if (newValue !== oldValue) {
                    this.heightForCost = this.cost / MAX_VALUE * MAX_DELTA;
                }
            };
            this._observerLocator.getObserver(this, 'cost').subscribe(this._costObserverCb);
        });
    }

    unbind() {
        this._observerLocator.getObserver(this, 'value').unsubscribe(this._valueObserverCb);
        this._observerLocator.getObserver(this, 'cost').unsubscribe(this._costObserverCb);
    }

    _fill(newValue, oldValue) {
        let percentFill = this.value / MAX_VALUE;
        let newY = MAX_HEIGHT - Math.round(MAX_DELTA * percentFill);
        let numberStepsBeforeFilled = Math.abs(newY - this.currentY) + 1;
        let deltaValue = newValue - oldValue;
        let valueDeltaPerStep = deltaValue / numberStepsBeforeFilled;
        let intermerdiaryGaugeValue = oldValue;

        clearInterval(this._fillInterval);
        this._fillInterval = setInterval(() => {
            // In order for the number to increase/decrease regularly, we add a small value to it.
            // But since the value of the gauge is always an int, we display the rounded value to
            // the user.
            intermerdiaryGaugeValue += valueDeltaPerStep;
            this.displayedValue = Math.round(intermerdiaryGaugeValue);

            if (this.currentY > newY) {
                this.currentY--;
            } else if (this.currentY < newY) {
                // Here we are emptiing the gauge. If the user still has its mouse over the trump,
                // we adjust the height of the mask so the gauge empties to the original bottom of
                // it.
                if (this.heightForCost > 0) {
                    this.heightForCost--;
                }
                this.currentY++;
            } else {
                this.displayedValue = this.value;
                clearInterval(this._fillInterval);
            }
        }, FILL_REFRESH_TIME);
    }

    get value() {
        return this._api.game.gauge_value;
    }
}
