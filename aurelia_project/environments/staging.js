export default {
    api: {
        host: "devapi.last-run.com",
        path: "/ws/",
        port: 80,
        tls_port: 443,
        version: "latest",
    },
    heroes: ["arline", "djor", "garez", "kharliass", "luni", "mirindrel", "razbrak", "ulya"],
    cards: [
        { name: "assassin", color: "red" },
        { name: "king", color: "black" },
        { name: "queen", color: "blue" },
        { name: "knight", color: "yellow" },
        { name: "wizard", color: "blue" },
        { name: "bishop", color: "red" },
        { name: "warrior", color: "yellow" },
    ],
    debug: false,
    testing: false,
};
