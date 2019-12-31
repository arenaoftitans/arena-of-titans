const SITE_ROUTES = [
    {
        route: "/founders",
        name: "founders",
        moduleId: "./site/routes/founders/founders",
        nav: false,
        title: "site.page_title.founders",
    },
    {
        route: "/heroes",
        name: "heroes",
        moduleId: "./site/routes/heroes/heroes",
        nav: false,
        title: "site.page_title.heroes",
    },
    {
        route: "",
        name: "home",
        moduleId: "./site/routes/home/home",
        nav: false,
        title: "site.page_title.home",
    },
    {
        route: "/moves",
        name: "moves",
        moduleId: "./site/routes/moves/moves",
        nav: false,
        title: "site.page_title.moves",
    },
    {
        route: "/people",
        name: "people",
        moduleId: "./site/routes/people/people",
        nav: false,
        title: "site.page_title.people",
    },
    {
        route: "/synopsis",
        name: "synopsis",
        moduleId: "./site/routes/synopsis/synopsis",
        nav: false,
        title: "site.page_title.synopsis",
    },
    {
        route: "/trumps",
        name: "trumps",
        moduleId: "./site/routes/trumps/trumps",
        nav: false,
        title: "site.page_title.trumps",
    },
];
configureSiteRoutes(SITE_ROUTES);

const NOT_FOUND = {
    name: "not-found",
    moduleId: "./site/routes/not-found/not-found",
    title: "site.page_title.not_found",
};
configureSiteRoutes([NOT_FOUND]);

const GAME_ROUTES = [
    {
        route: "game",
        name: "game",
        moduleId: "game/game",
    },
];

const ROUTES = SITE_ROUTES.concat(GAME_ROUTES);

export default ROUTES;
export { NOT_FOUND };

function configureSiteRoutes(routesConfig) {
    for (let routeConfig of routesConfig) {
        routeConfig.name = `site-${routeConfig.name}`;
        routeConfig.nav = false;
        routeConfig.layoutViewModel = "site/layout";
    }
}
