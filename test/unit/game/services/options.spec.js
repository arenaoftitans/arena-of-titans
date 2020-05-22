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
 *
 */

import { Options, ASSASSIN_IN_GAME_HELP } from "../../../../app/game/services/options";
import { StorageStub } from "../../../../app/test-utils";
import { ObserverLocator } from "aurelia-framework";
import { TaskQueue } from "aurelia-task-queue";

describe("app/services/options", () => {
    let mockedStorage;
    let mockedObserver;
    let sut;

    beforeEach(() => {
        mockedStorage = new StorageStub();
        mockedObserver = new ObserverLocator(new TaskQueue());
        sut = new Options(mockedStorage, mockedObserver);
    });

    it("construct from empty storage", () => {
        jest.spyOn(mockedStorage, "loadOptions").mockReturnValue({});
        jest.spyOn(mockedObserver, "getObserver");

        sut = new Options(mockedStorage, mockedObserver);

        expect(mockedStorage.loadOptions).toHaveBeenCalled();
        expect(mockedObserver.getObserver).toHaveBeenCalledWith(sut, "sound");
    });

    it("construct from storage", () => {
        jest.spyOn(mockedStorage, "loadOptions").mockReturnValue({
            sound: false,
            test: 789,
        });
        jest.spyOn(mockedObserver, "getObserver");

        sut = new Options(mockedStorage, mockedObserver);

        expect(mockedStorage.loadOptions).toHaveBeenCalled();
        expect(sut.sound).toBe(false);
        expect(sut.test).toBe(789);
        expect(mockedObserver.getObserver).toHaveBeenCalledWith(sut, "sound");
        expect(mockedObserver.getObserver).toHaveBeenCalledWith(sut, "test");
    });

    it("should update the inGameHelpSeen array", () => {
        jest.spyOn(mockedStorage, "saveOptions");
        sut.inGameHelpSeen = [];

        sut.markInGameOptionSeen("assassination");

        expect(sut.inGameHelpSeen.length).toBe(1);
        expect(mockedStorage.saveOptions).toHaveBeenCalled();
    });

    it("should not readd it to the inGameHelpSeen array", () => {
        jest.spyOn(mockedStorage, "saveOptions");
        sut.inGameHelpSeen = [ASSASSIN_IN_GAME_HELP];

        sut.markInGameOptionSeen("assassination");

        expect(sut.inGameHelpSeen.length).toBe(1);
        expect(mockedStorage.saveOptions).not.toHaveBeenCalled();
    });

    it("should not add undefined to the inGameHelpSeen array", () => {
        jest.spyOn(mockedStorage, "saveOptions");
        sut.inGameHelpSeen = [];

        sut.markInGameOptionSeen("wrong_action");

        expect(sut.inGameHelpSeen.length).toBe(0);
        expect(mockedStorage.saveOptions).not.toHaveBeenCalled();
    });

    it("should viewPossibleSquares in game help by default", () => {
        expect(sut.mustViewInGameHelp("assassination")).toBe(true);
    });

    it("should not viewPossibleSquares in game help if disabled", () => {
        sut.proposeInGameHelp = false;

        expect(sut.mustViewInGameHelp("assassination")).toBe(false);
    });

    it("should not viewPossibleSquares in game help if already seen", () => {
        sut.inGameHelpSeen = [ASSASSIN_IN_GAME_HELP];

        expect(sut.mustViewInGameHelp("assassination")).toBe(false);
    });
});
