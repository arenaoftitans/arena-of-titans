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
import { Options } from "./options";

@inject(EventAggregator, Options)
export class Sounds {
    constructor(ea, options) {
        this._ea = ea;
        this._options = options;

        this._soundDeferred = {};
        this._soundDeferred.promise = new Promise((resolve, reject) => {
            this._soundDeferred.resolve = resolve;
            this._soundDeferred.reject = reject;
        });

        this._ea.subscribe("aot:sound:ready", () => {
            this._soundDeferred.resolve();
        });
    }

    play(sound) {
        if (!this._options.sound) {
            return Promise.resolve();
        }

        return this._soundDeferred.promise.then(() => {
            this._ea.publish("aot:sound:play_card", sound);
        });
    }
}
