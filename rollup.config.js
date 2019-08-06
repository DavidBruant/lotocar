import resolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';
import { terser } from 'rollup-plugin-terser';
import livereload from 'rollup-plugin-livereload';
import replace from 'rollup-plugin-replace'

const production = !process.env.ROLLUP_WATCH;

export default {
	input: 'Corresplot/main.js',
	output: {
		file: 'build/corresplot-rollup-bundle.js',
		format: 'esm', // immediately-invoked function expression — suitable for <script> tags
		sourcemap: true
	},
	plugins: [
		resolve(), 
		commonjs(),
		replace({ 'process.env.NODE_ENV': JSON.stringify('production') }),
		!production && livereload(),
		production && terser()
	]
};
