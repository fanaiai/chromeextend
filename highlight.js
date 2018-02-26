(function(root) {
    var default_option = {};

    function HightLight(rootshadow, option) {
        this.opt = $.extend(default_option, option);
        this.sizes = {};
        this.rootshadow = rootshadow;
        this.addResizeEvent();
    }
    HightLight.prototype = {
        getSizes: function(ele) {
            var sizes = {
                "height": $(ele).outerHeight(),
                "width": $(ele).outerWidth(),
                "top": ele.getBoundingClientRect().top,
                "left": ele.getBoundingClientRect().left
            }
            return sizes;
        },
        addSelectedShadowDom: function(rootshadow, sizes, type) {
            var rootshadow = rootshadow || this.rootshadow || null;
            var innerShadowRoot = document.createElement("div");
            innerShadowRoot.className = "selected-element  caiyun-highlight";
            rootshadow.append(innerShadowRoot);
            var innershadow = innerShadowRoot.createShadowRoot();
            var innerShadowElement = document.createElement("div");
            innerShadowElement.className = "caiyun-highlight";
            $(innerShadowElement).css({
                "width": sizes.width + "px",
                "height": sizes.height + "px",
                "top": sizes.top + "px",
                "left": sizes.left + "px",
                "position": "fixed",
                "box-sizing": "border-box",
                "border": type == 'A' ? "1px solid rgb(10, 222, 57)" : "1px dashed rgb(243, 33, 33)",
                "background": "rgba(82, 152, 214, 0.31)",
                "z-index": 99999,
                "pointer-events": "none" //神属性
            });
            innershadow.append(innerShadowElement);
        },
        addHoverShadowDom: function(rootshadow, sizes) {
            var rootshadow = rootshadow || this.rootshadow || null;
            if ($(rootshadow).find(".hover-element").length <= 0) {
                var innerShadowRoot = document.createElement("div");
                innerShadowRoot.className = "hover-element  caiyun-highlight";
                rootshadow.append(innerShadowRoot);
                var innershadow = innerShadowRoot.createShadowRoot();
                var innerShadowElement = document.createElement("div");
                innerShadowElement.className = "caiyun-highlight";
                $(innerShadowElement).css({
                    "width": sizes.width + "px",
                    "height": sizes.height + "px",
                    "top": sizes.top + "px",
                    "left": sizes.left + "px",
                    "position": "fixed",
                    "box-sizing": "border-box",
                    "background": "rgba(156, 0, 251, 0.52)",
                    "z-index": 99999,
                    "pointer-events": "none" //神属性
                });
                innershadow.append(innerShadowElement);
            } else {
                var innerShadowRoot = $(rootshadow).find(".hover-element")[0];
                var innershadow = innerShadowRoot.shadowRoot;
                var $innerShadowElement = $(innershadow).find(".caiyun-highlight");
                $innerShadowElement.css({
                    "width": sizes.width + "px",
                    "height": sizes.height + "px",
                    "top": sizes.top + "px",
                    "left": sizes.left + "px"
                })
            }
        },
        clearallSelectedShadowDom: function(rootshadow) {
            var rootshadow = rootshadow || this.rootshadow || null;
            rootshadow.innerHTML = '';
        },
        repainSelectedShadowDom: function(rootshadow, paths) {
            var rootshadow = rootshadow || this.rootshadow || null;
            this.clearallSelectedShadowDom(rootshadow);
            var that = this;
            $.each(paths, function(i, e) {
                var host = $(e.pathstring);
                host.each(function(i, ele) {
                    var sizes = that.getSizes(ele);
                    console.log(ele, ele.getBoundingClientRect().top)
                    that.addSelectedShadowDom(rootshadow, sizes, ele.tagName);
                })
            })
        },
        addResizeEvent: function() {
            var that = this;
            $(window).resize(function(e) {
                that.repainSelectedShadowDom(that.rootshadow, CaiyunScope.totalpaths);
            })
            window.onmousewheel = document.onmousewheel = function(e) {
                that.repainSelectedShadowDom(that.rootshadow,CaiyunScope.totalpaths);
                clearTimeout($.data(this, 'timer'));
                $.data(this, 'timer', setTimeout(function() {
                    that.repainSelectedShadowDom(that.rootshadow, CaiyunScope.totalpaths);
                }, 250));
            }
        }
    }
    root.HightLight = HightLight;
})(window)