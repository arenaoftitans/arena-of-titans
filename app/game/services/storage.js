export class Storage {
    _expiresKey = 'expires';

    savePlayerId(gameId, playerId) {
        localStorage.setItem(gameId, playerId);
    }

    retrievePlayerId(gameId) {
        return localStorage.getItem(gameId);
    }
}
