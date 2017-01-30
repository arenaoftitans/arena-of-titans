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

import { Game } from '../../../app/game/game';
import {
    ApiStub,
    RouterStub,
    HistoryStub,
    I18nStub,
    EventAggregatorSubscriptionsStub,
} from '../../../app/test-utils';


describe('the Game module', () => {
    let mockedHistory;
    let mockedI18n;
    let mockedApi;
    let mockedOptions;
    let mockedEas;
    let sut;

    beforeEach(() => {
        mockedHistory = new HistoryStub();
        mockedI18n = new I18nStub();
        mockedApi = new ApiStub();
        mockedOptions = {};
        mockedEas = new EventAggregatorSubscriptionsStub();
        sut = new Game(mockedHistory, mockedI18n, mockedApi, mockedOptions, mockedEas);
    });

    it('should init the history', () => {
        spyOn(mockedHistory, 'init');

        sut = new Game(mockedHistory, mockedI18n, mockedApi, mockedOptions, mockedEas);

        expect(mockedHistory.init).toHaveBeenCalled();
    });

    it('should dispose subscription on deactivate', () => {
        spyOn(mockedEas, 'dispose');

        sut.deactivate();

        expect(mockedEas.dispose).toHaveBeenCalled();
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

        it('should log and reject promise if we already have a popup', done => {
            sut.type = 'info';
            spyOn(sut._logger, 'error');

            sut.popup('test', {test: true}).then(() => {
                expect(true).toBe(false);
                done();
            }, error => {
                expect(sut._logger.error).toHaveBeenCalled();
                expect(error.message).toBe('We can display only a popup at a time');
                done();
            });
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
            spyOn(mockedEas, 'subscribe');

            sut.activate();

            expect(mockedEas.subscribe).toHaveBeenCalled();
            expect(mockedEas.subscribe.calls.argsFor(0)[0]).toBe('aot:api:error');
        });

        it('should display error popup on error', () => {
            let message = {message: 'error'};
            spyOn(sut, 'popup').and.returnValue(new Promise(resolve => {}));

            sut.activate();
            mockedEas.publish('aot:api:error', message);

            expect(sut.popup).toHaveBeenCalledWith('error', message);
        });
    });
});
