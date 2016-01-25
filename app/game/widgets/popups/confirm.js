import { bindable } from 'aurelia-framework';


export class AotConfirmCustomElement {
    @bindable data = null;
    @bindable done = null;
    selectedChoice;

    ok() {
        if (this.data.choices && this.selectedChoice === undefined) {
            return;
        }
        this.done.resolve(this.selectedChoice);
    }

    cancel() {
        this.done.reject();
    }
}
