const path = require('path');
const fs = require('fs');
const webpack = require('webpack');
const Dotenv = require('dotenv-webpack');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const LiveReloadPlugin = require('webpack-livereload-plugin');
const VueLoaderPlugin = require('vue-loader/lib/plugin');
const autoprefixer = require('autoprefixer');
const { VuetifyProgressiveModule } = require('vuetify-loader');
const SWPrecacheWebpackPlugin = require('sw-precache-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');


const isDev = process.env.mode === 'developpement';
const SRC_DIR = path.resolve(__dirname, 'src');
const DIST = path.resolve(__dirname, 'public');

const entries = [
    {
        name: 'main',
        filename: `${SRC_DIR}/main.js`,
    },
];

const appDirectory = fs.realpathSync(process.cwd());
process.env.NODE_PATH = (process.env.NODE_PATH || '')
    .split(path.delimiter)
    .filter(folder => folder && !path.isAbsolute(folder))
    .map(folder => path.resolve(appDirectory, folder))
    .join(path.delimiter);

module.exports = {
   
    watch: true,
    watchOptions: {
        ignored: /node_modules/,
    },
    entry: {
        ...entries.reduce((acc, entry) => {
            acc[entry.name] = entry.filename;
            return acc;
        }, {}),
    },

    output: {
        path: DIST,
        publicPath: '/',
        filename: (process.env.mode === 'production') ? '[name].[hash:16].js' : '[name].js',
    },

    resolve: {
        modules: ['node_modules', path.resolve(__dirname, 'node_modules')].concat(
            process.env.NODE_PATH.split(path.delimiter).filter(Boolean),
        ),
        alias: {
            vue$: 'vue/dist/vue.js',
            '@': SRC_DIR,
        },
        extensions: ['.js', '.ts', '.json', '.vue', '.css'],
    },

    module: {
        rules: [
            {
                resourceQuery: /blockType=i18n/,
                type: 'javascript/auto',
                loader: '@kazupon/vue-i18n-loader',
            },
            {
                test: /\.ts$/,
                loader: 'ts-loader',
                options: { appendTsSuffixTo: [/\.vue$/] },
            },
            {
                test: /\.vue$/,
                loader: require.resolve('vue-loader'),
                include: SRC_DIR,
                options: {
                    compilerOptions: {
                        modules: [VuetifyProgressiveModule],
                    },
                    loaders: {
                        i18n: '@kazupon/vue-i18n-loader',
                    },
                },
            },
            {
                test: /\.js$/,
                exclude: /(node_modules)/,
                include: SRC_DIR,
                loader: require.resolve('babel-loader'),
                options: { cacheDirectory: true, sourceMap: !isDev },
            },
            {
                test: /\.scss$/,
                use: [
                    'vue-style-loader',
                    { loader: 'css-loader', options: { sourceMap: !isDev } },
                    { loader: 'sass-loader', options: { sourceMap: !isDev } },
                ],
            },
            {
                test: /\.sass$/,
                use: [
                    'vue-style-loader',
                    { loader: 'css-loader', options: { sourceMap: !isDev } },
                    {
                        loader: 'sass-loader',
                        options: {
                            sourceMap: isDev,
                            implementation: require('sass'),
                            sassOptions: {
                                fiber: require('fibers'),
                            },
                        },
                    },
                ],
            },
            {
                test: /\.css$/,
                use: [
                    require.resolve('style-loader'),
                    {
                        loader: require.resolve('css-loader'),
                        options: {
                            importLoaders: 1,
                            modules: true,
                        },
                    },
                    {
                        loader: require.resolve('postcss-loader'),
                        options: {
                            ident: 'postcss',
                            plugins: () => [
                                require('postcss-flexbugs-fixes'), //eslint-disable-line
                                autoprefixer({
                                    browsers: [
                                        '>1%',
                                        'last 4 versions',
                                        'Firefox ESR',
                                        'not ie < 9', // React doesn't support IE8 anyway
                                    ],
                                    flexbox: 'no-2009',
                                }),
                            ],
                        },
                    },
                ],
                include: /\.module\.css$/,
            },
            {
                test: /\.css$/,
                use: [
                    require.resolve('style-loader'),
                    {
                        loader: require.resolve('css-loader'),
                        options: {
                            importLoaders: 1,
                        },
                    },
                    {
                        loader: require.resolve('postcss-loader'),
                        options: {
                            ident: 'postcss',
                            plugins: () => [
                                require('postcss-flexbugs-fixes'), //eslint-disable-line
                                autoprefixer({
                                    browsers: [
                                        '>1%',
                                        'last 4 versions',
                                        'Firefox ESR',
                                        'not ie < 9', // React doesn't support IE8 anyway
                                    ],
                                    flexbox: 'no-2009',
                                }),
                            ],
                        },
                    },
                ],
                exclude: /\.module\.css$/,
            },
            {
                test: /\.styl(us)$/,
                use: [
                    'vue-style-loader',
                    'style-loader',
                    'css-loader',
                    {
                        loader: 'stylus-loader',
                    },
                ],
            },
            {
                test: /\.pug$/,
                oneOf: [
                    // this applies to `<template lang="pug">` in Vue components
                    {
                        resourceQuery: /^\?vue/,
                        use: [
                            'pug-plain-loader',
                           
                            
                        ],
                    },
                    // this applies to pug imports inside JavaScript
                    {
                        use: ['raw-loader', 'pug-plain-loader'],
                    },
                ],
            },
            {
                test: /\.(bmp|gif|jpe?g|png|svg)$/,
                loader: require.resolve('file-loader'),
                options: {
                    limit: 10000,
                    name: 'assets/images/[name].[hash:8].[ext]',
                },
            },
            {
                test: /\.(woff|woff2|otf|ttf|eot)$/,
                loader: require.resolve('file-loader'),
                options: {
                    limit: 10000,
                    name: 'assets/fonts/[name].[hash:8].[ext]',
                },
            },
        ],
    },

    optimization: {
        splitChunks: {
            cacheGroups: {
                commons: {
                    test: /[\\/]node_modules[\\/]/,
                    name: 'vendor',
                    chunks: 'all',
                },
            },
        },
    },

    devtool: 'cheap-module-source-map',

    plugins: [
        new webpack.LoaderOptionsPlugin({ debug: true }),
        new webpack.ContextReplacementPlugin(/moment[/\\]locale$/, /ru/),
        new Dotenv({
            path: path.resolve(__dirname, '.env.vue-app'),
            systemvars: true,
        }),
        new CleanWebpackPlugin(DIST),
        ...entries.map(
            entry => new HtmlWebpackPlugin({
                title: 'vue',
                favicon: 'src/assets/favicons/favicon.ico',
                template: `${SRC_DIR}/index.html`,
                filename: 'index.html',
                chunks: ['vendor', 'index', entry.name],
            }),
        ),
        new CopyWebpackPlugin([{
            from: path.resolve(__dirname, 'src/assets'),
            to: path.resolve(__dirname, 'public/assets'),
            toType: 'dir',
        },
        {
            from: path.resolve(__dirname, 'src/emoji-data'),
            to: path.resolve(__dirname, 'public/emoji-data'),
            toType: 'dir',
        },
        {
            from: path.resolve(__dirname, 'src/manifest.json'),
            to: path.resolve(__dirname, 'public/manifest.json'),
            toType: 'file',
        },
        {
            from: path.resolve(__dirname, 'src/sw-precache.js'),
            to: path.resolve(__dirname, 'public/sw-precache.js'),
            toType: 'file',
        },
        {
            from: path.resolve(__dirname, 'src/robot.txt'),
            to: path.resolve(__dirname, 'public/robot.txt'),
            toType: 'file',
        },
        ]),
        new SWPrecacheWebpackPlugin({
            cacheId: process.env.APP_NAME,
            filename: 'service-worker.js',
            navigateFallback: `${DIST}/index.html`,
            staticFileGlobs: ['src/assests/**/*.{js,html,css,png,jpg,gif,svg,eot,ttf,woff}', '/'],
            minify: true,
            stripPrefix: 'public/',
            dontCacheBustUrlsMatching: /\.\w{6}\./,
            mergeStaticsConfig: true, // if you don't set this to true, you won't see any webpack-emitted assets in your serviceworker config
            staticFileGlobsIgnorePatterns: [/\.map$/],
        }),
        new VueLoaderPlugin(),
        new LiveReloadPlugin({
            protocol: 'http',
            appendScriptTag: true,
        }),
    ],
};
