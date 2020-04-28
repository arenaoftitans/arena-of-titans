/*
 * Copyright (C) 2015-2016 by Arena of Titans Contributors.
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
import { Store } from "aurelia-store";
import { AssetSource } from "../services/assets";
import routes from "./routes";
import * as commonActions from "./actions/common";
import * as lobbyActions from "./actions/lobby";
import * as playActions from "./actions/play";
import * as currentTurnActions from "./actions/currentTurn";
import { Popup } from "./services/popup";
import { SW } from "../services/sw";

@inject(Store, Popup, SW)
export class Layout {
    constructor(store, popup, sw) {
        Object.entries(commonActions).map(([name, action]) => {
            store.registerAction(name, action);
        });
        Object.entries(lobbyActions).map(([name, action]) => {
            store.registerAction(name, action);
        });
        Object.entries(playActions).map(([name, action]) => {
            store.registerAction(name, action);
        });
        Object.entries(currentTurnActions).map(([name, action]) => {
            store.registerAction(name, action);
        });

        this._popup = popup;
        this.assetSource = AssetSource;

        sw.preloadBundles("game");
        AssetSource.preloadAssets("game");
    }

    configureRouter(config, router) {
        router.baseUrl = "/game";
        config.options.pushState = true;
        config.map(routes);
    }

    openOptions() {
        this._popup.display("options", {});
    }
}
