let webpack = require('webpack')
let path = require('path')
module.exports = {
	module: {
		rules: [
			{
				test: /\.(js|jsx)$/,
				exclude: /node_modules/,
				use: {
					loader: 'babel-loader'
				}
			},
			{
				test: /\.html$/,
				use: [
					{
						loader: 'html-loader'
					}
				]
			}
		]
	},
	mode: 'development',
	devServer: {
		contentBase: './build',
		hot: true
	},
	entry: ['webpack-hot-middleware/client', path.resolve(__dirname, 'main.js')],
	output: {
		filename: 'bundle.js',
		path: path.resolve(__dirname, 'direct/build'),
		publicPath: '/'
	},
	plugins: [new webpack.HotModuleReplacementPlugin()]
}
