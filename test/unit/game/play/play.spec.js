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
import { ApiStub, GameStub } from '../../../../app/test-utils';


describe('play', () => {
    let sut;
    let mockedApi;
    let mockedGame;

    beforeEach(() => {
        mockedApi = new ApiStub();
        mockedGame = new GameStub();
        sut = new Play(mockedApi, mockedGame);
    });

    it('should register api callbacks on activation', () => {
        spyOn(mockedApi, 'on');

        sut.activate();

        expect(mockedApi.on).toHaveBeenCalled();
    });

    it('should deregister api callbacks on deactivation', () => {
        spyOn(mockedApi, 'off');

        sut.deactivate();

        expect(mockedApi.off).toHaveBeenCalled();
    });

    it('should ask to join game in no name', () => {
        spyOn(mockedApi, 'joinGame');
        mockedApi._me = {};

        sut.activate({id: 'game_id'});

        expect(mockedApi.joinGame).toHaveBeenCalledWith({gameId: 'game_id'});
    });

    it('should not ask to join the game if a name is supplied', () => {
        spyOn(mockedApi, 'joinGame');
        mockedApi._me = {name: 'Player 1'};

        sut.activate({id: 'game_id'});

        expect(mockedApi.joinGame).not.toHaveBeenCalled();
    });

    it('should display the game over popup on game over', done => {
        spyOn(mockedGame, 'popup');
        mockedApi._gameOverDefered.resolve(['Player 1', 'Player 2']);

        sut.activate();

        mockedApi.onGameOverDefered.then(() => {
            expect(mockedGame.popup).toHaveBeenCalledWith(
                'game-over',
                {message: ['Player 1', 'Player 2']});
            done();
        });
    });

    describe('special actions', () => {
        it('should log error for unknown action', () => {
             spyOn(sut._logger, 'error');
            let action = {
                name: 'toto',
            };

            sut._handleSpecialActionNotify(action);

            expect(sut._logger.error).toHaveBeenCalledWith({
                name: 'toto',
                info: 'Unknow special action',
            });
            expect(sut.pawnClickable).toBe(false);
            expect(sut.onPawnClicked).toBe(null);
        });

        it('should make pawns clickable for assassination if your turn', () => {
            let action = {
                name: 'assassination',
            };
            spyOn(sut._api, 'viewPossibleActions');
            sut._api.game.your_turn = true;
            sut._api.me.index = 0;

            sut._handleSpecialActionNotify(action);

            expect(sut.pawnClickable).toBe(true);
            expect(sut.onPawnClicked).toEqual(jasmine.any(Function));
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
                name: 'Assassination',
            });

            expect(sut.onPawnSquareClicked).toEqual(jasmine.any(Function));
            expect(sut.pawnClickable).toBe(true);
            expect(sut.onPawnClicked).toEqual(jasmine.any(Function));
            expect(sut.pawnsForcedNotClickable).toEqual([0]);

            spyOn(mockedApi, 'playSpecialAction');

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
    });
});
