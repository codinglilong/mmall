const HtmlWebpackPlugin = require('html-webpack-plugin');
const config={
    page:[
        {
            key:'index',
            name:'首页',
        },
        {
            key:'user-login',
            name:'用户登录',
        },
        {
            key:'user-register',
            name:'用户注册',
        },
        {
            key:'result',
            name:'操作结果',
        },
        {
            key:'user-pass-reset',
            name:'密码找回',
        },
        {
            key:'user-center',
            name:'用户中心',
        },
        {
            key:'user-center-update',
            name:'修改个人信息',
        },
        {
            key:'user-pass-update',
            name:'修改密码',
        },
        {
            key:'list',
            name:'商品列表',
        },
        {
            key:'detail',
            name:'商品详情',
        },
        {
            key:'cart',
            name:'购物车',
        },
        {
            key:'order-confirm',
            name:'订单确认页',
        },
        {
            key:'order-list',
            name:'订单列表',
        },
        {
            key:'order-detail',
            name:'订单详情',
        },
        {
            key:'payment',
            name:'付款页面',
        },
    ],
    getHtmlConfig:function(name,title){
        return {
            template:'./src/view/'+name+'.html',
            filename:'view/'+name+'.html',
            inject:true,
            hash:true,
            title:title,
            chunks:['common',name],
        }
    },
    entryList:function(){
        let pageObj ={};
        
        this.page.forEach(function(item,index){
            pageObj[item.key]='./src/page/'+item.key+'/index.js';
        });
        return pageObj;
    },
    pluginList:function(){
        let plugs=[];
        const _this=this;
        this.page.forEach(function(item,index){
            plugs.push(new HtmlWebpackPlugin(_this.getHtmlConfig(item.key,item.name)));
        });
        return plugs;
    }
}
module.exports = config;