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

import { AotCounterCustomElement } from "../../../../../app/game/play/widgets/counter/counter";
import {
    ApiStub,
    EventAggregatorSubscriptionsStub,
    StateStub,
} from "../../../../../app/test-utils";

describe("counter", () => {
    let mockedApi;
    let mockedEas;
    let mockedState;
    let sut;

    beforeEach(() => {
        mockedApi = new ApiStub();
        mockedEas = new EventAggregatorSubscriptionsStub();
        mockedState = new StateStub();
        sut = new AotCounterCustomElement(mockedApi, mockedEas, mockedState);
    });

    it("should init on your turn", () => {
        jest.spyOn(sut, "countDownClock");
        sut.counterCanvas = document.createElement("div");

        mockedState.game.your_turn = true;
        mockedState.game.game_over = false;
        mockedEas.publish("aot:api:play_card");

        expect(sut.countDownClock).toHaveBeenCalled();
    });

    it("shouldn't start but reset when not your turn", () => {
        jest.useFakeTimers();
        jest.spyOn(sut, "start");

        sut.startTime = new Date().getTime();
        mockedState.game.your_turn = false;
        mockedState.game.game_over = false;
        mockedEas.publish("aot:api:play_card");

        jest.runAllTimers();

        expect(sut.start).not.toHaveBeenCalled();
        expect(clearInterval).toHaveBeenCalled();
        expect(sut.startTime).toBe(null);
    });

    it("should not start on game over", async () => {
        jest.spyOn(sut, "start");
        jest.spyOn(window, "clearInterval");

        mockedState.game.your_turn = true;
        mockedState.game.game_over = true;
        mockedApi.play();

        expect(sut.start).not.toHaveBeenCalled();
    });

    it("should handle playCard request while special action in progress", () => {
        sut.specialActionInProgress = true;
        sut._paused = true;
        jest.spyOn(sut, "init");

        sut._handlePlayRequest();

        expect(sut.specialActionInProgress).toBe(false);
        expect(sut._paused).toBe(false);
        expect(sut.init).not.toHaveBeenCalled();
    });

    it("should handle playCard request", () => {
        jest.spyOn(sut, "init");

        sut._handlePlayRequest();

        expect(sut.init).toHaveBeenCalledWith();
    });

    it("should handle special action notify", () => {
        jest.spyOn(sut, "startSpecialActionCounter");

        sut._handleSpecialActionNotify({ special_action_name: "action" });

        expect(sut.specialActionName).toBe("action");
        expect(sut._paused).toBe(true);
        expect(sut.specialActionInProgress).toBe(true);
        expect(sut.startSpecialActionCounter).not.toHaveBeenCalledWith();
    });

    it("should dispose subscriptions", () => {
        jest.spyOn(mockedEas, "dispose");

        sut.unbind();

        expect(mockedEas.dispose).toHaveBeenCalled();
    });
});
