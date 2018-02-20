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

import { Notify } from '../../../../app/game/services/notify';
import {
    I18nStub,
    EventAggregatorSubscriptionsStub,
    SoundsStub,
} from '../../../../app/test-utils';


describe('services/notify', () => {
    let mockedI18n;
    let mockedEas;
    let mockedSounds;
    let sut;
    let link = document.createElement('link');

    beforeEach(() => {
        link.href = '/dist/asset/favicon.png';
        spyOn(document, 'getElementById').and.returnValue(link);

        mockedI18n = new I18nStub();
        mockedEas = new EventAggregatorSubscriptionsStub();
        mockedSounds = new SoundsStub();
        sut = new Notify(mockedI18n, mockedEas, mockedSounds);
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

    describe('should play sound', () => {
        beforeEach(() => {
            spyOn(mockedSounds, 'play');
        });

        it('should play your-turn-voice', () => {
            sut._playVoice();

            expect(mockedSounds.play).toHaveBeenCalledWith('your-turn-voice');
        });

        it('should play your-turn', () => {
            sut._playYourTurnSound();

            expect(mockedSounds.play).toHaveBeenCalledWith('your-turn');
        });

        it('should play game-over', () => {
            sut.notifyGameOver();

            expect(mockedSounds.play).toHaveBeenCalledWith('game-over');
        });
    });
});
