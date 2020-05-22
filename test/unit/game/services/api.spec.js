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

import { Container } from "aurelia-framework";
import {
    AnimationsStub,
    ErrorsReporterStub,
    EventAggregatorStub,
    StorageStub,
    WsStub,
} from "../../../../app/test-utils";
import { createStore, gameUpdatedNotYourTurn, playerUpdatedNotYourTurn } from "../../fixtures";
import { Api } from "../../../../app/game/services/api";

describe("api", () => {
    let mockedWs;
    let mockedStore;
    let mockedStorage;
    let mockedEventAggregator;
    let mockedAnimations;
    let mockedErrorsReporter;
    let sut;

    beforeEach(() => {
        mockedWs = new WsStub();
        mockedStore = createStore();
        mockedStorage = new StorageStub();
        mockedEventAggregator = new EventAggregatorStub();
        mockedAnimations = new AnimationsStub();
        mockedErrorsReporter = new ErrorsReporterStub();

        jest.spyOn(mockedAnimations, "enable");
        jest.spyOn(mockedErrorsReporter, "enable");
        jest.spyOn(mockedWs, "send");

        sut = new Api(
            mockedWs,
            mockedStore,
            mockedStorage,
            mockedEventAggregator,
            mockedAnimations,
            mockedErrorsReporter,
        );
        Container.instance.registerInstance(Api, sut);
    });

    it("should init upon construction", () => {
        expect(mockedAnimations.enable).toHaveBeenCalled();
        expect(mockedErrorsReporter.enable).toHaveBeenCalled();
    });

    it("should reconnect", () => {
        sut.reconnect({ gameId: "game-id", playerName: "Test player", hero: "Arline" });

        expect(mockedWs.send.mock.calls).toMatchSnapshot();
    });

    it("should create lobby", () => {
        sut.createLobby("Test player", "Arline");

        expect(mockedWs.send.mock.calls).toMatchSnapshot();
    });

    it("should update solt", () => {
        sut.updateSlot({ index: 1, state: "CLOSED" });

        expect(mockedWs.send.mock.calls).toMatchSnapshot();
    });

    it("joinGame", () => {
        sut.joinGame({ gameId: "game-id", playerName: "Test player 2", hero: "Arline" });

        expect(mockedWs.send.mock.calls).toMatchSnapshot();
    });

    it("should create game", async () => {
        sut.lobby = { slots: [] };

        sut.createGame();

        expect(mockedWs.send.mock.calls).toMatchSnapshot();
    });

    it("should view possible movements", () => {
        sut.viewPossibleMovements({ name: "King", color: "blue" });

        expect(mockedWs.send.mock.calls).toMatchSnapshot();
    });

    it("should view possible actions", () => {
        sut.viewPossibleActions("Assasination", 1);

        expect(mockedWs.send.mock.calls).toMatchSnapshot();
    });

    it("should play card", () => {
        sut.playCard({ name: "King", color: "red", x: 0, y: 0 });

        expect(mockedWs.send.mock.calls).toMatchSnapshot();
    });

    it("should play special action", () => {
        sut.playSpecialAction({ x: 0, y: 0, name: "Assassination", targetIndex: 0 });

        expect(mockedWs.send.mock.calls).toMatchSnapshot();
    });

    it("should pass special action", () => {
        sut.passSpecialAction("Assassination");

        expect(mockedWs.send.mock.calls).toMatchSnapshot();
    });

    it("should play trump", () => {
        sut.playTrump({ name: "Tower", color: "black", square: {} }, 1);

        expect(mockedWs.send.mock.calls).toMatchSnapshot();
    });

    it("should pass turn", () => {
        sut.passTurn();

        expect(mockedWs.send.mock.calls).toMatchSnapshot();
    });

    it("should discard car", () => {
        sut.discardCard({ name: "King", color: "Blue" });

        expect(mockedWs.send.mock.calls).toMatchSnapshot();
    });

    it("should handle message", done => {
        let state = {};
        const subscription = mockedStore.state.subscribe(storeState => {
            state = storeState;

            if (state.game && state.me) {
                expect(state).toMatchSnapshot();
                subscription.unsubscribe();
                done();
            }
        });

        sut.handleMessage(gameUpdatedNotYourTurn);
        sut.handleMessage(playerUpdatedNotYourTurn);
    });
});
