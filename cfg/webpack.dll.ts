const chalk = require("chalk");
const fs = require("fs");

const Path = require("path");

const CheckDependencies = require("check-dependencies");

const WatchMissingNodeModulesPlugin = require('./watch-missing-node-modules-plugin');

import * as Webpack from "webpack";

import { DLL_POLYFILLS_PRE, DLL_POLYFILLS_POST, DLL_VENDORS_PRE, DLL_VENDORS_POST, dllEntries, paths } from "./constants";
import { loaders } from "./loaders";
import { Environment } from "./environment";

const env = new Environment(process.env.npm_lifecycle_event);

//TODO: now monkeypatching every time. We can only monkeypatch for the test run, so we need an env here.
function monkeyPatchAngular() {
    const ng2Path = Path.resolve("node_modules/@angular/core/bundles/core-testing.umd.js");

    if (fs.existsSync(ng2Path)) {
        console.log(chalk.cyan("found angular2 monkeypatching target"));
        let data = fs.readFileSync(ng2Path).toString();

        if (!(data.indexOf("//TestBed.resetTestingModule();") > 0)) {
            data = data.replace("TestBed.resetTestingModule();", "//TestBed.resetTestingModule();");
            fs.writeFileSync(ng2Path, data);
            console.log(chalk.green("🍌🍌🍌monkeypatched successfully🍌🍌🍌"));
        } else {
            console.log(chalk.cyan("source was 🍌🍌🍌monkeypatched🍌🍌🍌 previously"));
        }
    }
}

let polyfills = [
    ...DLL_POLYFILLS_PRE,
    "zone.js",
    "zone.js/dist/zone",
    "reflect-metadata",
    "core-js",
    "zone.js/dist/long-stack-trace-zone.js",
    ...DLL_POLYFILLS_POST
];

let vendors = [
    ...DLL_VENDORS_PRE,
    "@angular/platform-browser",
    "@angular/platform-browser-dynamic",
    "@angular/core",
    "@angular/common",
    "@angular/router",
    "@angular/forms",
    "@angular/http",
    ...DLL_VENDORS_POST
];

function createConfig() {
    monkeyPatchAngular();

    let config = {} as Webpack.Configuration;

    config.devtool = "cheap-module-eval-source-map";

    config.entry = {
        [dllEntries.polyfill]: polyfills,
        [dllEntries.vendor]: vendors
    };

    /**
     * Output
     * Reference: http://webpack.github.io/docs/configuration.html#output
     */
    config.output = {
        path: Path.resolve("dll"),
        filename: "[name].js",
        library: "[name]"
    };

    /**
     * Resolve
     * Reference: http://webpack.github.io/docs/configuration.html#resolve
     */
    config.resolve = {
        extensions: [".ts", ".js", ".json", ".css", ".scss", ".html"]
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

    /**
     * Plugins
     * Reference: http://webpack.github.io/docs/configuration.html#plugins
     * List: http://webpack.github.io/docs/list-of-plugins.html
     */
    config.plugins = [
        new Webpack.DllPlugin({
            path: Path.resolve("dll/[name]-manifest.json"),
            name: "[name]"
        }),
        new WatchMissingNodeModulesPlugin(paths.NodeModules),
    ];

    return config;
}

CheckDependencies("sync", function (output) {
    let filtered = output.error.filter(item => {
        return !(item.indexOf("bgt-lib-bos-ts") != -1) &&
            !(item.indexOf("bgt-lib-us-ts") != -1) &&
            !(item.indexOf("bgt-lib-gs-ts") != -1);
    });

    if (output.depsWereOk || filtered.length == 1) {
        module.exports = createConfig();
    } else {
        console.log(`${chalk.bgRed("Some of the packages are not installed!")} Please use ${chalk.bgCyan.bold("npm install")} to install the missing packages`);
        console.log(`Or execute the commands below:`);
        filtered.pop();

        filtered.forEach(item => {
            let packageName = item.split(":")[0];
            console.log(`${chalk.bgCyan.bold("npm install " + packageName)}`);
        });
    }
});


