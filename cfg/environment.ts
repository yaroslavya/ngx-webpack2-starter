const chalk = require("chalk");

//gob stands for green or blue.
let gob = function (value) {
	if (value) {
		return chalk.green(value);
	}

	return chalk.blue(value);
};

/**
 * Class to store current environment keys, set by the npm run command.
 */
export class Environment {
	public isDev = false;
	public isTest = false;
	public isProd = false;
	public isCoverage = false;
	public isUnit = false;
	public isIntegration = false;
	public isMixed = false;

	constructor( env: any ){
		this.isProd = env.includes("prod");
		this.isDev = !this.isProd;
		this.isTest = env.includes("test");
		this.isCoverage = env.includes("coverage");
		this.isUnit = env.includes("unit");
		this.isIntegration = env.includes("integration");
		this.isMixed = env.includes("mixed");

		let envSummary = `isProd: ${gob(this.isProd)}, isDev: ${gob(this.isDev)}, isTest: ${gob(this.isTest)}, isCoverage: ${gob(this.isCoverage)}, `;
		envSummary = `${envSummary} isUnit: ${gob(this.isUnit)} isIntegration: ${gob(this.isIntegration)}, isMixed: ${gob(this.isMixed)}`;
		console.log(`environment: ${envSummary}`);
	}
}