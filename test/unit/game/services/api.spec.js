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
import { State } from '../../../../app/game/services/state';
import {
    AnimationsStub,
    ErrorsReporterStub,
    EventAggregatorStub,
    NotifyStub,
    StorageStub,
    WsStub,
} from '../../../../app/test-utils';


describe('services/api', () => {
    let mockedStorage;
    let mockedWs;
    let mockedNotify;
    let mockedEa;
    let mockedState;
    let mockedAnimations;
    let mockedErrorsReporter;
    let sut;
    let rt;

    beforeEach(() => {
        mockedStorage = new StorageStub();
        mockedWs = new WsStub();
        mockedNotify = new NotifyStub();
        mockedEa = new EventAggregatorStub();
        mockedState = new State();
        mockedAnimations = new AnimationsStub();
        mockedErrorsReporter = new ErrorsReporterStub();
        sut = new Api(
            mockedWs,
            mockedState,
            mockedStorage,
            mockedNotify,
            mockedEa,
            mockedAnimations,
            mockedErrorsReporter
        );
        rt = sut.requestTypes;
    });

    it('should initialize as expected', () => {
        spyOn(mockedAnimations, 'enable');
        spyOn(mockedErrorsReporter, 'enable');
        spyOn(mockedState, 'reset');

        sut.init();

        expect(mockedAnimations.enable).toHaveBeenCalled();
        expect(mockedErrorsReporter.enable).toHaveBeenCalled();
        expect(mockedState.reset).toHaveBeenCalled();
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
        spyOn(sut, '_handleGameInitialized').and.callThrough();
        spyOn(mockedStorage, 'saveGameData');
        spyOn(mockedState, 'initializeGame');

        sut._handleMessage(gameInitializedMessage);
        expect(sut._handleGameInitialized).toHaveBeenCalledWith(gameInitializedMessage);
        expect(mockedStorage.saveGameData).toHaveBeenCalledWith(
            gameInitializedMessage.game_id,
            {
                apiVersion: undefined,
                playerId: gameInitializedMessage.player_id,
            }
        );
        expect(mockedState.initializeGame).toHaveBeenCalledWith(gameInitializedMessage);
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
        spyOn(sut, '_handleSlotUpdated').and.callThrough();
        mockedState.game.slots = [];

        expect(mockedState.game.slots.length).toBe(0);
        sut._handleMessage(slotUpdatedMessage);
        expect(sut._handleSlotUpdated).toHaveBeenCalledWith(slotUpdatedMessage);
        expect(mockedState.game.slots.length).toBe(1);
        expect(mockedState.game.slots[0]).toBe(slotUpdatedMessage.slot);
        expect(mockedState.game.slots[0].name).toBe('');

        slotUpdatedMessage.slot.name = 'Player 1';
        slotUpdatedMessage.slot.state = 'TAKEN';
        sut._handleMessage(slotUpdatedMessage);
        expect(mockedState.game.slots.length).toBe(1);
        expect(mockedState.game.slots[0].name).toBe('Player 1');
        expect(mockedState.game.slots[0].state).toBe('TAKEN');
        expect(mockedState.game.slots[0].index).toBe(0);
    });

    it('should update name', () => {
        spyOn(mockedWs, 'send');
        mockedState._me = {
            name: 'Player 1',
            index: 0,
            hero: 'daemon',
        };
        mockedState._game = {
            slots: [{
                index: 0,
                player_name: 'Player 1',
                state: 'TAKEN',
            }],
        };

        sut.updateMe('New Name', 'reaper');

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
        let message = {error_to_display: 'error', rt: 'error2', is_fatal: false};
        spyOn(sut, '_handleErrors').and.callThrough();
        spyOn(sut._ea, 'publish');

        sut._handleMessage(message);

        expect(sut._handleErrors).toHaveBeenCalledWith(message);
        expect(sut._ea.publish).toHaveBeenCalledWith(
            'aot:api:error',
            {
                isFatal: false,
                message: message.error_to_display,
            }
        );
        expect(sut._ea.publish.calls.count()).toBe(1);
    });

    it('should handle errors to log', () => {
        let message = {error: 'error'};
        spyOn(sut, '_handleErrors').and.callThrough();
        spyOn(sut._logger, 'error');
        spyOn(sut._ea, 'publish');

        sut._handleMessage(message);

        expect(sut._handleErrors).toHaveBeenCalledWith(message);
        expect(sut._logger.error).toHaveBeenCalledWith(message);
        expect(sut._ea.publish).not.toHaveBeenCalled();
    });

    it('should create the game', () => {
        spyOn(mockedWs, 'send');

        mockedState._game = {
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

    it('should handle player played', () => {
        let message = {
            game_over: false,
            winners: [],
        };
        spyOn(mockedNotify, 'notifyGameOver');

        sut._handleGameOverMessage(message);

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

        expect(sut._gameOverDefered.resolve).toHaveBeenCalledWith(message.winners);
        expect(mockedNotify.notifyGameOver).toHaveBeenCalled();
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
            spyOn(mockedState, 'updateAfterPlay');
            spyOn(mockedNotify, 'clearNotifications');
            spyOn(mockedNotify, 'notifyYourTurn');
            mockedState.game.your_turn = true;

            sut._handleMessage(message);

            expect(mockedState.updateAfterPlay).toHaveBeenCalledWith(message);
            expect(mockedNotify.clearNotifications).not.toHaveBeenCalled();
            expect(mockedNotify.notifyYourTurn).toHaveBeenCalled();
        });

        it('should handle play and not your turn', () => {
            let message = {
                rt: sut.requestTypes.play,
                your_turn: false,
            };
            spyOn(mockedState, 'updateAfterPlay');
            spyOn(mockedNotify, 'clearNotifications');
            spyOn(mockedNotify, 'notifyYourTurn');
            mockedState.game.your_turn = false;

            sut._handleMessage(message);

            expect(mockedState.updateAfterPlay).toHaveBeenCalledWith(message);
            expect(mockedNotify.clearNotifications).toHaveBeenCalled();
            expect(mockedNotify.notifyYourTurn).not.toHaveBeenCalled();
        });

        it('should handle play and your turn and was not your turn', () => {
            let message = {
                rt: sut.requestTypes.play,
                your_turn: true,
            };
            spyOn(mockedState, 'updateAfterPlay');
            spyOn(mockedNotify, 'clearNotifications');
            spyOn(mockedNotify, 'notifyYourTurn');
            mockedState.game.your_turn = true;
            mockedState.game.was_your_turn = true;

            sut._handleMessage(message);

            expect(mockedState.updateAfterPlay).toHaveBeenCalledWith(message);
            expect(mockedNotify.clearNotifications).toHaveBeenCalled();
            expect(mockedNotify.notifyYourTurn).not.toHaveBeenCalled();
        });

        it('should reconnect', () => {
            let message = {
                rt: sut.requestTypes.play,
                hand: [
                    {
                        name: 'King',
                        color: 'Red',
                    },
                ],
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
                            name: 'Tower',
                            color: 'Red',
                        },
                    ],
                },
            };
            spyOn(mockedState, 'updateAfterPlay');

            sut._handleMessage(message);

            expect(mockedState.updateAfterPlay).toHaveBeenCalledWith(message);
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

            sut.playTrump({trumpName: 'Trump', trumpColor: null});

            expect(mockedWs.send).toHaveBeenCalledWith({
                rt: sut.requestTypes.play_trump,
                play_request: {
                    name: 'Trump',
                    color: null,
                    target_index: null,
                },
            });
        });

        it('should play trump with a target', () => {
            spyOn(mockedWs, 'send');

            sut.playTrump({trumpName: 'Trump', trumpColor: null, targetIndex: 0});

            expect(mockedWs.send).toHaveBeenCalledWith({
                rt: sut.requestTypes.play_trump,
                play_request: {
                    name: 'Trump',
                    color: null,
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

        it('should pass action', () => {
            spyOn(mockedWs, 'send');

            sut.passSpecialAction('assassination');

            expect(mockedWs.send).toHaveBeenCalledWith({
                rt: sut.requestTypes.special_action_play,
                play_request: {
                    special_action_name: 'assassination',
                    cancel: true,
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
                    target_index: 0,
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
            it('should join the game if game was created', () => {
                sut._reconnectDefered = {};
                sut._gameId = 'game_id';
                let promise = new Promise(resolve => resolve());
                spyOn(sut, 'joinGame').and.returnValue(promise);
                spyOn(sut._ws, 'sendDefered');

                sut._handleWsReconnected();

                expect(sut._reconnectDefered.promise).toEqual(jasmine.any(Promise));
                return promise.then(() => {
                    expect(sut._ws.sendDefered).toHaveBeenCalled();
                }, () => fail('Unwanted code branch'));
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
