/*eslint-disable no-var*/

var path = require('path');
var AureliaWebpackPlugin = require('aurelia-webpack-plugin');
var ProvidePlugin = require('webpack/lib/ProvidePlugin');

module.exports = {
    devServer: {
        host: 'localhost',
        port: 8282,
        historyApiFallback: true,
        proxy: {
            '/*1.bundle.js': {
                target: 'http://localhost:8282',
                rewrite: function(req) {
                    req.url = '/' + req.url;
                }
            }
        }
    },
    entry: {
        main: [
            './app/main'
        ]
    },
    output: {
        path: path.join(__dirname, 'build'),
        publicPath: '/',
        filename: 'bundle.js'
    },
    plugins: [
        new AureliaWebpackPlugin({
            src: path.resolve('./app/'),
            includeSubModules: [
                { moduleId: "aurelia-i18n" }
            ]
        }),
        new ProvidePlugin({
            Promise: 'bluebird'
        })
    ],
    module: {
        loaders: [
            { test: /\.js$/, loader: 'babel', exclude: /node_modules/, query: { presets: ['es2015-loose', 'stage-1'], plugins: ['transform-decorators-legacy'] } },
            { test: /\.css?$/, loader: 'style!css' },
            { test: /\.json$/, loader: 'json' },
            { test: /\.html$/, loader: 'html' },
            { test: /\.(png|gif|jpg)$/, loader: 'url-loader?limit=8192' },
            { test: /\.woff2(\?v=[0-9]\.[0-9]\.[0-9])?$/, loader: 'url-loader?limit=10000&minetype=application/font-woff2' },
            { test: /\.woff(\?v=[0-9]\.[0-9]\.[0-9])?$/, loader: 'url-loader?limit=10000&minetype=application/font-woff' },
            { test: /\.(ttf|eot|svg)(\?v=[0-9]\.[0-9]\.[0-9])?$/, loader: 'file-loader' }
        ]
    }
};
