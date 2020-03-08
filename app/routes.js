/*
 * Copyright (C) 2015-2020 by Arena of Titans Contributors.
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

const SITE_ROUTES = [
    {
        route: "/founders",
        name: "founders",
        moduleId: "./site/routes/founders/founders",
        nav: false,
        title: "site.page_title.founders",
    },
    {
        route: "/heroes",
        name: "heroes",
        moduleId: "./site/routes/heroes/heroes",
        nav: false,
        title: "site.page_title.heroes",
    },
    {
        route: "",
        name: "home",
        moduleId: "./site/routes/home/home",
        nav: false,
        title: "site.page_title.home",
    },
    {
        route: "/moves",
        name: "moves",
        moduleId: "./site/routes/moves/moves",
        nav: false,
        title: "site.page_title.moves",
    },
    {
        route: "/people",
        name: "people",
        moduleId: "./site/routes/people/people",
        nav: false,
        title: "site.page_title.people",
    },
    {
        route: "/synopsis",
        name: "synopsis",
        moduleId: "./site/routes/synopsis/synopsis",
        nav: false,
        title: "site.page_title.synopsis",
    },
    {
        route: "/trumps",
        name: "trumps",
        moduleId: "./site/routes/trumps/trumps",
        nav: false,
        title: "site.page_title.trumps",
    },
];
configureSiteRoutes(SITE_ROUTES);

const NOT_FOUND = {
    name: "not-found",
    moduleId: "./site/routes/not-found/not-found",
    title: "site.page_title.not_found",
};
configureSiteRoutes([NOT_FOUND]);

const GAME_ROUTES = [
    {
        route: "game",
        name: "game",
        moduleId: "game/game",
    },
];

const ROUTES = SITE_ROUTES.concat(GAME_ROUTES);

export default ROUTES;
export { NOT_FOUND };

function configureSiteRoutes(routesConfig) {
    for (let routeConfig of routesConfig) {
        routeConfig.name = `site-${routeConfig.name}`;
        routeConfig.nav = false;
        routeConfig.layoutViewModel = "site/layout";
    }
}
