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

import { Storage } from '../../../app/services/storage';
import { LocalStorageStub } from '../../../app/test-utils';


describe('app/services/storage', () => {
    let sut;

    beforeEach(() => {
        // By default on FireFox, localStorage is read only. Make writable to replace it with mock.
        Object.defineProperty(window, 'localStorage', { writable: true });
        window.localStorage = new LocalStorageStub();
        sut = new Storage();
    });

    it('do not save private properties of options', () => {
        let options = {
            toSave: 'toto',
            _notToSave: 'test',
        };
        spyOn(window.localStorage, 'setItem');

        sut.saveOptions(options);

        expect(window.localStorage.setItem).toHaveBeenCalledWith(
            'options',
            JSON.stringify({
                toSave: 'toto',
            })
        );
    });
});