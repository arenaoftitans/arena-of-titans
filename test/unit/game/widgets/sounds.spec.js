/*
* Copyright (C) 2015-2018 by Arena of Titans Contributors.
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

import { EventAggregatorSubscriptionsStub } from '../../../../app/test-utils';
import { AotSoundsCustomElement } from '../../../../app/game/widgets/sounds/sounds';


describe('sounds', () => {
    let mockedEas;
    let sut;

    beforeEach(() => {
        mockedEas = new EventAggregatorSubscriptionsStub();
        spyOn(mockedEas, 'subscribe').and.callThrough();
        sut = new AotSoundsCustomElement(mockedEas);
    });

    describe('initialization', () => {
        it('should listen for play sound events', () => {
            expect(mockedEas.subscribe)
                .toHaveBeenCalledWith('aot:sound:play', jasmine.any(Function));
        });

        it('should push to the sound list on sound play events', () => {
            mockedEas.publish('aot:sound:play', 'a-sound');

            expect(sut.sounds.length).toBe(1);
            expect(sut.sounds[0]).toBe('a-sound');
        });

        it('should listen for play ended events', () => {
            expect(mockedEas.subscribe)
                .toHaveBeenCalledWith('aot:sound:ended', jasmine.any(Function));
        });

        it('should remove sound on ended event', () => {
            sut.sounds = ['sound1', 'sound2', 'sound3'];

            mockedEas.publish('aot:sound:ended', 'sound2');

            expect(sut.sounds.length).toBe(2);
            expect(sut.sounds).toEqual(['sound1', 'sound3']);
        });
    });
});
