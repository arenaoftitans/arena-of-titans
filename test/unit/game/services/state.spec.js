// /*
// * Copyright (C) 2015-2018 by Arena of Titans Contributors.
// *
// * This file is part of Arena of Titans.
// *
// * Arena of Titans is free software: you can redistribute it and/or modify
// * it under the terms of the GNU Affero General Public License as published by
// * the Free Software Foundation, either version 3 of the License, or
// * (at your option) any later version.
// *
// * Arena of Titans is distributed in the hope that it will be useful,
// * but WITHOUT ANY WARRANTY; without even the implied warranty of
// * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// * GNU Affero General Public License for more details.
// *
// * You should have received a copy of the GNU Affero General Public License
// * along with Arena of Titans. If not, see <http://www.gnu.org/licenses/>.
// */

import { State } from '../../../../app/game/services/state';
import { REQUEST_TYPES } from '../../../../app/game/constants';


describe('State', () => {
    let sut;

    beforeEach(() => {
        sut = new State();
    });

    it('should update the game', () => {
        let elapsedTime = 12;
        let message = {
            your_turn: true,
            on_last_line: false,
            has_won: false,
            rank: -1,
            next_player: 0,
            active_trumps: [{
                player_index: 0,
                player_name: 'Player 1',
                trumps: [{
                    name: 'Reinforcements',
                    color: null,
                }],
            }, {
                player_index: 1,
                player_name: 'Player 2',
                trumps: [],
            }],
            hand: [{
                name: 'King',
                color: 'RED',
            }],
            elapsed_time: elapsedTime,
        };
        let imgMatcher = /\/dist\/assets\/game\/cards\/trumps\/reinforcements-.*\.png/;
        sut.me.index = 0;

        sut.updateAfterPlay(message);

        expect(sut.game.your_turn).toBe(true);
        expect(sut.game.next_player).toBe(0);
        expect(sut.game.active_trumps.length).toBe(2);
        expect(sut.game.active_trumps[0]).toBe(message.active_trumps[0]);
        expect(sut.game.active_trumps[1]).toBe(message.active_trumps[1]);
        expect(sut.me.hand).toEqual([
            {
                name: 'King',
                color: 'RED',
                img: 'sprite-movement-king-red',
            },
        ]);
        expect(sut.me.has_won).toBe(false);
        expect(sut.me.rank).toBe(-1);
        expect(sut.me.affecting_trumps).toEqual([{
            name: 'Reinforcements',
            color: null,
            img: jasmine.stringMatching(imgMatcher),
        }]);
        expect(sut.me.elapsed_time).toBe(elapsedTime);
        expect(sut.me.on_last_line).toBe(false);
    });

    it('should create players with null descriptions', () => {
        sut._createPlayers([
            {
                hero: 'daemon',
                index: 0,
                name: 'Player 1',
                square: {x: 1, y: 2},
            },
            null,
            {
                hero: 'orc',
                index: 2,
                name: 'Player 2',
                square: null,
            },
        ]);

        expect(sut.game.players.heroes).toEqual(['daemon', null, 'orc']);
        expect(sut.game.players.indexes).toEqual([0, null, 2]);
        expect(sut.game.players.names).toEqual(['Player 1', null, 'Player 2']);
        expect(sut.game.players.squares).toEqual([{x: 1, y: 2}, {}, {}]);
    });

    it('should update name', () => {
        sut._me = {
            name: 'Player 1',
            index: 0,
            hero: 'daemon',
        };
        sut._game = {
            slots: [{
                index: 0,
                player_name: 'Player 1',
                state: 'TAKEN',
            }],
        };

        sut.updateMe('New Name', 'reaper');

        expect(sut.me.hero).toBe('reaper');
        expect(sut.me.name).toBe('New Name');
        expect(sut.game.slots[0].hero).toBe('reaper');
        expect(sut.game.slots[0].player_name).toBe('New Name');
    });

    it('should handle game initialized', () => {
        let gameInitializedMessage = {
            rt: REQUEST_TYPES.gameInitialized,
            index: 0,
            is_game_master: true,
            player_id: 'player_id',
            game_id: 'game_id',
            slots: [{
                index: 0,
                name: 'Player 1',
                state: 'TAKEN',
            }],
        };

        sut.initializeGame(gameInitializedMessage);

        expect(sut.me.index).toBe(gameInitializedMessage.index);
        expect(sut.me.is_game_master).toBe(gameInitializedMessage.is_game_master);
        expect(sut.me.id).toBe(gameInitializedMessage.player_id);
        expect(sut.game.id).toBe(gameInitializedMessage.game_id);
        expect(sut.game.slots).toBe(gameInitializedMessage.slots);
    });

    it('should handle game created data', () => {
        let message = {
            rt: REQUEST_TYPES.createGame,
            players: [{
                hero: 'daemon',
                index: 0,
                name: 'Player 1',
            }, {
                hero: 'reaper',
                index: 1,
                name: 'Player 2',
            }],
            trumps: [{
                name: 'Tower',
                color: 'Red',
                description: 'Prevents a player to move on red squares.',
                cost: 0,
                duration: 1,
                must_target_player: true,
            }],
            hand: [{
                name: 'King',
                color: 'RED',
            }],
            active_trumps: [{
                trumps: [],
            }],
        };
        sut.initializeGame({
            rt: REQUEST_TYPES.gameInitialized,
            index: 0,
            is_game_master: true,
            player_id: 'player_id',
            game_id: 'game_id',
            slots: [{
                index: 0,
                name: 'Player 1',
                state: 'TAKEN',
            }],
        });

        sut.createGame(message);

        expect(sut.game.players).toEqual({
            heroes: ['daemon', 'reaper'],
            indexes: [0, 1],
            names: ['Player 1', 'Player 2'],
            squares: [{}, {}],
        });
        expect(sut.me.trumps).toEqual([{
            name: 'Tower',
            color: 'Red',
            img: jasmine.stringMatching(/\/dist\/assets\/game\/cards\/trumps\/tower-red-.*\.png/),
            description: 'Prevents a player to move on red squares.',
            cost: 0,
            duration: 1,
            must_target_player: true,
        }]);
    });
});
