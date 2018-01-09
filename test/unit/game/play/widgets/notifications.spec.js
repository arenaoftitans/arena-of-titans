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

import { AotNotificationsCustomElement } from '../../../../../app/game/play/widgets/notifications/notifications';  // eslint-disable-line
import {
    ApiStub,
    PopupStub,
    I18nStub,
    EventAggregatorSubscriptionsStub,
    OptionsStub,
} from '../../../../../app/test-utils';


describe('notifications', () => {
    let mockedApi;
    let mockedI18n;
    let mockedEas;
    let mockedOptions;
    let mockedPopup;
    let sut;

    beforeEach(() => {
        mockedApi = new ApiStub();
        mockedI18n = new I18nStub();
        mockedEas = new EventAggregatorSubscriptionsStub();
        mockedOptions = new OptionsStub();
        mockedPopup = new PopupStub();
        sut = new AotNotificationsCustomElement(
            mockedApi,
            mockedI18n,
            mockedOptions,
            mockedPopup,
            mockedEas
        );
    });

    it('should update last action on player played', () => {
        spyOn(mockedI18n, 'tr').and.returnValue('translated');
        let message = {
            player_index: 0,
            last_action: {
                description: 'played',
                card: {
                    name: 'King',
                    color: 'RED',
                    description: 'A card',
                },
                player_name: 'Player 1',
            },
        };

        mockedEas.publish('aot:api:player_played', message);

        expect(mockedI18n.tr).toHaveBeenCalledWith(
            'actions.played',
            {
                playerName: 'Player 1',
                targetName: undefined,
            });
        expect(sut.lastAction.description).toBe('translated');
        expect(sut.lastAction.card).toEqual(message.last_action.card);
        expect(sut.lastAction.img).toBe('/latest/assets/game/cards/movement/king-red.png');
    });

    it('should update last action when a trump is played', () => {
        spyOn(mockedI18n, 'tr').and.returnValue('translated');
        let message = {
            last_action: {
                description: 'played_trump',
                trump: {
                    name: 'Tower',
                    color: 'Blue',
                    description: 'Block player.',
                },
                player_name: 'Player 1',
                target_name: 'Player 2',
            },
        };

        mockedEas.publish('aot:api:play_trump', message);

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
        expect(sut.lastAction.img).toBe('/latest/assets/game/cards/trumps/tower-blue.png');
    });

    it('should dispose subscriptions', () => {
        spyOn(mockedEas, 'dispose');

        sut.unbind();

        expect(mockedEas.dispose).toHaveBeenCalled();
    });

    describe('guided visit', () => {
        it('cancel', () => {
            let popupDefered = {};
            popupDefered.promise = new Promise((resolve, reject) => {
                popupDefered.reject = reject;
            });
            spyOn(mockedPopup, 'display').and.returnValue(popupDefered.promise);
            mockedOptions.proposeGuidedVisit = true;

            sut.bind();

            expect(mockedPopup.display).toHaveBeenCalledWith(
                'yes-no',
                {
                    translate: {
                        messages: { title: 'game.visit.propose' },
                    },
                }
            );
            popupDefered.reject(new Error());
            return popupDefered.promise.then(() => fail('Unwanted code branch'), () => {
                expect(mockedOptions.proposeGuidedVisit).toBe(false);
            }, () => fail('Unwanted code branch'));
        });

        it('skip', () => {
            mockedOptions.proposeGuidedVisit = false;
            spyOn(mockedPopup, 'display');

            sut.bind();

            expect(mockedPopup.display).not.toHaveBeenCalled();
        });

        it('start', () => {
            let popupDefered = {};
            popupDefered.promise = new Promise((resolve, reject) => {
                popupDefered.resolve = resolve;
            });
            spyOn(mockedPopup, 'display').and.returnValue(popupDefered.promise);
            spyOn(mockedEas, 'publish');
            spyOn(sut, '_startGuidedVisit').and.callThrough();
            spyOn(sut, '_displayNextVisitText');
            mockedOptions.proposeGuidedVisit = true;

            sut.bind();

            expect(mockedPopup.display).toHaveBeenCalledWith(
                'yes-no',
                {
                    translate: {
                        messages: { title: 'game.visit.propose' },
                    },
                }
            );
            popupDefered.resolve();
            return popupDefered.promise.then(() => {
                expect(sut._startGuidedVisit).toHaveBeenCalled();
                expect(sut._tutorialInProgress).toBe(true);
                expect(mockedEas.publish)
                    .toHaveBeenCalledWith('aot:notifications:start_guided_visit');
                expect(sut._displayNextVisitText).toHaveBeenCalled();
            }, () => fail('Unwanted code branch'));
        });

        it('display', () => {
            let initialGuidedVisitIndex = sut.guidedVisitTextIndex;
            spyOn(sut, '_highlightVisitElements');

            sut._displayNextVisitText();

            expect(sut.guidedVisitTextIndex).toBe(initialGuidedVisitIndex + 1);
            expect(sut._highlightVisitElements).toHaveBeenCalledWith(initialGuidedVisitIndex);
        });
    });

    describe('special action', () => {
        it('should notify special actions without popup', () => {
            sut.specialActionInProgress = false;
            spyOn(sut, '_translateSpecialActionText');
            spyOn(mockedOptions, 'mustViewInGameHelp').and.returnValue(false);
            spyOn(mockedEas, 'publish');
            spyOn(mockedPopup, 'display');

            sut._notifySpecialAction({special_action_name: 'action'});

            expect(sut.specialActionInProgress).toBe(true);
            expect(sut._specialActionName).toBe('action');
            expect(sut._translateSpecialActionText).toHaveBeenCalled();
            expect(mockedOptions.mustViewInGameHelp).toHaveBeenCalledWith('action');
            expect(mockedEas.publish)
                .toHaveBeenCalledWith('aot:notifications:special_action_in_game_help_seen');
            expect(mockedPopup.display).not.toHaveBeenCalled();
        });

        it('should notify special actions with popup', () => {
            sut.specialActionInProgress = false;
            spyOn(sut, '_translateSpecialActionText');
            spyOn(mockedOptions, 'mustViewInGameHelp').and.returnValue(true);
            spyOn(mockedEas, 'publish');
            let promise = new Promise(resolve => resolve());
            spyOn(mockedPopup, 'display').and.returnValue(promise);

            sut._notifySpecialAction({special_action_name: 'action'});

            expect(sut.specialActionInProgress).toBe(true);
            expect(sut._specialActionName).toBe('action');
            expect(sut._translateSpecialActionText).toHaveBeenCalled();
            expect(mockedOptions.mustViewInGameHelp).toHaveBeenCalledWith('action');
            expect(mockedPopup.display).toHaveBeenCalled();
            promise.then(() => {
                expect(mockedEas.publish)
                    .toHaveBeenCalledWith('aot:notifications:special_action_in_game_help_seen');
            }, () => fail('Unwanted code branch'));
        });

        it('should handle special action played message', () => {
            sut.specialActionInProgress = true;
            sut._specialActionName = 'toto';
            spyOn(sut, '_updateLastAction');

            sut._handleSpecialActionPlayed({special_action_name: 'action'});

            expect(sut.specialActionInProgress).toBe(false);
            expect(sut._specialActionName).toBe(undefined);
            expect(sut._updateLastAction).toHaveBeenCalledWith({special_action_name: 'action'});
        });
    });
});
