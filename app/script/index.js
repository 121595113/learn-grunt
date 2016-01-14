(function() {
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

            // 

            var wh = $(window).height();

            $(window).on('resize', function() {
                var newH = $(window).height();
                if (window.orientation == 90 || window.orientation == -90) {
                    // expression
                } else {
                    console.log(wh, newH);
                    if (wh > newH) {
                        $('body').addClass('focus');
                    } else {
                        $('body').removeClass('focus');
                    }
                    // $('#search').val(wh + ' ' + newH)
                    wh = newH;
                }
            })

        })
    })
})();
