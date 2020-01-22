const path = require("path");
const fs = require("fs");
const webpack = require("webpack");
const Dotenv = require("dotenv-webpack");
const CleanWebpackPlugin = require("clean-webpack-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const LiveReloadPlugin = require("webpack-livereload-plugin");
const VueLoaderPlugin = require("vue-loader/lib/plugin");
const autoprefixer = require("autoprefixer");
const { VuetifyProgressiveModule } = require("vuetify-loader");
const { InjectManifest } = require("workbox-webpack-plugin");
const CopyWebpackPlugin = require("copy-webpack-plugin");
//const PrerenderSPAPlugin = require("prerender-spa-plugin");
//const Renderer = PrerenderSPAPlugin.PuppeteerRenderer;

const isDev = process.env.mode === "developpement";
const SRC_DIR = path.resolve(__dirname, "src");
const DIST = path.resolve(__dirname, "public");

const entries = [
    {
        name: "main",
        filename: `${SRC_DIR}/main.js`
    }
];

const appDirectory = fs.realpathSync(process.cwd());
process.env.NODE_PATH = (process.env.NODE_PATH || "")
    .split(path.delimiter)
    .filter(folder => folder && !path.isAbsolute(folder))
    .map(folder => path.resolve(appDirectory, folder))
    .join(path.delimiter);

module.exports = {
    watch: true,
    watchOptions: {
        ignored: /node_modules/
    },
    entry: {
        ...entries.reduce((acc, entry) => {
            acc[entry.name] = entry.filename;
            return acc;
        }, {})
    },

    output: {
        path: DIST,
        publicPath: "/",
        filename:
            process.env.mode === "production"
                ? "[name].[hash:16].js"
                : "[name].js"
    },

    resolve: {
        modules: [
            "node_modules",
            path.resolve(__dirname, "node_modules")
        ].concat(process.env.NODE_PATH.split(path.delimiter).filter(Boolean)),
        alias: {
            vue$: "vue/dist/vue.js",
            "@": SRC_DIR
        },
        extensions: [".js", ".ts", ".json", ".vue", ".css"]
    },

    module: {
        rules: [
            {
                resourceQuery: /blockType=i18n/,
                type: "javascript/auto",
                loader: "@kazupon/vue-i18n-loader"
            },
            {
                test: /\.ts$/,
                loader: "ts-loader",
                options: { appendTsSuffixTo: [/\.vue$/] }
            },
            {
                test: /\.vue$/,
                loader: require.resolve("vue-loader"),
                include: SRC_DIR,
                options: {
                    compilerOptions: {
                        modules: [VuetifyProgressiveModule]
                    },
                    loaders: {
                        i18n: "@kazupon/vue-i18n-loader"
                    }
                }
            },
            {
                test: /\.js$/,
                exclude: /(node_modules)/,
                include: SRC_DIR,
                loader: require.resolve("babel-loader"),
                options: { cacheDirectory: true, sourceMap: !isDev }
            },
            {
                test: /\.scss$/,
                use: [
                    "vue-style-loader",
                    { loader: "css-loader", options: { sourceMap: !isDev } },
                    { loader: "sass-loader", options: { sourceMap: !isDev } }
                ]
            },
            {
                test: /\.sass$/,
                use: [
                    "vue-style-loader",
                    { loader: "css-loader", options: { sourceMap: !isDev } },
                    {
                        loader: "sass-loader",
                        options: {
                            sourceMap: isDev,
                            implementation: require("sass"),
                            sassOptions: {
                                fiber: require("fibers")
                            }
                        }
                    }
                ]
            },
            {
                test: /\.css$/,
                use: [
                    require.resolve("style-loader"),
                    {
                        loader: require.resolve("css-loader"),
                        options: {
                            importLoaders: 1,
                            modules: true
                        }
                    },
                    {
                        loader: require.resolve("postcss-loader"),
                        options: {
                            ident: "postcss",
                            plugins: () => [
                                require("postcss-flexbugs-fixes"), //eslint-disable-line
                                autoprefixer({
                                    browsers: [
                                        ">1%",
                                        "last 4 versions",
                                        "Firefox ESR",
                                        "not ie < 9" // React doesn't support IE8 anyway
                                    ],
                                    flexbox: "no-2009"
                                })
                            ]
                        }
                    }
                ],
                include: /\.module\.css$/
            },
            {
                test: /\.css$/,
                use: [
                    require.resolve("style-loader"),
                    {
                        loader: require.resolve("css-loader"),
                        options: {
                            importLoaders: 1
                        }
                    },
                    {
                        loader: require.resolve("postcss-loader"),
                        options: {
                            ident: "postcss",
                            plugins: () => [
                                require("postcss-flexbugs-fixes"), //eslint-disable-line
                                autoprefixer({
                                    browsers: [
                                        ">1%",
                                        "last 4 versions",
                                        "Firefox ESR",
                                        "not ie < 9" // React doesn't support IE8 anyway
                                    ],
                                    flexbox: "no-2009"
                                })
                            ]
                        }
                    }
                ],
                exclude: /\.module\.css$/
            },
            {
                test: /\.styl(us)$/,
                use: [
                    "vue-style-loader",
                    "style-loader",
                    "css-loader",
                    {
                        loader: "stylus-loader"
                    }
                ]
            },
            {
                test: /\.pug$/,
                oneOf: [
                    // this applies to `<template lang="pug">` in Vue components
                    {
                        resourceQuery: /^\?vue/,
                        use: ["pug-plain-loader"]
                    },
                    // this applies to pug imports inside JavaScript
                    {
                        use: ["raw-loader", "pug-plain-loader"]
                    }
                ]
            },
            {
                test: /\.(bmp|gif|jpe?g|png|svg)$/,
                loader: require.resolve("file-loader"),
                options: {
                    limit: 10000,
                    name: "assets/images/[name].[hash:8].[ext]"
                }
            },
            {
                test: /\.(woff|woff2|otf|ttf|eot)$/,
                loader: require.resolve("file-loader"),
                options: {
                    limit: 10000,
                    name: "assets/fonts/[name].[hash:8].[ext]"
                }
            }
        ]
    },

    optimization: {
        splitChunks: {
            cacheGroups: {
                commons: {
                    test: /[\\/]node_modules[\\/]/,
                    name: "vendor",
                    chunks: "all"
                }
            }
        }
    },

    devtool: "cheap-module-source-map",

    plugins: [
        new webpack.LoaderOptionsPlugin({ debug: true }),
        new VueLoaderPlugin(),
        new webpack.ContextReplacementPlugin(/moment[/\\]locale$/, /ru/),
        new Dotenv({
            path: path.resolve(__dirname, ".env.vue-app"),
            systemvars: true
        }),
        new CleanWebpackPlugin(DIST),
        ...entries.map(
            entry =>
                new HtmlWebpackPlugin({
                    title: "vue",
                    favicon: "src/assets/img/favicon.png",
                    template: `${SRC_DIR}/index.html`,
                    filename: "index.html",
                    chunks: ["vendor", "index", entry.name]
                })
        ),
        new CopyWebpackPlugin([
            {
                from: path.resolve(__dirname, "src/assets"),
                to: path.resolve(__dirname, "public/assets"),
                toType: "dir"
            },
            {
                from: path.resolve(__dirname, "src/manifest.json"),
                to: path.resolve(__dirname, "public/manifest.json"),
                toType: "file"
            },
            {
                from: path.resolve(__dirname, "src/sw-precache.js"),
                to: path.resolve(__dirname, "public/sw-precache.js"),
                toType: "file"
            },
            {
                from: path.resolve(__dirname, "src/sitemap.xml"),
                to: path.resolve(__dirname, "public/sitemap.xml"),
                toType: "file"
            },
            {
                from: path.resolve(__dirname, "src/robots.txt"),
                to: path.resolve(__dirname, "public/robots.txt"),
                toType: "file"
            },
            {
                from: path.resolve(__dirname, "src/push.js"),
                to: path.resolve(__dirname, "public/push.js"),
                toType: "file"
            }
        ]),
        new LiveReloadPlugin({
            protocol: "http",
            appendScriptTag: true
        }),
        new InjectManifest({
            swSrc: "./src/push.js",
            swDest: "service-worker.js",
            exclude: [/\.map$/],
            importWorkboxFrom:
                process.env.mode === "production" ? "cdn" : "local"
            //    maximumFileSizeToCacheInBytes: 7 * 1024 * 1024
        })

        /*new PrerenderSPAPlugin({
            // Required - The path to the webpack-outputted app to prerender.
            staticDir: path.join(__dirname, "public"),

            // Optional - The path your rendered app should be output to.
            // (Defaults to staticDir.)
            outputDir: path.join(__dirname, "public"),

            // Optional - The location of index.html
            indexPath: path.join(__dirname, "public", "index.html"),

            // Required - Routes to render.
            routes: ["/", "/login", "/signup", "/members"],

            // Optional - Allows you to customize the HTML and output path before
            // writing the rendered contents to a file.
            // renderedRoute can be modified and it or an equivelant should be returned.
            // renderedRoute format:
            // {
            //   route: String, // Where the output file will end up (relative to outputDir)
            //   originalRoute: String, // The route that was passed into the renderer, before redirects.
            //   html: String, // The rendered HTML for this route.
            //   outputPath: String // The path the rendered HTML will be written to.
            // }
            postProcess(renderedRoute) {
                // Ignore any redirects.
                renderedRoute.route = renderedRoute.originalRoute;
                // Basic whitespace removal. (Don't use this in production.)
                renderedRoute.html = renderedRoute.html
                    .split(/>[\s]+</gim)
                    .join("><");
                // Remove /index.html from the output path if the dir name ends with a .html file extension.
                // For example: /dist/dir/special.html/index.html -> /dist/dir/special.html
                if (renderedRoute.route.endsWith(".html")) {
                    renderedRoute.outputPath = path.join(
                        __dirname,
                        "public",
                        renderedRoute.route
                    );
                }

                return renderedRoute;
            },

            // Optional - Uses html-minifier (https://github.com/kangax/html-minifier)
            // To minify the resulting HTML.
            // Option reference: https://github.com/kangax/html-minifier#options-quick-reference
            minify: {
                collapseBooleanAttributes: true,
                collapseWhitespace: true,
                decodeEntities: true,
                keepClosingSlash: true,
                sortAttributes: true
            },

            // Server configuration options.
            server: {
                // Normally a free port is autodetected, but feel free to set this if needed.
                port: 8001
            },

            // The actual renderer to use. (Feel free to write your own)
            // Available renderers: https://github.com/Tribex/prerenderer/tree/master/renderers
            renderer: new Renderer({
                // Optional - The name of the property to add to the window object with the contents of `inject`.
                injectProperty: "__PRERENDER_INJECTED",
                // Optional - Any values you'd like your app to have access to via `window.injectProperty`.
                //inject: {
                //    foo: "bar"
                //},

                // Optional - defaults to 0, no limit.
                // Routes are rendered asynchronously.
                // Use this to limit the number of routes rendered in parallel.
                maxConcurrentRoutes: 4,

                // Optional - Wait to render until the specified event is dispatched on the document.
                // eg, with `document.dispatchEvent(new Event('custom-render-trigger'))`
                renderAfterDocumentEvent: "load",

                // Optional - Wait to render until the specified element is detected using `document.querySelector`
                renderAfterElementExists: "#material-ki",

                // Optional - Wait to render until a certain amount of time has passed.
                // NOT RECOMMENDED
                //renderAfterTime: 5000, // Wait 5 seconds.

                // Other puppeteer options.
                // (See here: https://github.com/GoogleChrome/puppeteer/blob/master/docs/api.md#puppeteerlaunchoptions)
                headless: false // Display the browser window when rendering. Useful for debugging.
            })
        })*/
    ]
};
