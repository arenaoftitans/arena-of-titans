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

import { Options } from '../../../app/services/options';
import { StorageStub } from '../../../app/test-utils';
import { ObserverLocator } from 'aurelia-framework';
import {TaskQueue} from 'aurelia-task-queue';


describe('app/services/options', () => {
    let mockedStorage;
    let mockedObserver;
    let sut;

    beforeEach(() => {
        mockedStorage = new StorageStub();
        mockedObserver = new ObserverLocator(new TaskQueue());
        sut = new Options(mockedStorage, mockedObserver);
    });

    it('construct from empty storage', () => {
        spyOn(mockedStorage, 'loadOptions').and.returnValue({});
        spyOn(mockedObserver, 'getObserver').and.callThrough();

        sut = new Options(mockedStorage, mockedObserver);

        expect(mockedStorage.loadOptions).toHaveBeenCalled();
        expect(mockedObserver.getObserver).toHaveBeenCalledWith(sut, 'sound');
    });

    it('construct from storage', () => {
        spyOn(mockedStorage, 'loadOptions').and.returnValue({
            sound: false,
            test: 789,
        });
        spyOn(mockedObserver, 'getObserver').and.callThrough();

        sut = new Options(mockedStorage, mockedObserver);

        expect(mockedStorage.loadOptions).toHaveBeenCalled();
        expect(sut.sound).toBe(false);
        expect(sut.test).toBe(789);
        expect(mockedObserver.getObserver).toHaveBeenCalledWith(sut, 'sound');
        expect(mockedObserver.getObserver).toHaveBeenCalledWith(sut, 'test');
    });
});
