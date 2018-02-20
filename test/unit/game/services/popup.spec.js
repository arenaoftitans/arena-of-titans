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

import { Popup } from '../../../../app/game/services/popup';
import {
    EventAggregatorSubscriptionsStub,
    I18nStub,
} from '../../../../app/test-utils';


describe('Popups service', () => {
    let mockedI18n;
    let mockedEas;
    let sut;

    beforeEach(() => {
        mockedI18n = new I18nStub();
        mockedEas = new EventAggregatorSubscriptionsStub();
        sut = new Popup(mockedI18n, mockedEas);
    });

    it('should initialize correctly', () => {
        expect(sut._popups).toEqual([]);
        expect(sut._displayedPopupDeferred.promise).toBeNull();
        expect(sut._displayedPopupData).toBeNull();
        expect(sut._displayedPopupDeferred.reject).toEqual(jasmine.any(Function));
        expect(sut._displayedPopupDeferred.resolve).toEqual(jasmine.any(Function));
        expect(sut._popupReadyDeferred.promise).toEqual(jasmine.any(Promise));
        expect(sut._popupReadyDeferred.resolve).toEqual(jasmine.any(Function));
    });

    describe('display', () => {
        it('should prepare the popup to be displayed', () => {
            spyOn(sut, '_closeAllWithoutTimeout');
            spyOn(mockedEas, 'publish');
            spyOn(sut, '_displayNext');
            spyOn(sut._popupReadyDeferred.promise, 'then');
            let type = 'info';
            let data = {message: 'Hello'};

            let ret = sut.display(type, data);

            expect(sut._closeAllWithoutTimeout).not.toHaveBeenCalled();
            expect(mockedEas.publish).not.toHaveBeenCalled();
            expect(sut._displayNext).not.toHaveBeenCalled();
            expect(sut._popupReadyDeferred.promise.then)
                .toHaveBeenCalledWith(jasmine.any(Function));
            expect(sut._popups.length).toBe(1);
            let popup = sut._popups[0];
            expect(popup.type).toBe(type);
            expect(popup.data).toBe(data);
            expect(popup.deferred).toBeDefined();
            expect(popup.timeout).toBe(0);

            expect(ret).toEqual(jasmine.any(Promise));
        });

        it('should call _displayNext once popups are ready', () => {
            spyOn(sut, '_displayNext');
            let type = 'info';
            let data = {message: 'Hello'};

            sut.display(type, data);

            sut._popupReadyDeferred.resolve();
            return sut._popupReadyDeferred.promise.then(() => {
                expect(sut._displayNext).toHaveBeenCalled();
            }, () => {
                fail('Unwanted code branch');
            });
        });

        it('should close all popups when displaying a new transition popup', () => {
            spyOn(sut, '_closeAllWithoutTimeout');
            let type = 'transition';
            let data = {message: 'Hello'};

            sut.display(type, data);

            expect(sut._closeAllWithoutTimeout).toHaveBeenCalled();
        });
    });

    describe('_closeAllWithoutTimeout', () => {
        it('should close displayed popup if it does not have a timeout', () => {
            spyOn(sut._logger, 'debug');
            spyOn(sut._displayedPopupDeferred, 'reject');
            sut._displayedPopupData = {
                meta: {},
            };

            sut._closeAllWithoutTimeout();

            expect(sut._logger.debug).toHaveBeenCalled();
            expect(sut._displayedPopupDeferred.reject).toHaveBeenCalledWith(jasmine.any(Error));
            expect(sut._displayedPopupData).toBeNull();
        });

        it('should leave displayed popup opened if it has a timeout', () => {
            spyOn(sut._logger, 'debug');
            spyOn(sut._displayedPopupDeferred, 'reject');
            sut._displayedPopupData = {
                meta: {
                    timeout: 20,
                },
            };

            sut._closeAllWithoutTimeout();

            expect(sut._logger.debug).toHaveBeenCalled();
            expect(sut._displayedPopupDeferred.reject).not.toHaveBeenCalled();
            expect(sut._displayedPopupData).not.toBeNull();
        });

        it('should purge the list of popups to display of popups without a timeout', () => {
            spyOn(sut._logger, 'debug');
            sut._popups.push({}, {timeout: 20});

            sut._closeAllWithoutTimeout();

            expect(sut._logger.debug).toHaveBeenCalled();
            expect(sut._popups).toEqual([{timeout: 20}]);
        });
    });

    describe('_displayNext', () => {
        it('should do nothing if no popups', () => {
            spyOn(mockedEas, 'publish');

            sut._displayNext();

            expect(mockedEas.publish).not.toHaveBeenCalled();
        });

        it('should clean displayed deferred on resolve', () => {
            sut._displayedPopupDeferred.promise = new Promise((resolve, reject) => {
                sut._displayedPopupDeferred.resolve = resolve;
                sut._displayedPopupDeferred.reject = reject;
            });
            let resolve = sut._displayedPopupDeferred.resolve;
            let reject = sut._displayedPopupDeferred.reject;
            sut._displayedPopupData = {};
            spyOn(sut._displayedPopupDeferred.promise, 'then').and.callThrough();

            sut._displayNext();

            expect(sut._displayedPopupDeferred.promise.then).toHaveBeenCalled();
            resolve();
            return sut._displayedPopupDeferred.promise.then(() => {
                expect(sut._displayedPopupDeferred.promise).toBeNull();
                expect(sut._displayedPopupDeferred.resolve).toEqual(jasmine.any(Function));
                expect(sut._displayedPopupDeferred.resolve).not.toBe(resolve);
                expect(sut._displayedPopupDeferred.reject).toEqual(jasmine.any(Function));
                expect(sut._displayedPopupDeferred.reject).not.toBe(reject);
                expect(sut._displayedPopupData).toBeNull();
            }, () => fail('Unwanted code branch'));
        });

        it('should clean displayed deferred on reject', () => {
            sut._displayedPopupDeferred.promise = new Promise((resolve, reject) => {
                sut._displayedPopupDeferred.resolve = resolve;
                sut._displayedPopupDeferred.reject = reject;
            });
            let resolve = sut._displayedPopupDeferred.resolve;
            let reject = sut._displayedPopupDeferred.reject;
            sut._displayedPopupData = {};
            spyOn(sut._displayedPopupDeferred.promise, 'then').and.callThrough();

            sut._displayNext();

            expect(sut._displayedPopupDeferred.promise.then).toHaveBeenCalled();
            reject(new Error());

            return sut._displayedPopupDeferred.promise.then(
                () => fail('Unwanted code branch'),
                () => {
                    expect(sut._displayedPopupDeferred.promise).toBeNull();
                    expect(sut._displayedPopupDeferred.resolve).toEqual(jasmine.any(Function));
                    expect(sut._displayedPopupDeferred.resolve).not.toBe(resolve);
                    expect(sut._displayedPopupDeferred.reject).toEqual(jasmine.any(Function));
                    expect(sut._displayedPopupDeferred.reject).not.toBe(reject);
                    expect(sut._displayedPopupData).toBeNull();
                });
        });

        it('should display next popup', () => {
            let popup = {
                type: 'info',
                data: {message: 'Hello'},
                timeout: 0,
                deferred: {
                    promise: jasmine.createSpy(),
                    reject: jasmine.createSpy(),
                    resolve: jasmine.createSpy(),
                },
            };
            sut._popups.push(popup);
            spyOn(mockedEas, 'publish');
            spyOn(window, 'setTimeout');

            sut._displayNext();

            expect(window.setTimeout).not.toHaveBeenCalled();
            expect(sut._popups).toEqual([]);
            expect(mockedEas.publish).toHaveBeenCalledWith('aot:popup:display', {
                type: 'info',
                data: {
                    message: 'Hello',
                    meta: {
                        timeout: 0,
                    },
                },
                deferred: popup.deferred,
            });
            expect(sut._displayedPopupDeferred.promise).toBe(popup.deferred.promise);
            expect(sut._displayedPopupDeferred.resolve).toBe(popup.deferred.resolve);
            expect(sut._displayedPopupDeferred.reject).toBe(popup.deferred.reject);
        });

        it('should setup timeout if a timeout is specified', () => {
            let popup = {
                type: 'info',
                data: {message: 'Hello'},
                timeout: 20,
                deferred: {
                    promise: new Promise(() => {}),
                    reject: jasmine.createSpy(),
                    resolve: jasmine.createSpy(),
                },
            };
            sut._popups.push(popup);
            spyOn(mockedEas, 'publish');
            spyOn(window, 'setTimeout');
            spyOn(popup.deferred.promise, 'then');

            sut._displayNext();

            expect(window.setTimeout).toHaveBeenCalledWith(jasmine.any(Function), 20);
            expect(popup.deferred.promise.then)
                .toHaveBeenCalledWith(jasmine.any(Function), jasmine.any(Function));
            expect(sut._popups).toEqual([]);
            expect(mockedEas.publish).toHaveBeenCalledWith('aot:popup:display', {
                type: 'info',
                data: {
                    message: 'Hello',
                    meta: {
                        timeout: 20,
                    },
                },
                deferred: popup.deferred,
            });
        });
    });

    describe('_translatePopup', () => {
        it('should not do anything if there is no popup', () => {
            spyOn(sut, '_translateObj');

            sut._translatePopup();

            expect(sut._translateObj).not.toHaveBeenCalled();
        });

        it('should not do anything if there is nothing to translate', () => {
            sut._displayedPopupData = {};
            spyOn(sut, '_translateObj');

            sut._translatePopup();

            expect(sut._translateObj).not.toHaveBeenCalled();
        });

        it('should not do anything if there is no messages to translate', () => {
            sut._displayedPopupData = {
                translate: {
                },
            };
            spyOn(sut, '_translateObj');

            sut._translatePopup();

            expect(sut._translateObj).not.toHaveBeenCalled();
        });

        it('should translate', () => {
            sut._displayedPopupData = {
                translate: {
                    messages: {
                        toto: 'hello',
                    },
                    params: {
                        p1: 'world',
                    },
                    paramsToTranslate: {
                        pt1: 'test',
                    },
                },
            };
            spyOn(sut, '_translateObj');

            sut._translatePopup();

            expect(sut._translateObj).toHaveBeenCalledWith(
                { p1: 'world' },
                { pt1: 'test' }
            );
            // Since _translateObj is mocked, the params cannot contain pt1
            expect(sut._translateObj).toHaveBeenCalledWith(
                sut._displayedPopupData,
                sut._displayedPopupData.translate.messages,
                { p1: 'world' }
            );
        });
    });
});
