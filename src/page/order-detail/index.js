require('./index.css');
require('page/common/nav/index.js');
require('page/common/header/index.js');

var navSide         = require('page/common/nav-side/index.js');
var _mm             = require('util/mm.js');
var _order          = require('service/order-service.js');
var templateIndex   = require('./index.template');

var page={
    data:{
        orderNumber:_mm.getUrlParam('orderNumber'),
    },
    init: function(){
        this.onLoad();
        this.bindEvent();
    },
    bindEvent:function(){
        var _this=this;
        $(document).on('click','.order-cancel',function(){
            if( window.confirm('确定要取消该订单吗？')){
                _order.cancelOrder(_this.data.orderNumber,function(res){
                    _mm.successTips('取消成功');
                    _this.loadDetail();
                },function(errMsg){
                    _mm.errTips(errMsg);
                })
            }
        })
    },
    onLoad : function(){
        navSide.init({name: 'order-list'});
        this.loadDetail();
    },
    loadDetail:function(){
        var _this=this;
        var orderDetailHtml='';
        var $content = $('.content');
        $content.html('<div class="loading"></div>');
        _order.getOrderDetail(_this.data.orderNumber,function(res){
            _this.dataFilter(res);
            orderDetailHtml=_mm.renderHtml(templateIndex,res);
            $content.html(orderDetailHtml);
        },function(errMsg){
            $content.html('<p class="err-tip">'+errMsg+'</p>');
        });
    },
    dataFilter(data){
        data.needPay = data.status == 10;
        data.isCancelable = data.status ==10;
    }
}
$(function(){
    page.init();
});