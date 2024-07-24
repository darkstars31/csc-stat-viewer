// Generated using webpack-cli https://github.com/webpack/webpack-cli

import { resolve as _resolve } from "path";
import HtmlWebpackPlugin from "html-webpack-plugin";
import { GenerateSW } from "workbox-webpack-plugin";
import { BundleAnalyzerPlugin as _BundleAnalyzerPlugin } from "webpack-bundle-analyzer";
const { BundleAnalyzerPlugin } = _BundleAnalyzerPlugin;

const isProduction = process.env.NODE_ENV === "production";

const stylesHandler = "style-loader";

const config = {
	entry: "./src/index.ts",
	output: {
		path: _resolve(__dirname, "dist"),
	},
	devServer: {
		open: true,
		host: "localhost",
	},
	plugins: [
		new BundleAnalyzerPlugin({
			analyzerMode: "server",
			generateStatsFile: true,
			statsOptions: { source: false },
		}),
		new HtmlWebpackPlugin({
			template: "index.html",
		}),

		// Add your plugins here
		// Learn more about plugins from https://webpack.js.org/configuration/plugins/
	],
	module: {
		rules: [
			{
				test: /\.(ts|tsx)$/i,
				loader: "ts-loader",
				exclude: ["/node_modules/"],
			},
			{
				test: /\.css$/i,
				use: [stylesHandler, "css-loader"],
			},
			{
				test: /\.(eot|svg|ttf|woff|woff2|png|jpg|gif|webp)$/i,
				type: "asset",
			},
			{
				test: /\.(png|j?g|svg|gif|webp)?$/,
				use: "file-loader?name=./assets/images/[name].[ext]",
			},
			// Add your rules for custom modules here
			// Learn more about loaders from https://webpack.js.org/loaders/
		],
	},
	resolve: {
		extensions: [".tsx", ".ts", ".jsx", ".js", "..."],
	},
};

export default () => {
	if (isProduction) {
		config.mode = "production";

		config.plugins.push(new GenerateSW());
	} else {
		config.mode = "development";
	}
	return config;
};
