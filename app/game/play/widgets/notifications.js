import { bindable, inject } from 'aurelia-framework';
import { I18N } from 'aurelia-i18n';
import { Api } from '../../services/api';
import { ImageName, ImageSource } from '../../services/utils';


@inject(Api, I18N)
export class AotNotificationsCustomElement {
    @bindable players = {};
    @bindable currentPlayerIndex = 0;
    _api;
    _lastAction = {};
    _i18n;

    constructor(api, i18n) {
        this._api = api;
        this._i18n = i18n;

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
        this._lastAction = {};

        if (lastAction.card && Object.keys(lastAction.card).length > 0) {
            let cardName = lastAction.card.name;
            let cardColor = lastAction.card.color.toLowerCase();
            this._lastAction.title = this._i18n.tr(`cards.${cardName.toLowerCase()}_${cardColor}`);
            this._lastAction.description = this._i18n.tr(`cards.${cardName.toLowerCase()}`);

            this._lastAction.img = ImageSource.forCard(lastAction.card);
        }

        if (lastAction.trump && Object.keys(lastAction.trump).length > 0) {
            let trump = lastAction.trump;
            this._lastAction.img = ImageSource.forTrump(trump);
            let trumpName = ImageName.forTrump(trump);
            this._lastAction.title = this._i18n.tr(trumpName);
            this._lastAction.description = this._i18n.tr(`${trumpName}_description`);
        }
    }

    get playerName() {
        return this._lastAction.player_name;
    }

    get currentPlayerName() {
        return this.players.names[this.currentPlayerIndex];
    }

    get lastAction() {
        return this._lastAction;
    }
}
