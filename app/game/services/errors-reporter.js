/*
* Copyright (C) 2015-2018 by Arena of Titans Contributors.
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

import { inject } from 'aurelia-framework';
import { EventAggregatorSubscriptions } from './utils';
import { Popup } from '../widgets/popups/popup';


@inject(EventAggregatorSubscriptions, Popup)
export class ErrorsReporter {
    constructor(eas, popup) {
        this._eas = eas;
        this._popup = popup;
    }

    enable() {
        // We disable just to be sure there are no listeners registered.
        // If we don't, we may register them twice.
        this.disable();

        this._eas.subscribe('aot:api:error', data => {
            let popupData = {
                isFatal: data.isFatal,
                translate: {
                    messages: {
                        message: data.message,
                    },
                },
            };
            this._popup.display('error', popupData).then(() => {
                if (/\/game\/.+\/create\/.+/.test(location.pathname)) {
                    location.reload();
                }
            });
        });
    }

    disable() {
        this._eas.dispose();
    }
}
