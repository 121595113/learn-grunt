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
            $('.nav li').on(Tap, function(e) {
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
                    wh = newH;
                }
            })

            // 一键加载
            var flag = true;
            $('.jiasu').on(Tap, function(event) {
                event.preventDefault();
                var _this = $(this);
                if (flag) {
                    _this.text('加速中...');
                    setTimeout(function() {
                        _this.text('加速完成')
                        setTimeout(function() {
                            _this.text('一键内存加速')
                            flag = true;
                        }, 1000)
                    }, 3000)
                } else {
                    return;
                }
                flag = false;
            });

            // 小数转换成百分数
            Number.prototype.toPercent = function(parm) {
                var parm = parm || 0;
                return (Math.round(this * 10000) / 100).toFixed(parm) + '%';
            };
            // 应用下载
            $('.preview-list .btn').each(function(index, el) {

                var timer = null;
                $(this).on(Tap, function(event) {
                    event.preventDefault();
                    var _this = $(this),
                        _parent = _this.parents('.item'),
                        dataSize = _parent.width();

                    clearTimeout(timer);

                    if (_parent.attr('state') == 'active') {
                        _parent.attr('state', 'stop');
                        _this.text('下载')

                    } else if (_parent.attr('state') == 'stop') {
                        var calc = function() {
                            var _curSize = _parent.find('.jindu').width(),
                                $val = (_curSize / dataSize);
                            _this.text($val.toPercent())
                            if ($val >= 1) {
                                _this.text('安装')
                                _parent.attr('state', 'finish');
                                return;
                            };
                            $val += 0.01;
                            _parent.find('.jindu').css({
                                'width': $val.toPercent()
                            })
                            timer = setTimeout(function() {
                                calc();
                            }, 250)
                        };
                        calc();
                        _parent.attr('state', 'active');

                    } else if (_parent.attr('state') == 'finish') {
                        return;
                    }
                });

            });

            // 搜索词
            var chars = ['开心消消乐', '支付宝', '经典单机游戏100款', '单机斗地主…'];

            function generateMixed(n, Arrys) {
                var Arrys = Arrys || [],
                    res = "";
                for (var i = 0; i < n; i++) {
                    var id = Math.floor(Math.random() * Arrys.length);
                    res += Arrys[id];
                }
                return res;
            }

            var T2 = null,
                placeholder = function() {
                    T2 = setTimeout(function() {
                        $('#search').prop('placeholder', '大家都在搜：' + generateMixed(1, chars));
                        placeholder();
                    }, 3500)
                }
            placeholder();
            $('#search').focus(function(event) {
                clearTimeout(T2)
            }).blur(function(event) {
                placeholder();
            });

            // ...
        });

    })
})();
