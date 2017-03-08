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

import Config from './configuration';


export class AssetSource {
    static version = Config.version;

    static forBackground(kind) {
        switch (kind) {
            case 'board':
                return `/${this.version}/assets/game/backgrounds/board.png`;
            case 'board-outline':
                return `/${this.version}/assets/game/backgrounds/board-outline.png`;
            case 'create-game':
                return `/${this.version}/assets/game/backgrounds/game-creation.jpg`;
            case 'heroes-selection':
                return `/${this.version}/assets/game/backgrounds/heroes-selection.png`;
            default:
                throw new Error(`No such background: ${kind}`);
        }
    }

    static forCard(card) {
        return `/${this.version}/assets/game/cards/movement/${ImageName.forCard(card)}.png`;
    }

    static forChestHero(hero) {
        return `/${this.version}/assets/game/heroes/${hero}-chest.png`;
    }

    static forCircledHero(hero) {
        return `/${this.version}/assets/game/heroes/${hero}-circle.png`;
    }

    static forGame(kind) {
        switch (kind) {
            case 'logo':
                return `/${this.version}/assets/game/aot-logo.png`;
            default:
                throw new Error(`No such image for game: ${kind}`);
        }
    }

    static forHero(hero) {
        return `/${this.version}/assets/game/heroes/${hero}.png`;
    }

    static forMiscImage(kind) {
        switch (kind) {
            case 'clippy':
                return `/${this.version}/assets/game/misc/clippy.svg`;
            case 'arrow-left':
                return `/${this.version}/assets/game/misc/arrow-left.png`;
            case 'arrow-right':
                return `/${this.version}/assets/game/misc/arrow-right.png`;
            default:
                throw new Error(`No such misc image: ${kind}`);
        }
    }

    static forSound(kind, format) {
        switch (kind) {
            case 'your-turn':
                return `/${this.version}/assets/sounds/game/your-turn-sound.${format}`;
            case 'your-turn-voice':
                return `/${this.version}/assets/sounds/game/your-turn-voice.${format}`;
            case 'game-over':
                return `/${this.version}/assets/sounds/game/game-over.${format}`;
            default:
                throw new Error(`No such sound: ${kind}`);
        }
    }

    static forTrump(trump) {
        return `/${this.version}/assets/game/cards/trumps/${ImageName.forTrump(trump)}.png`;
    }

    static preloadImages(kind) {
        if (!(kind in Config.images)) {
            throw new Error(`No such kind of images to preload: ${kind}`);
        }

        for (let src of Config.images[kind]) {
            let img = new Image();
            img.src = `//${location.host}/${this.version}/${src}`;
        }
    }
}


export class ImageClass {
    static forCard(card) {
        return `sprite-movement-${ImageName.forCard(card)}`;
    }
}


export class ImageName {
    static forCard(card) {
        let name = card.name.toLowerCase();
        let color = card.color.toLocaleLowerCase();

        return `${name}-${color}`;
    }

    static forTrump(trump) {
        let trumpName = trump.name.replace(' ', '-').toLowerCase();
        return `${trumpName}`;
    }
}
