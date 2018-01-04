var _mm =require('util/mm.js');
var _address =require('service/address-service.js');
var templateAddressModal =require('./address-modal.template');
var _cities=require('util/cities/index.js');

var addressModal={
    show:function(option){
        this.option = option;
        this.option.data = option.data || {};
        this.$modalWrap=$('.modal-wrap');
        this.loadModal();
        this.bindEvent();
    },
    hide:function(){
        this.$modalWrap.empty();
    },
    loadModal:function(){
        var addressModalHtml=_mm.renderHtml(templateAddressModal,{
            isUpdate:this.option.isUpdate,
            data:this.option.data
        });
        this.$modalWrap.html(addressModalHtml);
        this.loadProvince();
        

    },
    bindEvent:function(){
        var _this=this;
        $(document).on('change','#receiver-province',function(){
            var selectedProvince = $(this).val();
            _this.loadCities(selectedProvince);
        });
        $(document).on('click','.address-btn',function(){
            var receiverInfo=_this.getReceiverInfo();
            var isUpdate=_this.option.isUpdate;
            if(!isUpdate && receiverInfo.status){
                _address.save(receiverInfo.data,function(res){
                    _mm.successTips('地址添加成功');
                    _this.hide();
                    typeof _this.option.onSuccess === 'function' && _this.option.onSuccess(res);
                },function(errMsg){
                    _mm.errorTips(errMsg);
                });
            }else if(isUpdate && receiverInfo.status){

                _address.update(receiverInfo.data,function(res){
                    _mm.successTips('地址修改成功');
                    _this.hide();
                    typeof _this.option.onSuccess === 'function' && _this.option.onSuccess(res);
                },function(errMsg){
                    _mm.errorTips(errMsg);
                });

            }else{
                _mm.errorTips(receiverInfo.errMsg || '提交出错')
            }
        });
        $(document).on('click','.close',function(){
            _this.hide();
        })
        $(document).on('click','.modal-container',function(event){
            event.stopPropagation();
        })
    },
    loadProvince:function(){
        var provinces =_cities.getProvinces() || [];
        var $provinceSelect= this.$modalWrap.find('#receiver-province');
        $provinceSelect.html(this.getSelectOption(provinces));

        if(this.option.isUpdate && this.option.data.receiverProvince){
            $provinceSelect.val(this.option.data.receiverProvince);
            this.loadCities(this.option.data.receiverProvince);
        }

    },
    getSelectOption:function(optionArray){
        var html="<option value=''>请选择</option>";
        optionArray.forEach(function(item){
            html+="<option value='"+item+"'>"+item+"</option>"
        });
        return html;
    },
    loadCities:function(provinceName){
        var cities = _cities.getCities(provinceName)||[];
        var $citySelect= this.$modalWrap.find('#receiver-city');
        $citySelect.html(this.getSelectOption(cities));
        if(this.option.isUpdate && this.option.data.receiverCity){
            $citySelect.val(this.option.data.receiverCity);
        }
        
    },
    getReceiverInfo:function(){
        var receiverInfo = {};
        var result ={
            status:false
        };

        receiverInfo.receiverName = $.trim(this.$modalWrap.find('#receiver-name').val());
        receiverInfo.receiverProvince = this.$modalWrap.find('#receiver-province').val();
        receiverInfo.receiverCity = this.$modalWrap.find('#receiver-city').val();
        receiverInfo.receiverAddress = $.trim(this.$modalWrap.find('#receiver-address').val());
        receiverInfo.receiverPhone = $.trim(this.$modalWrap.find('#receiver-phone').val());
        receiverInfo.receiverZip = $.trim(this.$modalWrap.find('#receiver-zip').val());
        if(this.option.isUpdate){
            receiverInfo.id=$('#receiver-id').val();
        }
        if(!receiverInfo.receiverName){
            result.errMsg = '请输入收件人姓名';
        }else if(!receiverInfo.receiverProvince){
            result.errMsg = '请选择收件人所在省份';
        }else if(!receiverInfo.receiverCity){
            result.errMsg = '请选择收件人所在城市';
        }else if(!receiverInfo.receiverAddress){
            result.errMsg = '请输入收件人详细地址';
        }else if(!receiverInfo.receiverPhone){
            result.errMsg = '请输入收件人手机号';
        }else{
            result.status   = true;
            result.data     = receiverInfo;
        }
        return result;
    }
}
module.exports = addressModal;