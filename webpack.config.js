/*
 * Copyright (C) 2015-2020 by Arena of Titans Contributors.
 *
 * This file is part of Arena of Titans.
 *
 * Arena of Titans is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * Arena of Titans is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with Arena of Titans. If not, see <http://www.gnu.org/licenses/>.
 *
 */

const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const CopyWebpackPlugin = require("copy-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const DuplicatePackageCheckerPlugin = require("duplicate-package-checker-webpack-plugin");
const project = require("./aurelia_project/aurelia.json");
const { AureliaPlugin } = require("aurelia-webpack-plugin");
const { BundleAnalyzerPlugin } = require("webpack-bundle-analyzer");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const ServiceWorkerWebpackPlugin = require("serviceworker-webpack-plugin");

// config helpers:
const ensureArray = config => (config && (Array.isArray(config) ? config : [config])) || [];
const when = (condition, config, negativeConfig) =>
    condition ? ensureArray(config) : ensureArray(negativeConfig);

// primary config:
const title = "Last Run";
const outDir = path.resolve(__dirname, project.platform.output);
const srcDir = path.resolve(__dirname, "app");
const nodeModulesDir = path.resolve(__dirname, "node_modules");
const baseUrl = "/";

const cssRules = [
    { loader: "css-loader" },
    {
        loader: "postcss-loader",
        options: {
            plugins: () => [require("autoprefixer")(), require("cssnano")()],
        },
    },
];

const sassRules = [
    {
        loader: "sass-loader",
        options: {
            sassOptions: {
                includePaths: ["node_modules"],
            },
        },
    },
];

const environmentToPiwikId = {
    prod: 3,
    staging: 4,
};

module.exports = ({ environment } = {}, { extractCss, analyze, tests, hmr, port, host } = {}) => {
    const isProductionLikeBuild = environment !== "dev";

    return {
        resolve: {
            extensions: [".js"],
            modules: [srcDir, "node_modules"],

            alias: {
                // https://github.com/aurelia/binding/issues/702
                // Enforce single aurelia-binding, to avoid v1/v2 duplication due to
                // out-of-date dependencies on 3rd party aurelia plugins
                "aurelia-binding": path.resolve(__dirname, "node_modules/aurelia-binding"),
            },
        },
        entry: {
            app: ["aurelia-bootstrapper"],
        },
        mode: isProductionLikeBuild ? "production" : "development",
        output: {
            path: outDir,
            publicPath: baseUrl,
            filename: isProductionLikeBuild
                ? "[name].[chunkhash].bundle.js"
                : "[name].[hash].bundle.js",
            sourceMapFilename: isProductionLikeBuild
                ? "[name].[chunkhash].bundle.map"
                : "[name].[hash].bundle.map",
            chunkFilename: isProductionLikeBuild
                ? "[name].[chunkhash].chunk.js"
                : "[name].[hash].chunk.js",
        },
        optimization: {
            runtimeChunk: true, // separates the runtime chunk, required for long term cacheability
            // moduleIds is the replacement for HashedModuleIdsPlugin and NamedModulesPlugin deprecated in https://github.com/webpack/webpack/releases/tag/v4.16.0
            // changes module id's to use hashes be based on the relative path of the module, required for long term cacheability
            moduleIds: "hashed",
            // Use splitChunks to breakdown the App/Aurelia bundle down into smaller chunks
            // https://webpack.js.org/plugins/split-chunks-plugin/
            splitChunks: {
                hidePathInfo: true, // prevents the path from being used in the filename when using maxSize
                chunks: "initial",
                // sizes are compared against source before minification
                maxInitialRequests: Infinity, // Default is 3, make this unlimited if using HTTP/2
                maxAsyncRequests: Infinity, // Default is 5, make this unlimited if using HTTP/2
                minSize: 10000, // chunk is only created if it would be bigger than minSize, adjust as required
                maxSize: 40000, // splits chunks if bigger than 40k, adjust as required (maxSize added in webpack v4.15)
                cacheGroups: {
                    default: false, // Disable the built-in groups default & vendors (vendors is redefined below)
                    // You can insert additional cacheGroup entries here if you want to split out specific modules
                    // This is required in order to split out vendor css from the app css when using --extractCss
                    // For example to separate font-awesome and bootstrap:
                    // fontawesome: { // separates font-awesome css from the app css (font-awesome is only css/fonts)
                    //   name: 'vendor.font-awesome',
                    //   test:  /[\\/]node_modules[\\/]font-awesome[\\/]/,
                    //   priority: 100,
                    //   enforce: true
                    // },
                    // bootstrap: { // separates bootstrap js from vendors and also bootstrap css from app css
                    //   name: 'vendor.font-awesome',
                    //   test:  /[\\/]node_modules[\\/]bootstrap[\\/]/,
                    //   priority: 90,
                    //   enforce: true
                    // },

                    // This is the HTTP/2 optimised cacheGroup configuration
                    // generic 'initial/sync' vendor node module splits: separates out larger modules
                    vendorSplit: {
                        // each node module as separate chunk file if module is bigger than minSize
                        test: /[\\/]node_modules[\\/]/,
                        name(module) {
                            // Extract the name of the package from the path segment after node_modules
                            const packageName = module.context.match(
                                /[\\/]node_modules[\\/](.*?)([\\/]|$)/,
                            )[1];
                            return `vendor.${packageName.replace("@", "")}`;
                        },
                        priority: 20,
                    },
                    vendors: {
                        // picks up everything else being used from node_modules that is less than minSize
                        test: /[\\/]node_modules[\\/]/,
                        name: "vendors",
                        priority: 19,
                        enforce: true, // create chunk regardless of the size of the chunk
                    },
                    // generic 'async' vendor node module splits: separates out larger modules
                    vendorAsyncSplit: {
                        // vendor async chunks, create each asynchronously used node module as separate chunk file if module is bigger than minSize
                        test: /[\\/]node_modules[\\/]/,
                        name(module) {
                            // Extract the name of the package from the path segment after node_modules
                            const packageName = module.context.match(
                                /[\\/]node_modules[\\/](.*?)([\\/]|$)/,
                            )[1];
                            return `vendor.async.${packageName.replace("@", "")}`;
                        },
                        chunks: "async",
                        priority: 10,
                        reuseExistingChunk: true,
                        minSize: 5000, // only create if 5k or larger
                    },
                    vendorsAsync: {
                        // vendors async chunk, remaining asynchronously used node modules as single chunk file
                        test: /[\\/]node_modules[\\/]/,
                        name: "vendors.async",
                        chunks: "async",
                        priority: 9,
                        reuseExistingChunk: true,
                        enforce: true, // create chunk regardless of the size of the chunk
                    },
                    // generic 'async' common module splits: separates out larger modules
                    commonAsync: {
                        // common async chunks, each asynchronously used module a separate chunk file if module is bigger than minSize
                        name(module) {
                            // Extract the name of the module from last path component. 'src/modulename/' results in 'modulename'
                            const moduleName = module.context.match(/[^\\/]+(?=\/$|$)/)[0];
                            return `common.async.${moduleName.replace("@", "")}`;
                        },
                        minChunks: 2, // Minimum number of chunks that must share a module before splitting
                        chunks: "async",
                        priority: 1,
                        reuseExistingChunk: true,
                        minSize: 5000, // only create if 5k or larger
                    },
                    commonsAsync: {
                        // commons async chunk, remaining asynchronously used modules as single chunk file
                        name: "commons.async",
                        minChunks: 2, // Minimum number of chunks that must share a module before splitting
                        chunks: "async",
                        priority: 0,
                        reuseExistingChunk: true,
                        enforce: true, // create chunk regardless of the size of the chunk
                    },
                },
            },
        },
        performance: { hints: false },
        devServer: {
            contentBase: outDir,
            // serve index.html for all 404 (required for push-state)
            historyApiFallback: true,
            hot: hmr || project.platform.hmr,
            port: port || project.platform.port,
            host: host,
        },
        devtool: isProductionLikeBuild ? "nosources-source-map" : "cheap-module-eval-source-map",
        module: {
            rules: [
                // CSS required in JS/TS files should use the style-loader that auto-injects it into the website
                // only when the issuer is a .js/.ts file, so the loaders are not applied inside html templates
                {
                    test: /\.css$/i,
                    issuer: [{ not: [{ test: /\.html$/i }] }],
                    use: extractCss
                        ? [
                              {
                                  loader: MiniCssExtractPlugin.loader,
                              },
                              ...cssRules,
                          ]
                        : ["style-loader", ...cssRules],
                },
                {
                    test: /\.css$/i,
                    issuer: [{ test: /\.html$/i }],
                    // CSS required in templates cannot be extracted safely
                    // because Aurelia would try to require it again in runtime
                    use: cssRules,
                },
                {
                    test: /\.scss$/,
                    use: extractCss
                        ? [
                              {
                                  loader: MiniCssExtractPlugin.loader,
                              },
                              ...cssRules,
                              ...sassRules,
                          ]
                        : ["style-loader", ...cssRules, ...sassRules],
                    issuer: /\.[tj]s$/i,
                },
                {
                    test: /\.scss$/,
                    use: [...cssRules, ...sassRules],
                    issuer: /\.html?$/i,
                },
                { test: /\.html$/i, loader: "html-loader" },
                {
                    test: /\.js$/i,
                    loader: "babel-loader",
                    exclude: nodeModulesDir,
                    options: tests ? { sourceMap: "inline", plugins: ["istanbul"] } : {},
                },
                // embed small images and fonts as Data Urls and larger ones as files:
                {
                    test: /\.(png|gif|jpg|jpeg|cur)$/i,
                    loader: "file-loader",
                    options: { limit: 8192, name: "[path][name].[contenthash].[ext]" },
                },
                {
                    test: /\.woff2(\?v=[0-9]\.[0-9]\.[0-9])?$/i,
                    loader: "url-loader",
                    options: {
                        limit: 10000,
                        mimetype: "application/font-woff2",
                        name: "[path][name].[contenthash].[ext]",
                    },
                },
                {
                    test: /\.woff(\?v=[0-9]\.[0-9]\.[0-9])?$/i,
                    loader: "url-loader",
                    options: {
                        limit: 10000,
                        mimetype: "application/font-woff",
                        name: "[path][name].[contenthash].[ext]",
                    },
                },
                // load these fonts normally, as files:
                {
                    test: /\.(ttf|eot|svg|otf)(\?v=[0-9]\.[0-9]\.[0-9])?$/i,
                    loader: "file-loader",
                    options: { name: "[path][name].[contenthash].[ext]" },
                },
                {
                    test: /\.(ogg|mp3)?$/i,
                    loader: "file-loader",
                    options: { name: "[path][name].[contenthash].[ext]" },
                },
                {
                    test: /environment\.json$/i,
                    use: [
                        {
                            loader: "app-settings-loader",
                            options: { env: environment },
                        },
                    ],
                },
            ],
        },
        plugins: [
            ...when(!tests, new DuplicatePackageCheckerPlugin()),
            new AureliaPlugin(),
            new HtmlWebpackPlugin({
                template: "index.ejs",
                minify: isProductionLikeBuild
                    ? {
                          removeComments: true,
                          collapseWhitespace: true,
                          collapseInlineTagWhitespace: true,
                          collapseBooleanAttributes: true,
                          removeAttributeQuotes: true,
                          minifyCSS: true,
                          minifyJS: true,
                          removeScriptTypeAttributes: true,
                          removeStyleLinkTypeAttributes: true,
                          ignoreCustomFragments: [/\${.*?}/g],
                      }
                    : undefined,
                metadata: {
                    // available in index.ejs //
                    title,
                    baseUrl,
                    piwikId: environmentToPiwikId[environment],
                },
            }),
            new ServiceWorkerWebpackPlugin({
                entry: "./app/sw.js",
                minimize: isProductionLikeBuild,
            }),
            // ref: https://webpack.js.org/plugins/mini-css-extract-plugin/
            ...when(
                extractCss,
                new MiniCssExtractPlugin({
                    // updated to match the naming conventions for the js files
                    filename: isProductionLikeBuild
                        ? "css/[name].[contenthash].bundle.css"
                        : "css/[name].[hash].bundle.css",
                    chunkFilename: isProductionLikeBuild
                        ? "css/[name].[contenthash].chunk.css"
                        : "css/[name].[hash].chunk.css",
                }),
            ),
            ...when(
                !tests,
                new CopyWebpackPlugin(
                    project.build.copyFiles.map(pattern => ({
                        ...pattern,
                        to: path.resolve(outDir, pattern.to),
                    })),
                ),
            ), // ignore dot (hidden) files
            ...when(analyze, new BundleAnalyzerPlugin()),
            /**
             * Note that the usage of following plugin cleans the webpack output directory before build.
             * In case you want to generate any file in the output path as a part of pre-build step, this plugin will likely
             * remove those before the webpack build. In that case consider disabling the plugin, and instead use something like
             * `del` (https://www.npmjs.com/package/del), or `rimraf` (https://www.npmjs.com/package/rimraf).
             */
            new CleanWebpackPlugin(),
        ],
    };
};
