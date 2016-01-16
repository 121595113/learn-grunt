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

            // 解决弹出输入框的底部操作栏紧跟虚拟键盘的bug
            var wh = $(window).height();
            $(window).on('resize', function() {
                var newH = $(window).height();
                if (window.orientation == 90 || window.orientation == -90) {
                    // expression
                } else {
                    var poor = Math.abs(wh - newH);
                    if (wh > newH && poor > 100) {
                        $('body').addClass('focus');
                    } else {
                        $('body').removeClass('focus');
                    }
                    // $('#search').val(wh - newH)
                    wh = newH;
                }
            })

            // 监听滚动事件
            var searchbox = $('#search').parents('.search-box');
            $(document).on('scroll', function(event) {
                event.preventDefault();
                var _scrollTop = $('body').scrollTop() || $('html').scrollTop();
                $('#search').val(_scrollTop)
                if (_scrollTop<=0) {
                    $('html').scrollTop=1;
                };
                if (_scrollTop >= 80) {
                    _scrollTop = 80;
                }
                if (_scrollTop >= 0) {
                    searchbox.css({
                        'background': 'rgba(38,191,128,' + _scrollTop / 100 + ')'
                    })
                }else{
                    var val=-_scrollTop/100>1.2?1.2:-_scrollTop/100;
                    $('.bg-text').css({
                        'transform': 'scale('+ val+')'
                    })
                }

            });


        })
    })
})();
