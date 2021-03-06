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

let ua = navigator.userAgent;
let msie = +(/msie (\d+)/.exec(ua.toLowerCase()) || [])[1];
if (isNaN(msie)) {
    msie = +(/trident\/.*; rv:(\d+)/.exec(ua.toLowerCase()) || [])[1];
}
if (isNaN(msie)) {
    msie = +(/edge\/(\d+)\./.exec(ua.toLowerCase()) || [])[1];
}
if (isNaN(msie)) {
    msie = false;
}

let mac = !msie && /\(Mac/.test(ua);

let htmlCollection2Array = collection => Array.prototype.slice.call(collection);

export const browsers = {
    mac: mac,
    msie: msie,
    htmlCollection2Array: htmlCollection2Array,
};
