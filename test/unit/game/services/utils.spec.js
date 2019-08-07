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
    randomInt,
    selectRandomElement,
    BindingEngineSubscriptions,
    Elements,
    EventAggregatorSubscriptions,
    Wait,
} from '../../../../app/game/services/utils';
import { browsers } from '../../../../app/services/browser-sniffer';
import {
    BindingEngineStub,
    EventAggregatorStub,
} from '../../../../app/test-utils';


describe('services/utils', () => {
    beforeEach(() => {
        jest.resetAllMocks();
    });

    describe('selectRandomElement', () => {
        it('should return undefined for empty array', () => {
            expect(selectRandomElement([])).toBeUndefined();
        });

        it('should return an item for a non empty arry', () => {
            expect(selectRandomElement(['toto'])).toBe('toto');
        });
    });

    describe('randomInt', () => {
        it('should return correct value if min === max', () => {
            expect(randomInt(0, 0)).toBe(0);
            expect(randomInt(10, 10)).toBe(10);
        });
    });

    describe('Elements', () => {
        it('forClass without container', () => {
            jest.spyOn(document, 'getElementById');
            jest.spyOn(document, 'getElementsByClassName');

            Elements.forClass('my-class');

            expect(document.getElementById).not.toHaveBeenCalled();
            expect(document.getElementsByClassName).toHaveBeenCalledWith('my-class');
        });

        it('forClass with container', () => {
            let container = {
                getElementsByClassName: () => {},
            };
            jest.spyOn(document, 'getElementById').mockReturnValue(container);
            jest.spyOn(document, 'getElementsByClassName');
            jest.spyOn(container, 'getElementsByClassName');

            Elements.forClass('my-class', 'my-id');

            expect(document.getElementById).toHaveBeenCalledWith('my-id');
            expect(document.getElementsByClassName).not.toHaveBeenCalled();
            expect(container.getElementsByClassName).toHaveBeenCalledWith('my-class');
        });

        it('forClass on msie', () => {
            jest.spyOn(browsers, 'htmlCollection2Array').mockImplementation(() => {});
            browsers.msie = true;

            Elements.forClass('my-class');

            expect(browsers.htmlCollection2Array).toHaveBeenCalled();

            browsers.msie = false;
        });

        it('forClass on safari', () => {
            jest.spyOn(browsers, 'htmlCollection2Array');
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
            jest.spyOn(mockedEa, 'subscribe');
            let fn = () => {};

            sut.subscribe('signal', fn);

            expect(mockedEa.subscribe).toHaveBeenCalledWith('signal', fn);
            expect(sut._subscriptions.length).toBe(1);
        });

        it('should dispose', () => {
            let subscription = {
                dispose: jest.fn(),
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

    describe('BindingEngineSubscriptions', () => {
        let mockedBindingEngine;
        let sut;

        beforeEach(() => {
            mockedBindingEngine = new BindingEngineStub();
            sut = new BindingEngineSubscriptions(mockedBindingEngine);
        });

        it('should subscribe', () => {
            jest.spyOn(mockedBindingEngine, 'propertyObserver');
            let fn = () => {};
            let object = {};

            sut.subscribe(object, 'property', fn);

            expect(mockedBindingEngine.propertyObserver).toHaveBeenCalledWith(object, 'property');
            expect(mockedBindingEngine.propertyObserverObj.subscribe).toHaveBeenCalledWith(fn);
            expect(sut._subscriptions.length).toBe(1);
        });

        it('should dispose', () => {
            let subscription = {
                dispose: jest.fn(),
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
                jest.spyOn(document, 'getElementsByClassName').mockReturnValue([]);

                let promise = Wait.forClass(className);

                expect(promise).toEqual(expect.any(Promise));
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
                jest.spyOn(document, 'getElementsByClassName').mockImplementation(() => []);
                let element = {
                    getElementsByClassName: jest.fn(),
                };

                let promise = Wait.forClass(className, {element});

                expect(promise.then).toBeDefined();
                expect(document.getElementsByClassName).not.toHaveBeenCalled();
                expect(element.getElementsByClassName).toHaveBeenCalledWith(className);
                expect(Wait.classPromises[className]).toBe(promise);
            });
        });

        describe('forId', () => {
            let idName = 'my-id';

            it('should create new promise', () => {
                jest.spyOn(document, 'getElementById').mockReturnValue([]);

                let promise = Wait.forId(idName);

                expect(promise).toEqual(expect.any(Promise));
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
