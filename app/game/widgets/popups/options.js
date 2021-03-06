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
 *
 */

import { inject } from "aurelia-framework";
import { I18N } from "aurelia-i18n";
import { Options } from "../../services/options";

import frenchFlag from "../../../../assets/components/french.png";
import englishFlag from "../../../../assets/components/english.png";

@inject(Options, I18N)
export class AotOptionsCustomElement {
    constructor(options, i18n) {
        this.options = options;
        this.i18n = i18n;
        this.assetSources = {
            frenchFlag,
            englishFlag,
        };
    }

    activate(model) {
        this.deferred = model.deferred;
    }

    ok() {
        this.deferred.resolve();
    }

    changeLang(lang) {
        this.i18n.setLocale(lang);
    }
}
