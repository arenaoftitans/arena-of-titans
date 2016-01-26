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

            if (lastAction.card && Object.keys(lastAction.card).length > 0) {
                let cardName = lastAction.card.name;
                let cardColor = lastAction.card.color.toLowerCase();
                this._lastAction.title = `${cardName} ${cardColor}`;

                let card = `${cardName.toLowerCase()}_${cardColor}`;
                this._lastAction.img = `/assets/game/cards/movement/${card}.png`;
            }
        });

        this._api.on(this._api.requestTypes.play_trump, message => {
            let lastAction = message.last_action;
            lastAction.playerName = '';
            let trumpName = lastAction.trump.name.replace(' ', '_').toLowerCase();
            lastAction.img = `/assets/game/cards/trumps/${trumpName}.png`;
            this._lastAction = lastAction;
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
