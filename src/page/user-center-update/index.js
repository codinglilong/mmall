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
        navSide.init({name:'user-center-update'});
        this.onLoadUserInfo();
    },
    bindEvent:function(){
        var _this=this;
        $(document).on('click','.btn-submit',function(){
            var userInfo={
                phone:$.trim($('#phone').val()),
                email:$.trim($('#email').val()),
                question:$.trim($('#question').val()),
                answer:$.trim($('#answer').val()),
            }

            var validateResult =_this.formValidate(userInfo);
            if(validateResult.status){
                _user.updateUserInfo(userInfo,function(res){
                    _mm.successTips();
                    window.location.href ='./user-center.html';
                },function(errMsg){
                    _mm.errorTips(errMsg)
                });
            }else{
                _mm.errorTips(validateResult.msg);
            }

        })
    },
    formValidate:function(formData){
        var result ={
            status :false,
            msg:''
        }
        if(!_mm.validate(formData.phone,'phone')){
            result.msg='手机格式不正确';
            return result;
        }
        if(!_mm.validate(formData.email,'email')){
            result.msg='邮箱格式不正确';
            return result;
        }
        if(!_mm.validate(formData.question,'require')){
            result.msg='密码提示问题不能为空';
            return result;
        }
        if(!_mm.validate(formData.answer,'require')){
            result.msg='密码提示答案不能为空';
            return result;
        }
        result.status=true;
        return result;
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