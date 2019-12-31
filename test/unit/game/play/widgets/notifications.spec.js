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

import { AotNotificationsCustomElement } from "../../../../../app/game/play/widgets/notifications/notifications"; // eslint-disable-line
import {
    ApiStub,
    PopupStub,
    I18nStub,
    EventAggregatorSubscriptionsStub,
    OptionsStub,
} from "../../../../../app/test-utils";

describe("notifications", () => {
    let mockedApi;
    let mockedI18n;
    let mockedEas;
    let mockedOptions;
    let mockedPopup;
    let sut;

    beforeEach(() => {
        mockedApi = new ApiStub();
        mockedI18n = new I18nStub();
        mockedEas = new EventAggregatorSubscriptionsStub();
        mockedOptions = new OptionsStub();
        mockedPopup = new PopupStub();
        sut = new AotNotificationsCustomElement(
            mockedApi,
            mockedI18n,
            mockedOptions,
            mockedPopup,
            mockedEas,
        );
    });

    it("should update last action on player played", () => {
        jest.spyOn(mockedI18n, "tr").mockReturnValue("translated");
        let message = {
            player_index: 0,
            last_action: {
                description: "played",
                card: {
                    name: "King",
                    color: "RED",
                    description: "A card",
                },
                player_name: "Player 1",
            },
        };
        let imgMatcher = /\/dist\/assets\/game\/cards\/movement\/king-red-.*\.png/;

        mockedEas.publish("aot:api:player_played", message);

        expect(mockedI18n.tr).toHaveBeenCalledWith("actions.played", {
            playerName: "Player 1",
            targetName: undefined,
        });
        expect(sut.lastAction.description).toBe("translated");
        expect(sut.lastAction.card).toEqual(message.last_action.card);
        expect(sut.lastAction.img).toMatch(imgMatcher);
    });

    it("should update last action when a trump is played", () => {
        jest.spyOn(mockedI18n, "tr").mockReturnValue("translated");
        let message = {
            last_action: {
                description: "played_trump",
                trump: {
                    name: "Tower",
                    color: "Blue",
                    description: "Block player.",
                },
                player_name: "Player 1",
                target_name: "Player 2",
            },
        };
        let imgMatcher = /\/dist\/assets\/game\/cards\/trumps\/tower-blue-.*\.png/;

        mockedEas.publish("aot:api:play_trump", message);

        expect(mockedI18n.tr).toHaveBeenCalledWith("actions.played_trump", {
            playerName: "Player 1",
            targetName: "Player 2",
        });
        expect(sut.lastAction.description).toBe("translated");
        expect(mockedI18n.tr).toHaveBeenCalledWith("trumps.tower_blue_description");
        expect(sut.lastAction.trump.description).toBe("translated");
        expect(sut.lastAction.trump).toEqual(message.last_action.trump);
        expect(sut.lastAction.img).toMatch(imgMatcher);
    });

    it("should dispose subscriptions", () => {
        jest.spyOn(mockedEas, "dispose");

        sut.unbind();

        expect(mockedEas.dispose).toHaveBeenCalled();
    });

    describe("special action", () => {
        it("should notify special actions without popup", () => {
            sut.specialActionInProgress = false;
            jest.spyOn(sut, "_translateSpecialActionText");
            jest.spyOn(mockedOptions, "mustViewInGameHelp").mockReturnValue(false);
            jest.spyOn(mockedEas, "publish");
            jest.spyOn(mockedPopup, "display");

            sut._notifySpecialAction({ special_action_name: "action" });

            expect(sut.specialActionInProgress).toBe(true);
            expect(sut._specialActionName).toBe("action");
            expect(sut._translateSpecialActionText).toHaveBeenCalled();
            expect(mockedOptions.mustViewInGameHelp).toHaveBeenCalledWith("action");
            expect(mockedEas.publish).toHaveBeenCalledWith(
                "aot:notifications:special_action_in_game_help_seen",
            );
            expect(mockedPopup.display).not.toHaveBeenCalled();
        });

        it("should notify special actions with popup", async () => {
            sut.specialActionInProgress = false;
            jest.spyOn(sut, "_translateSpecialActionText");
            jest.spyOn(mockedOptions, "mustViewInGameHelp").mockReturnValue(true);
            jest.spyOn(mockedEas, "publish");
            let promise = new Promise(resolve => resolve());
            jest.spyOn(mockedPopup, "display").mockReturnValue(promise);

            sut._notifySpecialAction({ special_action_name: "action" });

            expect(sut.specialActionInProgress).toBe(true);
            expect(sut._specialActionName).toBe("action");
            expect(sut._translateSpecialActionText).toHaveBeenCalled();
            expect(mockedOptions.mustViewInGameHelp).toHaveBeenCalledWith("action");
            expect(mockedPopup.display).toHaveBeenCalled();
            await promise;
            expect(mockedEas.publish).toHaveBeenCalledWith(
                "aot:notifications:special_action_in_game_help_seen",
            );
        });

        it("should handle special action played message", () => {
            sut.specialActionInProgress = true;
            sut._specialActionName = "toto";
            jest.spyOn(sut, "_updateLastAction");

            sut._handleSpecialActionPlayed({ special_action_name: "action" });

            expect(sut.specialActionInProgress).toBe(false);
            expect(sut._specialActionName).toBe(undefined);
            expect(sut._updateLastAction).toHaveBeenCalledWith({ special_action_name: "action" });
        });
    });
});
