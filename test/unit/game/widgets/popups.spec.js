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

import '../../setup';
import { AotPopupCustomElement } from '../../../../app/game/widgets/popups/popup';

import { BindingEngine } from 'aurelia-binding';
import { Container } from 'aurelia-dependency-injection';
import { TemplatingEngine } from 'aurelia-templating';

import {initialize} from 'aurelia-pal-browser';

initialize();


describe('popups', () => {
    let container;
    let templatingEngine;
    let bindingEngine;

    beforeEach(() => {
        container = new Container();
        templatingEngine = container.get(TemplatingEngine);
        bindingEngine = container.get(BindingEngine);
    });

    describe('popup custom element', () => {
        let popupElement;

        it('should contain default properties', () => {
            popupElement = templatingEngine.createViewModelForUnitTest(AotPopupCustomElement);

            expect(popupElement.data).toBe(null);
            expect(popupElement.type).toBe(null);
            expect(popupElement.done).toBe(null);
        });

        it('should set bindable to correct values', () => {
            let attributesFromHTML = {
                data: bindingEngine.createBindingExpression('data', 'data'),
                type: 'create',
                done: bindingEngine.createBindingExpression('done', 'done'),
            };

            let bindingContext = {
                data: {
                    player: null,
                },
                done: {
                    promise: null,
                }
            };

            let ele = templatingEngine.createViewModelForUnitTest(
                AotPopupCustomElement,
                attributesFromHTML,
                bindingContext);

            expect(ele.type).toBe('create');
            expect(ele.data.player).toBe(bindingContext.data.player);
            expect(ele.done.promise).toBe(bindingContext.done.promise);
        });
    });
});

