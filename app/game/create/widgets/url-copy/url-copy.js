/*
 * Copyright (C) 2017 by Arena of Titans Contributors.
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

import { bindable } from 'aurelia-framework';
import Clipboard from 'clipboard';
import { Wait } from '../../../services/utils';
import { AssetSource } from '../../../../services/assets';


export class AotUrlCopyCustomElement {
    @bindable url;

    constructor() {
        this.assetSource = AssetSource;
    }

    activate() {
        // Catch is there to prevent 'cUnhandled rejection TypeError: _clipboard2.default is not
        // a constructor' warnings when launching tests with Firefox.
        Wait.forId('copy-invite-link').then(() => {
            new Clipboard('#copy-invite-link'); // eslint-disable-line
        }).catch(() => {});
    }
}
