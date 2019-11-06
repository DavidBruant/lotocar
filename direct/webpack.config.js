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
	devServer: {
		contentBase: './build'
	},
	entry: {
		direct: './direct/main.js',
		'outil-metier': './outil-metier/Corresplot/main.js'
	},
	output: {
		filename: '[name]/bundle.js',
		path: __dirname,
		publicPath: '/'
	}
}
