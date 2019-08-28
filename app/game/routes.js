const ROUTES = [
    {
        route: ['', '/play', '/:version', '/:version/play'],
        redirect: 'create',
    },
    {
        route: ['/:version/create/:id', '/:version/create', '/create'],
        name: 'create',
        moduleId: './create/create',
        nav: false,
        title: 'site.page_title.create_game',
    },
    {
        route: '/:version/play/:id',
        name: 'play',
        moduleId: './play/play',
        nav: false,
        title: 'site.page_title.play_game',
    },
];

export default ROUTES;
