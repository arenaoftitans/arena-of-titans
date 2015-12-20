import { inject } from 'aurelia-framework';
import { Router } from 'aurelia-router';


@inject(Router)
export class Create {
    router;

    constructor(router) {
        this.router = router;
    }

    activate(params) {
        this.router.baseUrl = 'game';
        if (!params.id) {
            this.router.navigateToRoute('create', {id: 'toto'});
        }
    }
}
