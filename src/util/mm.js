var conf={
    serverHost:'',
}
var Hogan =require('hogan');
var _mm ={
    //封装请求
    request:function(param){
        var _this=this;
        $.ajax({
            type:param.method || 'get',
            url:param.url || '',
            dataType:param.tyle || 'json',
            data:param.data || '',
            success: function(res){
                if(res.status === 0){//请求成功
                    typeof param.success === 'function' && param.success(res.data,res.msg);
                }else if(res.status === 10){//没有登录
                    _this.doLogin();
                }else if(res.status === 1){//请求错误
                    typeof param.error === 'function' && param.error(res.msg);
                }else{
                    typeof param.error === 'function' && param.error(res.msg);
                }
            },
            error:function(err){
                typeof param.error === 'function' && param.error(err.statusText);
            }
        });
    },
    //登录
    doLogin:function(){
        window.location.href = './user-login.html?redirect='+encodeURIComponent(window.location.href);
    },
    //获取url参数
    getUrlParam:function(name){
        var reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)', 'i');
        var r = window.location.search.substr(1).match(reg);
        return r ? decodeURIComponent(r[2]) : null;
    },
    //获取服务器地址
    getServerUrl:function(path){
        return conf.serverHost + path;
    },
    //渲染html模版
    renderHtml:function(htmlTemplate,data){
        var template = Hogan.compile(htmlTemplate);
        var result = template.render(data);
        return result;
    },
    //成功提示
    successTips:function(msg){
        alert(msg || "操作成功!");
    },
    //成功提示
    errorTips:function(msg){
        alert(msg || "操作失败!");
    },
    //部分验证
    validate:function(value,type){
        var value =$.trim(value);
        if(type === 'require'){
            return !!value;
        }
        if(type==='password'){
            return /^.{6,}$/.test(value);
        }
        if(type === 'phone'){
            return /^1\d{10}$/.test(value);
        }
        if(type === 'email'){
            return  /^([0-9A-Za-z\-_\.]+)@([0-9a-z]+\.[a-z]{2,3}(\.[a-z]{2})?)$/g.test(value);
        }
        return true;
    },
    goHome:function(){
        window.location.href = './index.html';
    }

}
module.exports = _mm;