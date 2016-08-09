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
} from '../../../../app/test-utils';;


describe('game/create', () => {
    let sut;
    let mockedRouter;
    let mockedGame;
    let mockedApi;
    let mockedobserverLocator;
    let mockedStorage;
    let mockedConfig;
    let mockedHistory;

    beforeEach(() => {
        mockedRouter = new RouterStub();
        mockedApi = new ApiStub();
        mockedStorage = new StorageStub();
        mockedobserverLocator = new ObserverLocatorStub();
        mockedHistory = new HistoryStub();
        mockedConfig = {
            test: {
                debug: false
            }
        };
        sut = new Create(
            mockedRouter,
            mockedApi,
            mockedStorage,
            mockedConfig,
            mockedobserverLocator,
            mockedHistory
        );
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

    it('should reset with init method', () => {
        let observerLocatorStubResults = new ObserverLocatorStubResults();
        spyOn(sut, 'initPlayerInfoDefered');
        spyOn(sut, '_registerApiCallbacks');
        spyOn(mockedApi, 'init');
        spyOn(Wait, 'flushCache');
        spyOn(mockedobserverLocator, 'getObserver').and.returnValue(observerLocatorStubResults);
        spyOn(observerLocatorStubResults, 'subscribe');
        spyOn(mockedHistory, 'init');

        sut.init();

        expect(sut.initPlayerInfoDefered).toHaveBeenCalled();
        expect(sut._registerApiCallbacks).toHaveBeenCalled();
        expect(mockedApi.init).toHaveBeenCalled();
        expect(Wait.flushCache).toHaveBeenCalled();
        expect(mockedobserverLocator.getObserver).toHaveBeenCalledWith({}, 'name');
        expect(observerLocatorStubResults.subscribe).toHaveBeenCalled();
        expect(mockedHistory.init).toHaveBeenCalled();
    });

    it('should not ask for the name if it knows the player name', done => {
        spyOn(mockedApi, 'initializeGame');

        mockedApi._me = {
            name: 'Player 1'
        };
        sut.activate({id: 'toto'});
        sut.playerInfoDefered.resolve()

        sut.playerInfoDefered.promise.then(() => {
            expect(mockedApi.initializeGame).not.toHaveBeenCalled();
            done();
        });
    });

    it('should ask the player name when joining a game', done => {
        spyOn(mockedApi, 'joinGame');
        spyOn(mockedStorage, 'loadPlayerInfos');
        spyOn(mockedStorage, 'savePlayerInfos');

        sut.activate({id: 'game_id'});
        sut.playerInfoDefered.resolve({
            name: 'Tester',
            hero: 'daemon',
        });

        expect(mockedStorage.loadPlayerInfos).toHaveBeenCalled();
        sut.playerInfoDefered.promise.then(() => {
            expect(mockedApi.joinGame).toHaveBeenCalledWith({gameId: 'game_id', name: 'Tester', hero: 'daemon'});
            expect(mockedStorage.savePlayerInfos).toHaveBeenCalledWith({name: 'Tester', hero: 'daemon'});
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

    it('should navigate to create/{id} after game initialization', () => {
        let gameInitializedData = {game_id: 'the_game_id'};
        spyOn(mockedRouter, 'navigateToRoute');

        sut.activate();
        mockedApi.initializeGame(gameInitializedData);

        expect(mockedRouter.navigateToRoute).toHaveBeenCalledWith(
            'create',
            {id: gameInitializedData.game_id});
    });

    it('should create game', () => {
       spyOn(mockedApi, 'createGame');

        sut.createGame();

        expect(mockedApi.createGame).toHaveBeenCalled();
    });

    it('should navigate to play/{id} after the game creation', () => {
        spyOn(mockedRouter, 'navigateToRoute');

        sut.activate({id: 'the_game_id'});
        mockedApi.createGame();

        expect(mockedRouter.navigateToRoute).toHaveBeenCalledWith(
            'play',
            {id: 'the_game_id'}
        )
    });

    it('should create debug game when config.test.debug is true', () => {
        spyOn(mockedApi, 'createGameDebug');
        mockedConfig.test.debug = true;

        sut.activate();

        expect(mockedApi.createGameDebug).toHaveBeenCalled();
    });
});
