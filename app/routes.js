const SITE_ROUTES = [
    {
        route: '',
        name: 'home',
        moduleId: './site/routes/home/home',
        nav: false,
        title: 'site.page_title.home',
    },
    {
        route: '/synopsis',
        name: 'synopsis',
        moduleId: './site/routes/synopsis/synopsis',
        nav: false,
        title: 'site.page_title.synopsis',
    },
    {
        route: '/heroes',
        name: 'heroes',
        moduleId: './site/routes/heroes/heroes',
        nav: false,
        title: 'site.page_title.heroes',
    },
    {
        route: '/trumps',
        name: 'trumps',
        moduleId: './site/routes/trumps/trumps',
        nav: false,
        title: 'site.page_title.trumps',
    },
];
configureSiteRoutes(SITE_ROUTES);

const NOT_FOUND = {
    name: 'not-found',
    moduleId: './site/routes/not-found/not-found',
    title: 'site.page_title.not_found',
};
configureSiteRoutes([NOT_FOUND]);

const GAME_ROUTES = [
    {
        route: ['/game', '/game/play', '/game/:version', '/game/:version/play'],
        redirect: '/game/create',
    },
    {
        route: ['/game/create', '/game/:version/create', '/game/:version/create/:id'],
        name: 'create',
        moduleId: './game/create/create',
        nav: false,
        title: 'site.page_title.create_game',
    },
    {
        route: ':version/play/:id',
        name: 'play',
        moduleId: './game/play/play',
        nav: false,
        title: 'site.page_title.play_game',
    },
];
configureGameRoutes(GAME_ROUTES);

const ROUTES = SITE_ROUTES.concat(GAME_ROUTES);

export default ROUTES;
export { NOT_FOUND };

function configureSiteRoutes(routesConfig) {
    for (let routeConfig of routesConfig) {
        routeConfig.name = `site-${routeConfig.name}`;
        routeConfig.nav = false;
        routeConfig.layoutViewModel = 'site/layout';
    }
}

function configureGameRoutes(routesConfig) {
    for (let routeConfig of routesConfig) {
        routeConfig.name = routeConfig.name ? `game-${routeConfig.name}` : undefined;
        routeConfig.nav = false;
        routeConfig.layoutViewModel = 'game/layout';
    }
}
