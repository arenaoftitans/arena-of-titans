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

import { AotTrumpCustomElement } from '../../../../../app/game/play/widgets/trump/trump';
import {
    ApiStub,
    EventAggregatorSubscriptionsStub,
    GameStub,
    I18nStub,
} from '../../../../../app/test-utils';


describe('trump', () => {
    let sut;
    let mockedI18n;
    let mockedApi;
    let mockedGame;
    let element;
    let mockedEas;

    beforeEach(() => {
        mockedApi = new ApiStub();
        mockedGame = new GameStub();
        mockedI18n = new I18nStub();
        mockedEas = new EventAggregatorSubscriptionsStub();
        sut = new AotTrumpCustomElement(mockedApi, mockedGame, mockedI18n, element, mockedEas);
        sut.kind = 'player';
    });

    it('should play trump with a target after a popup', done => {
        let defered = {};
        defered.promise = new Promise(resolve => {
            defered.resolve = resolve;
        });
        spyOn(mockedGame, 'popup').and.returnValue(defered.promise);
        spyOn(mockedApi, 'playTrump');
        mockedApi._game = {
            players: {
                names: ['Player 1', null, 'Player 2'],
                indexes: [0, null, 2],
            },
            trumps_statuses: [true],
            your_turn: true,
        };
        mockedApi._me = {
            index: 0,
        };
        sut.trump = {name: 'Trump', must_target_player: true};
        sut.index = 0;

        sut.play();

        expect(mockedGame.popup).toHaveBeenCalledWith(
            'confirm',
            {
                message: 'Who should be the target of Trump?',
                choices: [{
                    name: 'Player 2',
                    index: 2,
                }],
                title: 'trumps.trump',
                description: 'trumps.trump_description',
                selectedChoice: '1',
            }
        );
        defered.resolve(2);
        defered.promise.then(() => {
            expect(mockedApi.playTrump).toHaveBeenCalledWith({
                trumpName: 'Trump',
                targetIndex: 2,
            });
            done();
        });
    });

    it('should play trump without a target directly', () => {
        spyOn(mockedGame, 'popup');
        spyOn(mockedApi, 'playTrump');
        mockedApi._game = {
            trumps_statuses: [true],
            your_turn: true,
        };
        sut.trump = {name: 'Trump', must_target_player: false};
        sut.index = 0;

        sut.play();

        expect(mockedGame.popup).not.toHaveBeenCalled();
        expect(mockedApi.playTrump).toHaveBeenCalledWith({trumpName: 'Trump'});
    });

    it('should not play a trump if not your turn', () => {
        spyOn(mockedApi, 'playTrump');
        mockedApi._game = {
            your_turn: false,
        };

        sut.play({name: 'Trump'});

        expect(mockedApi.playTrump).not.toHaveBeenCalled();
    });

    it('should dispose subscriptions', () => {
        spyOn(mockedEas, 'dispose');

        sut.unbind();

        expect(mockedEas.dispose).toHaveBeenCalled();
    });

    it('should not play trump if kind is different than player', () => {
        spyOn(mockedApi, 'playTrump');
        spyOn(mockedGame, 'popup');
        sut.kind = 'affecting';

        sut.play();

        expect(mockedApi.playTrump).not.toHaveBeenCalled();
        expect(mockedGame.popup).not.toHaveBeenCalled();
    });

    describe('should get the correct list of targets', () => {
        it('for player 0', () => {
            mockedApi._game = {
                players: {
                    indexes: [0, 1, null, 3, undefined, 5, null, null, null],
                    names: ['P0', 'P1', null, 'P3', undefined, 'P5', null, null, null],
                },
            };
            mockedApi._me = {
                index: 0,
            };

            let otherPlayers = sut._getOtherPlayerNames();

            expect(otherPlayers.length).toBe(3);
            let expectedIndexes = [1, 3, 5];
            for (let i = 0; i < otherPlayers.length; i++) {
                let player = otherPlayers[i];
                let index = expectedIndexes[i];
                expect(player.index).toBe(index);
                expect(player.name).toBe(`P${index}`);
            }
        });

        it('for other player', () => {
            mockedApi._game = {
                players: {
                    indexes: [0, 1, null, 3, undefined, 5, null, null, null],
                    names: ['P0', 'P1', null, 'P3', undefined, 'P5', null, null, null],
                },
            };
            mockedApi._me = {
                index: 1,
            };

            let otherPlayers = sut._getOtherPlayerNames();

            expect(otherPlayers.length).toBe(3);
            let expectedIndexes = [0, 3, 5];
            for (let i = 0; i < otherPlayers.length; i++) {
                let player = otherPlayers[i];
                let index = expectedIndexes[i];
                expect(player.index).toBe(index);
                expect(player.name).toBe(`P${index}`);
            }
        });
    });
});
