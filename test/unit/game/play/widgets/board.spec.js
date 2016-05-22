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

import '../../../setup';
import { AotBoardCustomElement } from '../../../../../app/game/play/widgets/board';
import { ApiStub } from '../../../utils';


describe('board', () => {
    let sut;
    let mockedApi;

    beforeEach(() => {
        mockedApi = new ApiStub();
        sut = new AotBoardCustomElement(mockedApi);
    });

    it('should register callbacks', () => {
        expect(mockedApi._cbs[mockedApi.requestTypes.view].length).toBe(1);
        expect(mockedApi._cbs[mockedApi.requestTypes.player_played].length).toBe(1);
    });

    it('should move to on possible square', () => {
        spyOn(mockedApi, 'play');
        sut._possibleSquares = ['square-0-0'];
        sut.selectedCard = {name: 'King', color: 'red'};

        sut.moveTo('square-0-0', 0, 0);

        expect(mockedApi.play).toHaveBeenCalledWith({
            cardName: 'King',
            cardColor: 'red',
            x: 0,
            y: 0
        });
        expect(sut._possibleSquares.length).toBe(0);
        expect(sut.selectedCard).toBe(null);
    });

    it('should only move on possible square', () => {
        spyOn(mockedApi, 'play');
        sut._possibleSquares = ['square-0-0'];
        sut.selectedCard = {name: 'King', color: 'red'};

        sut.moveTo('square-1-0', 0, 0);

        expect(mockedApi.play).not.toHaveBeenCalled();
    });

    it('should not move if no possible squares', () => {
        spyOn(mockedApi, 'play');
        sut.selectedCard = {name: 'King', color: 'red'};

        sut.moveTo('square-1-0', 0, 0);

        expect(mockedApi.play).not.toHaveBeenCalled();
    });

    it('should not move if no selected card', () => {
        spyOn(mockedApi, 'play');
        sut._possibleSquares = ['square-0-0'];
        sut.selectedCard = null;

        sut.moveTo('square-0-0', 0, 0);

        expect(mockedApi.play).not.toHaveBeenCalled();
    });

    it('should reset possible squares', () => {
        sut._possibleSquares = ['square-0-0'];
        sut._resetPossibleSquares();

        expect(sut._possibleSquares.length).toBe(0);
    });
});
