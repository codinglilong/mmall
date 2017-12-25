var nav = require('page/common/nav/index.js');
require('page/common/header/index.js');
require('./index.css');

var _mm =require('util/mm.js');
var _cart =require('service/cart-service.js');
var templateIndex =require('./index.template');

var page={
    data:{
    },
    init:function(){
        this.onLoad();
        this.bindEvent();
    },
    onLoad:function(){
        this.loadCart();
    },
    bindEvent:function(){
        var _this=this;
        $(document).on('click','.cart-select',function(){
            var $this=$(this);
            var productId =$this.parents('.cart-table').data('product-id');
            if($this.is(':checked')){
                _cart.selectProduct(productId,function(res){
                    _this.renderCart(res);
                },function(errMsg){
                    _this.showCartError('未知错误，请重新刷新页面');
                });
            }else{
                _cart.unSelectProduct(productId,function(res){
                    _this.renderCart(res);
                },function(errMsg){
                    _this.showCartError('未知错误，请重新刷新页面');
                });
            }
        });

        $(document).on('click','.cart-select-all',function(){
            var $this=$(this);
            if($this.is(':checked')){
                _cart.selectAllProduct(function(res){
                    _this.renderCart(res);
                },function(errMsg){
                    _this.showCartError('未知错误，请重新刷新页面');
                });
            }else{
                _cart.unSelectAllProduct(function(res){
                    _this.renderCart(res);
                },function(errMsg){
                    _this.showCartError('未知错误，请重新刷新页面');
                });
            }
        });

        $(document).on('click','.count-btn',function(){
            var $this=$(this);
            var $pCount=$this.siblings('.count-input');
            var type=$this.hasClass('plus')?'plus':'minus';
            var productId =$this.parents('.cart-table').data('product-id');
            var currCount=parseInt($pCount.val());
            var minCount=1;
            var maxCount=parseInt($pCount.data('max'));
            var newCount=0;

            if(type === 'plus'){
                if(currCount >= maxCount){
                    _mm.errorTips('该商品数量已达到上限');
                    return;
                }
                newCount =currCount+1;
            }else if(type === 'minus'){
                if(currCount <= minCount){
                    return;
                }
                newCount =currCount-1;
            }
            _cart.updateProduct({
                productId:productId,
                count:newCount,
            },function(res){
                _this.renderCart(res);
            },function(errMsg){
                _this.showCartError('未知错误，请重新刷新页面');
            });

        });

        $(document).on('click','.cart-delete',function(){
            if(window.confirm('确认要删除该商品吗？')){
                var $this=$(this);
                var productId =$this.parents('.cart-table').data('product-id');
                _this.deleteCartProduct(productId);
            }
        });

        $(document).on('click','.delete-selected',function(){
            if(window.confirm('确认要删除该商品吗？')){
                var $this=$(this);
                var arrProductIds=[];
                var $selectedItem=$('.cart-select:checked');
                $selectedItem.each(function(index,item){
                    arrProductIds.push($(item).parents('.cart-table').data('product-id'))
                });
                if(arrProductIds.length){
                    _this.deleteCartProduct(arrProductIds.join(','));
                }else{
                    _mm.errorTips('未选中需要删除的商品');
                }
                
            }
        });

        $(document).on('click','.btn-submit',function(){
            if(_this.data.cartInfo && _this.data.cartInfo.cartTotalPrice > 0){
                window.location.href='./order-confirm.html';
            }else{
                _mm.errorTips('请选择商品后提交');
            }
        });
    },
    loadCart:function(){
        var _this=this;
        _cart.getCartList(function(res){
            _this.renderCart(res);
        },function(errMsg){
            _this.showCartError('未知错误，请重新刷新页面');
        });
    },
    renderCart:function(data){
        this.filter(data);
        this.data.cartInfo=data;
        var cartHtml=_mm.renderHtml(templateIndex,data);
        $('.page-wrap').html(cartHtml);
        nav.loadCartInfo();

    },
    filter:function(data){
        data.notEmpty = !!data.cartProductVoList.length;
    },
    showCartError(msg){
        $('.page-wrap').html('<p class="err-tip">'+ msg +'</p>');
    },
    deleteCartProduct:function(productIds){
        var _this=this;
        _cart.deleteProduct(productIds,function(res){
            _this.renderCart(res);
        },function(errMsg){
            _this.showCartError('未知错误，请重新刷新页面');
        })
    }
}
$(function(){
    page.init();
})