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
    EventAggregatorSubscriptionsStub,
    PopupStub,
} from '../../../app/test-utils';


describe('the Game module', () => {
    let mockedHistory;
    let mockedApi;
    let mockedOptions;
    let mockedPopup;
    let mockedEas;
    let sut;

    beforeEach(() => {
        mockedHistory = new HistoryStub();
        mockedApi = new ApiStub();
        mockedOptions = {};
        mockedPopup = new PopupStub();
        mockedEas = new EventAggregatorSubscriptionsStub();
        sut = new Game(mockedHistory, mockedApi, mockedOptions, mockedPopup, mockedEas);
    });

    it('should init the history', () => {
        spyOn(mockedHistory, 'init');

        sut = new Game(mockedHistory, mockedApi, mockedOptions, mockedPopup, mockedEas);

        expect(mockedHistory.init).toHaveBeenCalled();
    });

    it('should dispose subscription on deactivate', () => {
        spyOn(mockedEas, 'dispose');

        sut.deactivate();

        expect(mockedEas.dispose).toHaveBeenCalled();
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
            let message = {
                isFatal: false,
                message: 'error',
            };
            spyOn(mockedPopup, 'display').and.returnValue(new Promise(resolve => {}));

            sut.activate();
            mockedEas.publish('aot:api:error', message);

            expect(mockedPopup.display).toHaveBeenCalledWith('error', {
                isFatal: false,
                translate: {
                    messages: {
                        message: 'error',
                    },
                },
            });
        });
    });
});
