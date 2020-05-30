/*
 * Copyright (C) 2015-2020 by Last Run Contributors.
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

import { inject } from "aurelia-framework";
import { EventAggregator } from "aurelia-event-aggregator";
import { I18N } from "aurelia-i18n";

const langToTutorialVideo = {
    fr: "https://www.youtube.com/embed/_ly4641dfEU",
    en: "https://www.youtube.com/embed/ppLC6GzaLsc",
};

const defaultTutorialUrl = langToTutorialVideo.en;

@inject(I18N, EventAggregator)
export class Home {
    constructor(i18n, ea) {
        this._i18n = i18n;
        this._ea = ea;
        this._subscribtion = null;

        this.updateTutorialUrl();
    }

    bind() {
        this._subscribtion = this._ea.subscribe("i18n:locale:changed", () => {
            this.updateTutorialUrl();
        });
    }

    unbind() {
        this._subscribtion.dispose();
    }

    updateTutorialUrl() {
        this.tutorialUrl = langToTutorialVideo[this._i18n.getLocale()] || defaultTutorialUrl;
    }
}
