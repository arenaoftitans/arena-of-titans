const ROUTES = [
    {
        route: ['', '/play', '/:version', '/:version/play'],
        redirect: 'create',
    },
    {
        route: ['/create', '/:version/create', '/:version/create/:id'],
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
