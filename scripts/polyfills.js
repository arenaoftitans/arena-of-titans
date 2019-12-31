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

function values(obj) {
    var vals = [];
    for (var key in obj) {
        if (obj.hasOwnProperty(key) && obj.propertyIsEnumerable(key)) {
            vals.push(obj[key]);
        }
    }
    return vals;
}


function isInteger(value) {
  return typeof value === "number" &&
    isFinite(value) &&
    Math.floor(value) === value;
}


if (typeof Object.values !== 'function') {
    Object.values = values;
}

if (typeof Number.isInteger !== 'function') {
    Number.isInteger = isInteger;
}
