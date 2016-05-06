import { bindable } from 'aurelia-framework';


export class AotPopupCustomElement {
    @bindable data = null;
    @bindable type = null;
    @bindable done = null;

    background = '';

    bind() {
        switch (this.type) {
            case 'game-over':
                this.background = 'game-over';
                break;
            default:
                this.background = 'default';
                break;
        }
    }
}
