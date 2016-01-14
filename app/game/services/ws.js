export class Ws {
    _ws;

    constructor() {
        this._ws = new WebSocket('ws://localhost:9000');
    }

    send(data) {
        this._ws.send(JSON.stringify(data));
    }

    onmessage(cb) {
        this._ws.onmessage = (data) => {
            cb(JSON.parse(data.data));
        };
    }
}
