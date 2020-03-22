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

import assetsList from "../assets-list";

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
            case "ocean":
                return this._mapToRealPath("game/backgrounds/ocean.jpeg");
            case "clouds":
                return this._mapToRealPath("game/backgrounds/clouds.png");
            case "island":
                return this._mapToRealPath("game/backgrounds/island.png");
            case "create-game":
                return this._mapToRealPath("game/backgrounds/game-creation.jpg");
            case "heroes-selection":
                return this._mapToRealPath("game/backgrounds/heroes-selection.png");
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
            case "logo":
                return this._mapToRealPath("game/aot-logo.png");
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
            case "clippy":
                return this._mapToRealPath("game/misc/clippy.svg");
            case "arrow-left":
                return this._mapToRealPath("game/misc/arrow-left.png");
            case "arrow-right":
                return this._mapToRealPath("game/misc/arrow-right.png");
            case "favicon":
                return this._mapToRealPath("favicon.png");
            case "favicon-notify":
                return this._mapToRealPath("favicon-notify.png");
            default:
                throw new Error(`No such misc image: ${kind}`);
        }
    }

    static forGlobalImage(kind) {
        switch (kind) {
            case "french-flag":
                return this._mapToRealPath("components/french.png");
            case "english-flag":
                return this._mapToRealPath("components/english.png");
            case "gear":
                return this._mapToRealPath("components/gear.png");
            default:
                throw new Error(`No such global image: ${kind}`);
        }
    }

    static forSound(kind, format) {
        switch (kind) {
            case "your-turn":
                return this._mapToRealPath(`game/sounds/your-turn-sound.${format}`);
            case "your-turn-voice":
                return this._mapToRealPath(`game/sounds/your-turn-voice.${format}`);
            case "game-over":
                return this._mapToRealPath(`game/sounds/game-over.${format}`);
            default:
                throw new Error(`No such sound: ${kind}`);
        }
    }

    static forPawn(hero) {
        return this._mapToRealPath(`game/heroes/${hero}-pawn.png`);
    }

    static forPower(power) {
        return this._mapToRealPath(`game/cards/powers/${ImageName.forTrump(power)}.png`);
    }

    static forTrump(trump) {
        // Affecting trumps can be power. We rely on their 'passive' property to detect them.
        if ("passive" in trump || trump.is_power) {
            return AssetSource.forPower(trump);
        }

        return this._mapToRealPath(`game/cards/trumps/${ImageName.forTrump(trump)}.png`);
    }

    static preloadImages(kind) {
        // Don't try to preload images when testing the application.
        if (window.jasmine) {
            return;
        }
        let imagesToPreload = [];
        for (let imgSrc in assetsList) {
            if (imgSrc.includes(kind) && !imgSrc.includes("sounds")) {
                imagesToPreload.push(assetsList[imgSrc]);
            }
        }

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
        if (window.IS_TESTING) {
            return;
        }

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
        let trumpName = trump.name.replace(/ /g, "-").toLowerCase();
        if (!trump.color) {
            return trumpName;
        }

        let trumpColor = trump.color.toLowerCase();
        return `${trumpName}-${trumpColor}`;
    }
}
