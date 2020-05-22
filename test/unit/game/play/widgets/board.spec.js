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

import { AotBoardCustomElement } from "../../../../../app/game/play/widgets/board/board";
import { createStore, gameUpdatedYourTurn, playerUpdatedYourTurn } from "../../../fixtures";

describe("board", () => {
    let mockedStore;
    let mockedAddClass;
    let mockedRemoveClass;
    let sut;

    beforeEach(async () => {
        mockedStore = createStore();
        mockedStore.registerAction("updatePlayers", (state, players) => {
            const newState = { ...state };
            newState.game = { ...newState.game };
            newState.game.players = players;
            return newState;
        });
        sut = new AotBoardCustomElement(mockedStore);
        mockedAddClass = jest.fn();
        mockedRemoveClass = jest.fn();

        sut.pawnLayer = {
            querySelector: jest.fn(() => ({
                classList: {
                    add: mockedAddClass,
                    remove: mockedRemoveClass,
                },
            })),
        };

        await mockedStore.dispatch("gameUpdated", gameUpdatedYourTurn.request);
        await mockedStore.dispatch("playerUpdated", playerUpdatedYourTurn.request);

        sut.bind();
    });

    afterEach(() => {
        sut.unbind();
    });

    it("must show/hide player", async () => {
        await mockedStore.dispatch("updatePlayers", {
            "0": {
                activeTrumps: [],
                square: { x: 6, y: 7, color: "RED" },
                name: "Edwin",
                index: 0,
                hero: "Mirindrel",
                isVisible: true,
            },
            "1": {
                activeTrumps: [],
                square: { x: 5, y: 4, color: "BLACK" },
                name: "AI 1",
                index: 1,
                hero: "Luni",
                isVisible: false,
            },
        });

        expect(mockedAddClass).toHaveBeenNthCalledWith(1, "hidden");
        expect(mockedRemoveClass.mock.calls.length).toBe(0);

        await mockedStore.dispatch("updatePlayers", {
            "0": {
                activeTrumps: [],
                square: { x: 6, y: 7, color: "RED" },
                name: "Edwin",
                index: 0,
                hero: "Mirindrel",
                isVisible: true,
            },
            "1": {
                activeTrumps: [],
                square: { x: 5, y: 4, color: "BLACK" },
                name: "AI 1",
                index: 1,
                hero: "Luni",
                isVisible: true,
            },
        });

        expect(mockedAddClass).toHaveBeenNthCalledWith(1, "hidden");
        expect(mockedRemoveClass).toHaveBeenNthCalledWith(1, "hidden");
    });

    it("should not hide current player pawn", async () => {
        await mockedStore.dispatch("updatePlayers", {
            "0": {
                activeTrumps: [],
                square: { x: 6, y: 7, color: "RED" },
                name: "Edwin",
                index: 0,
                hero: "Mirindrel",
                isVisible: false,
            },
            "1": {
                activeTrumps: [],
                square: { x: 5, y: 4, color: "BLACK" },
                name: "AI 1",
                index: 1,
                hero: "Luni",
                isVisible: true,
            },
        });

        expect(mockedAddClass.mock.calls.length).toBe(0);
        expect(mockedRemoveClass.mock.calls.length).toBe(0);
    });
});
