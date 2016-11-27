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

import { Api } from '../../../../app/game/services/api';
import { EventAgregatorStub, NotifyStub, StorageStub, WsStub } from '../../../../app/test-utils';


describe('services/api', () => {
    let mockedStorage;
    let mockedWs;
    let mockedConfig;
    let mockedNotify;
    let mockedEa;
    let sut;
    let rt;

    beforeEach(() => {
        mockedStorage = new StorageStub();
        mockedWs = new WsStub();
        mockedConfig = {
            test: {
                debug: false,
            },
        };
        mockedNotify = new NotifyStub();
        mockedEa = new EventAgregatorStub();
        sut = new Api(mockedWs, mockedStorage, mockedConfig, mockedNotify, mockedEa);
        rt = sut.requestTypes;
    });

    it('should send game data to ws on initialize game', () => {
        let gameData = {
            player_name: 'Tester',
            hero: 'daemon',
            rt: rt.init_game,
        };
        spyOn(mockedWs, 'send');

        sut.initializeGame('Tester', 'daemon');

        expect(mockedWs.send).toHaveBeenCalledWith(gameData);
    });

    it('should register callbacks', () => {
        let cb = () => {
        };
        sut.on(rt.init_game, cb);

        expect(sut.callbacks[rt.init_game].length).toBe(1);
        expect(sut.callbacks[rt.init_game][0]).toBe(cb);
    });

    it('should deregister callbacks', () => {
        let index = sut.on(rt.init_game, () => {
        });
        sut.off(rt.init_game, index);

        expect(sut.callbacks[rt.init_game].length).toBe(1);
        expect(sut.callbacks[rt.init_game][0]).toBe(undefined);
    });

    it('should handle game initialized', () => {
        let gameInitializedMessage = {
            rt: sut.requestTypes.game_initialized,
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
        let gameInitializedCallback = jasmine.createSpy('gameInitializedCallback');
        sut.on(rt.game_initialized, gameInitializedCallback);
        spyOn(sut, '_handleGameInitialized').and.callThrough();
        spyOn(mockedStorage, 'savePlayerId');

        sut._handleMessage(gameInitializedMessage);
        expect(sut._handleGameInitialized).toHaveBeenCalledWith(gameInitializedMessage);
        expect(mockedStorage.savePlayerId).toHaveBeenCalledWith(
            gameInitializedMessage.game_id,
            gameInitializedMessage.player_id
        );
        expect(sut.me.index).toBe(gameInitializedMessage.index);
        expect(sut.me.is_game_master).toBe(gameInitializedMessage.is_game_master);
        expect(sut.me.id).toBe(gameInitializedMessage.player_id);
        expect(sut.game.id).toBe(gameInitializedMessage.game_id);
        expect(sut.game.slots).toBe(gameInitializedMessage.slots);
        expect(gameInitializedCallback).toHaveBeenCalledWith(gameInitializedMessage);
    });

    it('should handle slot updated', () => {
        let slotUpdatedMessage = {
            rt: sut.requestTypes.slot_updated,
            slot: {
                index: 0,
                name: '',
                state: 'OPEN',
            },
        };
        let slotUpdatedCallback = jasmine.createSpy('slotUpdatedCallback');
        sut.on(rt.slot_updated, slotUpdatedCallback);
        spyOn(sut, '_handleSlotUpdated').and.callThrough();
        sut._game.slots = [];

        expect(sut._game.slots.length).toBe(0);
        sut._handleMessage(slotUpdatedMessage);
        expect(sut._handleSlotUpdated).toHaveBeenCalledWith(slotUpdatedMessage);
        expect(sut._game.slots.length).toBe(1);
        expect(sut._game.slots[0]).toBe(slotUpdatedMessage.slot);
        expect(sut._game.slots[0].name).toBe('');
        expect(slotUpdatedCallback).toHaveBeenCalledWith(slotUpdatedMessage);

        slotUpdatedMessage.slot.name = 'Player 1';
        slotUpdatedMessage.slot.state = 'TAKEN';
        sut._handleMessage(slotUpdatedMessage);
        expect(sut._game.slots.length).toBe(1);
        expect(sut._game.slots[0].name).toBe('Player 1');
        expect(sut._game.slots[0].state).toBe('TAKEN');
        expect(sut._game.slots[0].index).toBe(0);
        expect(slotUpdatedCallback).toHaveBeenCalledWith(slotUpdatedMessage);
    });

    it('should update name', () => {
        spyOn(mockedWs, 'send');

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
        expect(mockedWs.send).toHaveBeenCalledWith({
            rt: sut.requestTypes.slot_updated,
            slot: {
                hero: 'reaper',
                index: 0,
                player_name: 'New Name',
                state: 'TAKEN',
            },
        });
    });

    it('should send game data when joining game', () => {
        spyOn(mockedWs, 'send');

        sut.joinGame({gameId: 'the_game_id', name: 'Player 2', hero: 'daemon'});

        expect(mockedWs.send).toHaveBeenCalledWith({
            rt: sut.requestTypes.init_game,
            player_name: 'Player 2',
            game_id: 'the_game_id',
            player_id: undefined,
            hero: 'daemon',
        });
    });

    it('should send game data when joining game with a game id', () => {
        spyOn(mockedWs, 'send');

        sut.joinGame({gameId: 'the_game_id', playerId: 'player_id', hero: 'daemon'});

        expect(mockedWs.send).toHaveBeenCalledWith({
            rt: sut.requestTypes.init_game,
            player_name: undefined,
            game_id: 'the_game_id',
            player_id: 'player_id',
            hero: 'daemon',
        });
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

        expect(sut._game.players.heroes).toEqual(['daemon', null, 'orc']);
        expect(sut._game.players.indexes).toEqual([0, null, 2]);
        expect(sut._game.players.names).toEqual(['Player 1', null, 'Player 2']);
        expect(sut._game.players.squares).toEqual([{x: 1, y: 2}, {}, {}]);
    });

    describe('joinGame', () => {
        it('should fetch the game id if neither name nor playerId is defined', () => {
            spyOn(mockedStorage, 'retrievePlayerId').and.returnValue('player_id');
            spyOn(mockedWs, 'send');

            sut.joinGame({gameId: 'game_id'});

            expect(mockedStorage.retrievePlayerId).toHaveBeenCalledWith('game_id');
            expect(mockedWs.send).toHaveBeenCalledWith({
                rt: sut.requestTypes.init_game,
                player_name: undefined,
                game_id: 'game_id',
                player_id: 'player_id',
                hero: undefined,
            });
        });

        it('should not fetch the if playerId is defined', () => {
            spyOn(mockedStorage, 'retrievePlayerId');

            sut.joinGame({gameId: 'game_id', playerId: 'player_id'});

            expect(mockedStorage.retrievePlayerId).not.toHaveBeenCalled();
        });

        it('should not fetch the if name is defined', () => {
            spyOn(mockedStorage, 'retrievePlayerId');

            sut.joinGame({gameId: 'game_id', name: 'Player 1'});

            expect(mockedStorage.retrievePlayerId).not.toHaveBeenCalled();
        });
    });

    it('should handle errors to display', () => {
        let message = {error_to_display: 'error'};
        let errorCb = jasmine.createSpy('errorCb');
        spyOn(sut, '_handleErrors').and.callThrough();
        spyOn(sut, '_callCallbacks');

        sut.onerror(errorCb);
        sut._handleMessage(message);

        expect(sut._handleErrors).toHaveBeenCalledWith(message);
        expect(sut._callCallbacks).not.toHaveBeenCalled();
        expect(errorCb).toHaveBeenCalledWith({message: message.error_to_display});
    });

    it('should handle errors to log', () => {
        let message = {error: 'error'};
        let errorCb = jasmine.createSpy('errorCb');
        spyOn(sut, '_handleErrors').and.callThrough();
        spyOn(sut, '_callCallbacks');
        spyOn(sut._logger, 'error');

        sut.onerror(errorCb);
        sut._handleMessage(message);

        expect(sut._handleErrors).toHaveBeenCalledWith(message);
        expect(sut._callCallbacks).not.toHaveBeenCalled();
        expect(errorCb).not.toHaveBeenCalled();
        expect(sut._logger.error).toHaveBeenCalledWith(message);
    });

    it('should create the game', () => {
        spyOn(mockedWs, 'send');

        sut._game = {
            slots: [
                {
                    index: 0,
                    player_name: 'Player 1',
                    hero: 'daemon',
                },
                {
                    index: 1,
                    player_name: 'Player 2',
                    hero: 'daemon',
                },
            ],
        };
        sut.createGame();

        expect(mockedWs.send).toHaveBeenCalledWith({
            rt: sut.requestTypes.create_game,
            debug: true,
            create_game_request: [
                {
                    index: 0,
                    name: 'Player 1',
                    hero: 'daemon',
                },
                {
                    index: 1,
                    name: 'Player 2',
                    hero: 'daemon',
                },
            ],
        });
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
        sut._me.index = 0;

        sut._updateGame(message);

        expect(sut._game.your_turn).toBe(true);
        expect(sut._game.next_player).toBe(0);
        expect(sut._game.active_trumps.length).toBe(2);
        expect(sut._game.active_trumps[0]).toBe(message.active_trumps[0]);
        expect(sut._game.active_trumps[1]).toBe(message.active_trumps[1]);
        expect(sut._me.hand).toEqual([
            {
                name: 'King',
                color: 'RED',
                img: 'sprite-movement-king-red',
            },
        ]);
        expect(sut._me.has_won).toBe(false);
        expect(sut._me.rank).toBe(-1);
        expect(sut._me.affecting_trumps).toEqual([{
            name: 'Reinforcements',
            img: '/assets/game/cards/trumps/reinforcements.png',
        }]);
        expect(sut._me.elapsed_time).toBe(elapsedTime);
        expect(sut._me.on_last_line).toBe(false);
    });

    it('should handle player played', () => {
        let message = {
            game_over: false,
            winners: [],
        };
        spyOn(mockedNotify, 'notifyGameOver');

        sut._handleGameOverMessage(message);

        expect(sut._game.game_over).toBe(false);
        expect(sut._game.winners.length).toBe(0);
        expect(mockedNotify.notifyGameOver).not.toHaveBeenCalled();
    });

    it('should handle player played game over', () => {
        let message = {
            game_over: true,
            winners: ['Player 1', 'Player 2'],
        };
        spyOn(sut._gameOverDefered, 'resolve');
        spyOn(mockedNotify, 'notifyGameOver');

        sut._handleGameOverMessage(message);

        expect(sut._game.game_over).toBe(true);
        expect(sut._game.winners.length).toBe(2);
        expect(sut._gameOverDefered.resolve).toHaveBeenCalledWith(message.winners);
        expect(mockedNotify.notifyGameOver).toHaveBeenCalled();
    });

    it('should handle game created data', () => {
        let message = {
            rt: sut.requestTypes.create_game,
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
                name: 'Red Tower',
                description: 'Prevents a player to move on red squares.',
                cost: 0,
                duration: 1,
                must_target_player: true,
            }],
        };
        spyOn(sut, '_updateGame');
        sut._handleMessage(message);

        expect(sut._updateGame).toHaveBeenCalledWith(message);
        expect(sut._game.players).toEqual({
            heroes: ['daemon', 'reaper'],
            indexes: [0, 1],
            names: ['Player 1', 'Player 2'],
            squares: [{}, {}],
        });
        expect(sut._me.trumps).toEqual([{
            name: 'Red Tower',
            img: '/assets/game/cards/trumps/red-tower.png',
            description: 'Prevents a player to move on red squares.',
            cost: 0,
            duration: 1,
            must_target_player: true,
        }]);
    });

    it('should create game for debug', () => {
        spyOn(sut, 'initializeGame');
        spyOn(mockedWs, 'send');
        spyOn(sut, 'createGame');
        mockedConfig.test.debug = true;

        sut.createGameDebug();
        expect(sut.initializeGame).toHaveBeenCalledWith('Player 1', 'daemon');

        sut._handleMessage({
            rt: rt.game_initialized,
            game_id: 'game_id',
            player_id: 'player_id',
            index: 0,
            is_game_master: true,
            slots: [{
                player_name: 'Player 1',
            }],
        });

        sut._handleMessage({
            rt: rt.slot_updated,
            slot: {
                index: 1,
            },
        });
        expect(sut.createGame).toHaveBeenCalled();
    });

    describe('game', () => {
        it('should view possible movements', () => {
            spyOn(mockedWs, 'send');

            sut.viewPossibleMovements({name: 'King', color: 'red'});

            expect(mockedWs.send).toHaveBeenCalledWith({
                rt: sut.requestTypes.view,
                play_request: {
                    card_name: 'King',
                    card_color: 'red',
                },
            });
        });

        it('should play', () => {
            spyOn(mockedWs, 'send');

            sut.play({cardName: 'King', cardColor: 'red', x: '0', y: '0'});

            expect(mockedWs.send).toHaveBeenCalledWith({
                rt: sut.requestTypes.play,
                play_request: {
                    card_name: 'King',
                    card_color: 'red',
                    x: 0,
                    y: 0,
                },
            });
        });

        it('should handle play and your turn', () => {
            let message = {
                rt: sut.requestTypes.play,
                your_turn: true,
            };
            spyOn(sut, '_updateGame');
            spyOn(mockedNotify, 'clearNotifications');
            spyOn(mockedNotify, 'notifyYourTurn');
            sut._game.your_turn = true;

            sut._handleMessage(message);

            expect(sut._updateGame).toHaveBeenCalledWith(message);
            expect(mockedNotify.clearNotifications).not.toHaveBeenCalled();
            expect(mockedNotify.notifyYourTurn).toHaveBeenCalled();
        });

        it('should handle play and not your turn', () => {
            let message = {
                rt: sut.requestTypes.play,
                your_turn: false,
            };
            spyOn(sut, '_updateGame');
            spyOn(mockedNotify, 'clearNotifications');
            spyOn(mockedNotify, 'notifyYourTurn');
            sut._game.your_turn = false;

            sut._handleMessage(message);

            expect(sut._updateGame).toHaveBeenCalledWith(message);
            expect(mockedNotify.clearNotifications).toHaveBeenCalled();
            expect(mockedNotify.notifyYourTurn).not.toHaveBeenCalled();
        });

        it('should handle play and your turn and was not your turn', () => {
            let message = {
                rt: sut.requestTypes.play,
                your_turn: true,
            };
            spyOn(sut, '_updateGame');
            spyOn(mockedNotify, 'clearNotifications');
            spyOn(mockedNotify, 'notifyYourTurn');
            sut._game.your_turn = true;
            sut._game.was_your_turn = true;

            sut._handleMessage(message);

            expect(sut._updateGame).toHaveBeenCalledWith(message);
            expect(mockedNotify.clearNotifications).toHaveBeenCalled();
            expect(mockedNotify.notifyYourTurn).not.toHaveBeenCalled();
        });

        it('should reconnect', () => {
            let message = {
                rt: sut.requestTypes.play,
                reconnect: {
                    players: [
                        {
                            index: 0,
                            square: {x: 0, y: 0},
                            hero: 'daemon',
                        },
                    ],
                    trumps: [
                        {
                            name: 'Tower red',
                        },
                    ],
                },
            };
            spyOn(sut, '_updateGame');

            sut._handleMessage(message);

            expect(sut._updateGame).toHaveBeenCalled();
            expect(sut._game.players).toEqual({
                indexes: [0],
                names: [undefined],
                squares: [{x: 0, y: 0}],
                heroes: ['daemon'],
            });
            expect(sut._me.trumps).toEqual([
                {
                    name: 'Tower red',
                    img: '/assets/game/cards/trumps/tower-red.png',
                },
            ]);
        });

        it('should ask name when reconnecting to a freed slot', () => {
            spyOn(sut._reconnectDefered, 'reject');

            let message = {
                rt: sut.requestTypes.game_initialized,
                index: -1,
            };

            sut._handleMessage(message);

            expect(sut._reconnectDefered.reject).toHaveBeenCalled();
        });

        it('should play trump without target', () => {
            spyOn(mockedWs, 'send');

            sut.playTrump({trumpName: 'Trump'});

            expect(mockedWs.send).toHaveBeenCalledWith({
                rt: sut.requestTypes.play_trump,
                play_request: {
                    name: 'Trump',
                    target_index: null,
                },
            });
        });

        it('should play trump with a target', () => {
            spyOn(mockedWs, 'send');

            sut.playTrump({trumpName: 'Trump', targetIndex: 0});

            expect(mockedWs.send).toHaveBeenCalledWith({
                rt: sut.requestTypes.play_trump,
                play_request: {
                    name: 'Trump',
                    target_index: 0,
                },
            });
        });

        it('should pass', () => {
            spyOn(mockedWs, 'send');

            sut.pass();

            expect(mockedWs.send).toHaveBeenCalledWith({
                rt: sut.requestTypes.play,
                play_request: {
                    pass: true,
                },
            });
        });

        it('should discard', () => {
            spyOn(mockedWs, 'send');

            sut.discard({cardName: 'King', cardColor: 'red'});

            expect(mockedWs.send).toHaveBeenCalledWith({
                rt: sut.requestTypes.play,
                play_request: {
                    discard: true,
                    card_name: 'King',
                    card_color: 'red',
                },
            });
        });

        describe('special actions', () => {
            it('should display possible actions for assassinate', () => {
                spyOn(sut._ws, 'send');

                sut.viewPossibleActions({
                    name: 'assassination',
                    targetIndex: 0,
                });

                expect(sut._ws.send).toHaveBeenCalledWith({
                    rt: sut.requestTypes.special_action_view_possible_actions,
                    play_request: {
                        special_action_name: 'assassination',
                        target_index: 0,
                    },
                });
            });

            it('should handle special action played for invalid action', () => {
                spyOn(sut._logger, 'error');

                sut._handleSpecialActionPlayed({special_action_name: 'action'});

                expect(sut._logger.error).toHaveBeenCalled();
            });

            it('should handle special action played for assassination', () => {
                spyOn(sut, '_movePlayer');

                sut._handleSpecialActionPlayed({
                    special_action_name: 'Assassination',
                    player_index: 0,
                    new_square: {
                        x: 1,
                        y: 2,
                    },
                });

                expect(sut._movePlayer).toHaveBeenCalledWith({
                    playerIndex: 0,
                    newSquare: {
                        x: 1,
                        y: 2,
                    },
                });
            });

            it('should handle special action played when canceled', () => {
                spyOn(sut, '_movePlayer');

                sut._handleSpecialActionPlayed({
                    special_action_name: null,
                    player_index: 0,
                });

                expect(sut._movePlayer).not.toHaveBeenCalled();
            });

            it('should cancel special action', () => {
                spyOn(sut._ws, 'send');

                sut.cancelSpecialAction('assassination');

                expect(sut._ws.send).toHaveBeenCalledWith({
                    rt: sut.requestTypes.special_action_play,
                    play_request: {
                        special_action_name: 'assassination',
                        cancel: true,
                        target_index: -1,
                    },
                });
            });
        });

        describe('WS reconnected', () => {
            it('should join the game if game was created', done => {
                sut._reconnectDefered = {};
                sut._gameId = 'game_id';
                let promise = new Promise(resolve => resolve());
                spyOn(sut, 'joinGame').and.returnValue(promise);
                spyOn(sut._ws, 'sendDefered');

                sut._handleWsReconnected();

                expect(sut._reconnectDefered.promise).toEqual(jasmine.any(Promise));
                promise.then(() => {
                    expect(sut._ws.sendDefered).toHaveBeenCalled();
                    done();
                });
            });

            it('should not join the game if it has not been created', () => {
                spyOn(sut, '_createReconnectDefered');
                spyOn(sut, 'joinGame');

                sut._handleWsReconnected();

                expect(sut._createReconnectDefered).not.toHaveBeenCalled();
                expect(sut.joinGame).not.toHaveBeenCalled();
            });
        });
    });
});
