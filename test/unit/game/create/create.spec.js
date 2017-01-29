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
    ObserverLocatorStub,
    ObserverLocatorStubResults,
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
    let mockedobserverLocator;
    let mockedStorage;
    let mockedConfig;
    let mockedHistory;
    let mockedEas;
    let mockedEa;

    beforeEach(() => {
        mockedRouter = new RouterStub();
        mockedApi = new ApiStub();
        mockedStorage = new StorageStub();
        mockedobserverLocator = new ObserverLocatorStub();
        mockedHistory = new HistoryStub();
        mockedEas = new EventAggregatorSubscriptionsStub();
        mockedEa = new EventAggregatorStub();
        mockedConfig = {
            test: {
                debug: false,
            },
        };
        sut = new Create(
            mockedRouter,
            mockedApi,
            mockedStorage,
            mockedConfig,
            mockedobserverLocator,
            mockedHistory,
            mockedEa,
            mockedEas
        );
    });

    it('should register api callbacks on activation', () => {
        spyOn(mockedEas, 'subscribe');
        spyOn(mockedEa, 'subscribe');

        sut.activate();

        expect(mockedEas.subscribe).toHaveBeenCalled();
        expect(mockedEas.subscribe).toHaveBeenCalled();
    });

    it('should deregister api callbacks on deactivation', () => {
        spyOn(mockedEas, 'dispose');
        spyOn(sut, '_unregisterMyNameObserver');

        sut.deactivate();

        expect(mockedEas.dispose).toHaveBeenCalled();
        expect(sut._unregisterMyNameObserver).toHaveBeenCalled();
    });

    it('should reset with init method', () => {
        let observerLocatorStubResults = new ObserverLocatorStubResults();
        spyOn(sut, 'initPlayerInfoDefered');
        spyOn(sut, '_registerEvents');
        spyOn(mockedApi, 'init');
        spyOn(Wait, 'flushCache');
        spyOn(mockedobserverLocator, 'getObserver').and.returnValue(observerLocatorStubResults);
        spyOn(observerLocatorStubResults, 'subscribe');
        spyOn(mockedHistory, 'init');
        spyOn(sut, '_unregisterMyNameObserver');

        sut.init();

        expect(sut.initPlayerInfoDefered).toHaveBeenCalled();
        expect(sut._registerEvents).toHaveBeenCalled();
        expect(mockedApi.init).toHaveBeenCalled();
        expect(Wait.flushCache).toHaveBeenCalled();
        expect(mockedobserverLocator.getObserver).toHaveBeenCalledWith({}, 'name');
        expect(observerLocatorStubResults.subscribe).toHaveBeenCalled();
        expect(sut._unregisterMyNameObserver).toHaveBeenCalled();
        expect(mockedHistory.init).toHaveBeenCalled();
    });

    it('should not ask for the name if it knows the player name', done => {
        spyOn(mockedApi, 'initializeGame');
        spyOn(sut, '_joinGame');

        mockedApi._me = {
            name: 'Player 1',
        };
        sut.activate({id: 'game_id'});
        sut.playerInfoDefered.resolve();

        sut.playerInfoDefered.promise.then(() => {
            expect(mockedApi.initializeGame).not.toHaveBeenCalled();
            done();
        }, () => {
            expect(false).toBe(true);
            done();
        });
    });

    it('should ask the player name when joining a game', done => {
        spyOn(mockedApi, 'joinGame');
        spyOn(mockedStorage, 'loadPlayerInfos');
        spyOn(mockedStorage, 'savePlayerInfos');
        spyOn(mockedStorage, 'retrievePlayerId');

        sut.activate({id: 'game_id'});
        sut.playerInfoDefered.resolve({
            name: 'Tester',
            hero: 'daemon',
        });

        expect(mockedStorage.loadPlayerInfos).toHaveBeenCalled();
        expect(mockedStorage.retrievePlayerId).toHaveBeenCalled();
        sut.playerInfoDefered.promise.then(() => {
            expect(mockedApi.joinGame).toHaveBeenCalledWith({
                gameId: 'game_id',
                name: 'Tester',
                hero: 'daemon',
            });
            done();
        }, () => {
            expect(false).toBe(true);
            done();
        });
    });

    it('should ask the player name when reconnecting to a freed slot', done => {
        spyOn(sut, '_askName');
        spyOn(mockedStorage, 'retrievePlayerId').and.returnValue('player_id');

        sut.activate({id: 'game_id'});
        mockedApi._reconnectDefered.reject(new Error());

        mockedApi._reconnectDefered.promise.then(() => {
            expect(false).toBe(true);
            done();
        }, () => {
            expect(sut._askName).toHaveBeenCalledWith('game_id');
            done();
        });
    });

    it('should join the game from a cookie', () => {
        spyOn(mockedStorage, 'retrievePlayerId').and.returnValue('player_id');
        spyOn(sut, '_askName');
        spyOn(mockedApi, 'joinGame').and.returnValue(new Promise(resolve => {}));

        sut.activate({id: 'game_id'});

        expect(mockedStorage.retrievePlayerId).toHaveBeenCalledWith('game_id');
        expect(sut._askName).not.toHaveBeenCalled();
        expect(mockedApi.joinGame).toHaveBeenCalledWith({
            gameId: 'game_id',
            playerId: 'player_id',
        });
    });

    it('should navigate to initialize the game if no id param', done => {
        spyOn(mockedApi, 'initializeGame');
        let data = {
            name: 'Tester',
            hero: 'daemon',
        };

        sut.activate();
        sut.playerInfoDefered.resolve(data);

        sut.playerInfoDefered.promise.then(() => {
            expect(mockedApi.initializeGame).toHaveBeenCalledWith('Tester', 'daemon');
            done();
        });
    });

    it('should edit name', done => {
        spyOn(mockedApi, 'updateMe');
        spyOn(sut, 'initPlayerInfoDefered').and.callThrough();
        let data = {
            name: 'Tester',
            hero: 'daemon',
        };

        sut.editMe();
        sut.playerInfoDefered.resolve(data);

        expect(sut.initPlayerInfoDefered).toHaveBeenCalled();
        sut.playerInfoDefered.promise.then(() => {
            expect(mockedApi.updateMe).toHaveBeenCalledWith('Tester', 'daemon');
            done();
        });
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
            test: {
                debug: false,
            },
            version: 42,
        };
        sut = new Create(
            mockedRouter,
            mockedApi,
            mockedStorage,
            mockedConfig,
            mockedobserverLocator,
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

        sut.activate({id: 'the_game_id'});
        mockedEas.publish('aot:api:create_game');

        expect(mockedRouter.navigateToRoute).toHaveBeenCalledWith(
            'play',
            {
                id: 'the_game_id',
                version: 'latest',
            }
        );
    });

    it('should create debug game when config.test.debug is true', () => {
        spyOn(mockedApi, 'createGameDebug');
        mockedConfig.test.debug = true;

        sut.activate();

        expect(mockedApi.createGameDebug).toHaveBeenCalled();
    });
});
