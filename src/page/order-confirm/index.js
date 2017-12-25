var nav = require('page/common/nav/index.js');
require('page/common/header/index.js');
require('./index.css');

var _mm =require('util/mm.js');
var _order =require('service/order-service.js');
var _address =require('service/address-service.js');
var templateAddress =require('./address-list.template');
var templateProduct =require('./product-list.template');

var page={
    data:{
        selectedAddressId:null,
    },
    init:function(){
        this.onLoad();
        this.bindEvent();
    },
    onLoad:function(){
        this.loadAddressList();
        this.loadProductList();
    },
    bindEvent:function(){
        var _this=this;
        $(document).on('click','.address-item',function(){
            var $this=$(this);
            $this.addClass('active').siblings('.address-item').removeClass('active');
            _this.data.selectedAddressId = $this.data('id');
        });
        $(document).on('click','.order-submit',function(){
            var $this=$(this);
            var shippingId= _this.data.selectedAddressId;
            if(shippingId){
                _order.createOrder({
                    shippingId:shippingId
                },function(res){
                    window.location.href='./payment.html?orderNumber='+res.orderNo;
                },function(errMsg){
                    _mm.errorTips(errMsg);
                });
            }else{
                _mm.errorTips('选择商品后提交');
            }
        });
    },
    loadAddressList:function(){
        var _this=this;
        _address.getAddressList(function(res){
            var AddressListHtml=_mm.renderHtml(templateAddress,res);
            $('.address-con').html(AddressListHtml,res);
        },function(errMsg){
            $('.address-con').html('<p class="err-tip">地址查询出现未知错误</p>');
        });
    },
    loadProductList:function(){
        var _this=this;
        _order.getProductList(function(res){
            var ProductListHtml=_mm.renderHtml(templateProduct,res);
            $('.product-con').html(ProductListHtml,res);
        },function(errMsg){
            $('.product-con').html('<p class="err-tip">商品信息加载失败</p>');
        });
    },
}
$(function(){
    page.init();
})