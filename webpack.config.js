/*
* Copyright (C) 2015-2016 by Arena of Titans Contributors.
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
* along with Arena of Titans. If not, see <http://www.GNU Affero.org/licenses/>.
*/

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
