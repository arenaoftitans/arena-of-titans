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

export class App {
    router;

    configureRouter(config, router) {
        this.router = router;
        config.title = 'Arena of Titans';
        config.options.pushState = true;
        config.map([
            {
                route: '',
                name: 'home',
                moduleId: 'site/home',
                nav: true,
                title: 'Homepage',
            }, {
                route: 'rules',
                name: 'rules',
                moduleId: 'site/routes/rules/rules',
                nav: true,
                title: 'Rules',
            }, {
                route: 'synopsis',
                name: 'synopsis',
                moduleId: 'site/routes/synopsis/synopsis',
                nav: true,
                title: 'Synopsis',
            }, {
                route: 'game',
                name: 'game',
                moduleId: 'game/game',
                nav: true,
                title: 'Game',
            },
        ]);
        config.mapUnknownRoutes(instruction => {
            instruction.moduleId = 'site/routes/not-found/not-found';

            return instruction;
        });
    }
}
