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

import { Wait } from '../../../../app/game/services/utils';
import { Notify } from '../../../../app/game/services/notify';
import { I18nStub, EventAggregatorSubscriptionsStub } from '../../../../app/test-utils';


describe('services/notify', () => {
    let mockedI18n;
    let mockedEas;
    let mockedOptions;
    let sut;
    let link = document.createElement('link');

    beforeEach(() => {
        link.href = '/dist/asset/favicon.png';
        spyOn(document, 'getElementById').and.returnValue(link);

        mockedI18n = new I18nStub();
        mockedEas = new EventAggregatorSubscriptionsStub();
        mockedOptions = {};
        sut = new Notify(mockedI18n, mockedEas, mockedOptions);
    });

    it('should clearNotifications', () => {
        sut._originalTitle = 'originalTitle';
        sut._originalFaviconHref = '/original/favicon.png';
        expect(document.title).not.toBe(sut._originalTitle);
        spyOn(sut, '_createFavicon');

        sut.clearNotifications();

        expect(document.title).toBe(sut._originalTitle);
        expect(sut._createFavicon).toHaveBeenCalledWith(sut._originalFaviconHref);
    });

    it('should swap favicon', () => {
        spyOn(sut, '_createFavicon');

        sut._swapFavicon();

        expect(document.getElementById).toHaveBeenCalledWith('favicon');
        expect(sut._createFavicon).toHaveBeenCalledWith(
            jasmine.stringMatching(/\/dist\/assets\/favicon-notify.*\.png/),
            link
        );
    });

    it('should not play sound if sounds are disabled', () => {
        mockedOptions.sound = false;
        spyOn(Wait, 'forId');

        sut._playYourTurnSound();
        sut._playVoice();
        sut.notifyGameOver();

        expect(Wait.forId).not.toHaveBeenCalled();
    });

    describe('should play sound if sounds are enabled', () => {
        let element;
        let promise;

        beforeEach(() => {
            mockedOptions.sound = true;
            element = {
                play: () => {},
            };
            spyOn(element, 'play');
            promise = new Promise(resolve => resolve(element));
            spyOn(Wait, 'forId').and.returnValue(promise);
        });

        it('voice', () => {
            return sut._playVoice().then(() => {
                expect(Wait.forId).toHaveBeenCalledWith('notify-voice-player');
                expect(element.play).toHaveBeenCalled();
            });
        });

        it('sound', () => {
            return sut._playYourTurnSound().then(() => {
                expect(Wait.forId).toHaveBeenCalledWith('notify-sound-player');
                expect(element.play).toHaveBeenCalled();
            });
        });

        it('game over', () => {
            return sut.notifyGameOver().then(() => {
                expect(Wait.forId).toHaveBeenCalledWith('notify-game-over-player');
                expect(element.play).toHaveBeenCalled();
            });
        });

        it('should catch error in play function', () => {
            element.play.and.throwError('cannot play');
            spyOn(console, 'warn');

            return sut.notifyGameOver().then(() => {
                /* eslint-disable no-console */
                expect(console.warn.calls.count()).toBe(2);
                /* eslint-enable */
            });
        });
    });
});
