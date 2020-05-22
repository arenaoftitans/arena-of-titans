/*
 * Copyright (C) 2015-2020 by Last Run Contributors.
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

import { AotSoundCustomElement } from "../../../../app/game/widgets/sound/sound";
import { EventAggregatorStub } from "../../../../app/test-utils";

describe("sound", () => {
    let mockedEa;
    let mockedAudio;
    let sut;

    beforeEach(() => {
        mockedEa = new EventAggregatorStub();
        mockedAudio = {
            play: jest.fn(),
            addEventListener: jest.fn(),
        };
        sut = new AotSoundCustomElement(mockedEa);
        sut.audio = mockedAudio;
        sut.sound = "a-sound";
    });

    describe("ended", () => {
        it("should add event listeners on bind", () => {
            sut.bind();

            expect(mockedAudio.addEventListener).toHaveBeenCalledWith(
                "ended",
                expect.any(Function),
            );
        });

        it("should register proper callback on ended event", () => {
            jest.spyOn(mockedEa, "publish");
            sut.bind();

            const callback = mockedAudio.addEventListener.mock.calls.slice(-1)[0][1];
            callback();

            expect(mockedEa.publish).toHaveBeenCalledWith("aot:sound:ended", "a-sound");
        });
    });

    describe("playCard sound", () => {
        it("should playCard on bind", () => {
            sut.bind();

            expect(mockedAudio.play).toHaveBeenCalled();
        });

        it("should handle exceptions", () => {
            mockedAudio.play.mockImplementation(() => {
                throw new Error("cannot play_card");
            });
            jest.spyOn(console, "warn").mockImplementation(() => {});

            sut.bind();

            /* eslint-disable no-console */
            expect(console.warn.mock.calls.length).toBe(2);
            /* eslint-enable */
        });
    });
});
