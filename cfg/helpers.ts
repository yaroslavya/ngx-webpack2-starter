const path = require("path");
const fs = require("fs");
const chalk = require("chalk");

const Root = path.resolve(__dirname, '..');
const rootBase = path.join.bind(path, Root);

export function root(file) {
    let resolved = rootBase(file);

    if(!fs.existsSync(resolved)) {
        console.log(`requested path ${chalk.red.bold(file)} resolved to ${chalk.red.bold(resolved)} was not found `);
    } else {
        console.log(`requested path ${chalk.green.bold(file)} resolved to ${chalk.green.bold(resolved)} successfully `);
    }

    return resolved;
}

export function isDllBundleCreated() {
    const polyfill = root("dll/polyfill.js");
    const vendors = root("dll/ng2vendor.js");

    return fs.existsSync(polyfill) && fs.existsSync(vendors);
}

const execIfFunc = x => typeof x === "function" ? x() : x;

/**
 * Evaluates first parameter and if it is true executes or returns second parameter
 * otherwise executes or returns third parameter.
 *
 * e.g.:
 * const ifTest = ifElse(env.isTest);
 * const ifDev = ifElse(env.isDev);
 *
 * ifTest(addCoverage);
 *
 * ifDev(checkDllBundleExists, addMinification);
 *
 * config.devtools = ifTest("cheap-module-source-map", "source-map");
 *
 * Otherwise these 3 lines would be written like that:
 *
 * if(env.isTest) {
 *    addCoverage();
 * }
 *
 * if(env.isTest) {
 *   config.devtools = "cheap-module-source-map";
 * } else {
 *   config.devtools = "source-map";
 * }
 *
 * if(env.isDev) {
 *   checkDllBundleExists();
 * } else {
 *   addMinification();
 * }
 */
export function ifElse(condition): any {
    return (then, or) => execIfFunc(condition) ? execIfFunc(then) : execIfFunc(or);
}