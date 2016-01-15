import { Api } from '../../../../app/game/services/api';
import { StorageStub, WsStub } from '../../utils';


describe('services/api', () => {
    let mockedStorage;
    let mockedWs;
    let sut;
    let rt;

    beforeEach(() => {
        mockedStorage = new StorageStub();
        mockedWs = new WsStub();
        sut = new Api(mockedWs, mockedStorage);
        rt = sut.requestTypes;
    });

    it('should send game data to ws on initialize game', () => {
        let gameData = {
            player_name: 'Tester',
            rt: rt.init_game
        };
        spyOn(mockedWs, 'send');

        sut.initializeGame('Tester');

        expect(mockedWs.send).toHaveBeenCalledWith(gameData);
    });

    it('should send slot data to ws', () => {
        let slot = {
            index: 0,
            player_name: '',
            state: 'OPEN'
        };
        spyOn(mockedWs, 'send');
        sut._game.slots = [];

        sut.addSlot();
        expect(mockedWs.send).toHaveBeenCalledWith({
            rt: rt.add_slot,
            slot: slot
        });
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
                state: 'TAKEN'
            }]
        };
        let gameInitializedCallback = jasmine.createSpy('gameInitializedCallback');
        sut.on(rt.game_initialized, gameInitializedCallback);
        spyOn(sut, '_handleGameInitialized').and.callThrough();
        spyOn(mockedStorage, 'savePlayerId');

        sut._handleMessage(gameInitializedMessage);
        expect(sut._handleGameInitialized).toHaveBeenCalledWith(gameInitializedMessage);
        expect(mockedStorage.savePlayerId).toHaveBeenCalledWith(gameInitializedMessage.game_id, gameInitializedMessage.player_id);
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
                state: 'OPEN'
            }
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
            index: 0
        };
        sut._game = {
            slots: [{
                index: 0,
                player_name: 'Player 1',
                state: 'TAKEN'
            }]
        };
        sut.updateName('New Name');

        expect(sut.me.name).toBe('New Name');
        expect(sut.game.slots[0].player_name).toBe('New Name');
        expect(mockedWs.send).toHaveBeenCalledWith({
            rt: sut.requestTypes.slot_updated,
            slot: {
                index: 0,
                player_name: 'New Name',
                state: 'TAKEN'
            }
        })
    });

    it('should send game data when joining game', () => {
        spyOn(mockedWs, 'send');

        sut.joinGame({gameId: 'the_game_id', name: 'Player 2'});

        expect(mockedWs.send).toHaveBeenCalledWith({
            rt: sut.requestTypes.init_game,
            player_name: 'Player 2',
            game_id: 'the_game_id',
            player_id: undefined
        });
    });

    it('should send game data when joining game with a cookie', () => {
        spyOn(mockedWs, 'send');

        sut.joinGame({gameId: 'the_game_id', playerId: 'player_id'});

        expect(mockedWs.send).toHaveBeenCalledWith({
            rt: sut.requestTypes.init_game,
            player_name: undefined,
            game_id: 'the_game_id',
            player_id: 'player_id'
        });
    });

    it('should handle errors to display', () => {
        let message = {error_to_display: 'error'};
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
        let message = {error: 'error'};
        let errorCb = jasmine.createSpy('errorCb');
        spyOn(sut, '_handleErrors').and.callThrough();
        spyOn(sut, '_callCallbacks');
        spyOn(console, 'error');

        sut.onerror(errorCb);
        sut._handleMessage(message);

        expect(sut._handleErrors).toHaveBeenCalledWith(message);
        expect(sut._callCallbacks).not.toHaveBeenCalled();
        expect(errorCb).not.toHaveBeenCalled();
        expect(console.error).toHaveBeenCalledWith(message);
    });
});
