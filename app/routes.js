const SITE_ROUTES = [
    {
        route: '',
        name: 'home',
        moduleId: './site/routes/home/home',
        nav: false,
        title: 'Home',
    },
    {
        route: '/synopsis',
        name: 'synopsis',
        moduleId: './site/routes/synopsis/synopsis',
        nav: false,
        title: 'Synopsis',
    },
    {
        route: '/heroes',
        name: 'heroes',
        moduleId: './site/routes/heroes/heroes',
        nav: false,
        title: 'Heroes',
    },
    {
        route: '/trumps',
        name: 'trumps',
        moduleId: './site/routes/trumps/trumps',
        nav: false,
        title: 'Trumps',
    },
];
configureSiteRoutes(SITE_ROUTES);

const GAME_ROUTES = [
    {
        route: ['/game', '/game/play', '/game/:version', '/game/:version/play'],
        redirect: 'create',
    },
    {
        route: ['/game/create', '/game/:version/create', '/game/:version/create/:id'],
        name: 'create',
        moduleId: './game/create/create',
        nav: false,
        title: 'Create game',
    },
    {
        route: ':version/play/:id',
        name: 'play',
        moduleId: './game/play/play',
        nav: false,
        title: 'Play',
    },
];
configureGameRoutes(GAME_ROUTES);

const ROUTES = SITE_ROUTES.concat(GAME_ROUTES);

export default ROUTES;

function configureSiteRoutes(routesConfig) {
    for (let routeConfig of routesConfig) {
        routeConfig.nav = false;
        routeConfig.layoutViewModel = 'site/layout';
    }
}

function configureGameRoutes(routesConfig) {
    for (let routeConfig of routesConfig) {
        routeConfig.nav = false;
        routeConfig.layoutViewModel = 'game/layout';
    }
}
