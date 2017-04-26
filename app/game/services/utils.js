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

import { inject, transient, BindingEngine } from 'aurelia-framework';
import { EventAggregator } from 'aurelia-event-aggregator';
import { browsers } from '../../services/browser-sniffer';


/**
 * Returns an int in [min, max]
 * @param {int} min
 * @param {int} max
 * @returns {int}
 */
export function randomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}


/**
 * Choose and return a random element from the array. If the array is empty, it
 * returns undefined.
 *
 * @param {Array} array - The array in which to choose the element.
 * @returns {Object|undefined}
 */
export function selectRandomElement(array) {
    if (array.length === 0) {
        return undefined;
    }

    let index = randomInt(0, array.length);
    return array[index];
}


export class Wait {
    static idPromises = {};
    static classPromises = {};

    static flushCache() {
        Wait.idPromises = {};
        Wait.classPromises = {};
    }

    static forId(id) {
        if (id in Wait.idPromises) {
            return Wait.idPromises[id];
        }

        let defered = {};
        defered.promise = new Promise((resolve) => {
            defered.resolve = resolve;
        });

        (function wait() {
            let element = document.getElementById(id);
            // If jasmine is defined, we are running this in a unit test and must resolve the
            // promise.
            if (element !== null || window.jasmine) {
                defered.resolve(element);
            } else {
                setTimeout(wait, 500);
            }
        })();

        Wait.idPromises[id] = defered.promise;

        return defered.promise;
    }

    static forClass(className, {element = document, fresh = false} = {}) {
        if (className in Wait.classPromises && !fresh) {
            return Wait.classPromises[className];
        }

        let defered = {};
        defered.promise = new Promise(resolve => {
            defered.resolve = resolve;
        });

        (function wait() {
            let elementsWithClasses = element.getElementsByClassName(className);
            // If jasmine is defined, we are running this in a unit test and must resolve the
            // promise.
            if (elementsWithClasses.length > 0 || window.jasmine) {
                defered.resolve(elementsWithClasses);
            } else {
                setTimeout(wait, 50);
            }
        })();

        if (!fresh) {
            Wait.classPromises[className] = defered.promise;
        }

        return defered.promise;
    }
}


export class Elements {
    static forClass(className, containerId = null) {
        let container = document;
        if (containerId) {
            container = document.getElementById(containerId);
        }

        let elements = container.getElementsByClassName(className);

        if (browsers.msie || browsers.mac) {
            elements = browsers.htmlCollection2Array(elements);
        }

        return elements;
    }
}


export class Blink {
    constructor(elements, maxBlinkTime, blinkTime, blinkClass) {
        this._elements = elements;
        this._maxBlinkTime = maxBlinkTime;
        this._blinkTime = blinkTime;
        this._blinkClass = blinkClass;
    }

    blink() {
        this._blinkCount = 0;
        this._makeBlink();
    }

    _makeBlink() {
        this._blinkTimeout = setTimeout(() => {
            this._blinkElements();
            this._blinkCount++;
            if (this._blinkCount * this._blinkTime <= this._maxBlinkTime) {
                this._makeBlink();
            } else {
                this.clearElements();
            }
        }, this._blinkTime);
    }

    _blinkElements() {
        for (let elt of this._elements) {
            if (elt.classList.contains(this._blinkClass)) {
                elt.classList.remove(this._blinkClass);
            } else {
                elt.classList.add(this._blinkClass);
            }
        }
    }

    clearElements() {
        clearTimeout(this._blinkElements);
        for (let elt of this._elements) {
            elt.classList.remove(this._blinkClass);
        }
    }
}


/**
 * Utility object to manage (ie subscribe and dispose) group of EventAggregator subscriptions.
 * You need to inject a new instance each time you use it. Otherwise all the subscriptions will
 * be disposed of! To acheive this, we use the transient decorator so each item it is injected,
 * a new instance is created.
 */
@transient()
@inject(EventAggregator)
export class EventAggregatorSubscriptions {
    constructor(ea) {
        this._ea = ea;
        this._subscriptions = [];
    }

    subscribe(signal, fn) {
        let sub = this._ea.subscribe(signal, fn);
        this._subscriptions.push(sub);
    }

    subscribeMultiple(signals, fn) {
        for (let signal of signals) {
            this.subscribe(signal, fn);
        }
    }

    dispose() {
        while (this._subscriptions.length > 0) {
            let subscription = this._subscriptions.shift();
            subscription.dispose();
        }
    }

    publish(signal, message) {
        this._ea.publish(signal, message);
    }
}


/**
 * Utility object to manage (ie subscribe and dispose) group of BindingEngine subscriptions.
 * You need to inject a new instance each time you use it. Otherwise all the subscriptions will
 * be disposed of! To acheive this, we use the transient decorator so each item it is injected,
 * a new instance is created.
 */
@transient()
@inject(BindingEngine)
export class BindingEngineSubscriptions {
    constructor(bindingEngine) {
        this._bindingEngine = bindingEngine;
        this._subscriptions = [];
    }

    subscribe(object, property, fn) {
        let subscription = this._bindingEngine.propertyObserver(object, property)
            .subscribe(fn);
        this._subscriptions.push(subscription);
    }

    dispose() {
        while (this._subscriptions.length > 0) {
            let subscription = this._subscriptions.shift();
            subscription.dispose();
        }
    }
}
