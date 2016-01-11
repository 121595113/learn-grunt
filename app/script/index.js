(function(){
    require.config({
        paths: {
            "zepto": ['zepto.min'],
            "swiper": ['swiper.min']
        },
        shim: { 
            'zepto': {
                exports: '$'
            }
        }
    });
    require(["zepto", "swiper"], function($) {
        $(function() {
            // banner
            var mySwiper = new Swiper('.swiper-container', {
                speed: 400,
                loop: true,
                centeredSlides: true,
                autoplay: 5000,
                autoplayDisableOnInteraction: false,
                preloadImages: false,
                lazyLoading: true
            });

            // 底部操作栏
            var Tap = "ontouchstart" in window ? "tap" : "click";
            $('.nav li').on("click", function(e) {
             e.stopPropagation();
             e.preventDefault();
             $(this).addClass('active').siblings().removeClass('active')
            })
        })
    })
})();
