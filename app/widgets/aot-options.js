import { I18N } from 'aurelia-i18n';
import { inject } from 'aurelia-framework';


@inject(I18N)
export class AotOptionsCustomElement {
    constructor(i18n) {
        this.i18n = i18n;
    }

    changeLang(lang) {
        this.i18n.setLocale(lang);
    }
}
