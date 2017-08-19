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

import { Popup } from '../../../app/game/widgets/popups/popup';
import {
    EventAggregatorSubscriptionsStub,
    I18nStub,
} from '../../../app/test-utils';


describe('Popups', () => {
    describe('service', () => {
        let mockedI18n;
        let mockedEas;
        let sut;

        beforeEach(() => {
            mockedI18n = new I18nStub();
            mockedEas = new EventAggregatorSubscriptionsStub();
            sut = new Popup(mockedI18n, mockedEas);
        });

        it('should initalize correctly', () => {
            expect(sut._popups).toEqual([]);
            expect(sut._displayedPopupDefered.promise).toBeNull();
            expect(sut._displayedPopupData).toBeNull();
            expect(sut._displayedPopupDefered.reject).toEqual(jasmine.any(Function));
            expect(sut._displayedPopupDefered.resolve).toEqual(jasmine.any(Function));
            expect(sut._popupReadyDefered.promise).toEqual(jasmine.any(Promise));
            expect(sut._popupReadyDefered.resolve).toEqual(jasmine.any(Function));
        });

        describe('display', () => {
            it('should prepare the popup to be displayed', () => {
                spyOn(sut, '_closeAll');
                spyOn(mockedEas, 'publish');
                spyOn(sut, '_displayNext');
                spyOn(sut._popupReadyDefered.promise, 'then');
                let type = 'info';
                let data = {message: 'Hello'};

                let ret = sut.display(type, data);

                expect(sut._closeAll).not.toHaveBeenCalled();
                expect(mockedEas.publish).not.toHaveBeenCalled();
                expect(sut._displayNext).not.toHaveBeenCalled();
                expect(sut._popupReadyDefered.promise.then)
                    .toHaveBeenCalledWith(jasmine.any(Function));
                expect(sut._popups.length).toBe(1);
                let popup = sut._popups[0];
                expect(popup.type).toBe(type);
                expect(popup.data).toBe(data);
                expect(popup.defered).toBeDefined();
                expect(popup.timeout).toBe(0);

                expect(ret).toEqual(jasmine.any(Promise));
            });

            it('should call _displayNext once popups are ready', () => {
                spyOn(sut, '_displayNext');
                let type = 'info';
                let data = {message: 'Hello'};

                sut.display(type, data);

                sut._popupReadyDefered.resolve();
                return sut._popupReadyDefered.promise.then(() => {
                    expect(sut._displayNext).toHaveBeenCalled();
                }, () => {
                    fail('Unwanted code branch');
                });
            });

            it('should close all popups when displaying a new transition popup', () => {
                spyOn(sut, '_closeAll');
                let type = 'transition';
                let data = {message: 'Hello'};

                sut.display(type, data);

                expect(sut._closeAll).toHaveBeenCalled();
            });
        });

        describe('_closeAll', () => {
            it('should close all popups', () => {
                spyOn(sut._logger, 'debug');
                spyOn(sut._displayedPopupDefered, 'reject');
                sut._displayedPopupData = {};
                sut._popups.push({});

                sut._closeAll();

                expect(sut._logger.debug).toHaveBeenCalled();
                expect(sut._popups).toEqual([]);
                expect(sut._displayedPopupDefered.reject).toHaveBeenCalledWith(jasmine.any(Error));
                expect(sut._displayedPopupData).toBeNull();
            });
        });

        describe('_displayNext', () => {
            it('should do nothing if no popups', () => {
                spyOn(mockedEas, 'publish');

                sut._displayNext();

                expect(mockedEas.publish).not.toHaveBeenCalled();
            });

            it('should clean displayed defered on resolve', () => {
                sut._displayedPopupDefered.promise = new Promise((resolve, reject) => {
                    sut._displayedPopupDefered.resolve = resolve;
                    sut._displayedPopupDefered.reject = reject;
                });
                let resolve = sut._displayedPopupDefered.resolve;
                let reject = sut._displayedPopupDefered.reject;
                sut._displayedPopupData = {};
                spyOn(sut._displayedPopupDefered.promise, 'then').and.callThrough();

                sut._displayNext();

                expect(sut._displayedPopupDefered.promise.then).toHaveBeenCalled();
                resolve();
                return sut._displayedPopupDefered.promise.then(() => {
                    expect(sut._displayedPopupDefered.promise).toBeNull();
                    expect(sut._displayedPopupDefered.resolve).toEqual(jasmine.any(Function));
                    expect(sut._displayedPopupDefered.resolve).not.toBe(resolve);
                    expect(sut._displayedPopupDefered.reject).toEqual(jasmine.any(Function));
                    expect(sut._displayedPopupDefered.reject).not.toBe(reject);
                    expect(sut._displayedPopupData).toBeNull();
                }, () => fail('Unwanted code branch'));
            });

            it('should clean displayed defered on reject', () => {
                sut._displayedPopupDefered.promise = new Promise((resolve, reject) => {
                    sut._displayedPopupDefered.resolve = resolve;
                    sut._displayedPopupDefered.reject = reject;
                });
                let resolve = sut._displayedPopupDefered.resolve;
                let reject = sut._displayedPopupDefered.reject;
                sut._displayedPopupData = {};
                spyOn(sut._displayedPopupDefered.promise, 'then').and.callThrough();

                sut._displayNext();

                expect(sut._displayedPopupDefered.promise.then).toHaveBeenCalled();
                reject(new Error());

                return sut._displayedPopupDefered.promise.then(
                    () => fail('Unwanted code branch'),
                    () => {
                        expect(sut._displayedPopupDefered.promise).toBeNull();
                        expect(sut._displayedPopupDefered.resolve).toEqual(jasmine.any(Function));
                        expect(sut._displayedPopupDefered.resolve).not.toBe(resolve);
                        expect(sut._displayedPopupDefered.reject).toEqual(jasmine.any(Function));
                        expect(sut._displayedPopupDefered.reject).not.toBe(reject);
                        expect(sut._displayedPopupData).toBeNull();
                    });
            });

            it('should display next popup', () => {
                let popup = {
                    type: 'info',
                    data: {message: 'Hello'},
                    timeout: 0,
                    defered: {
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
                    data: {message: 'Hello'},
                    defered: popup.defered,
                });
                expect(sut._displayedPopupDefered.promise).toBe(popup.defered.promise);
                expect(sut._displayedPopupDefered.resolve).toBe(popup.defered.resolve);
                expect(sut._displayedPopupDefered.reject).toBe(popup.defered.reject);
            });

            it('should setup timeout if a timeout is specified', () => {
                let popup = {
                    type: 'info',
                    data: {message: 'Hello'},
                    timeout: 20,
                    defered: {
                        promise: new Promise(() => {}),
                        reject: jasmine.createSpy(),
                        resolve: jasmine.createSpy(),
                    },
                };
                sut._popups.push(popup);
                spyOn(mockedEas, 'publish');
                spyOn(window, 'setTimeout');
                spyOn(popup.defered.promise, 'then');

                sut._displayNext();

                expect(window.setTimeout).toHaveBeenCalledWith(jasmine.any(Function), 20);
                expect(popup.defered.promise.then)
                    .toHaveBeenCalledWith(jasmine.any(Function), jasmine.any(Function));
                expect(sut._popups).toEqual([]);
                expect(mockedEas.publish).toHaveBeenCalledWith('aot:popup:display', {
                    type: 'info',
                    data: {message: 'Hello'},
                    defered: popup.defered,
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
});
