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

const CHOOSABLE_SLOTS_STATES = ["OPEN", "AI", "CLOSED"];

export class AotSlotCustomElement {
    @bindable player;
    @bindable canAdmin;
    @bindable onSlotUpdate = () => {};

    constructor() {
        this.choosableSlotsStates = CHOOSABLE_SLOTS_STATES;
    }

    updateSlot(event) {
        const updatedSlot = {
            ...this.player,
            state: event.target.value,
        };

        this.onSlotUpdate(updatedSlot);
    }
}
