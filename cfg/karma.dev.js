const constants = require("./constants");
const Environment = require("./environment").Environment;
const webpackConfig = require("./webpack.dev");

const paths = constants.paths;
const karma = constants.karma;

const env = new Environment(process.env.npm_lifecycle_event);
function getValues(obj) {
    if(!obj) return [];

    return Object.keys(obj).map(function(key){
        return obj[key];
    });
}

module.exports = function (config) {
    var cfg = {
        port: karma.port,
        browserNoActivityTimeout: karma.browserNoActivityTimeout,
        basePath: "",
        singleRun: false,
        frameworks: ["jasmine"],
        reporters: ["mocha"],
        webpack: webpackConfig,
        browsers: ["Chrome"],
        mime: {
            'text/x-typescript': ['ts', 'tsx']
        },
        mochaReporter: {
            ignoreSkipped: true
        }
    };

    if (env.isUnit) {        
        var dllFiles = [];
        var dllFileNames = getValues(constants.dllEntries);

        dllFileNames.forEach((dllFileName) => {
            dllFiles.push({
                pattern: "../dll/" + dllFileName + ".js",
                watched: false,
                served: true
            })
        });
        
        dllFiles.push(paths.testSuitePath);
        cfg.files = dllFiles;        

        cfg.preprocessors = { [paths.testSuitePath]: ["webpack", "sourcemap"] };

        if (env.isCoverage) {
            cfg.reporters = ["mocha", "coverage", "remap-coverage"];
            cfg.preprocessors = { [paths.testSuitePath]: ["coverage", "webpack", "sourcemap"] };
            cfg.coverageReporter = {
                type: "in-memory"
            };

            cfg.remapCoverageReporter = {
                'text-summary': null,
                json: paths.coverageReportPath + "/coverage.json",
                "lcovonly": paths.coverageReportPath + "/lcov.info",
                html: paths.coverageReportPath + "/html"
            };
        }
    }

    config.set(cfg);
};