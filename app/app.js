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

import * as LogManager from "aurelia-logging";
import { inject } from "aurelia-framework";
import { EventAggregator } from "aurelia-event-aggregator";
import routes, { NOT_FOUND as notFoundRoute } from "./routes";
import { SW } from "./services/sw";

@inject(EventAggregator, SW)
export class App {
    router;
    ea;

    constructor(ea, sw) {
        this._ea = ea;
        this._sw = sw;
        this._logger = LogManager.getLogger("app");
    }

    bind() {
        this.navigationSubscription = this._ea.subscribe("router:navigation:complete", () => {
            window.scrollTo(0, 0);
        });

        if (navigator.serviceWorker) {
            this._logger.info("Registering SW");
            navigator.serviceWorker.register("./sw.js").then(registration => {
                this._logger.info("SW registration succeeded.");
                this._sw.swRegistration = registration;
            });
        }
    }

    unbind() {
        this.navigationSubscription.dispose();
    }

    configureRouter(config, router) {
        this.router = router;
        config.title = "Last Run";
        config.options.pushState = true;
        config.options.root = this.findRouterRoot();
        config.map(routes);
        config.mapUnknownRoutes(() => {
            return notFoundRoute;
        });
    }

    findRouterRoot() {
        const customRoot = location.href.match(/(\/index-.+\.html)/);
        return customRoot === null ? "/" : customRoot[1];
    }
}
