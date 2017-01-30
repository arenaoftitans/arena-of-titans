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


// In milliseconds.
const POPUP_INFOS_APPEAR_TIMEOUT = 500;


@inject(ObserverLocator, Element)
export class AotInfosCustomElement {
    @bindable type = null;
    @bindable infos = null;
    element = null;
    height
    timeout;
    waitForElement;
    width;

    constructor(observerLocator, element) {
        this._observerLocator = observerLocator;
        this.element = element;

        this._infosObserverCb = () => {
            this.hide();

            if (this.timeout !== undefined) {
                clearTimeout(this.timeout);
            }

            if (!this.infos.event) {
                return;
            } else if (this.infos.visible) {
                let target = this.infos.event.target;
                this.timeout = setTimeout(() => this.show(target), POPUP_INFOS_APPEAR_TIMEOUT);
            }
        };
        this._observerLocator.getObserver(this, 'infos').subscribe(this._infosObserverCb);
    }

    attached() {
        this.infosDiv = this.element.getElementsByTagName('div')[0];
        this.init();
    }

    unbind() {
        this._observerLocator.getObserver(this, 'infos').subscribe(this._infosObserverCb);
    }

    init() {
        let boundingBox = this.infosDiv.getBoundingClientRect();
        this.width = boundingBox.width;
        this.height = boundingBox.height;
        this.hide();
    }

    show(target) {
        if (this.type === 'trumps' || this.type === 'affecting-trumps') {
            let trumpsContainer = this.type === 'trumps' ? document.getElementById('player-trumps')
                : document.getElementById('trumps-affecting-player');

            this.infosDiv.style.top = target.getBoundingClientRect().top -
                this.height -
                target.getBoundingClientRect().height +
                'px';
            this.infosDiv.style.left = trumpsContainer.getBoundingClientRect().width + 'px';
        } else if (this.type === 'cards') {
            let targetBoundingClientRect = target.getBoundingClientRect();

            let halfCardWidth = targetBoundingClientRect.width / 2;
            let halfInfosWidth = this.width / 2;

            this.infosDiv.style.top = targetBoundingClientRect.top -
                this.height -
                10 +
                'px';
            this.infosDiv.style.left = target.getBoundingClientRect().left -
                halfInfosWidth +
                halfCardWidth +
                'px';
        } else if (this.type === 'player-name') {
            let event = this.infos.event;
            let boardBg = document.getElementById('board-bg');

            this.infosDiv.style.width = this.infos.title.length + 2 + 'em';
            this.infosDiv.style.height = '2.5em';

            let elementBoundingClientRect = this.infosDiv.getBoundingClientRect();
            let y = event.y || event.clientY || 0;
            let x = event.x || event.clientX || 0;
            this.infosDiv.style.top = y -
                1.5 * elementBoundingClientRect.height -
                boardBg.getBoundingClientRect().top +
                'px';
            this.infosDiv.style.left = x -
                elementBoundingClientRect.width / 2 -
                boardBg.getBoundingClientRect().left +
                'px';
            this.infosDiv.style['background-size'] =
                `${this.infosDiv.style.width} ${this.infosDiv.style.height}`;
        }
    }

    hide() {
        if (this.infosDiv) {
            this.infosDiv.style.top = '-500px';
        }
    }
}
