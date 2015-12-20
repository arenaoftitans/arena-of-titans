import { inject } from 'aurelia-framework';
import { Router } from 'aurelia-router';
import { Game } from '../game';


@inject(Router, Game)
export class Create {
    router;
    game;

    constructor(router, game) {
        this.router = router;
        this.game = game;
    }

    activate(params) {
        this.router.baseUrl = 'game';
        if (!params.id) {
            this.router.navigateToRoute('create', {id: 'toto'});
        } else {
            this.game.popup('create-game', {name: ''}).then(data => {
            });
        }
    }
}
