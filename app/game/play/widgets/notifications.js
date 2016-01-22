import { bindable, inject } from 'aurelia-framework';
import { Api } from '../../services/api';


@inject(Api)
export class AotNotificationsCustomElement {
    @bindable players = {};
    @bindable currentPlayerIndex = 0;
    _api;
    _lastAction;

    constructor(api) {
        this._api = api;
        this._api.on(this._api.requestTypes.player_played, message => {
            let lastAction = message.last_action;
            this._lastAction = lastAction;
            this._lastAction.playerName = this.players.names[message.player_index];

            let cardName = lastAction.card.name;
            let cardColor = lastAction.card.color.toLowerCase();
            this._lastAction.title = `${cardName} ${cardColor}`;

            let card = `${cardName.toLowerCase()}_${cardColor}`;
            this._lastAction.img = `/assets/game/cards/movement/${card}.png`;
        });
    }

    get playerName() {
        if (this.currentPlayerIndex < this.players.names.length) {
            return this.players.names[this.currentPlayerIndex];
        }
    }

    get lastAction() {
        return this._lastAction;
    }
}
