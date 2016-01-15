export class Ws {
    _ws;
    _waitingOpen = [];

    constructor() {
        this._ws = new WebSocket('ws://localhost:9000');
        this._ws.onopen = () => {
            this._waitingOpen.forEach(data => {
                this.send(data);
            });
        };
    }

    send(data) {
        // If the websocket is not opened yet, we delay the transmission of data.
        if (this._ws.readyState === 1) {
            this._ws.send(JSON.stringify(data));
        } else {
            this._waitingOpen.push(data);
        }
    }

    onmessage(cb) {
        this._ws.onmessage = (data) => {
            cb(JSON.parse(data.data));
        };
    }
}
