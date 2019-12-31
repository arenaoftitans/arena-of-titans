/*
 * Copyright (C) 2015-2018 by Arena of Titans Contributors.
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

import { EventAggregatorStub } from "../../../../app/test-utils";
import { Sounds } from "../../../../app/game/services/sounds";

describe("sounds service", () => {
    let mockedEa;
    let mockedOptions;
    let sut;

    beforeEach(() => {
        mockedEa = new EventAggregatorStub();
        mockedOptions = {};
        sut = new Sounds(mockedEa, mockedOptions);
    });

    describe("initialization", () => {
        it("should resolve deferred once sound element is ready", () => {
            jest.spyOn(sut._soundDeferred, "resolve");
            mockedEa.publish("aot:sound:ready");

            expect(sut._soundDeferred.resolve).toHaveBeenCalled();
        });
    });

    describe("sound ready", () => {
        beforeEach(() => {
            jest.spyOn(mockedEa, "publish");
            sut._soundDeferred.resolve();

            return sut._soundDeferred.promise;
        });

        it("should play sounds if sound is enabled", () => {
            mockedOptions.sound = true;

            return sut.play("a-sound").then(() => {
                expect(mockedEa.publish).toHaveBeenCalledWith("aot:sound:play", "a-sound");
            });
        });

        it("should not play sounds if sound is disabled", () => {
            mockedOptions.sound = false;

            return sut.play("a-sound").then(() => {
                expect(mockedEa.publish).not.toHaveBeenCalled();
            });
        });
    });
});
