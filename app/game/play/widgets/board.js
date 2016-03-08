import { bindable, inject } from 'aurelia-framework';
import { Api } from '../../services/api';


@inject(Api)
export class AotBoardCustomElement {
    @bindable selectedCard = null;
    _api;
    _possibleSquares = [];

    constructor(api) {
        this._api = api;
        this._api.on(this._api.requestTypes.view, data => {
            this._possibleSquares = data.possible_squares.map(square => {
                return `square-${square.x}-${square.y}`;
            });
        });
    }

    moveTo(squareId, x, y) {
        if (this._possibleSquares.length > 0 &&
                this._possibleSquares.indexOf(squareId) > -1 &&
                this.selectedCard) {
            this._api.play({
                cardName: this.selectedCard.name,
                cardColor: this.selectedCard.color,
                x: x,
                y: y,
            });
            this._possibleSquares = [];
            this.selectedCard = null;
        }
    }

    get playerIndexes() {
        return this._api.game.players.indexes;
    }
}
