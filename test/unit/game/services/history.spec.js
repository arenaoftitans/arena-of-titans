/*
* Copyright (C) 2016 by Arena of Titans Contributors.
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

import { History } from '../../../../app/game/services/history';
import { ApiStub, EventAggregatorSubscriptionsStub } from '../../../../app/test-utils';

describe('services/history', () => {
    let sut;
    let mockedApi;
    let mockedEas;

    beforeEach(() => {
        mockedApi = new ApiStub();
        mockedEas = new EventAggregatorSubscriptionsStub();
        sut = new History(mockedApi, mockedEas);
    });

    it('init', () => {
        spyOn(mockedEas, 'subscribe');
        spyOn(mockedEas, 'dispose');

        sut.init();

        expect(mockedEas.dispose).toHaveBeenCalled();
        expect(mockedEas.subscribe).toHaveBeenCalled();
        expect(mockedEas.subscribe.calls.mostRecent().args[0]).toBe('aot:api:player_played');
    });

    it('init with null', () => {
        spyOn(mockedEas, 'subscribe');
        spyOn(mockedEas, 'dispose');
        spyOn(sut, '_addEntry');
        let message = {
            history: [
                [
                    {
                        card: 'card 1',
                        player_index: 0,
                    },
                    {
                        card: 'card 2',
                        player_index: 0,
                    },
                ],
                null,
            ],
        };
        mockedApi._reconnectDefered.promise = new Promise(resolve => {
            mockedApi._reconnectDefered.resolve = resolve;
        });
        mockedApi._reconnectDefered.resolve(message);

        return sut.init().then(() => {
            expect(mockedEas.dispose).toHaveBeenCalled();
            expect(mockedEas.subscribe).toHaveBeenCalled();
            expect(mockedEas.subscribe.calls.mostRecent().args[0]).toBe('aot:api:player_played');
            expect(sut._addEntry).toHaveBeenCalledWith({
                card: 'card 1',
                player_index: 0,
            });
            expect(sut._addEntry).toHaveBeenCalledWith({
                card: 'card 2',
                player_index: 0,
            });
        }, () => fail('Unwanted code branch'));
    });

    describe('getLastPlayedCards', () => {
        it('should return an empty array if history doesn\'t exists for player', () => {
            expect(sut.getLastPlayedCards(0)).toEqual(jasmine.any(Array));
            expect(sut.getLastPlayedCards(0).length).toBe(0);
        });

        it('should return one card if one entry', () => {
            sut._addEntry({
                card: 'card',
                player_index: 0,
            });

            expect(sut.getLastPlayedCards(0)).toEqual(['card']);
        });

        it('should return two cards if two entries', () => {
            sut._addEntry({
                card: 'card1',
                player_index: 0,
            });
            sut._addEntry({
                card: 'card2',
                player_index: 0,
            });

            expect(sut.getLastPlayedCards(0)).toEqual(['card1', 'card2']);
        });

        it('should return the two last cards if more than two entries', () => {
            sut._addEntry({
                card: 'card1',
                player_index: 0,
            });
            sut._addEntry({
                card: 'card2',
                player_index: 0,
            });
            sut._addEntry({
                card: 'card3',
                player_index: 0,
            });

            expect(sut.getLastPlayedCards(0)).toEqual(['card2', 'card3']);
        });
    });
});
