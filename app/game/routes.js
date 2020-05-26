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

import { translationsKey } from "../translations";

const ROUTES = [
    {
        route: ["", "/play", "/:version", "/:version/play"],
        redirect: "create",
    },
    {
        route: ["/:version/create/:id", "/:version/create", "/create"],
        name: "create",
        moduleId: PLATFORM.moduleName("./create/create"),
        nav: false,
        title: translationsKey("site.page_title.create_game"),
    },
    {
        route: "/:version/play/:id",
        name: "play",
        moduleId: PLATFORM.moduleName("./play/play"),
        nav: false,
        title: translationsKey("site.page_title.play_game"),
    },
];

export default ROUTES;
