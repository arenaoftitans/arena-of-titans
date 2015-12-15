export class NavBarCustomElement {
    router;

    configureRouter(config, router) {
        this.router = router;
        console.log(router.navigation);
    }
}
