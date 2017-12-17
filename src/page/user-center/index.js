require('page/common/nav/index.js');
require('page/common/header/index.js');
require('./index.css');
var navSide = require('page/common/nav-side/index.js');
var _mm =require('util/mm.js');
var _user =require('service/user-service.js');
var templateIndex =require('./index.template');
var paga={
    init:function(){
        this.bindEvent();
        this.onLoad();
    },
    onLoad:function(){
        navSide.init({name:'user-center'});
        this.onLoadUserInfo();
    },
    bindEvent:function(){
        var _this=this;
    },
    onLoadUserInfo:function(){
        var userHtml='';
        _user.getUserInfo(function(res){
            userHtml=_mm.renderHtml(templateIndex,res);
            $('.panel-body').html(userHtml);
        },function(errMsg){
            _mm.errorTips(errMsg);
        })
    }
}
paga.init();