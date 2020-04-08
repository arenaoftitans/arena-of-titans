module.exports = api => {
    api.cache.using(() => {
        return "babel:" + process.env.BABEL_TARGET;
    });

    return {
        plugins: [
            ["@babel/plugin-proposal-decorators", { legacy: true }],
            ["@babel/plugin-proposal-class-properties", { loose: true }],
        ],
        presets: [
            [
                "@babel/preset-env",
                {
                    loose: true,
                    modules: process.env.BABEL_TARGET === "node" ? "commonjs" : false,
                    targets:
                        process.env.BABEL_TARGET === "node"
                            ? {
                                  node: "10",
                              }
                            : undefined,
                },
            ],
        ],
    };
};
