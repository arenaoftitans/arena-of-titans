/*
 * Copyright (C) 2016 by Arena of Titans Contributors.
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

import {
    Elements,
    EventAggregatorSubscriptions,
    Wait,
} from '../../../../app/game/services/utils';
import { browsers } from '../../../../app/services/browser-sniffer';
import { EventAggregatorStub } from '../../../../app/test-utils';


describe('services/utils', () => {
    describe('Elements', () => {
        it('forClass without container', () => {
            spyOn(document, 'getElementById');
            spyOn(document, 'getElementsByClassName');

            Elements.forClass('my-class');

            expect(document.getElementById).not.toHaveBeenCalled();
            expect(document.getElementsByClassName).toHaveBeenCalledWith('my-class');
        });

        it('forClass with container', () => {
            let container = {
                getElementsByClassName: () => {},
            };
            spyOn(document, 'getElementById').and.returnValue(container);
            spyOn(document, 'getElementsByClassName');
            spyOn(container, 'getElementsByClassName');

            Elements.forClass('my-class', 'my-id');

            expect(document.getElementById).toHaveBeenCalledWith('my-id');
            expect(document.getElementsByClassName).not.toHaveBeenCalled();
            expect(container.getElementsByClassName).toHaveBeenCalledWith('my-class');
        });

        it('forClass on msie', () => {
            spyOn(browsers, 'htmlCollection2Array');
            browsers.msie = true;

            Elements.forClass('my-class');

            expect(browsers.htmlCollection2Array).toHaveBeenCalled();

            browsers.msie = false;
        });

        it('forClass on safari', () => {
            spyOn(browsers, 'htmlCollection2Array');
            browsers.mac = true;

            Elements.forClass('my-class');

            expect(browsers.htmlCollection2Array).toHaveBeenCalled();

            browsers.mac = false;
        });
    });

    describe('EventAggregatorSubscriptions', () => {
        let mockedEa;
        let sut;

        beforeEach(() => {
            mockedEa = new EventAggregatorStub();
            sut = new EventAggregatorSubscriptions(mockedEa);
        });

        it('should subscribe', () => {
            spyOn(mockedEa, 'subscribe');
            let fn = () => {};

            sut.subscribe('signal', fn);

            expect(mockedEa.subscribe).toHaveBeenCalledWith('signal', fn);
            expect(sut._subscriptions.length).toBe(1);
        });

        it('should dispose', () => {
            let subscription = {
                dispose: jasmine.createSpy('dispose'),
            };
            sut._subscriptions = [subscription];


            sut.dispose();

            expect(subscription.dispose).toHaveBeenCalled();
            expect(sut._subscriptions.length).toBe(0);
        });

        it('should dispose empty', () => {
            sut.dispose();

            expect(sut._subscriptions.length).toBe(0);
        });
    });

    describe('Wait', () => {
        beforeEach(() => {
            Wait.flushCache();
        });

        it('should flush cache', () => {
            Wait.idPromises.toto = null;
            Wait.classPromises.toto = null;

            Wait.flushCache();

            expect(Wait.idPromises).toEqual({});
            expect(Wait.classPromises).toEqual({});
        });

        describe('forClass', () => {
            let className = 'my-class';

            it('should create new promise', () => {
                spyOn(document, 'getElementsByClassName').and.returnValue([]);

                let promise = Wait.forClass(className);

                expect(promise).toEqual(jasmine.any(Promise));
                expect(document.getElementsByClassName).toHaveBeenCalledWith(className);
                expect(Wait.classPromises[className]).toBe(promise);
            });

            it('should serve from cache if present', () => {
                let promise = new Promise(() => {});
                Wait.classPromises[className] = promise;

                let returnedPromise = Wait.forClass(className);

                expect(returnedPromise).toBe(promise);
            });

            it('should return new promise if fresh is true', () => {
                let promise = new Promise(() => {});
                Wait.classPromises[className] = promise;

                let returnedPromise = Wait.forClass(className, {fresh: true});

                expect(returnedPromise).not.toBe(promise);
            });

            it('should search from element if passed', () => {
                spyOn(document, 'getElementsByClassName');
                let spy = jasmine.createSpy('getElementsByClassName').and.returnValue([]);
                let element = {
                    getElementsByClassName: spy,
                };

                let promise = Wait.forClass(className, {element: element});

                expect(promise.then).toBeDefined();
                expect(document.getElementsByClassName).not.toHaveBeenCalled();
                expect(element.getElementsByClassName).toHaveBeenCalledWith(className);
                expect(Wait.classPromises[className]).toBe(promise);
            });
        });

        describe('forId', () => {
            let idName = 'my-id';

            it('should create new promise', () => {
                spyOn(document, 'getElementById').and.returnValue([]);

                let promise = Wait.forId(idName);

                expect(promise).toEqual(jasmine.any(Promise));
                expect(document.getElementById).toHaveBeenCalledWith(idName);
                expect(Wait.idPromises[idName]).toBe(promise);
            });

            it('should serve from cache if present', () => {
                let promise = new Promise(() => {});
                Wait.idPromises[idName] = promise;

                let returnedPromise = Wait.forId(idName);

                expect(returnedPromise).toBe(promise);
            });
        });
    });
});
