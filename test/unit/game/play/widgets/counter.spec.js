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

import '../../../setup';
import { AotCounterCustomElement } from '../../../../../app/game/play/widgets/counter';
import { Wait } from '../../../../../app/game/services/utils';
import { ApiStub, EventAgregatorStub } from '../../../utils';


describe('counter', () => {
    let mockedApi;
    let mockedEa;
    let sut;

    beforeEach(() => {
        mockedApi = new ApiStub();
        mockedEa = new EventAgregatorStub();
        sut = new AotCounterCustomElement(mockedApi, {}, mockedEa);
    });

    it('should start on your turn', done => {
        spyOn(sut, 'start');

        mockedApi.game.your_turn = true;
        mockedApi.game.game_over = false;
        mockedApi.play();

        Wait.forId('counter').then(() => {
            expect(sut.start).toHaveBeenCalled();
            done();
        });
    });

    it('shouldn\'t start but reset when not your turn', done => {
        spyOn(sut, 'start');
        spyOn(window, 'clearInterval');

        sut.startTime = (new Date()).getTime();
        mockedApi.game.your_turn = false;
        mockedApi.game.game_over = false;
        mockedApi.play();

        Wait.forId('counter').then(() => {
            expect(sut.start).not.toHaveBeenCalled();
            expect(window.clearInterval).toHaveBeenCalled();
            expect(sut.startTime).toBe(null);
            done();
        });
    });

    it('shouldn\'t start on game over', done => {
        spyOn(sut, 'start');
        spyOn(window, 'clearInterval');

        mockedApi.game.your_turn = true;
        mockedApi.game.game_over = true;
        mockedApi.play();

        Wait.forId('counter').then(() => {
            expect(sut.start).not.toHaveBeenCalled();
            done();
        });
    });
});
