const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
    entry: './src/ts/app.ts',
    output: {
        filename: 'bundle.js',
        path: __dirname + "/dist"
    },
    devtool: "source-map",
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                loader: 'awesome-typescript-loader',
                exclude: /node_modules/,
            },
            {
              enforce: "pre",
              test: /\.js$/,
              loader: "source-map-loader"
            }
        ]
    },
    resolve: {
        extensions: [".tsx", ".ts", ".js"]
    },
    plugins: [
        new HtmlWebpackPlugin({
            title: 'HACOSOLVE'
        })
    ]
};
