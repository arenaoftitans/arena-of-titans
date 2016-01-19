import { bindable } from 'aurelia-framework';


export class AotInfosCustomElement {
    @bindable data = null;
    @bindable done = null;

    ok() {
        this.done.resolve();
    }
}
