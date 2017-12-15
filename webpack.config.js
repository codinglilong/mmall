const path = require('path');
const webpack =require('webpack');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const HtmlWebpackPlugin =require('html-webpack-plugin');
//清除输出目录，免得每次手动删除
// const CleanWebpackPlugin = require('clean-webpack-plugin');

const WEBPACK_ENV = process.env.WEBPACK_ENV || 'dev';

const getHtmlConfig =function(name,title){
    return {
        template:'./src/view/'+name+'.html',
        filename:'view/'+name+'.html',
        inject:true,
        hash:true,
        title:title,
        chunks:['common',name],
    }
}
const config={
    entry: {
        'common':['./src/page/common/index.js'],
        'index':['./src/page/index/index.js'],
        'login':['./src/page/login/index.js'],
        'result':['./src/page/result/index.js']
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
        new HtmlWebpackPlugin(getHtmlConfig('index','首页')),
        new HtmlWebpackPlugin(getHtmlConfig('login','用户登录')),
        new HtmlWebpackPlugin(getHtmlConfig('result','操作结果')),
    ],
    devServer:{
        port: 8088,
        inline:true,
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
 module.exports = config;