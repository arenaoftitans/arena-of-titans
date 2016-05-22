export class ImageSource {
    static forTrump(trump) {
        return `/assets/game/cards/trumps/${ImageName.forTrump(trump)}.png`;
    }

    static forCard(card) {
        return `/assets/game/cards/movement/${ImageName.forCard(card)}.png`;
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
