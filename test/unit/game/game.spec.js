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

import '../setup';
import { Game } from '../../../app/game/game';
import { ApiStub, RouterStub, HistoryStub } from '../utils';


class Popup {
}


describe('the Game module', () => {
    let mockedApi;
    let mockedHistory;
    let sut;

    beforeEach(() => {
        mockedApi = new ApiStub();
        mockedHistory = new HistoryStub();
        sut = new Game(mockedApi, mockedHistory);
    });

    it('should init the history', () => {
        spyOn(mockedHistory, 'init');

        sut = new Game(mockedApi, mockedHistory);

        expect(mockedHistory.init).toHaveBeenCalled();
    });

    describe('popups', () => {
        it('creates a popup', () => {
            sut.popup('test', {test: true});
            expect(sut.type).toBe('test');
            expect(sut.data.test).toBe(true);
        });

        it('close the popup on resolve', done => {
            sut.popup('test', {test: true}).then(data => {
                expect(data.test).toBe(true);
                expect(sut.type).toBe(null);
                expect(sut.data).toBe(null);
                done();
            });

            sut.popupDefered.resolve({test: true});
        });
    });

    describe('router', () => {
        let mockedRouter;

        beforeEach(() => {
            mockedRouter = new RouterStub();
            sut.configureRouter(mockedRouter, mockedRouter);
        });

        it('should have a baseUrl', () => {
            expect(mockedRouter.baseUrl).toBe('game');
        });

        it('should be configured as pushState', () => {
            expect(mockedRouter.options.pushState).toBe(true);
        });
    });

    describe('errors', () => {
        it('should register error callback', () => {
            spyOn(mockedApi, 'onerror');

            sut.activate();

            expect(mockedApi.onerror).toHaveBeenCalled();
        });

        it('should display error popup on error', () => {
            let message = {message: 'error'};
            spyOn(sut, 'popup').and.returnValue(new Promise(resolve => {}));

            sut.activate();
            mockedApi._errorCbs.forEach(cb => {
                cb(message);
            });

            expect(sut.popup).toHaveBeenCalledWith('error', message);
        });
    });
});
