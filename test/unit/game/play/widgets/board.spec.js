/*
 * Copyright (C) 2015-2016 by Arena of Titans Contributors.
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

import { AotBoardCustomElement } from "../../../../../app/game/play/widgets/board/board";
import { StateStub } from "../../../../../app/test-utils";
import { ApiStub, EventAggregatorSubscriptionsStub } from "../../../../../app/test-utils";

describe("board", () => {
    let sut;
    let mockedApi;
    let mockedEas;
    let mockedState;

    beforeEach(() => {
        mockedApi = new ApiStub();
        mockedEas = new EventAggregatorSubscriptionsStub();
        mockedState = new StateStub();
        sut = new AotBoardCustomElement(mockedApi, mockedEas, mockedState);
    });

    it("should register callbacks", () => {
        jest.spyOn(mockedEas, "subscribe");

        sut = new AotBoardCustomElement(mockedApi, mockedEas);

        expect(mockedEas.subscribe).toHaveBeenCalled();
        expect(mockedEas.subscribe.mock.calls[0][0]).toBe("aot:api:view_possible_squares");
        expect(mockedEas.subscribe.mock.calls[1][0]).toBe("aot:api:player_played");
        expect(mockedEas.subscribe.mock.calls[2][0]).toBe("aot:api:play_card");
        expect(mockedEas.subscribe.mock.calls[3][0]).toBe("aot:api:play_trump");
        expect(mockedEas.subscribe.mock.calls[4][0]).toBe(
            "aot:api:special_action_view_possible_actions",
        );
    });

    it("should dispose of subscriptions", () => {
        jest.spyOn(mockedEas, "dispose");

        sut.unbind();

        expect(mockedEas.dispose).toHaveBeenCalled();
    });

    it("should highlight possible squares", () => {
        sut._highlightPossibleSquares([
            { x: 0, y: 0 },
            { x: 7, y: 5 },
        ]);

        expect(sut.possibleSquares).toEqual(["square-0-0", "square-7-5"]);
    });

    it("should reset possible squares", () => {
        sut.possibleSquares = ["square-0-0"];

        sut._resetPossibleSquares();

        expect(sut.possibleSquares).toEqual([]);
    });

    it("should move to on possible square", () => {
        jest.spyOn(mockedApi, "play");
        sut.possibleSquares = ["square-0-0"];
        sut.selectedCard = { name: "King", color: "red" };

        sut.handleSquareClicked("square-0-0", 0, 0, { isArrivalSquare: false });

        expect(mockedApi.play).toHaveBeenCalledWith({
            cardName: "King",
            cardColor: "red",
            x: 0,
            y: 0,
        });
        expect(sut.possibleSquares.length).toBe(0);
        expect(sut.selectedCard).toBe(null);
    });

    it("should only move on possible square", () => {
        jest.spyOn(mockedApi, "play");
        sut.possibleSquares = ["square-0-0"];
        sut.selectedCard = { name: "King", color: "red" };

        sut.handleSquareClicked("square-1-0", 0, 0, { isArrivalSquare: false });

        expect(mockedApi.play).not.toHaveBeenCalled();
    });

    it("should not move if no possible squares", () => {
        jest.spyOn(mockedApi, "play");
        sut.selectedCard = { name: "King", color: "red" };

        sut.handleSquareClicked("square-1-0", 0, 0, { isArrivalSquare: false });

        expect(mockedApi.play).not.toHaveBeenCalled();
    });

    it("should not move if no selected card", () => {
        jest.spyOn(mockedApi, "play");
        sut.possibleSquares = ["square-0-0"];
        sut.selectedCard = null;

        sut.handleSquareClicked("square-0-0", 0, 0, { isArrivalSquare: false });

        expect(mockedApi.play).not.toHaveBeenCalled();
    });

    it("should reset possible squares", () => {
        sut.possibleSquares = ["square-0-0"];
        sut._resetPossibleSquares();

        expect(sut.possibleSquares.length).toBe(0);
    });

    describe("pawn clicked", () => {
        it("should not do anything if pawnClickabel is false", () => {
            sut.onPawnClicked = jest.fn();

            sut.pawnClicked();

            expect(sut.onPawnClicked).not.toHaveBeenCalled();
        });

        it("should not do anything if index is excluded from clickable list", () => {
            sut.onPawnClicked = jest.fn();
            sut.pawnClickable = true;
            sut.pawnsForcedNotClickable = [0];

            sut.pawnClicked(0);

            expect(sut.onPawnClicked).not.toHaveBeenCalled();
        });

        it("should call cb if pawnClickabel is true", () => {
            sut.onPawnClicked = jest.fn();
            sut.pawnClickable = true;

            sut.pawnClicked(0);

            expect(sut.onPawnClicked).toHaveBeenCalledWith(0);
        });

        it("should move to if possible squares and pawn", () => {
            jest.spyOn(mockedApi, "playSpecialAction");
            sut.possibleSquares = ["square-0-0"];
            sut._selectedPawnIndex = 0;
            sut._actionName = "action";
            sut.onPawnSquareClicked = () => {};
            sut.onPawnSquareClicked = jest.fn();

            sut.handleSquareClicked("square-0-0", 0, 0, { isArrivalSquare: false });

            expect(sut.onPawnSquareClicked).toHaveBeenCalledWith("square-0-0", 0, 0, 0);
            expect(sut.possibleSquares).toEqual([]);
            expect(sut._selectedPawnIndex).toBe(-1);
        });
    });
});
