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

import { Create } from '../../../../app/game/create/create';
import { Wait } from '../../../../app/game/services/utils';
import {
    ApiStub,
    BindingEngineSubscriptionsStub,
    RouterStub,
    StorageStub,
    HistoryStub,
    EventAggregatorSubscriptionsStub,
    EventAggregatorStub,
} from '../../../../app/test-utils';


describe('game/create', () => {
    let sut;
    let mockedRouter;
    let mockedApi;
    let mockedBes;
    let mockedStorage;
    let mockedConfig;
    let mockedHistory;
    let mockedEas;
    let mockedEa;

    beforeEach(() => {
        mockedRouter = new RouterStub();
        mockedApi = new ApiStub();
        mockedStorage = new StorageStub();
        mockedBes = new BindingEngineSubscriptionsStub();
        mockedHistory = new HistoryStub();
        mockedEas = new EventAggregatorSubscriptionsStub();
        mockedEa = new EventAggregatorStub();
        mockedConfig = {};
        sut = new Create(
            mockedRouter,
            mockedApi,
            mockedStorage,
            mockedConfig,
            mockedBes,
            mockedHistory,
            mockedEa,
            mockedEas
        );
    });

    it('should activate', () => {
        spyOn(mockedEas, 'subscribe');
        spyOn(mockedEa, 'subscribe');
        spyOn(sut, 'init');
        spyOn(sut, '_joinGame');

        sut.activate({id: 'game_id'});

        expect(sut.gameId).toBe('game_id');
        expect(mockedEas.subscribe).toHaveBeenCalled();
        expect(mockedEas.subscribe).toHaveBeenCalled();
        expect(sut.init).toHaveBeenCalled();
        expect(sut.gameId).toBe('game_id');
        expect(sut._joinGame).toHaveBeenCalled();
    });

    it('should deregister api callbacks on deactivation', () => {
        spyOn(mockedEas, 'dispose');
        spyOn(mockedBes, 'dispose');

        sut.deactivate();

        expect(mockedEas.dispose).toHaveBeenCalled();
        expect(mockedBes.dispose).toHaveBeenCalled();
    });

    it('should reset with init method', () => {
        spyOn(sut, '_registerEvents');
        spyOn(mockedApi, 'init');
        spyOn(Wait, 'flushCache');
        spyOn(sut, 'initPlayerInfos');
        spyOn(mockedHistory, 'init');
        spyOn(mockedBes, 'subscribe');

        sut.init({id: 'game_id'});

        expect(sut._registerEvents).toHaveBeenCalled();
        expect(mockedApi.init).toHaveBeenCalled();
        expect(Wait.flushCache).toHaveBeenCalled();
        expect(mockedHistory.init).toHaveBeenCalled();
        expect(sut.initPlayerInfos);
        expect(mockedBes.subscribe)
            .toHaveBeenCalledWith(sut.playerInfos, 'name', jasmine.any(Function));
        expect(mockedBes.subscribe)
            .toHaveBeenCalledWith(sut.playerInfos, 'hero', jasmine.any(Function));
    });

    it('should initialize player infos', () => {
        spyOn(mockedStorage, 'loadPlayerInfos').and.returnValue({});

        sut.initPlayerInfos();

        expect(mockedStorage.loadPlayerInfos).toHaveBeenCalled();
        expect(sut.playerInfos.name.length).toBeGreaterThan(0);
        expect(sut.playerInfos.hero.length).toBeGreaterThan(0);
    });

    it('should clear player id when reconnecting to the game and the slot was freed', () => {
        let joinGame = new Promise((resolve, reject) => reject(new Error()));
        spyOn(mockedApi, 'joinGame').and.returnValue(joinGame);
        // Since we have a nested call to _joinGame, we need to use a state of the storage to
        // avoid an infinite recursion.
        let storageCleared = false;
        spyOn(mockedStorage, 'retrievePlayerId').and.callFake(() => {
            if (!storageCleared) {
                return 'player_id';
            }

            return null;
        });
        spyOn(mockedStorage, 'clearPlayerId').and.callFake(() => {
            storageCleared = true;
        });
        spyOn(sut._logger, 'warn');
        sut.gameId = 'game_id';

        return sut._joinGame().then(() => {
            expect(mockedApi.joinGame)
                .toHaveBeenCalledWith({gameId: 'game_id', playerId: 'player_id'});
            expect(sut._logger.warn).toHaveBeenCalledWith('Failed to join the game');
            expect(mockedStorage.clearPlayerId).toHaveBeenCalledWith('game_id');
        }, () => fail('Unwanted code branch'));
    });

    it('should join the game from an id', () => {
        spyOn(mockedStorage, 'retrievePlayerId').and.returnValue('player_id');
        spyOn(mockedApi, 'joinGame').and.returnValue(new Promise(resolve => resolve()));
        sut.playerInfos = {};
        sut.gameId = 'game_id';

        return sut._joinGame().then(() => {
            expect(mockedStorage.retrievePlayerId).toHaveBeenCalledWith('game_id');
            expect(mockedApi.joinGame)
                .toHaveBeenCalledWith({gameId: 'game_id', playerId: 'player_id'});
        }, () => fail('Unwanted code branch'));
    });

    it('should navigate to initialize the game if no id param', () => {
        spyOn(mockedApi, 'initializeGame');

        sut.activate();

        expect(mockedApi.initializeGame)
            .toHaveBeenCalledWith(jasmine.any(String), jasmine.any(String));
        expect(sut.gameId).toBeUndefined();
    });

    it('should navigate to {version}/create/{id} after game initialization', () => {
        let gameInitializedData = {game_id: 'the_game_id'};
        spyOn(mockedRouter, 'navigateToRoute');

        sut.activate();
        mockedEas.publish('aot:api:game_initialized', gameInitializedData);

        expect(mockedRouter.navigateToRoute).toHaveBeenCalledWith(
            'create',
            {
                id: gameInitializedData.game_id,
                version: 'latest',
            }
        );
    });

    it('should navigate to {version}/create/{id} after game initialization with actual version in config', () => {  // eslint-disable-line
        mockedConfig = {
            version: 42,
        };
        sut = new Create(
            mockedRouter,
            mockedApi,
            mockedStorage,
            mockedConfig,
            mockedBes,
            mockedHistory,
            mockedEa,
            mockedEas
        );
        let gameInitializedData = {game_id: 'the_game_id'};
        spyOn(mockedRouter, 'navigateToRoute');

        sut.activate();
        mockedEas.publish('aot:api:game_initialized', gameInitializedData);

        expect(mockedRouter.navigateToRoute).toHaveBeenCalledWith(
            'create',
            {
                id: gameInitializedData.game_id,
                version: 42,
            }
        );
    });

    it('should set the 2nd slot to AI after game initilization', () => {
        spyOn(mockedApi, 'updateSlot');

        mockedApi._me = {
            name: 'Player 1',
            is_game_master: true,
        };
        mockedApi._game = {
            slots: [
                {
                    state: 'TAKEN',
                },
            ],
        };
        for (let i = 1; i < 8; i++) {
            mockedApi._game.slots.push({
                state: 'OPEN',
            });
        }

        sut._autoAddAi();

        expect(mockedApi.updateSlot).toHaveBeenCalled();
        let args = mockedApi.updateSlot.calls.mostRecent().args[0];
        expect(args.state).toBe('AI');
        expect(args.player_name).toBe('AI undefined');
        expect(args.hero).toBeDefined();
    });

    it('should not set the 2nd slot to AI if player changed a slot', () => {
        spyOn(mockedApi, 'updateSlot');

        mockedApi._me = {
            name: 'Player 1',
            is_game_master: true,
        };
        mockedApi._game = {
            slots: [
                {
                    state: 'TAKEN',
                },
            ],
        };
        for (let i = 1; i < 8; i++) {
            mockedApi._game.slots.push({
                state: 'OPEN',
            });
        }
        mockedApi._game.slots[3].state = 'TAKEN';

        sut._autoAddAi();

        expect(mockedApi.updateSlot).not.toHaveBeenCalled();
    });

    it('should create game', () => {
        spyOn(mockedApi, 'createGame');

        sut.createGame();

        expect(mockedApi.createGame).toHaveBeenCalled();
    });

    it('should navigate to play/{id} after the game creation', () => {
        spyOn(mockedRouter, 'navigateToRoute');
        sut.creating = true;

        sut.activate({id: 'the_game_id'});
        mockedEas.publish('aot:api:create_game');

        expect(mockedRouter.navigateToRoute).toHaveBeenCalledWith(
            'play',
            {
                id: 'the_game_id',
                version: 'latest',
            }
        );
        expect(sut.gameId).toBe('the_game_id');
    });
});
