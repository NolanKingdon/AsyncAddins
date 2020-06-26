const path = require('path');
const HtmlWebPackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

module.exports = {
    plugins: [
        new HtmlWebPackPlugin({
            
            template: './src/app/sync.html',
                        
            filename: './sync.html'
        }),
        new MiniCssExtractPlugin({
            name: '[name].css',
            chunkFilename: '[id].css'
        }),
    ],
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: 'sync.js'
    }
}