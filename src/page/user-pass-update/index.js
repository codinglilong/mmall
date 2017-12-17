require('page/common/nav/index.js');
require('page/common/header/index.js');
require('./index.css');
var navSide = require('page/common/nav-side/index.js');
var _mm =require('util/mm.js');
var _user =require('service/user-service.js');

var paga={
    init:function(){
        this.bindEvent();
        this.onLoad();
    },
    onLoad:function(){
        navSide.init({name:'user-pass-update'});
    },
    bindEvent:function(){
        var _this=this;
        $(document).on('click','.btn-submit',function(){
            var userInfo={
                password:$.trim($('#password').val()),
                passwordNew:$.trim($('#password-new').val()),
                passwordConfirm:$.trim($('#password-confirm').val()),
            }

            var validateResult =_this.formValidate(userInfo);
            if(validateResult.status){
                _user.updatePassword({
                    passwordOld:userInfo.password,
                    passwordNew:userInfo.passwordNew,
                },function(res){
                    _mm.successTips();
                    $('#password').val('');
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
        if(!_mm.validate(formData.password,'require')){
            result.msg="原密码不能为空";
            return result;
        }

        if(formData.passwordNew.length<6){
            result.msg='密码长度不能少于6位';
            return result;
        }
        
        if(formData.passwordNew !== formData.passwordConfirm){
            result.msg='两次密码输入不一致';
            return result;
        }
        result.status=true;
        return result;
    },
}
paga.init();