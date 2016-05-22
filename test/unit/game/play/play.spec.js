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
import { Play } from '../../../../app/game/play/play';
import { ApiStub, GameStub } from '../../utils';


describe('play', () => {
    let sut;
    let mockedApi;
    let mockedGame;

    beforeEach(() => {
        mockedApi = new ApiStub();
        mockedGame = new GameStub();
        sut = new Play(mockedApi, mockedGame);
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
});
