/* eslint-disable @typescript-eslint/no-var-requires */
/* global __dirname, process */
const path = require('path');

const isDev = process.env.NODE_ENV === 'development';
const { BugsnagBuildReporterPlugin } = require('webpack-bugsnag-plugins');

const PACKAGE = require('./package.json');
const CONFIG = require('./config.json');
const { version } = PACKAGE;
const { bugsnagApiKeyStaging, bugsnagApiKeyProduction } = CONFIG;

const bugsnagPlugin = [];
bugsnagApiKeyStaging && bugsnagPlugin.push(new BugsnagBuildReporterPlugin({apiKey: bugsnagApiKeyStaging, appVersion: version}));
bugsnagApiKeyProduction && bugsnagPlugin.push(new BugsnagBuildReporterPlugin({apiKey: bugsnagApiKeyProduction, appVersion: version}));

module.exports = {
    entry: {
        one_page: './src/themes/one-page/init.tsx',
        buy_now: './src/themes/buy-now/init.tsx',
        three_page: './src/themes/three-page/init.tsx',
    },
    output: {
        path: path.join(__dirname, '/build'),
        filename: '[name].js',
    },
    devtool: 'source-map',
    mode: process.env.NODE_ENV,
    target: 'web',
    resolve: {
        alias: {
            src: path.resolve(__dirname, 'src'),
            public: path.resolve(__dirname, 'public'),
            root: path.resolve(__dirname),
        },
        modules: [path.resolve(__dirname, 'src'), 'node_modules'],
        extensions: ['.tsx', '.ts', '.jsx', '.js']
    },
    devServer: {
        static: './',
        host: 'localhost',
        allowedHosts: 'all',
    },
    module: {
        rules: [
            {
                test: /\.(css|scss)$/,
                use: [
                    {
                        loader: 'style-loader',
                        options: { injectType: 'singletonStyleTag' }
                    }, 'css-loader']
            },
            {
                test: /\.(jpg|jpeg|png|gif|mp3|svg)$/,
                use: ['file-loader']
            },
            {
                test: /\.tsx?$/,
                exclude: /node_modules/,
                use: [
                    {
                        loader: 'ts-loader'
                    }
                ]
            }
        ]
    },
    plugins: [...bugsnagPlugin],
    performance: {
        hints: isDev ? false : 'warning',
        maxEntrypointSize: 1048576,
        maxAssetSize: 1048576
    }
};
