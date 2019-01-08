const HtmlWebpackPlugin = require('html-webpack-plugin');
const path = require('path');

module.exports = {
    entry: './src/ts/app.ts',
    output: {
        filename: 'bundle.js',
        path: path.join(__dirname, 'public'),
    },
    mode: 'development',
    devtool: "inline-source-map",
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                loader: 'ts-loader',
                exclude: /node_modules/,
            }
        ]
    },
    resolve: {
        extensions: [".ts", ".js"]
    },
    plugins: [
        new HtmlWebpackPlugin({
            title: 'HACOSOLVE'
        })
    ],
    devServer: {
        contentBase: path.join(__dirname, 'public'),
        watchContentBase: true,
        compress: true,
        port: 9000
    }
};
