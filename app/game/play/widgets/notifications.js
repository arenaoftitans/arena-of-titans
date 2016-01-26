import { bindable, inject } from 'aurelia-framework';
import { Api } from '../../services/api';


@inject(Api)
export class AotNotificationsCustomElement {
    @bindable players = {};
    @bindable currentPlayerIndex = 0;
    _api;
    _lastAction = {};

    constructor(api) {
        this._api = api;

        this._api.onReconnectDefered.then(message => {
            this._updateLastAction(message);
        });

        this._api.on(this._api.requestTypes.player_played, message => {
            this._updateLastAction(message);
        });

        this._api.on(this._api.requestTypes.play_trump, message => {
            this._updateLastAction(message);
        });
    }

    _updateLastAction(message) {
        let lastAction = message.last_action === null ? {} : message.last_action;
        this._lastAction = lastAction;

        if (lastAction.card && Object.keys(lastAction.card).length > 0) {
            let cardName = lastAction.card.name;
            let cardColor = lastAction.card.color.toLowerCase();
            this._lastAction.title = `${cardName} ${cardColor}`;

            let card = `${cardName.toLowerCase()}_${cardColor}`;
            this._lastAction.img = `/assets/game/cards/movement/${card}.png`;
        }

        if (lastAction.trump && Object.keys(lastAction.trump).length > 0) {
            let trumpName = lastAction.trump.name.replace(' ', '_').toLowerCase();
            lastAction.img = `/assets/game/cards/trumps/${trumpName}.png`;
            this._lastAction = lastAction;
        }
    }

    get playerName() {
        return this._lastAction.player_name;
    }

    get lastAction() {
        return this._lastAction;
    }
}
