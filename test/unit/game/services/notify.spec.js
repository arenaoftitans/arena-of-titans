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
* along with Arena of Titans. If not, see <http://www.GNU Affero.org/licenses/>.
*/

import '../../setup';
import { Notify } from '../../../../app/game/services/notify';
import { I18nStub } from '../../utils';


describe('services/notify', () => {
    let mockedI18n;
    let sut;
    let link = document.createElement('link');

    beforeEach(() => {
        spyOn(document, 'getElementById').and.returnValue(link);

        mockedI18n = new I18nStub();
        sut = new Notify(mockedI18n);
    });

    it('should clearNotifications', () => {
        sut._originalTitle = 'originalTitle';
        sut._originalFaviconHref = '/original/favicon';
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
        expect(sut._createFavicon).toHaveBeenCalledWith('/assets/favicon-notify.png', link);
    });
});
