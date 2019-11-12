// You can't use import statements here
let webpack = require('webpack')
let path = require('path')
let common = require('../webpack.common.js')

module.exports = {
	...common,
	entry: {
		corresplot: [
			...(common.mode === 'development'
				? ['webpack-hot-middleware/client']
				: []),
			path.resolve(__dirname + '/Corresplot/', 'main.js')
		],
		demandes: [
			...(common.mode === 'development'
				? ['webpack-hot-middleware/client']
				: []),
			path.resolve(__dirname + '/demandes/', 'main.js')
		]
	},
	output: {
		filename: '[name].js',
		path: path.resolve(__dirname, 'build'),
		publicPath: '/build/'
	}
}
