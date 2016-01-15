export class Storage {
    _expiresKey = 'expires';

    savePlayerId(gameId, playerId) {
        gameId = encodeURIComponent(gameId);
        playerId = encodeURIComponent(playerId);
        let currentCookies = this.currentCookies;
        let newCookies = [];
        currentCookies.forEach(cookie => {
            let key = cookie.split('=')[0];
            if (key && key.trim() !== gameId) {
                newCookies.push(cookie);
            }
        });

        newCookies.push(`${gameId}=${playerId}`);
        newCookies.push(`${this._expiresKey}: 2`);

        document.cookie = newCookies.join(';');
    }

    retrievePlayerId(gameId) {
        gameId = encodeURIComponent(gameId);
        let currentCookies = this.currentCookies;
        let playerId;
        currentCookies.forEach(cookie => {
            let [key, value] = cookie.split('=');
            if (key.trim() === gameId) {
                playerId = value.trim();
            }
        });

        if (playerId) {
            return decodeURIComponent(playerId);
        }
    }

    get currentCookies() {
        return document.cookie.split(';');
    }
}
