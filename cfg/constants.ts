const fs = require("fs");
const path = require("path");

import { root } from "./helpers";

export const RESOLVE_EXTENSIONS = [".ts", ".js", ".json", ".css", ".scss", ".html"];
export const DLL_POLYFILLS_PRE = [];
export const DLL_POLYFILLS_POST = [];

export const DLL_VENDORS_PRE = [];
export const DLL_VENDORS_POST = [
    "lodash",
    "moment",
    "crypto-js"
];

export const dllEntries = {
    polyfill: "polyfill",
    vendor: "ng2vendor"
};

export const MAIN_ENTRY = "src/main.ts";

export const PORT = 1001;
export const HOST = "localhost";
export const PUBLIC_PATH = `http://${HOST}:${PORT}/`;

export const APP_FILENAME = "index.html";
export const APP_FULL_URL = PUBLIC_PATH + APP_FILENAME;

export const meta = {
    title: "NGX-Boilerplate",
    port: PORT,
    host: HOST
};

const appDirectory = fs.realpathSync(process.cwd());

function resolveApp(relativePath) {
    return path.resolve(appDirectory, relativePath);
}

export const paths = {
    appEntry: MAIN_ENTRY,
    publicPath: PUBLIC_PATH,
    appUrl: APP_FULL_URL,
    srcPath: root("src"),
    testSuitePath: root("test/unit-suite.js"),
    coverageReportPath: root("reports"),
    NodeModules: resolveApp('node_modules')
};

export const karma = {
    port: 6464,
    browserNoActivityTimeout: 90000
}