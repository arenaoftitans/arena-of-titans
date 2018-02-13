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

import assetsList from '../assets-list';


const PRELOAD_DELAY = 1000;
const PRELOAD_CHUNK_SIZE = 5;

export class AssetSource {
    static _mapToRealPath(path) {
        path = `/assets/${path}`;
        return assetsList[path];
    }

    static forAnimation(data) {
        return this._mapToRealPath(`game/animation/${ImageName.forAnimation(data)}.png`);
    }

    static forBackground(kind) {
        switch (kind) {
            case 'board':
                return this._mapToRealPath('game/backgrounds/board.png');
            case 'board-outline':
                return this._mapToRealPath('game/backgrounds/board-outline.png');
            case 'create-game':
                return this._mapToRealPath('game/backgrounds/game-creation.jpg');
            case 'heroes-selection':
                return this._mapToRealPath('game/backgrounds/heroes-selection.png');
            default:
                throw new Error(`No such background: ${kind}`);
        }
    }

    static forCard(card) {
        return this._mapToRealPath(`game/cards/movement/${ImageName.forCard(card)}.png`);
    }

    static forChestHero(hero) {
        return this._mapToRealPath(`game/heroes/${hero}-chest.png`);
    }

    static forCircledHero(hero) {
        return this._mapToRealPath(`game/heroes/${hero}-circle.png`);
    }

    static forGame(kind) {
        switch (kind) {
            case 'logo':
                return this._mapToRealPath('game/aot-logo.png');
            default:
                throw new Error(`No such image for game: ${kind}`);
        }
    }

    static forHero(hero) {
        return this._mapToRealPath(`game/heroes/${hero}.png`);
    }

    static forHeroPower(hero) {
        return this._mapToRealPath(`game/cards/powers/${hero}.png`);
    }

    static forMiscImage(kind) {
        switch (kind) {
            case 'clippy':
                return this._mapToRealPath('game/misc/clippy.svg');
            case 'arrow-left':
                return this._mapToRealPath('game/misc/arrow-left.png');
            case 'arrow-right':
                return this._mapToRealPath('game/misc/arrow-right.png');
            case 'favicon':
                return this._mapToRealPath('favicon.png');
            case 'favicon-notify':
                return this._mapToRealPath('favicon-notify.png');
            default:
                throw new Error(`No such misc image: ${kind}`);
        }
    }

    static forGlobalImage(kind) {
        switch (kind) {
            case 'french-flag':
                return this._mapToRealPath('components/french.png');
            case 'english-flag':
                return this._mapToRealPath('components/english.png');
            case 'gear':
                return this._mapToRealPath('components/gear.png');
            default:
                throw new Error(`No such global image: ${kind}`);
        }
    }

    static forSound(kind, format) {
        switch (kind) {
            case 'your-turn':
                return this._mapToRealPath(`sounds/game/your-turn-sound.${format}`);
            case 'your-turn-voice':
                return this._mapToRealPath(`sounds/game/your-turn-voice.${format}`);
            case 'game-over':
                return this._mapToRealPath(`sounds/game/game-over.${format}`);
            default:
                throw new Error(`No such sound: ${kind}`);
        }
    }

    static forPower(power) {
        return this._mapToRealPath(`game/cards/powers/${ImageName.forTrump(power)}.png`);
    }

    static forTrump(trump) {
        return this._mapToRealPath(`game/cards/trumps/${ImageName.forTrump(trump)}.png`);
    }

    static preloadImages(kind) {
        if (!(kind in assetsList)) {
            throw new Error(`No such kind of images to preload: ${kind}`);
        }
        // Don't try to preload images when testing the application.
        if (window.jasmine) {
            return;
        }
        let imagesToPreload = assetsList[kind];
        let imagesChunkToPreload = [];
        let startIndex = 0;
        while (startIndex < imagesToPreload.length) {
            let chunk = imagesToPreload.slice(startIndex, startIndex + PRELOAD_CHUNK_SIZE);
            imagesChunkToPreload.push(chunk);
            startIndex += PRELOAD_CHUNK_SIZE;
        }

        let timeout = 0;
        for (let chunk of imagesChunkToPreload) {
            setTimeout(() => {
                this._preloadImages(chunk);
            }, timeout);
            timeout += PRELOAD_DELAY;
        }
    }

    static _preloadImages(images) {
        for (let src of images) {
            let img = new Image();
            img.src = `//${location.host}${src}`;
        }
    }
}


export class ImageClass {
    static forCard(card) {
        return `sprite-movement-${ImageName.forCard(card)}`;
    }
}


export class ImageName {
    static forAnimation(data) {
        let name = data.name.toLowerCase();
        let color = data.color.toLocaleLowerCase();

        return `${name}-${color}`;
    }

    static forCard(card) {
        let name = card.name.toLowerCase();
        let color = card.color.toLocaleLowerCase();

        return `${name}-${color}`;
    }

    static forTrump(trump) {
        let trumpName = trump.name.replace(' ', '-').toLowerCase();
        if (trump.color === null) {
            return trumpName;
        }

        let trumpColor = trump.color.toLowerCase();
        return `${trumpName}-${trumpColor}`;
    }
}
