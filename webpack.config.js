const path = require('path');
const webpack =require('webpack');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const HtmlWebpackPlugin =require('html-webpack-plugin');
const WEBPACK_ENV = process.env.WEBPACK_ENV || 'dev';
console.log(WEBPACK_ENV);

const getHtmlConfig =function(name){
    return {
        template:'./src/view/'+name+'.html',
        filename:'view/'+name+'.html',
        inject:true,
        hash:true,
        chunks:['common',name],
    }
}
const config={
    entry: {
        'common':['./src/page/common/index.js'],
        'index':['./src/page/index/index.js'],
        'login':['./src/page/login/index.js']
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
            }
        ]
    },
    plugins:[
        new webpack.optimize.CommonsChunkPlugin({
            name:'common',
            filename:'js/base.js'
        }),
        new ExtractTextPlugin("css/[name].css"),
        new HtmlWebpackPlugin(getHtmlConfig('index')),
        new HtmlWebpackPlugin(getHtmlConfig('login')),
    ]
}
if('dev' === WEBPACK_ENV){
    config.entry.common.push('webpack-dev-server/client?http://localhost:8080/');
}
 module.exports = config;