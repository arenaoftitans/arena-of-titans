/*
 * Copyright (C) 2015-2020 by Arena of Titans Contributors.
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

import * as LogManager from "aurelia-logging";

const trackGameActionDimensionId = 1;
const gameEventAction = "game";
const gameCreatedActionValue = "gameCreated";
const cardPlayedActionValue = "cardPlayed";
const trumpPlayedActionValue = "trumpPlayed";

export class TrackActions {
    constructor() {
        this._logger = LogManager.getLogger("aot:tracking");
        this._alreadySeen = {
            gameCreated: false,
            cardPlayed: false,
            trumpPlayed: false,
        };

        if (!window._paq) {
            this._logger.debug("_paq is not defined, cannot log actions");
        }
    }

    trackGameCreated() {
        if (this._alreadySeen.gameCreated) {
            return;
        }

        this._alreadySeen.gameCreated = true;
        this._trackAction(trackGameActionDimensionId, gameCreatedActionValue);
    }

    trackCardPlayed() {
        if (this._alreadySeen.cardPlayed) {
            return;
        }

        this._alreadySeen.cardPlayed = true;
        this._trackAction(trackGameActionDimensionId, cardPlayedActionValue);
    }

    trackTrumpPlayed() {
        if (this._alreadySeen.trumpPlayed) {
            return;
        }

        this._alreadySeen.trumpPlayed = true;
        this._trackAction(trackGameActionDimensionId, trumpPlayedActionValue);
    }

    _trackAction(dimensionId, dimensionValue) {
        if (!window._paq) {
            return;
        }

        window._paq.push(["trackEvent", gameEventAction, dimensionValue]);
    }
}
