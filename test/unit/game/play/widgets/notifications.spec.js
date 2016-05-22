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

import '../../../setup';
import { AotNotificationsCustomElement } from '../../../../../app/game/play/widgets/notifications';
import { ApiStub, I18nStub } from '../../../utils';


describe('notifications', () => {
    let mockedApi;
    let mockedI18n;
    let sut;

    beforeEach(() => {
        mockedApi = new ApiStub();
        mockedI18n = new I18nStub();
        sut = new AotNotificationsCustomElement(mockedApi, mockedI18n);
    });

    it('should update last action on player played', () => {
        let cb = mockedApi._cbs[mockedApi.requestTypes.player_played][0];
        let message = {
            player_index: 0,
            last_action: {
                description: 'played',
                card: {
                    name: 'King',
                    color: 'RED',
                    description: 'A card'
                },
                player_name: 'Player 1'
            }
        };

        cb(message);

        expect(sut.playerName).toBe('Player 1');
        expect(sut.lastAction.description).toBe('played');
        expect(sut.lastAction.card).toEqual(message.last_action.card);
        expect(sut.lastAction.img).toBe('/assets/game/cards/movement/king-red.png');
    });

    it('should update last action when a trump is played', () => {
        let cb = mockedApi._cbs[mockedApi.requestTypes.play_trump][0];
        let message = {
            last_action: {
                description: 'Someone played a trump',
                trump: {
                    name: 'Tower Blue',
                    description: 'Block player.'
                },
                player_name: 'Player 1'
            }
        };

        cb(message);

        expect(sut.playerName).toBe('Player 1');
        expect(sut.lastAction.description).toBe('Someone played a trump');
        expect(sut.lastAction.trump.description).toBe('tower-blue_description');
        expect(sut.lastAction.trump).toEqual(message.last_action.trump);
        expect(sut.lastAction.img).toBe('/assets/game/cards/trumps/tower-blue.png');
    });
});
