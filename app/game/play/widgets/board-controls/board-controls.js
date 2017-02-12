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

import { inject, NewInstance, ObserverLocator } from 'aurelia-framework';

import { EventAggregatorSubscriptions } from '../../../services/utils';
import { MAX_ZOOM, MIN_ZOOM, MOVE_STEP, ZOOM_STEP } from '../board/board';


@inject(ObserverLocator, NewInstance.of(EventAggregatorSubscriptions))
export class AotBoardControlsCustomElement {
    constructor(observerLocator, eas) {
        this._ol = observerLocator;
        this._eas = eas;

        // Set this to true, when the value is changed just to sync the input with the zoom level.
        // We don't want to trigger an zoom in this case.
        this._synching = false;

        this.value = 1;
        this._valueObserverCb = (newValue, oldValue) => {
            if (newValue !== oldValue && !this._synching) {
                this._eas.publish('aot:board:controls:zoom', {
                    direction: null,
                    value: newValue,
                    fixPawn: true,
                });
            }
            this._synching = false;
        };
        this._ol.getObserver(this, 'value').subscribe(this._valueObserverCb);
        this._eas.subscribe('aot:board:zoom', message => {
            this._synching = true;
            // The transmitted value is a number but the result of the binding is a string. So, if
            // we set the value to a number, this will trigger an unecessary change.
            this.value = message.value.toString();
        });
    }

    move(direction) {
        let deltaX = 0;
        let deltaY = 0;

        switch (direction) {
            case 'up':
                deltaY = -MOVE_STEP;
                break;
            case 'right':
                deltaX = MOVE_STEP;
                break;
            case 'down':
                deltaY = MOVE_STEP;
                break;
            case 'left':
                deltaX = -MOVE_STEP;
                break;
            default:
                break;
        }

        this._eas.publish('aot:board:controls:move', {
            deltaX: deltaX,
            deltaY: deltaY,
        });
    }

    reset() {
        this._eas.publish('aot:board:controls:reset');
    }

    unbind() {
        this._eas.dispose();
        this._ol.getObserver(this, 'value').unsubscribe(this._valueObserverCb);
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
