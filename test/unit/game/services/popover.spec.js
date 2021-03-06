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

import { Popover } from "../../../../app/game/services/popover";
import { EventAggregatorSubscriptionsStub } from "../../../../app/test-utils";

describe("Popover service", () => {
    let mockedEas;
    let sut;

    beforeEach(() => {
        mockedEas = new EventAggregatorSubscriptionsStub();
        sut = new Popover(mockedEas);
    });

    it("should initialize correctly", () => {
        expect(sut.type).toBeNull();
        expect(sut._popovers).toEqual([]);
        expect(sut._displayed).toBe(false);
    });

    describe("display", () => {
        it("should prepare the popover to be displayed", () => {
            jest.spyOn(sut._popoverReadyDeferred.promise, "then");
            let type = "info";
            let text = "Hello";

            let ret = sut.display(type, text);

            expect(sut._popovers.length).toBe(1);
            let popover = sut._popovers[0];
            expect(popover.deferred.promise).toEqual(expect.any(Promise));
            expect(popover.type).toBe(type);
            expect(popover.text).toBe(text);
            expect(sut._popoverReadyDeferred.promise.then).toHaveBeenCalled();
            expect(ret).toEqual(expect.any(Function));
        });

        it("should call _displayNext once popups are ready", async () => {
            jest.spyOn(sut, "_displayNext");
            let type = "info";
            let text = "Hello";

            sut.display(type, text);

            sut._popoverReadyDeferred.resolve();
            await sut._popoverReadyDeferred.promise;
            expect(sut._displayNext).toHaveBeenCalled();
        });
    });

    describe("_displayNext", () => {
        it("should do nothing if no popups", () => {
            jest.spyOn(mockedEas, "publish");

            sut._displayNext();

            expect(mockedEas.publish).not.toHaveBeenCalled();
        });

        it("should clean displayed deferred on hide", () => {
            jest.spyOn(sut, "_displayNext");

            mockedEas.publish("aot:popover:hidden");

            expect(sut._displayNext).toHaveBeenCalled();
            expect(sut._displayed).toBe(false);
        });

        it("should display next popup", () => {
            let popover = {
                type: "danger",
                text: "Hello",
                deferred: {
                    promise: jest.fn(),
                    reject: jest.fn(),
                    resolve: jest.fn(),
                },
            };
            sut._popovers.push(popover);
            jest.spyOn(mockedEas, "publish");

            sut._displayNext();

            expect(sut._popovers).toEqual([]);
            expect(mockedEas.publish).toHaveBeenCalledWith("aot:popover:display", {
                type: "danger",
                text: "Hello",
                deferred: popover.deferred,
            });
            expect(sut._displayed).toBe(true);
        });
    });
});
