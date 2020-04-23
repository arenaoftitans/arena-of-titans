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

import { bindable, inject } from "aurelia-framework";
import { Popup } from "../../../services/popup";
import { AssetSource } from "../../../../services/assets";

@inject(Popup)
export class AotPlayerBoxCustomElement {
    @bindable index;
    @bindable players;

    constructor(popup) {
        this.assetSource = AssetSource;
        this._popup = popup;
    }

    bind() {
        this.playerBoxIndex = `player-box-${this.index}`;
    }

    viewPlayerInfos() {
        this._popup.display("player-box", {
            playerName: this.playerName,
            playerIndex: this.index,
            hero: this.players[this.index].hero,
        });
    }

    get playerName() {
        if (this.players) {
            return this.players[this.index].name;
        }

        return "";
    }

    get hero() {
        return this.players[this.index].hero;
    }
}
