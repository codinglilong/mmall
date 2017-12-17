require('./index.css');
require('page/common/nav/index.js');
require('page/common/header/index.js');
require('util/slider/index.js');
var templateBanner =require('./index.template');
var _mm=require('util/mm.js');
$(function() {
    var bannerHtml = _mm.renderHtml(templateBanner,{});
    $('.banner-con').html(bannerHtml);
    var $slider = $('.banner').unslider({
        dots: true,
    });
    $('.banner-con .banner-arrow').click(function(){
        var forward = $(this).hasClass('prev')?'prev':'next';
        $slider.data('unslider')[forward]();
    });
});