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


export class Site {
    configureRouter(config, router) {
        config.baseUrl = 'site';
        config.options.pushState = true;
        config.map([
            {
                route: [''],
                name: 'home',
                moduleId: './routes/home/home',
                nav: false,
                title: 'Home',
            },
            {
                route: ['/synopsis'],
                name: 'synopsis',
                moduleId: './routes/synopsis/synopsis',
                nav: false,
                title: 'Synopsis',
            },
            {
                route: ['/heroes'],
                name: 'heroes',
                moduleId: './routes/heroes/heroes',
                nav: false,
                title: 'Heroes',
            },
            {
                route: ['/trumps'],
                name: 'trumps',
                moduleId: './routes/trumps/trumps',
                nav: false,
                title: 'Trumps',
            },
        ]);
        config.mapUnknownRoutes(instruction => {
            instruction.moduleId = 'not-found';

            return instruction;
        });
    }
}
