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

import { AotTrumpCustomElement } from "../../../../../app/game/play/widgets/trump/trump";
import {
    ApiStub,
    EventAggregatorSubscriptionsStub,
    PopupStub,
    I18nStub,
    StateStub,
} from "../../../../../app/test-utils";

describe("trump", () => {
    let sut;
    let mockedI18n;
    let mockedApi;
    let mockedPopup;
    let element;
    let mockedEas;
    let mockedState;

    beforeEach(() => {
        mockedApi = new ApiStub();
        mockedPopup = new PopupStub();
        mockedI18n = new I18nStub();
        mockedEas = new EventAggregatorSubscriptionsStub();
        mockedState = new StateStub();
        sut = new AotTrumpCustomElement(
            mockedApi,
            mockedPopup,
            mockedI18n,
            element,
            mockedEas,
            mockedState,
        );
        sut.kind = "player";
    });

    it("should play trump with a target after a popup", async () => {
        let deferred = {};
        deferred.promise = new Promise(resolve => {
            deferred.resolve = resolve;
        });
        jest.spyOn(mockedPopup, "display").mockReturnValue(deferred.promise);
        jest.spyOn(mockedEas, "publish");
        mockedState._game = {
            players: {
                names: ["Player 1", null, "Player 2"],
                indexes: [0, null, 2],
            },
            trump_target_indexes: [0, 2],
            your_turn: true,
        };
        mockedState._me = {
            index: 0,
        };
        sut.trump = { name: "Trump", color: null, must_target_player: true };
        sut.canBePlayed = true;

        sut.play();

        expect(mockedPopup.display).toHaveBeenCalledWith("confirm", {
            choices: [
                {
                    name: "Player 2",
                    index: 2,
                },
            ],
            translate: {
                messages: {
                    title: "trumps.trump",
                    description: "trumps.trump_description",
                    message: "game.play.select_trump_target",
                },
                paramsToTranslate: {
                    trumpname: "trumps.trump",
                },
            },
            selectedChoice: {
                name: "Player 2",
                index: 2,
            },
        });
        deferred.resolve({
            name: "Player 2",
            index: 2,
        });
        await deferred.promise;
        expect(mockedEas.publish).toHaveBeenCalledWith("aot:trump:wish_to_play", {
            trumpName: "Trump",
            trumpColor: null,
            targetIndex: 2,
        });
    });

    it("should play trump without a target directly", () => {
        jest.spyOn(mockedPopup, "display");
        jest.spyOn(mockedEas, "publish");
        mockedState._game = {
            your_turn: true,
            trump_target_indexes: [],
        };
        sut.trump = { name: "Trump", color: null, must_target_player: false };
        sut.canBePlayed = true;

        sut.play();

        expect(mockedPopup.display).not.toHaveBeenCalled();
        expect(mockedEas.publish).toHaveBeenCalledWith("aot:trump:wish_to_play", {
            trumpName: "Trump",
            trumpColor: null,
        });
    });

    it("should not play a trump if not your turn", () => {
        jest.spyOn(mockedEas, "publish");
        mockedApi._game = {
            your_turn: false,
        };

        sut.play({ name: "Trump" });

        expect(mockedEas.publish).not.toHaveBeenCalled();
    });

    it("should dispose subscriptions", () => {
        jest.spyOn(mockedEas, "dispose");

        sut.unbind();

        expect(mockedEas.dispose).toHaveBeenCalled();
    });

    it("should not play trump if kind is different than player", () => {
        jest.spyOn(mockedApi, "playTrump");
        jest.spyOn(mockedPopup, "display");
        sut.kind = "affecting";

        sut.play();

        expect(mockedApi.playTrump).not.toHaveBeenCalled();
        expect(mockedPopup.display).not.toHaveBeenCalled();
    });

    describe("should get the correct list of targets", () => {
        it("for player 0", () => {
            mockedState._game = {
                players: {
                    indexes: [0, 1, null, 3, undefined, 5, null, null, null],
                    names: ["P0", "P1", null, "P3", undefined, "P5", null, null, null],
                },
                trump_target_indexes: [0, 1, 3, 5],
            };
            mockedState._me = {
                index: 0,
            };

            let otherPlayers = sut._getOtherPlayerNames();

            expect(otherPlayers.length).toBe(3);
            let expectedIndexes = [1, 3, 5];
            for (let i = 0; i < otherPlayers.length; i++) {
                let player = otherPlayers[i];
                let index = expectedIndexes[i];
                expect(player.index).toBe(index);
                expect(player.name).toBe(`P${index}`);
            }
        });

        it("for other player", () => {
            mockedState._game = {
                players: {
                    indexes: [0, 1, null, 3, undefined, 5, null, null, null],
                    names: ["P0", "P1", null, "P3", undefined, "P5", null, null, null],
                },
                trump_target_indexes: [0, 1, 3, 5],
            };
            mockedState._me = {
                index: 1,
            };

            let otherPlayers = sut._getOtherPlayerNames();

            expect(otherPlayers.length).toBe(3);
            let expectedIndexes = [0, 3, 5];
            for (let i = 0; i < otherPlayers.length; i++) {
                let player = otherPlayers[i];
                let index = expectedIndexes[i];
                expect(player.index).toBe(index);
                expect(player.name).toBe(`P${index}`);
            }
        });
    });
});
