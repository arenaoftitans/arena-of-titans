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

import { Popup } from "../../../../app/game/services/popup";
import { EventAggregatorSubscriptionsStub, I18nStub } from "../../../../app/test-utils";

describe("Popups service", () => {
    let mockedI18n;
    let mockedEas;
    let sut;

    beforeEach(() => {
        mockedI18n = new I18nStub();
        mockedEas = new EventAggregatorSubscriptionsStub();
        sut = new Popup(mockedI18n, mockedEas);
    });

    it("should initialize correctly", () => {
        expect(sut._popups).toEqual([]);
        expect(sut._displayedPopupDeferred.promise).not.toBeNull();
        expect(sut._displayedPopupDeferred.pending).toBe(false);
        expect(sut._displayedPopupData).toBeNull();
        expect(sut._displayedPopupDeferred.reject).toEqual(expect.any(Function));
        expect(sut._displayedPopupDeferred.resolve).toEqual(expect.any(Function));
        expect(sut._popupReadyDeferred.promise).toEqual(expect.any(Promise));
        expect(sut._popupReadyDeferred.resolve).toEqual(expect.any(Function));
    });

    describe("display", () => {
        it("should prepare the popup to be displayed", () => {
            jest.spyOn(sut, "_closeAllWithoutTimeout");
            jest.spyOn(mockedEas, "publish");
            jest.spyOn(sut, "_displayNext");
            jest.spyOn(sut._popupReadyDeferred.promise, "then");
            let type = "info";
            let data = { message: "Hello" };

            let ret = sut.display(type, data);

            expect(sut._closeAllWithoutTimeout).not.toHaveBeenCalled();
            expect(mockedEas.publish).not.toHaveBeenCalled();
            expect(sut._displayNext).not.toHaveBeenCalled();
            expect(sut._popupReadyDeferred.promise.then).toHaveBeenCalledWith(expect.any(Function));
            expect(sut._popups.length).toBe(1);
            let popup = sut._popups[0];
            expect(popup.type).toBe(type);
            expect(popup.data).toBe(data);
            expect(popup.deferred).toBeDefined();
            expect(popup.timeout).toBe(0);

            expect(ret).toEqual(expect.any(Promise));
        });

        it("should call _displayNext once popups are ready", async () => {
            jest.spyOn(sut, "_displayNext");
            let type = "info";
            let data = { message: "Hello" };

            sut.display(type, data);

            sut._popupReadyDeferred.resolve();
            await sut._popupReadyDeferred.promise;
            await sut._displayedPopupDeferred.promise;
            expect(sut._displayNext).toHaveBeenCalled();
        });

        it("should close all popups when displaying a new transition popup", () => {
            jest.spyOn(sut, "_closeAllWithoutTimeout");
            let type = "transition";
            let data = { message: "Hello" };

            sut.display(type, data);

            expect(sut._closeAllWithoutTimeout).toHaveBeenCalled();
        });
    });

    describe("_closeAllWithoutTimeout", () => {
        it("should close displayed popup if it does not have a timeout", () => {
            jest.spyOn(sut._logger, "debug");
            jest.spyOn(sut._displayedPopupDeferred, "reject");
            sut._displayedPopupData = {
                meta: {},
            };

            sut._closeAllWithoutTimeout();

            expect(sut._logger.debug).toHaveBeenCalled();
            expect(sut._displayedPopupDeferred.reject).toHaveBeenCalledWith(expect.any(Error));
            expect(sut._displayedPopupData).toBeNull();
        });

        it("should leave displayed popup opened if it has a timeout", () => {
            jest.spyOn(sut._logger, "debug");
            jest.spyOn(sut._displayedPopupDeferred, "reject");
            sut._displayedPopupData = {
                meta: {
                    timeout: 20,
                },
            };

            sut._closeAllWithoutTimeout();

            expect(sut._logger.debug).toHaveBeenCalled();
            expect(sut._displayedPopupDeferred.reject).not.toHaveBeenCalled();
            expect(sut._displayedPopupData).not.toBeNull();
        });

        it("should purge the list of popups to display of popups without a timeout", () => {
            jest.spyOn(sut._logger, "debug");
            sut._popups.push({}, { timeout: 20 });

            sut._closeAllWithoutTimeout();

            expect(sut._logger.debug).toHaveBeenCalled();
            expect(sut._popups).toEqual([{ timeout: 20 }]);
        });
    });

    describe("_displayNext", () => {
        it("should do nothing if no popups", () => {
            jest.spyOn(mockedEas, "publish");

            sut._displayNext();

            expect(mockedEas.publish).not.toHaveBeenCalled();
        });

        it("should do nothing if currently displayed popup is still pending", () => {
            sut._displayedPopupDeferred.pending = true;
            jest.spyOn(mockedEas, "publish");

            sut._displayNext();

            expect(mockedEas.publish).not.toHaveBeenCalled();
        });

        it("should display next popup", () => {
            let popup = {
                type: "info",
                data: { message: "Hello" },
                timeout: 0,
                deferred: {
                    promise: { then: jest.fn() },
                    reject: jest.fn(),
                    resolve: jest.fn(),
                },
            };
            sut._popups.push(popup);
            jest.spyOn(mockedEas, "publish");
            jest.spyOn(window, "setTimeout");

            sut._displayNext();

            expect(window.setTimeout).not.toHaveBeenCalled();
            expect(sut._popups).toEqual([]);
            expect(mockedEas.publish).toHaveBeenCalledWith("aot:popup:display", {
                type: "info",
                data: {
                    message: "Hello",
                    meta: {
                        timeout: 0,
                    },
                },
                deferred: popup.deferred,
            });
            expect(sut._displayedPopupDeferred.promise).toBe(popup.deferred.promise);
            expect(sut._displayedPopupDeferred.resolve).toBe(popup.deferred.resolve);
            expect(sut._displayedPopupDeferred.reject).toBe(popup.deferred.reject);
        });

        it("should setup timeout if a timeout is specified", () => {
            jest.useFakeTimers();

            let popup = {
                type: "info",
                data: { message: "Hello" },
                timeout: 20,
                deferred: {
                    promise: new Promise(() => {}),
                    reject: jest.fn(),
                    resolve: jest.fn(),
                },
            };
            sut._popups.push(popup);
            jest.spyOn(mockedEas, "publish");
            jest.spyOn(popup.deferred.promise, "then");

            sut._displayNext();

            expect(setTimeout).toHaveBeenCalledWith(expect.any(Function), 20);
            expect(popup.deferred.promise.then).toHaveBeenCalledWith(
                expect.any(Function),
                expect.any(Function),
            );
            expect(sut._popups).toEqual([]);
            expect(mockedEas.publish).toHaveBeenCalledWith("aot:popup:display", {
                type: "info",
                data: {
                    message: "Hello",
                    meta: {
                        timeout: 20,
                    },
                },
                deferred: popup.deferred,
            });
        });
    });

    describe("_translatePopup", () => {
        it("should not do anything if there is no popup", () => {
            jest.spyOn(sut, "_translateObj");

            sut._translatePopup();

            expect(sut._translateObj).not.toHaveBeenCalled();
        });

        it("should not do anything if there is nothing to translate", () => {
            sut._displayedPopupData = {};
            jest.spyOn(sut, "_translateObj");

            sut._translatePopup();

            expect(sut._translateObj).not.toHaveBeenCalled();
        });

        it("should not do anything if there is no messages to translate", () => {
            sut._displayedPopupData = {
                translate: {},
            };
            jest.spyOn(sut, "_translateObj").mockImplementation(() => {});

            sut._translatePopup();

            expect(sut._translateObj).not.toHaveBeenCalled();
        });

        it("should translate", () => {
            sut._displayedPopupData = {
                translate: {
                    messages: {
                        toto: "hello",
                    },
                    params: {
                        p1: "world",
                    },
                    paramsToTranslate: {
                        pt1: "test",
                    },
                },
            };
            jest.spyOn(sut, "_translateObj").mockImplementation(() => {});

            sut._translatePopup();

            expect(sut._translateObj).toHaveBeenNthCalledWith(1, { p1: "world" }, { pt1: "test" });
            // Since _translateObj is mocked, the params cannot contain pt1
            expect(sut._translateObj).toHaveBeenNthCalledWith(
                2,
                sut._displayedPopupData,
                sut._displayedPopupData.translate.messages,
                { p1: "world" },
            );
        });
    });
});
