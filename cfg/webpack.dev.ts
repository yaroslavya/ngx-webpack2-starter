import * as Webpack from "webpack";

const chalk = require("chalk");
const opn = require("opn");

import { RESOLVE_EXTENSIONS, MAIN_ENTRY, PUBLIC_PATH, APP_FILENAME, APP_FULL_URL, meta, dllEntries, paths } from "./constants";
import { Environment } from "./environment";
import { isDllBundleCreated, root, ifElse } from "./helpers";
import { loaders } from "./loaders";

const CopyWebpackPlugin = require("copy-webpack-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");

const env = new Environment(process.env.npm_lifecycle_event);
const ifNotTest = ifElse(!env.isTest);
const ifCoverage = ifElse(env.isTest && env.isCoverage);

function createConfig() {
    let config = {} as Webpack.Configuration;

    /**
     * Devtool
     * Reference: http://webpack.github.io/docs/configuration.html#devtool
     * Type of sourcemap to use per build type
     */
    config.devtool = "cheap-module-source-map";

    /**
     * Entry
     * Reference: http://webpack.github.io/docs/configuration.html#entry
     */
    config.entry = ifNotTest({
        "app": root(MAIN_ENTRY)
    });

    /**
     * Output
     * Reference: http://webpack.github.io/docs/configuration.html#output
     */
    config.output = ifNotTest({
        path: root("dist"),
        filename: "js/[name].js",
        chunkFilename: "[id].chunk.js",
        publicPath: PUBLIC_PATH
    }, {});


    /**
     * Dev server configuration
     * Reference: http://webpack.github.io/docs/configuration.html#devserver
     * Reference: http://webpack.github.io/docs/webpack-dev-server.html
     */
    config.devServer = ifNotTest(
        {
            host: meta.host,
            port: meta.port,
            contentBase: "/dist",
            stats: "minimal",
            watchOptions: {
                ignored: /(cfg|node_modules)/
            }
        }
    );

    /**
     * Resolve
     * Reference: http://webpack.github.io/docs/configuration.html#resolve
     */
    config.resolve = {
        alias: {
            //NOTE: Aliases are based on the folder structure so I left them hardcoded here.
            //Also you`ll have to change the tsconfig.json as well.
            core: root("src/core"),
            features: root("src/features"),
            infrastructure: root("src/infrastructure"),
            util: root("src/util")
        },
        extensions: [...RESOLVE_EXTENSIONS],
        unsafeCache: true,
        modules: ["node_modules"]
    };

    /**
     * Loaders
     * Reference: http://webpack.github.io/docs/configuration.html#module-loaders
     * List: http://webpack.github.io/docs/list-of-loaders.html
     * This handles most of the magic responsible for converting modules
     */
    config.module = {
        loaders: [
            loaders.atl(env),
            loaders.json({ env }),
            loaders.css({ env }),
            loaders.html({ env }),
            loaders.sass({ env }),
            loaders.font({ env }),
            loaders.image({ env })
        ]
    };

    ifCoverage(() => {
        //HACK: need to get loaders like that otherwise typescript complains there is no loaders for module.
        config.module["loaders"].push(loaders.coverage({ env, include: [root("src")], exclude: [/node_modules/, /test/] }))
    });

    /**
     * Plugins
     * Reference: http://webpack.github.io/docs/configuration.html#plugins
     * List: http://webpack.github.io/docs/list-of-plugins.html
     */
    config.plugins = [
        // Workaround needed for angular 2 angular/angular#11580
        new Webpack.ContextReplacementPlugin(
            // The (\\|\/) piece accounts for path separators in *nix and Windows
            /angular(\\|\/)core(\\|\/)(esm(\\|\/)src|src)(\\|\/)linker/,
            "/src"
        )
    ];

    ifNotTest(() => config.plugins.push(new CopyWebpackPlugin([{ from: "public" }])));
    config.plugins.push(new CopyWebpackPlugin([{ from: "dll" }]));

    ifNotTest(() => config.plugins.push(new HtmlWebpackPlugin({
        title: meta.title,
        template: "./src/app.ejs",
        chunksSortMode: "dependency",
        inject: true,
        filename: APP_FILENAME,
        isNg2dev: true
    })));

    let entryNames = Object.keys(dllEntries).map((key) => { return dllEntries[key] });

    entryNames.forEach((entryName) => {
        config.plugins.push(new Webpack.DllReferencePlugin({
            context: ".",
            manifest: require(`../dll/${entryName}-manifest.json`)
        }));
    });

    config.plugins.push(
        new (require("hard-source-webpack-plugin"))({
            cacheDirectory: __dirname + "/tmp/hard-source/[confighash]",
            recordsPath: __dirname + "/tmp/hard-source/[confighash]/records.json",
            configHash: (require("node-object-hash"))().hash
        })
    );

    config.plugins.push(new Webpack.DefinePlugin({
        env: env,
        PRODUCTION: env.isProd
    }));

    return config;
}

if (isDllBundleCreated()) {
    ifNotTest(() => {
        console.log("opening " + chalk.cyan(paths.appUrl) + " in a new incognito window");
        opn(APP_FULL_URL, { app: ["chrome", "--incognito"] });
    });

    module.exports = createConfig();
} else {
    console.log(`${chalk.bgRed.bold("Dll bundles were not created!")} 
Please, run ${chalk.bgCyan.bold("npm run build:dll")} to create the dll bundles.`);
}


