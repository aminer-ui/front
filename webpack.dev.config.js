const path = require('path');
const htmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
    mode: 'development',
    entry: './src/App.js',
    output: {
        filename: 'main.js',
        path: path.resolve(__dirname, 'dist'),
    },
    module: {
        rules: [
            {
                test: /\.(js|jsx)$/,
                include: path.resolve(__dirname, "./src"),
                use: [
                    {
                        loader: "babel-loader",
                        options: {
                            presets: ['@babel/preset-react', '@babel/preset-env'],
                        }
                    },
                ]
            },
            // {
            //     test: /\.(css|less)$/,
            //     include: path.resolve(__dirname, './src'),
            //     use: ["style-loader", "css-loader", "less-loader"]
            // },
            {
                test: /\.(css|less)$/,
                use: [
                    {
                        loader: 'style-loader' // creates style nodes from JS strings
                    },
                    {
                        loader: 'css-loader',
                        options: {
                            modules: true // 重点
                        }
                    },
                    {
                        loader: 'less-loader',
                    }
                ]
            }
        ]
    },
    devServer: {
        contentBase: './dist'
    },
    plugins: [
        new htmlWebpackPlugin({
            template: 'public/index.html'
        })
    ],
};
