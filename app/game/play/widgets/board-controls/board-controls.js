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

import { inject, ObserverLocator } from 'aurelia-framework';
import { EventAggregator } from 'aurelia-event-aggregator';

import { MAX_ZOOM, MIN_ZOOM, ZOOM_STEP } from '../board/board';


@inject(ObserverLocator, EventAggregator)
export class AotBoardControlsCustomElement {
    constructor(observerLocator, ea) {
        this._ea = ea;

        this.value = 1;
        observerLocator.getObserver(this, 'value').subscribe((newValue, oldValue) => {
            if (newValue !== oldValue) {
                this._ea.publish('aot:board:controls:zoom', {
                    direction: null,
                    value: newValue,
                });
            }
        });
    }

    zoom(direction) {
        this._ea.publish('aot:board:controls:zoom', {
            direction: direction,
            value: null,
        });
    }

    get maxZoom() {
        return MAX_ZOOM;
    }

    get minZoom() {
        return MIN_ZOOM;
    }

    get zoomStep() {
        return ZOOM_STEP;
    }
}
