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

import {
    AotBoardControlsCustomElement,
} from '../../../../../app/game/play/widgets/board-controls/board-controls';
import {
    EventAggregatorSubscriptionsStub,
    ObserverLocatorStub,
} from '../../../../../app/test-utils';


describe('board-controls', () => {
    let sut;
    let mockedOl;
    let mockedEas;

    beforeEach(() => {
        mockedOl = new ObserverLocatorStub();
        mockedEas = new EventAggregatorSubscriptionsStub();
        sut = new AotBoardControlsCustomElement(mockedOl, mockedEas);
    });

    it('should initialize', () => {
        spyOn(mockedOl, 'getObserver').and.callThrough();
        spyOn(mockedEas, 'subscribe');

        sut = new AotBoardControlsCustomElement(mockedOl, mockedEas);

        expect(sut._synching).toBe(false);
        expect(sut.value).toBe(1);
        expect(mockedOl.getObserver).toHaveBeenCalled();
        expect(mockedEas.subscribe).toHaveBeenCalled();
    });

    it('should clean on unbind', () => {
        spyOn(mockedEas, 'dispose');
        spyOn(mockedOl, 'getObserver').and.callThrough();

        sut.unbind();

        expect(mockedEas.dispose).toHaveBeenCalled();
        expect(mockedOl.getObserver).toHaveBeenCalled();
    });

    describe('on value change', () => {
        it('shound not update if values are the same', () => {
            spyOn(mockedEas, 'publish');

            sut._valueObserverCb('1', '1');

            expect(mockedEas.publish).not.toHaveBeenCalled();
        });

        it('should not update if synching', () => {
            spyOn(mockedEas, 'publish');
            sut._synching = true;

            sut._valueObserverCb('1', '2');

            expect(mockedEas.publish).not.toHaveBeenCalled();
            expect(sut._synching).toBe(false);
        });

        it('should update if values are different', () => {
            spyOn(mockedEas, 'publish');

            sut._valueObserverCb('1', '2');

            expect(mockedEas.publish).toHaveBeenCalledWith('aot:board:controls:zoom', {
                direction: null,
                value: '1',
            });
        });
    });
});
