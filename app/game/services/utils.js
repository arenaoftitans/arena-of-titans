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

export class ImageSource {
    static forTrump(trump) {
        return `/assets/game/cards/trumps/${ImageName.forTrump(trump)}.png`;
    }

    static forCard(card) {
        return `/assets/game/cards/movement/${ImageName.forCard(card)}.png`;
    }

    static forCircledHero(hero) {
        return `/assets/game/heroes/${hero}-circle.png`;
    }
}


export class ImageClass {
    static forCard(card) {
        return `sprite-movement-${ImageName.forCard(card)}`;
    }
}


export class ImageName {
    static forTrump(trump) {
        let trumpName = trump.name.replace(' ', '-').toLowerCase();
        return `${trumpName}`;
    }

    static forCard(card) {
        let name = card.name.toLowerCase();
        let color = card.color.toLocaleLowerCase();

        return `${name}-${color}`;
    }
}


export class Wait {
    static idPromises = {};

    static flushCache() {
        Wait.idPromises = {};
    }

    static forId(id) {
        if (id in Wait.idPromises) {
            return Wait.idPromises[id];
        }

        let defered = {};
        defered.promise = new Promise((resolve) => {
            defered.resolve = resolve;
        });

        (function wait() {
            let element = document.getElementById(id);
            // If jasmine is defined, we are running this in a unit test and must resolve the
            // promise.
            if (element !== null || window.jasmine) {
                defered.resolve(element);
            } else {
                setTimeout(wait, 500);
            }
        })();

        Wait.idPromises[id] = defered.promise;

        return defered.promise;
    }
}
