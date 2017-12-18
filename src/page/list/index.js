require('page/common/nav/index.js');
require('page/common/header/index.js');
require('./index.css');

var _mm =require('util/mm.js');
var _product =require('service/product-service.js');
var templateIndex =require('./index.template');

var page={
    data:{
        listParam:{
            keyword:_mm.getUrlParam('keyword') || '',
            categoryId:_mm.getUrlParam('categoryId') || '',
            orderBy:_mm.getUrlParam('orderBy') || '',
            pageNum:_mm.getUrlParam('pageNum') || 1,
            pageSize:_mm.getUrlParam('pageSize') || 20,
        }
    },
    init:function(){
        this.onLoad();
        this.bindEvent();
    },
    onLoad:function(){
        this.loadList();
    },
    bindEvent:function(){
        var _this=this;
        $('.sort-item').click(function(){
            var $this=$(this);
            _this.data.listParam.pageNum=1;
            if($this.data('type') === 'default'){
                if($this.hasClass === 'active'){
                    return ;
                }else{
                    $this.addClass('active').siblings('.sort-item').removeClass('active asc desc');
                    _this.data.listParam.orderBy='default';
                }
            }else if($this.data('type') === 'price'){
                $this.addClass('active').siblings('.sort-item').removeClass('active asc desc');
                if(!$this.hasClass('asc')){
                    $this.addClass('asc').removeClass('desc');
                    _this.data.listParam.orderBy='price_asc';
                }else{
                    $this.addClass('desc').removeClass('asc');
                    _this.data.listParam.orderBy='price_desc';
                }
            }
            _this.loadList();
        })
    },
    loadList:function(){
        var listParam=this.data.listParam;
        var _this=this;
        var listHtml='';
        var $pListCon=$('.p-list-con');
        $pListCon.html('<div class="loading"></div>');
        
        listParam.categoryId ? (delete listParam.keyword) : (delete listParam.categoryId);
        _product.getProductList(listParam,function(res){
            listHtml =_mm.renderHtml(templateIndex,{
                list:res.list
            });
            $('.p-list-con').html(listHtml);
            _this.loadPagination(res.pageNum,res.pages)
        },function(errMsg){
            _mm.errorTips(errMsg);
        });
    },
    loadPagination:function(pageNum,pages){

    }
}
$(function(){
    page.init();
})