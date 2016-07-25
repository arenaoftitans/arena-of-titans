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

import { App } from '../../app/app';
import { RouterStub } from '../../app/test-utils';


describe('the App module', () => {
    var sut;
    var mockedRouter;

    beforeEach(() => {
        mockedRouter = new RouterStub();
        sut = new App();
        sut.configureRouter(mockedRouter, mockedRouter);
    });

    it('contains a router property', () => {
        expect(sut._router).toBeDefined();
    });

    it('configures the router title', () => {
        expect(sut._router.title).toEqual('Arena of Titans');
    });

    it('configures the pushState', () => {
        expect(sut._router.options.pushState).toBe(true);
    });
});
