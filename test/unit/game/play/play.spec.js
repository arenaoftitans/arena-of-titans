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

import { Play } from '../../../../app/game/play/play';
import {
    ApiStub,
    EventAggregatorSubscriptionsStub,
    PopupStub,
    StateStub,
} from '../../../../app/test-utils';


describe('play', () => {
    let sut;
    let mockedApi;
    let mockedPopup;
    let mockedEas;
    let mockedState;

    beforeEach(() => {
        mockedApi = new ApiStub();
        mockedPopup = new PopupStub();
        mockedEas = new EventAggregatorSubscriptionsStub();
        mockedState = new StateStub();
        sut = new Play(mockedApi, mockedPopup, mockedEas, mockedState);
    });

    it('should register api callbacks on activation', () => {
        jest.spyOn(mockedEas, 'subscribe');

        sut.activate();

        expect(mockedEas.subscribe).toHaveBeenCalled();
    });

    it('should deregister api callbacks on deactivation', () => {
        jest.spyOn(mockedEas, 'dispose');

        sut.deactivate();

        expect(mockedEas.dispose).toHaveBeenCalled();
    });

    it('should ask to join game in no name', () => {
        jest.spyOn(mockedApi, 'joinGame');
        mockedApi._me = {};

        sut.activate({id: 'game_id'});

        expect(mockedApi.joinGame).toHaveBeenCalledWith({gameId: 'game_id'});
    });

    it('should not ask to join the game if a name is supplied', () => {
        jest.spyOn(mockedApi, 'joinGame');
        mockedState._me = {name: 'Player 1'};

        sut.activate({id: 'game_id'});

        expect(mockedApi.joinGame).not.toHaveBeenCalled();
    });

    it('should display the game over popup on game over', async() => {
        jest.spyOn(mockedPopup, 'display');
        mockedApi._gameOverDeferred.resolve(['Player 1', 'Player 2']);

        sut.activate();

        await mockedApi.onGameOverDeferred;

        expect(mockedPopup.display).toHaveBeenCalledWith(
            'game-over',
            {message: ['Player 1', 'Player 2']},
        );
    });

    describe('special actions', () => {
        it('should log error for unknown action', () => {
            jest.spyOn(sut._logger, 'error');
            let action = {
                special_action_name: 'toto',
            };

            sut._handleSpecialActionNotify(action);

            expect(sut._logger.error).toHaveBeenCalledWith({
                special_action_name: 'toto',
                info: 'Unknow special action',
            });
            expect(sut.pawnClickable).toBe(false);
            expect(sut.onPawnClicked).toBe(null);
        });

        it('should make pawns clickable for assassination if your turn', () => {
            let action = {
                special_action_name: 'assassination',
            };
            jest.spyOn(sut._api, 'viewPossibleActions');
            mockedState.game.your_turn = true;
            mockedState.me.index = 0;

            sut._handleSpecialActionNotify(action);

            expect(sut.pawnClickable).toBe(true);
            expect(sut.onPawnClicked).toEqual(expect.any(Function));
            sut.onPawnClicked(0);
            expect(sut._api.viewPossibleActions).toHaveBeenCalledWith({
                name: 'assassination',
                targetIndex: 0,
            });
            expect(sut.pawnsForcedNotClickable).toEqual([0]);
        });

        it('should handle view special action', () => {
            sut.pawnClickable = true;
            sut.onPawnClicked = () => {};
            sut.pawnsForcedNotClickable = [0];

            sut._handleSpecialActionViewPossibleActions({
                special_action_name: 'Assassination',
            });

            expect(sut.onPawnSquareClicked).toEqual(expect.any(Function));
            expect(sut.pawnClickable).toBe(true);
            expect(sut.onPawnClicked).toEqual(expect.any(Function));
            expect(sut.pawnsForcedNotClickable).toEqual([0]);

            jest.spyOn(mockedApi, 'playSpecialAction');

            sut.onPawnSquareClicked('square-0-0', 0, 0, 0);

            expect(sut.onPawnSquareClicked).toBe(null);
            expect(sut.pawnClickable).toBe(false);
            expect(sut.onPawnClicked).toBe(null);
            expect(sut.pawnsForcedNotClickable).toEqual([]);
            expect(mockedApi.playSpecialAction).toHaveBeenCalledWith({
                x: 0,
                y: 0,
                name: 'Assassination',
                targetIndex: 0,
            });
        });

        it('reset pawns', () => {
            sut.pawnClickable = true;
            sut.onPawnClicked = () => {};
            sut.pawnsForcedNotClickable = [0];

            sut._resetPawns();

            expect(sut.pawnClickable).toBe(false);
            expect(sut.onPawnClicked).toBe(null);
            expect(sut.pawnsForcedNotClickable).toEqual([]);
        });
    });
});
