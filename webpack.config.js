/**
* Webpack configuration file intended for static and small web apps
*
* @author Jake Skoric <info@jakeskoric.com>
*/

const CleanWebpackPlugin = require('clean-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const FaviconsWebpackPlugin = require('favicons-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const path = require('path');
const webpack = require('webpack');

module.exports = function(env) {
	return {
		entry: {
			app: './app/client.js',
		},
		output: {
			path: path.resolve(__dirname, 'dist'),
			filename: 'js/[chunkhash].[name].bundle.js',
			pathinfo: false, // Should NOT be enabled for production
		},
		resolve: {
			alias: {
				'vue$': 'vue/dist/vue.common.js',
				// 'jquery': path.resolve(__dirname, 'node_modules/jquery/src/jquery'), // If you need jQuery in your project, use this line
			}
		},
		module: {
			rules: [
				{
					test: /\.vue$/,
					loader: 'vue-loader',
					enforce: 'pre'
				},

				{
					test: /\.js$/,
					exclude: /node_modules/,
					loader: 'babel-loader',
					query: {presets: ['es2015']}
				},

				{
					test: /\.css$/,
					loader: ExtractTextPlugin.extract({loader: 'css-loader?minimize'}),
				},

				{
					test: /\.(png|jpe?g|gif|svg)(\?.*)?$/i,
					loader: 'url-loader',
					query: {limit: 10000, name: 'img/[name].[hash:7].[ext]'}
				},

				{
					test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
					loader: 'url-loader',
					query: {limit: 10000, name: 'fonts/[name].[hash:7].[ext]'}
				},

				{
					test: /\.html$/,
					loader: 'html-loader'
				}

			],
		},
		plugins: [
			new webpack.DefinePlugin({
				'process.env': {
					NODE_ENV: '"production"'
				}
			}),

			new webpack.optimize.UglifyJsPlugin({compress: {warnings: false}, mangle: false, sourceMap: true}),

			new webpack.optimize.OccurrenceOrderPlugin(),

			// Split vendor js into its own file
			new webpack.optimize.CommonsChunkPlugin({
				name: 'vendor',
				minChunks: function(module, count) {
					// Any required modules inside node_modules are extracted to vendor
					return (
						module.resource &&
						/\.js$/.test(module.resource) &&
						module.resource.indexOf(path.join(__dirname, 'node_modules')) === 0
					);
				}
			}),
			/* Extract webpack runtime and module manifest to its own file in order to
			 * prevent vendor hash from being updated whenever app bundle is updated */
			new webpack.optimize.CommonsChunkPlugin({
				name: 'manifest',
				chunks: ['vendor']
			}),

			new FaviconsWebpackPlugin({
				logo: './app/assets/favicon.png',
				icons: {android: true, appleIcon: false, appleStartup: false, firefox: false}
			}),

			new ExtractTextPlugin({filename: 'css/[name].[contenthash].bundle.css', disable: false, allChunks: true}),

			new HtmlWebpackPlugin({
				template: './app/index.html',
				inject: true,
				cache: true,
				chunksSortMode: 'dependency',
				// More options: https://github.com/kangax/html-minifier#options-quick-reference
				minify: {html5: true, removeComments: true, collapseWhitespace: false}
			}),

			new CleanWebpackPlugin(['dist', 'build']),
		]
	};
};
