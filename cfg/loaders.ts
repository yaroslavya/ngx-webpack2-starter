import { paths } from "./constants";
import { Environment } from "./environment";
import { root } from "./helpers";

let path = require("path");

export interface ILoaderArgs {
	env: Environment,
	include?: Array<string>,
	exclude?
}

function rootifyRelative(paths: Array<string>) {
	return paths.map((item) => {
		if( path.isAbsolute(item) ) {
			return item;
		}

		return root(item);
	});
}

export const loaders = {
	atl: (env:Environment) => {
		let atlOptions = [
			"forkChecker=true",
			"useTranspileModule=true",
			"transpileOnly=true",
			"useCache=true"
		];

		let exclude = /(node_modules|libs)/;

		if (atlOptions.length > 0) {
			console.info("overriding tsconfig settings with: ", atlOptions)
		}

		return { test: /\.ts$/, loader: "awesome-typescript-loader?" + atlOptions.join("&"), exclude};
	},

	sass: ({env, include = [paths.srcPath], exclude = /node_modules/} : ILoaderArgs) => {
		let loaders = env.isTest ? "empty-string-loader" : "to-string-loader!css-loader!sass-loader";
		include = rootifyRelative(include);

		return { test: /\.scss$/, loader: loaders, include, exclude };
	},

	css: ({env, include = [paths.srcPath], exclude = /node_modules/}: ILoaderArgs) => {
		let loaders = env.isTest ? "empty-string-loader" : "style-loader!css-loader";
		include = rootifyRelative(include);

		return { test: /\.css$/, loader: loaders, include, exclude };
	},

	html: ({env, include = [paths.srcPath], exclude = /node_modules/}: ILoaderArgs) => {
		include = rootifyRelative(include);

		return { test: /\.html$/, loader: "html-loader", include, exclude };
	},

	font: ({env, include = [paths.srcPath], exclude = /node_modules/}: ILoaderArgs) => {
		include = rootifyRelative(include);

		return { test: /\.(ttf|eot|woff(2)?)(\?[a-z0-9=&.]+)?$/, loader: "file-loader?name=./files/[name].[ext]", include, exclude };
	},

	image: ({env, include = [paths.srcPath], exclude = /node_modules/}: ILoaderArgs) => {
		include = rootifyRelative(include);

		return { test: /\.(svg|gif)$/, loader: "url-loader", include, exclude };
	},

	json: ({env, include = [paths.srcPath], exclude = /node_modules/}: ILoaderArgs) => {
		include = rootifyRelative(include);

		return { test: /\.json$/, loader: "json-loader", include, exclude };
	},

	coverage: ({env, include = [paths.srcPath], exclude = /node_modules/}: ILoaderArgs) => {
			if(env.isCoverage) {
				return { test: /\.(js|ts)$/, loader: "istanbul-instrumenter-loader", enforce: "post", include, exclude };
			}
	}

};