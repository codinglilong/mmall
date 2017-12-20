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
    devtool:'cheap-module-eval-source-map',
    entry: {
        'common':['./src/page/common/index.js'],
        'index':['./src/page/index/index.js'],
        'user-login':['./src/page/user-login/index.js'],
        'user-register':['./src/page/user-register/index.js'],
        'user-pass-reset':['./src/page/user-pass-reset/index.js'],
        'user-center':['./src/page/user-center/index.js'],
        'user-center-update':['./src/page/user-center-update/index.js'],
        'user-pass-update':['./src/page/user-pass-update/index.js'],
        'result':['./src/page/result/index.js'],
        'list':['./src/page/list/index.js'],
        'detail':['./src/page/detail/index.js']
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
        new HtmlWebpackPlugin(getHtmlConfig('user-login','用户登录')),
        new HtmlWebpackPlugin(getHtmlConfig('result','操作结果')),
        new HtmlWebpackPlugin(getHtmlConfig('user-register','用户注册')),
        new HtmlWebpackPlugin(getHtmlConfig('user-pass-reset','密码找回')),
        new HtmlWebpackPlugin(getHtmlConfig('user-center','用户中心')),
        new HtmlWebpackPlugin(getHtmlConfig('user-center-update','修改个人信息')),
        new HtmlWebpackPlugin(getHtmlConfig('user-pass-update','修改密码')),
        new HtmlWebpackPlugin(getHtmlConfig('list','商品列表')),
        new HtmlWebpackPlugin(getHtmlConfig('detail','商品详情')),
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
 module.exports = config;