export class Wait {
    forId(id) {
        let defered = {};
        defered.promise = new Promise((resolve) => {
            defered.resolve = resolve;
        });

        (function wait() {
            let element = document.getElementById(id);
            if (element !== null) {
                defered.resolve(element);
            } else {
                setTimeout(wait, 500);
            }
        })();

        return defered.promise;
    }
}
