import "../src/vendor";

require("zone.js/dist/zone");
require("zone.js/dist/long-stack-trace-zone");
require("zone.js/dist/proxy");
require("zone.js/dist/sync-test");
require("zone.js/dist/jasmine-patch");
require("zone.js/dist/async-test");
require("zone.js/dist/fake-async-test");

let testing = require("@angular/core/testing");
let browser = require("@angular/platform-browser-dynamic/testing");

// note: i *think* restting helps with tests getting slower over time.
// needs proper testing by running in watch mode with line enabled/disabled
// and making changes to retrigger test execution & module compilation
testing.TestBed.resetTestEnvironment();

testing.TestBed.initTestEnvironment(browser.BrowserDynamicTestingModule, browser.platformBrowserDynamicTesting());
