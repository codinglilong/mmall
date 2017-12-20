require('./index.css');
var _mm=require('../mm.js');
var htmlTemplate=require('./index.template');

var Pagination =function(){
    var _this=this;
    this.defalutOption ={
        container:null,
        pageNum:1,
        pageRange:3,
        onSelectPage:null,
    }
    $(document).on('click','.pg-item',function(){
        var $this=$(this);
        if($this.hasClass('active') || $this.hasClass('disabled')){
            return ;
        }
        
        typeof _this.option.onSelectPage === 'function'
        ?
        _this.option.onSelectPage($this.data('value'))
        :
        null
    });
}
Pagination.prototype.render=function(userOption){
    this.option=$.extend({},this.defalutOption,userOption);
    if(!(this.option.container instanceof jQuery)){
        return;
    }
    if(this.option.pages <= 1){
        return ;
    }
    this.option.container.html(this.getPaginationHtml());
}
Pagination.prototype.getPaginationHtml=function(){
    var html='';
    var pageArray=[];
    var option=this.option;
    var start = this.option.pageNum - this.option.pageRange>0
                ? option.pageNum - option.pageRange:1;
    var end =option.pageNum + option.pageRange < option.pages
                ? option.pageNum + option.pageRange: option.pages;
    pageArray.push({
        name:'上一页',
        value:this.option.prePage,
        disabled:!this.option.hasPreviousPage
    });
    for (let i = start; i <= end; i++) {
        pageArray.push({
            name:i,
            value:i,
            active:(i === option.pageNum),
        });
    }
    pageArray.push({
        name:'下一页',
        value:this.option.nextPage,
        disabled:!this.option.hasNextPage
    });
    html=_mm.renderHtml(htmlTemplate,{
        pageArray:pageArray,
        pageNum:option.pageNum,
        pages:option.pages
    });
    return html;
}
module.exports=Pagination;