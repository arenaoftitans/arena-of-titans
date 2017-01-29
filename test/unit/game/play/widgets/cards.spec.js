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

import { AotCardsCustomElement } from '../../../../../app/game/play/widgets/cards/cards';
import {
    ApiStub,
    GameStub,
    I18nStub,
    EventAggregatorSubscriptionsStub,
    ObserverLocatorStub,
    ObserverLocatorStubResults,
} from '../../../../../app/test-utils';


describe('cards', () => {
    let sut;
    let mockedApi;
    let mockedGame;
    let mockedI18n;
    let mockedEas;
    let mockedOl;

    beforeEach(() => {
        mockedApi = new ApiStub();
        mockedGame = new GameStub();
        mockedI18n = new I18nStub();
        mockedOl = new ObserverLocatorStub();
        mockedEas = new EventAggregatorSubscriptionsStub();
        sut = new AotCardsCustomElement(mockedApi, mockedGame, mockedI18n, mockedOl, mockedEas);
    });

    it('should view possible movements', () => {
        let card = {name: 'King', color: 'red'};
        spyOn(mockedApi, 'viewPossibleMovements');
        mockedApi._game.your_turn = true;

        sut.viewPossibleMovements(card);

        expect(sut.selectedCard).toBe(card);
        expect(mockedApi.viewPossibleMovements).toHaveBeenCalledWith(card);
    });

    it('should not view possible movement if not your turn', () => {
        let card = {name: 'King', color: 'red'};
        spyOn(mockedApi, 'viewPossibleMovements');
        mockedApi._game.your_turn = false;
        sut.selectedCard = null;

        sut.viewPossibleMovements(card);

        expect(sut.selectedCard).toBe(null);
        expect(mockedApi.viewPossibleMovements).not.toHaveBeenCalledWith();
    });

    it('should pass', done => {
        spyOn(mockedGame, 'popup').and.callThrough();
        spyOn(mockedApi, 'pass');
        sut.selectedCard = {name: 'King', color: 'red'};

        sut.pass();

        expect(mockedGame.popup).toHaveBeenCalledWith(
            'confirm',
            {message: 'Are you sure you want to pass your turn?'});
        mockedGame.popupPromise.then(() => {
            expect(sut.selectedCard).toBe(null);
            expect(mockedApi.pass).toHaveBeenCalled();
            done();
        });
    });

    it('should not pass on cancel', done => {
        let promise = Promise.reject(new Error());
        spyOn(mockedGame, 'popup').and.returnValue(promise);
        spyOn(mockedApi, 'pass');

        sut.pass();

        expect(mockedGame.popup).toHaveBeenCalledWith(
            'confirm',
            {message: 'Are you sure you want to pass your turn?'});

        promise.then(() => {
            expect(false).toBe(true);
            done();
        }, () => {
            expect(mockedApi.pass).not.toHaveBeenCalled();
            done();
        });
    });

    it('should discard a card', done => {
        spyOn(mockedApi, 'discard');
        spyOn(mockedGame, 'popup').and.callThrough();
        sut.selectedCard = {
            name: 'King',
            color: 'red',
        };

        sut.discard();

        expect(mockedGame.popup).toHaveBeenCalledWith(
            'confirm',
            {message: 'game.play.discard_confirm_message'});

        mockedGame.popupPromise.then(() => {
            expect(mockedApi.discard).toHaveBeenCalledWith({
                cardName: 'King',
                cardColor: 'red',
            });
            expect(sut.selectedCard).toBe(null);
            done();
        });
    });

    it('should display a popup if no card is selected', () => {
        spyOn(mockedApi, 'discard');
        spyOn(mockedGame, 'popup');

        sut.discard();

        expect(mockedApi.discard).not.toHaveBeenCalled();
        expect(mockedGame.popup).toHaveBeenCalledWith('infos', {message: 'You must select a card'});
    });

    describe('special action', () => {
        it('should register callbacks', () => {
            spyOn(mockedEas, 'subscribe');

            sut =
                new AotCardsCustomElement(mockedApi, mockedGame, mockedI18n, mockedOl, mockedEas);

            expect(mockedEas.subscribe).toHaveBeenCalled();
        });

        it('should dispose subscriptions', () => {
            let observerLocatorStubResults = new ObserverLocatorStubResults();
            spyOn(mockedOl, 'getObserver').and.returnValue(observerLocatorStubResults);
            spyOn(observerLocatorStubResults, 'unsubscribe');
            spyOn(mockedEas, 'dispose');

            sut.unbind();

            expect(mockedEas.dispose).toHaveBeenCalled();
            expect(observerLocatorStubResults.unsubscribe).toHaveBeenCalled();
        });

        it('should notify special action', () => {
            sut.specialActionInProgress = false;

            sut._notifySpecialAction();

            expect(sut.specialActionInProgress).toBe(true);
        });

        it('should handle special action', () => {
            sut.specialActionInProgress = true;

            sut._handleSpecialActionPlayed();

            expect(sut.specialActionInProgress).toBe(false);
        });

        it('should view possible movements for cards', () => {
            sut.specialActionInProgress = true;
            spyOn(mockedApi, 'viewPossibleMovements');

            sut.viewPossibleMovements();

            expect(mockedApi.viewPossibleMovements).not.toHaveBeenCalled();
        });
    });
});
