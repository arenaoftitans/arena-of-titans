import { bindable } from 'aurelia-framework';


export class AotConfirmCustomElement {
    @bindable data = null;
    @bindable done = null;

    ok() {
        this.done.resolve();
    }

    cancel() {
        this.done.reject();
    }
}
