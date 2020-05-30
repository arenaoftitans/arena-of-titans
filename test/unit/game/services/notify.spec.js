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

import { Notify } from "../../../../app/game/services/notify";
import { I18nStub, EventAggregatorSubscriptionsStub, SoundsStub } from "../../../../app/test-utils";

describe("services/notify", () => {
    let mockedI18n;
    let mockedEas;
    let mockedSounds;
    let sut;
    let link = document.createElement("link");

    beforeEach(() => {
        link.href = "/dist/asset/favicon.png";
        jest.spyOn(document, "getElementById").mockReturnValue(link);

        mockedI18n = new I18nStub();
        mockedEas = new EventAggregatorSubscriptionsStub();
        mockedSounds = new SoundsStub();
        sut = new Notify(mockedI18n, mockedEas, mockedSounds);
    });

    it("should clearNotifications", () => {
        sut._originalTitle = "originalTitle";
        sut._originalFaviconHref = "/original/favicon.png";
        expect(document.title).not.toBe(sut._originalTitle);
        jest.spyOn(sut, "_createFavicon").mockImplementation(() => {});

        sut.clearNotifications();

        expect(document.title).toBe(sut._originalTitle);
        expect(sut._createFavicon).toHaveBeenCalledWith(sut._originalFaviconHref);
    });

    it("should swap favicon", () => {
        jest.spyOn(sut, "_createFavicon").mockImplementation(() => {});

        sut._swapFavicon();

        expect(document.getElementById).toHaveBeenCalledWith("favicon");
        expect(sut._createFavicon).toHaveBeenCalledWith("test-file-stub", link);
    });

    describe("should playCard sound", () => {
        beforeEach(() => {
            jest.spyOn(mockedSounds, "play");
        });

        it("should playCard your-turn-voice", () => {
            sut._playVoice();

            expect(mockedSounds.play).toHaveBeenCalledWith("your-turn-voice");
        });

        it("should playCard your-turn", () => {
            sut._playYourTurnSound();

            expect(mockedSounds.play).toHaveBeenCalledWith("your-turn");
        });
    });
});
