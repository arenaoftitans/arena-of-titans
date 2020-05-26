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

import { PLATFORM } from "aurelia-pal";
import { translationsKey } from "./translations";

const SITE_ROUTES = [
    {
        route: "/founders",
        name: "founders",
        moduleId: PLATFORM.moduleName("./site/routes/founders/founders"),
        nav: false,
        title: translationsKey("site.page_title.founders"),
    },
    {
        route: "/heroes",
        name: "heroes",
        moduleId: PLATFORM.moduleName("./site/routes/heroes/heroes"),
        nav: false,
        title: translationsKey("site.page_title.heroes"),
    },
    {
        route: "",
        name: "home",
        moduleId: PLATFORM.moduleName("./site/routes/home/home"),
        nav: false,
        title: translationsKey("site.page_title.home"),
    },
    {
        route: "/moves",
        name: "moves",
        moduleId: PLATFORM.moduleName("./site/routes/moves/moves"),
        nav: false,
        title: translationsKey("site.page_title.moves"),
    },
    {
        route: "/people",
        name: "people",
        moduleId: PLATFORM.moduleName("./site/routes/people/people"),
        nav: false,
        title: translationsKey("site.page_title.people"),
    },
    {
        route: "/synopsis",
        name: "synopsis",
        moduleId: PLATFORM.moduleName("./site/routes/synopsis/synopsis"),
        nav: false,
        title: translationsKey("site.page_title.synopsis"),
    },
    {
        route: "/trumps",
        name: "trumps",
        moduleId: PLATFORM.moduleName("./site/routes/trumps/trumps"),
        nav: false,
        title: translationsKey("site.page_title.trumps"),
    },
    {
        route: "/privacy",
        name: "privacy",
        moduleId: PLATFORM.moduleName("./site/routes/privacy/privacy"),
        nav: false,
        title: translationsKey("site.page_title.privacy"),
    },
];
configureSiteRoutes(SITE_ROUTES);

const NOT_FOUND = {
    name: "not-found",
    moduleId: PLATFORM.moduleName("./site/routes/not-found/not-found"),
    title: translationsKey("site.page_title.not_found"),
};
configureSiteRoutes([NOT_FOUND]);

const GAME_ROUTES = [
    {
        route: "game",
        name: "game",
        moduleId: PLATFORM.moduleName("game/game"),
    },
];

const ROUTES = SITE_ROUTES.concat(GAME_ROUTES);

export default ROUTES;
export { NOT_FOUND };

function configureSiteRoutes(routesConfig) {
    for (let routeConfig of routesConfig) {
        routeConfig.name = `site-${routeConfig.name}`;
        routeConfig.nav = false;
        routeConfig.layoutViewModel = PLATFORM.moduleName("site/layout");
    }
}
