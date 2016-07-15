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
import { AotTrumpsCustomElement } from '../../../../../app/game/play/widgets/trumps/trumps';
import { ApiStub, GameStub, I18nStub } from '../../../utils';


describe('trumps', () => {
    let sut;
    let mockedI18n;
    let mockedApi;
    let mockedGame;

    beforeEach(() => {
        mockedApi = new ApiStub();
        mockedGame = new GameStub();
        mockedI18n = new I18nStub();
        sut = new AotTrumpsCustomElement(mockedApi, mockedGame, mockedI18n);
    });

    it('should play trump with a target after a popup', done => {
        let defered = {};
        defered.promise = new Promise(resolve => defered.resolve = resolve);
        spyOn(mockedGame, 'popup').and.returnValue(defered.promise);
        spyOn(mockedApi, 'playTrump');
        mockedApi._game = {
            players: {
                names: ['Player 1', 'Player 2'],
                indexes: [0, 1]
            },
            your_turn: true
        };
        mockedApi._me = {
            index: 0
        };

        sut.play({name: 'Trump', must_target_player: true});

        expect(mockedGame.popup).toHaveBeenCalledWith(
            'confirm',
            {
                message: 'Who should be the target of Trump?', choices: [
                {
                    name: 'Player 2',
                    index: 1
                }
            ],
            'title': 'trumps.trump',
            description: 'trumps.trump_description',
            }
        );
        defered.resolve(1);
        defered.promise.then(() => {
            expect(mockedApi.playTrump).toHaveBeenCalledWith({
                trumpName: 'Trump',
                targetIndex: 1
            });
            done();
        });
    });

    it('should play trump without a target directly', () => {
        spyOn(mockedGame, 'popup');
        spyOn(mockedApi, 'playTrump');
        mockedApi._game = {
            your_turn: true
        };

        sut.play({name: 'Trump', must_target_player: false});

        expect(mockedGame.popup).not.toHaveBeenCalled();
        expect(mockedApi.playTrump).toHaveBeenCalledWith({trumpName: 'Trump'});
    });

    it('should not play a trump if not your turn', () => {
        spyOn(mockedApi, 'playTrump');
        mockedApi._game = {
            your_turn: false
        };

        sut.play({name: 'Trump'});

        expect(mockedApi.playTrump).not.toHaveBeenCalled();
    });
});
