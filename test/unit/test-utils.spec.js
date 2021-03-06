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

import { EventAggregatorStub, EventAggregatorSubscriptionsStub } from "../../app/test-utils";

describe("test-utils", () => {
    describe("EventAggregatorStub", () => {
        let sut;

        beforeEach(() => {
            sut = new EventAggregatorStub();
        });

        it("should register callbacks", () => {
            let signal = "signal";
            let fn = () => {};

            sut.subscribe(signal, fn);

            expect(Object.keys(sut.cbs)).toEqual([signal]);
            expect(sut.cbs[signal].length).toBe(1);
            expect(sut.cbs[signal][0]).toBe(fn);
        });

        it("should not fail on publish if no cb registered", () => {
            sut.publish("signal");
        });

        it("should call callbacks on publish", () => {
            let fn = jest.fn();
            sut.cbs.signal = [fn];

            sut.publish("signal", "message");

            expect(fn).toHaveBeenCalledWith("message");
        });
    });

    describe("EventAggregatorSubscriptionsStub", () => {
        let sut;

        beforeEach(() => {
            sut = new EventAggregatorSubscriptionsStub();
        });

        it("should subscribe multiple", () => {
            let fn = () => {};
            let signals = ["signal1", "signal2"];
            jest.spyOn(sut, "subscribe");

            sut.subscribeMultiple(signals, fn);

            expect(sut.subscribe).toHaveBeenCalledWith("signal1", fn);
            expect(sut.subscribe).toHaveBeenCalledWith("signal2", fn);
        });
    });
});
