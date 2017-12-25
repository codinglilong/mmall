const path = require('path');
const webpack =require('webpack');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const HtmlWebpackPlugin =require('html-webpack-plugin');
//清除输出目录，免得每次手动删除
// const CleanWebpackPlugin = require('clean-webpack-plugin');

const html_config = require('./config/html_config.js');
const WEBPACK_ENV = process.env.WEBPACK_ENV || 'dev';

const config={
    devtool:'cheap-module-eval-source-map',
    entry: {
        'common':['./src/page/common/index.js'],
    },
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: 'js/[name].js',
        publicPath:'/dist',
    },
    externals:{
        'jquery':'window.jQuery',
    },
    module:{
        loaders:[
            {
                test:/\.css$/,
                loader:ExtractTextPlugin.extract('style-loader','css-loader'),
            },
            {
                test: /\.(png|jpe?g|gif|svg|woff|woff2|ttf|eot|ico)\??.*$/,
                loader:'file-loader?limit=100&name=images/[name].[ext]',
            },
            {
                test:/\.template$/,
                loader:'html-loader',
            },
        ]
    },
    resolve:{
        alias:{
            node_modules:__dirname+'/node_modules',
            util:__dirname+'/src/util',
            page:__dirname+'/src/page',
            service:__dirname+'/src/service',
            image:__dirname+'/src/image',
        }
    },
    plugins:[
        // new CleanWebpackPlugin(['dist']),
        new webpack.optimize.CommonsChunkPlugin({
            name:'common',
            filename:'js/base.js'
        }),
        new ExtractTextPlugin("css/[name].css"),
    ],
    devServer:{
        port: 8088,
        inline:true,
        noInfo: true,
        proxy: [
            {
                context: ['/product/*', '/user/*', '/cart/*', '/order/*', '/shipping/*'],
                target: 'http://happymmall.com',
                secure: false,
                changeOrigin: true
            }  
        ]
    }
}
if('dev' === WEBPACK_ENV){
    config.entry.common.push('webpack-dev-server/client?http://localhost:8080/');
}
config.entry=Object.assign(config.entry,html_config.entryList());
config.plugins=config.plugins.concat(html_config.pluginList());

module.exports = config;