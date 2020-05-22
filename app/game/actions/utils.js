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

import { Container } from "aurelia-framework";
import { Api } from "../services/api";
import { BOARD_MOVE_MODE } from "../constants";
import { Popup } from "../services/popup";

const toCamel = s => {
    return s.replace(/([-_][a-z])/gi, $1 => {
        return $1
            .toUpperCase()
            .replace("-", "")
            .replace("_", "");
    });
};

const isObject = function(o) {
    return o === Object(o) && !Array.isArray(o) && typeof o !== "function";
};

export const keysToCamel = function(o) {
    if (isObject(o)) {
        const n = {};

        Object.keys(o).forEach(k => {
            n[toCamel(k)] = keysToCamel(o[k]);
        });

        return n;
    } else if (Array.isArray(o)) {
        return o.map(i => {
            return keysToCamel(i);
        });
    }

    return o;
};

export function getApi() {
    return Container.instance.get(Api);
}

export function displayPopup(popupType, options) {
    return Container.instance.get(Popup).display(popupType, options);
}

export function getEmptyCurrentTurn() {
    return {
        selectedCard: null,
        selectedTrump: null,
        boardMode: BOARD_MOVE_MODE,
        possibleSquares: [],
        mustAutoAskPossibleSquares: false,
        trumpInfosData: {
            infos: {},
            type: null,
        },
    };
}
