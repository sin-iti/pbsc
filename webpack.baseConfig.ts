import * as webpack from "webpack";
import * as path from "path";
import * as UglifyJsPlugin from "uglifyjs-webpack-plugin";
import * as MiniCssExtractPlugin from "mini-css-extract-plugin";
import * as NpmInstallWebpackPlugin from "npm-install-webpack-plugin";
let uglifyjs = new UglifyJsPlugin({
    sourceMap: true,
    uglifyOptions: {
        compress: {
            warnings: true,
            drop_debugger: false,
            drop_console: false
        }
    }
});
const srcDir =  path.resolve(__dirname, "src");
let miniCss = new MiniCssExtractPlugin({
    filename: "[name].css",
    chunkFilename: "[id].css",
});
let config: webpack.Configuration = {
    mode: 'development',
    devtool: "source-map",
    entry: {

    },
    target: "web",
    output: {
        path: path.resolve(__dirname, "./dist/"),
        filename: '[name].js'
    },
    module: {
        rules: [
            {
                test: /\.scss/,
                include: [
                    srcDir
                ],
                use: [
                    MiniCssExtractPlugin.loader,
                    'css-loader',
                    'sass-loader'
                ]
            },
            {
                test: /\.ts/,
                include: [
                    srcDir,
                ],
                use: [
                    "ts-loader"
                ]
            }
        ]
    },
    resolve: {
        extensions: [".ts", ".scss", ".less", ".css", ".js"],
        alias: {

        }
    },
    plugins: [
        uglifyjs,
        miniCss,
        // new NpmInstallWebpackPlugin({
        //     dev: true,
        // })
    ]
}

export {config};
