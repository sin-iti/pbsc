import * as webpack from "webpack";
import * as path from "path";
import * as UglifyJsPlugin from "uglifyjs-webpack-plugin";
import * as MiniCssExtractPlugin from "mini-css-extract-plugin";
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
        // "three": ["three"],
        // "tween": ["@tweenjs/tween.js"],
        "stats": ["stats.js"]
    },
    target: "web",
    output: {
        path: path.resolve(__dirname, "./dist/src"),
        filename: '[name].js',
        library: "[name]",
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
                    {
                        loader: 'css-loader',
                        options: {
                            importLoaders: 2,
                            minimize: true,
                        }
                    },
                    {
                        loader: 'postcss-loader',
                        options: {
                            plugins: [
                               require( "autoprefixer")({
                                    browsers: ['last 100 versions']
                               })
                            ]
                        }
                    },
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
        new webpack.DllPlugin({
            name: '[name]',
            path: path.join(__dirname, "dist/lib/[name]-manifest.json"),
            context: __dirname,
        }),
        // new NpmInstallWebpackPlugin({
        //     dev: true,
        // })
    ],
}

export default config;
