import { bindable } from 'aurelia-framework';


export class AotPlayerInfosCustomElement {
    @bindable data = null;
    @bindable done = null;

    save() {
        this.done.resolve(this.data);
    }

    selectHero() {
    }
}
