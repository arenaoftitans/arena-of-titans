import { bindable } from 'aurelia-framework';


export class AotGameOverCustomElement {
    @bindable data = null;
    @bindable done = null;

    ok() {
        this.done.resolve();
    }
}
