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

import { Elements } from '../../../../app/game/services/utils';
import { browsers } from '../../../../app/services/browser-sniffer';


describe('services/utils', () => {
    describe('Elements', () => {
        it('forClass without container', () => {
            spyOn(document, 'getElementById');
            spyOn(document, 'getElementsByClassName');

            Elements.forClass('my-class');

            expect(document.getElementById).not.toHaveBeenCalled();
            expect(document.getElementsByClassName).toHaveBeenCalledWith('my-class')
        });

        it('forClass with container', () => {
            let container = {
                getElementsByClassName: () => {},
            };
            spyOn(document, 'getElementById').and.returnValue(container);
            spyOn(document, 'getElementsByClassName');
            spyOn(container, 'getElementsByClassName');

            Elements.forClass('my-class', 'my-id');

            expect(document.getElementById).toHaveBeenCalledWith('my-id');
            expect(document.getElementsByClassName).not.toHaveBeenCalled();
            expect(container.getElementsByClassName).toHaveBeenCalledWith('my-class');
        });

        it('forClass on msie', () => {
            spyOn(browsers, 'htmlCollection2Array');
            browsers.msie = true;

            Elements.forClass('my-class');

            expect(browsers.htmlCollection2Array).toHaveBeenCalled();

            browsers.msie = false;
        });

        it('forClass on safari', () => {
            spyOn(browsers, 'htmlCollection2Array');
            browsers.mac = true;

            Elements.forClass('my-class');

            expect(browsers.htmlCollection2Array).toHaveBeenCalled();

            browsers.mac = false;
        });

    });
});
