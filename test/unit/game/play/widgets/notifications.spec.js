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

import { AotNotificationsCustomElement } from '../../../../../app/game/play/widgets/notifications/notifications';
import {
    ApiStub,
    GameStub,
    I18nStub,
    EventAgregatorStub,
}
from '../../../../../app/test-utils';


describe('notifications', () => {
    let mockedApi;
    let mockedI18n;
    let mockedEa;
    let mockedOptions;
    let mockedGame;
    let sut;

    beforeEach(() => {
        mockedApi = new ApiStub();
        mockedI18n = new I18nStub();
        mockedEa = new EventAgregatorStub();
        mockedOptions = {};
        mockedGame = new GameStub();
        sut = new AotNotificationsCustomElement(mockedApi, mockedI18n, mockedEa, mockedOptions, mockedGame);
    });

    it('should update last action on player played', () => {
        spyOn(mockedI18n, 'tr').and.returnValue('translated');
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

        expect(mockedI18n.tr).toHaveBeenCalledWith(
            'actions.played',
            {
                playerName: 'Player 1',
                targetName: undefined,
            });
        expect(sut.lastAction.description).toBe('translated');
        expect(sut.lastAction.card).toEqual(message.last_action.card);
        expect(sut.lastAction.img).toBe('/assets/game/cards/movement/king-red.png');
    });

    it('should update last action when a trump is played', () => {
        spyOn(mockedI18n, 'tr').and.returnValue('translated');
        let cb = mockedApi._cbs[mockedApi.requestTypes.play_trump][0];
        let message = {
            last_action: {
                description: 'played_trump',
                trump: {
                    name: 'Tower Blue',
                    description: 'Block player.'
                },
                player_name: 'Player 1',
                target_name: 'Player 2',
            }
        };

        cb(message);

       expect(mockedI18n.tr).toHaveBeenCalledWith(
            'actions.played_trump',
            {
                playerName: 'Player 1',
                targetName: 'Player 2',
            });
        expect(sut.lastAction.description).toBe('translated');
        expect(mockedI18n.tr).toHaveBeenCalledWith('trumps.tower_blue_description');
        expect(sut.lastAction.trump.description).toBe('translated');
        expect(sut.lastAction.trump).toEqual(message.last_action.trump);
        expect(sut.lastAction.img).toBe('/assets/game/cards/trumps/tower-blue.png');
    });

    describe('guided visit', () => {
        it('cancel', done => {
            let popupDefered = {};
            popupDefered.promise = new Promise((resolve, reject) => {
                popupDefered.reject = reject;
            });
            spyOn(mockedGame, 'popup').and.returnValue(popupDefered.promise);
            mockedOptions.proposeGuidedVisit = true;

            sut.bind();

            expect(mockedGame.popup).toHaveBeenCalledWith('yes-no', {title: 'game.visit.propose'});
            popupDefered.reject(new Error());
            popupDefered.promise.then(() => {
                expect(true).toBe(false);
                done();
            }, () => {
                expect(mockedOptions.proposeGuidedVisit).toBe(false);
                done();
            });
        });

        it('skip', () => {
            mockedOptions.proposeGuidedVisit = false;
            spyOn(mockedGame, 'popup');

            sut.bind();

            expect(mockedGame.popup).not.toHaveBeenCalled();
        });

        it('start', done => {
            let popupDefered = {};
            popupDefered.promise = new Promise((resolve, reject) => {
                popupDefered.resolve = resolve;
            });
            spyOn(mockedGame, 'popup').and.returnValue(popupDefered.promise);
            spyOn(mockedEa, 'publish');
            spyOn(sut, '_startGuidedVisit').and.callThrough();
            spyOn(sut, '_displayNextVisitText');
            mockedOptions.proposeGuidedVisit = true;

            sut.bind();

            expect(mockedGame.popup).toHaveBeenCalledWith('yes-no', {title: 'game.visit.propose'});
            popupDefered.resolve();
            popupDefered.promise.then(() => {
                expect(sut._startGuidedVisit).toHaveBeenCalled();
                expect(sut._tutorialInProgress).toBe(true);
                expect(mockedEa.publish).toHaveBeenCalledWith('aot:notifications:start_guided_visit');
                expect(sut._displayNextVisitText).toHaveBeenCalled();
                done();
            }, () => {
                expect(false).toBe(true);
                done();
            });
        });

        it('display', () => {
            let initialGuidedVisitIndex = sut.guidedVisitTextIndex;
            spyOn(sut, '_highlightVisitElements');

            sut._displayNextVisitText();

            expect(sut.guidedVisitTextIndex).toBe(initialGuidedVisitIndex + 1);
            expect(sut._highlightVisitElements).toHaveBeenCalledWith(initialGuidedVisitIndex);
        });
    });
});
