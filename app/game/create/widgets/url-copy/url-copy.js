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

import { bindable } from "aurelia-framework";

import clippy from "../../../../../assets/game/misc/clippy.svg";

export class AotUrlCopyCustomElement {
    @bindable url;
    inviteLink = null; // Populated by ref.

    constructor() {
        this.clippyImg = clippy;
    }

    copyUrl() {
        this.inviteLink.select();
        document.execCommand("copy");
    }
}
