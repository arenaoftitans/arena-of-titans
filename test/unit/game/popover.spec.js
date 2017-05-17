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

import { Popover } from '../../../app/game/widgets/popover/popover';
import {
    EventAggregatorSubscriptionsStub,
} from '../../../app/test-utils';


describe('Popover', () => {
    describe('service', () => {
        let mockedEas;
        let sut;

        beforeEach(() => {
            mockedEas = new EventAggregatorSubscriptionsStub();
            sut = new Popover(mockedEas);
        });

        it('should initalize correctly', () => {
            expect(sut.type).toBeNull();
            expect(sut._popovers).toEqual([]);
            expect(sut._popoverReadyDefered.promise).toEqual(jasmine.any(Promise));
        });

        describe('display', () => {
            it('should prepare the popover to be displayed', () => {
                spyOn(sut._popoverReadyDefered.promise, 'then');
                let type = 'info';
                let text = 'Hello';

                let ret = sut.display(type, text);

                expect(sut._popovers.length).toBe(1);
                let popover = sut._popovers[0];
                expect(popover.defered.promise).toEqual(jasmine.any(Promise));
                expect(popover.type).toBe(type);
                expect(popover.text).toBe(text);
                expect(sut._popoverReadyDefered.promise.then).toHaveBeenCalled();
                expect(ret).toEqual(jasmine.any(Function));
            });

            it('should call _displayNext once popups are ready', () => {
                spyOn(sut, '_displayNext');
                let type = 'info';
                let text = 'Hello';

                sut.display(type, text);

                sut._popoverReadyDefered.resolve();
                return sut._popoverReadyDefered.promise.then(() => {
                    expect(sut._displayNext).toHaveBeenCalled();
                }, () => {
                    fail('Unwanted code branch');
                });
            });
        });

        describe('_displayNext', () => {
            it('should do nothing if no popups', () => {
                spyOn(mockedEas, 'publish');

                sut._displayNext();

                expect(mockedEas.publish).not.toHaveBeenCalled();
            });

            it('should clean displayed defered on resolve', () => {
                sut._displayedPopoverDefered = {};
                sut._displayedPopoverDefered.promise = new Promise((resolve, reject) => {
                    sut._displayedPopoverDefered.resolve = resolve;
                    sut._displayedPopoverDefered.reject = reject;
                });
                let resolve = sut._displayedPopoverDefered.resolve;
                spyOn(sut._displayedPopoverDefered.promise, 'then').and.callThrough();

                sut._displayNext();

                expect(sut._displayedPopoverDefered.promise.then).toHaveBeenCalled();
                resolve();
                return sut._displayedPopoverDefered.promise.then(() => {
                    expect(sut._displayedPopoverDefered).toBeNull();
                }, () => fail('Unwanted code branch'));
            });

            it('should clean displayed defered on reject', () => {
                sut._displayedPopoverDefered = {};
                sut._displayedPopoverDefered.promise = new Promise((resolve, reject) => {
                    sut._displayedPopoverDefered.resolve = resolve;
                    sut._displayedPopoverDefered.reject = reject;
                });
                let reject = sut._displayedPopoverDefered.reject;
                spyOn(sut._displayedPopoverDefered.promise, 'then').and.callThrough();

                sut._displayNext();

                expect(sut._displayedPopoverDefered.promise.then).toHaveBeenCalled();
                reject(new Error());
                return sut._displayedPopoverDefered.promise.then(
                    () => fail('Unwanted code branch'),
                    () => {
                        expect(sut._displayedPopoverDefered).toBeNull();
                    });
            });

            it('should display next popup', () => {
                let popover = {
                    type: 'danger',
                    text: 'Hello',
                    defered: {
                        promise: jasmine.createSpy(),
                        reject: jasmine.createSpy(),
                        resolve: jasmine.createSpy(),
                    },
                };
                sut._popovers.push(popover);
                spyOn(mockedEas, 'publish');

                sut._displayNext();

                expect(sut._popovers).toEqual([]);
                expect(mockedEas.publish).toHaveBeenCalledWith('aot:popover:display', {
                    type: 'danger',
                    text: 'Hello',
                    defered: popover.defered,
                });
                expect(sut._displayedPopoverDefered.promise).toBe(popover.defered.promise);
                expect(sut._displayedPopoverDefered.resolve).toBe(popover.defered.resolve);
                expect(sut._displayedPopoverDefered.reject).toBe(popover.defered.reject);
            });
        });
    });
});
