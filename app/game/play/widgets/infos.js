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
* along with Arena of Titans. If not, see <http://www.GNU Affero.org/licenses/>.
*/

import { bindable, inject, ObserverLocator } from 'aurelia-framework';
import { Wait } from '../../services/utils';


// In milliseconds.
const POPUP_INFOS_APPEAR_TIMEOUT = 500;


@inject(ObserverLocator)
export class AotInfosCustomElement {
    @bindable type = null;
    @bindable infos = null;
    element = null;
    height
    timeout;
    waitForElement;
    width;

    constructor(observerLocator) {
        observerLocator.getObserver(this, 'infos').subscribe(() => {
            if (this.element === null) {
                this.init();
            } else {
                this.hide();
            }

            if (this.timeout !== undefined) {
                clearTimeout(this.timeout);
            }

            if (!this.infos.event) {
                return;
            } else if (this.infos.visible) {
                let target = this.infos.event.target;
                this.timeout = setTimeout(() => this.show(target), POPUP_INFOS_APPEAR_TIMEOUT);
            }
        });
    }

    init() {
        let infosId = this.getInfosId();
        Wait.forId(infosId).then(element => {
            this.element = element;
            let boundingBox = element.getBoundingClientRect();
            this.width = boundingBox.width;
            this.height = boundingBox.height;
            this.hide();
        });
    }

    getInfosId() {
        switch (this.type) {
            case 'cards':
                return 'cards-element-infos';
            case 'trumps':
                return 'trumps-element-infos';
            case 'player-name':
                return 'player-name-element-infos';
            default:
                throw new Error('Unsuported typein aot-info: ' + this.type);
        }
    }

    show(target) {
        if (this.type === 'trumps') {
            let trumpsContainer = document.getElementById('player-trumps');

            let top = 0;
            let element = target;
            do {
                top += element.offsetTop || 0;
                element = element.offsetParent;
            } while (element);

            this.element.style.top = top -
                this.height -
                target.getBoundingClientRect().height +
                'px';
            this.element.style.left = trumpsContainer.getBoundingClientRect().width + 'px';
        } else if (this.type === 'cards') {
            let targetBoundingClientRect = target.getBoundingClientRect();

            let halfCardWidth = targetBoundingClientRect.width / 2;
            let halfInfosWidth = this.width / 2;

            this.element.style.top = targetBoundingClientRect.top -
                this.height -
                10 +
                'px';
            this.element.style.left = target.getBoundingClientRect().left -
                halfInfosWidth +
                halfCardWidth +
                'px';
        } else if (this.type === 'player-name') {
            let event = this.infos.event;

            this.element.style.width = this.infos.title.length + 'em';
            this.element.style.height = '2.5em';

            let elementBoundingClientRect = this.element.getBoundingClientRect();
            let y = event.y || event.clientY || 0;
            let x = event.x || event.clientX || 0;
            this.element.style.top = y -
                1.5 * elementBoundingClientRect.height +
                'px';
            this.element.style.left = x -
                elementBoundingClientRect.width / 2 +
                'px';
            this.element.style['background-size'] =
                `${this.element.style.width} ${this.element.style.height}`;
        }
    }

    hide() {
        if (this.element) {
            this.element.style.top = '-500px';
        }
    }
}
