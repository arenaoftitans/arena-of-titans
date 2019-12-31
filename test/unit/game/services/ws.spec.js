/*
 * Copyright (C) 2016 by Arena of Titans Contributors.
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

import { EventAggregatorStub, PopoverStub, WebsocketSub } from "../../../../app/test-utils";
import { Ws } from "../../../../app/game/services/ws";

describe("services/ws", () => {
    let mockedConfig;
    let mockedEa;
    let mockedPopover;
    let sut;

    beforeEach(() => {
        mockedConfig = {
            api: {
                host: "localhost",
                port: 9000,
                path: "/ws/unit",
            },
        };
        mockedEa = new EventAggregatorStub();
        mockedPopover = new PopoverStub();
        sut = new Ws(mockedConfig, mockedEa, mockedPopover, WebsocketSub);
    });

    it("should store messages to send after join game in proper array", () => {
        sut.send({ message: "coucou" });

        expect(sut._waitingGameJoined.length).toBe(1);
        expect(sut._waitingOpen.length).toBe(0);
    });

    it("should store messages to send directly after connection in proper array", () => {
        sut.send({ message: "coucou", rt: "INIT_GAME" });

        expect(sut._waitingGameJoined.length).toBe(0);
        expect(sut._waitingOpen.length).toBe(1);
    });

    it("should send deferred message", () => {
        sut._waitingGameJoined.push({ msg: "coucou" });
        sut._waitingGameJoined.push({ msg: "salut" });
        jest.spyOn(sut, "send").mockImplementation(() => {});

        sut.sendDeferred();

        let firstCallArgs = sut.send.mock.calls[0][0];
        expect(firstCallArgs).toEqual({ msg: "coucou" });
        let secondCallArgs = sut.send.mock.calls[1][0];
        expect(secondCallArgs).toEqual({ msg: "salut" });
        expect(sut._waitingGameJoined.length).toBe(0);
    });

    it("should send waiting open on open", () => {
        jest.spyOn(mockedEa, "publish").mockImplementation(() => {});
        jest.spyOn(sut, "_sendPending").mockImplementation(() => {});
        sut._waitingOpen.push({ msg: "coucou" });

        sut._ws.onopen();

        expect(sut._sendPending).toHaveBeenCalledWith([{ msg: "coucou" }]);
        expect(mockedEa.publish).not.toHaveBeenCalled();
    });

    it("should handle reconnect", () => {
        jest.spyOn(mockedEa, "publish").mockImplementation(() => {});
        jest.spyOn(sut, "_sendPending").mockImplementation(() => {});
        sut._waitingOpen.push({ msg: "coucou" });
        sut._mustReconnect = true;
        sut._closePopover = jest.fn();

        sut._ws.onopen();

        expect(sut._sendPending).toHaveBeenCalledWith([{ msg: "coucou" }]);
        expect(mockedEa.publish).toHaveBeenCalledWith("aot:ws:reconnected");
        expect(sut._mustReconnect).toBe(false);
        expect(sut._closePopover).toHaveBeenCalled();
    });

    it("should handle onclose", () => {
        jest.spyOn(mockedPopover, "display").mockImplementation(() => {});

        sut._ws.onclose();

        expect(sut._mustReconnect).toBe(true);
        expect(mockedPopover.display).toHaveBeenCalled();
    });
});
