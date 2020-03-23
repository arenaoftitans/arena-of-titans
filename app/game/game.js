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
import { History } from "./services/history";
import { AssetSource } from "../services/assets";
import routes from "./routes";

@inject(History)
export class Layout {
    constructor(history) {
        // Init history here: if the page is reloaded on the game page, the history may not be
        // setup until the player click on the player box. This may result in some actions not
        // being displayed. For instance, create a game, refresh, play a card. Without the line
        // below, it will not appear in the player box.
        history.init();

        AssetSource.preloadAssets("game");
    }

    configureRouter(config, router) {
        router.baseUrl = "/game";
        config.options.pushState = true;
        config.map(routes);
    }
}
