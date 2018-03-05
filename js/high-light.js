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
                "top": ele.getBoundingClientRect().top + window.scrollY,
                "left": ele.getBoundingClientRect().left + window.scrollX
            }
            return sizes;
        },
        addSelectedShadowDom: function(rootshadow, sizes, type, processed, current) {
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
                "position": "absolute",
                "box-sizing": "border-box",
                "border": type == 'A' ? "2px solid rgb(10, 222, 57)" : "2px dashed rgb(243, 33, 33)",
                "background": processed ? "rgba(123, 251, 140, 0.57)" : "rgba(251, 123, 123, 0.57)",
                "box-shadow": current ? "0 0 0 2px #03A9F4" : "none",
                "z-index": 99999,
                "border-radius": "3px",
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
                    "position": "absolute",
                    "box-sizing": "border-box",
                    "background": "rgba(255, 178, 0, 0.48)",
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
        clearHoverShadowDom:function(){
            
        },
        clearallSelectedShadowDom: function(rootshadow) {
            var rootshadow = rootshadow || this.rootshadow || null;
            rootshadow.innerHTML = '';
        },
        repainSelectedShadowDom: function(rootshadow, paths, processedpaths, currentpaths) {
            var rootshadow = rootshadow || this.rootshadow || null;
            this.clearallSelectedShadowDom(rootshadow);
            var that = this;
            var totalpaths = {};
            $.each(paths, function(i, e) {
                if (!totalpaths[e.pathstring]) {
                    totalpaths[e.pathstring] = {};
                }
                $.extend(true, totalpaths[e.pathstring], e, { path: true })
            })
            if (processedpaths) {
                $.each(processedpaths, function(i, e) {
                    if (!totalpaths[e.pathstring]) {
                        totalpaths[e.pathstring] = {};
                    }
                    $.extend(true, totalpaths[e.pathstring], e, { processed: true })
                })
            }
            if (currentpaths) {
                $.each(currentpaths, function(i, e) {
                    if (!totalpaths[e.pathstring]) {
                        totalpaths[e.pathstring] = {};
                    }
                    $.extend(true, totalpaths[e.pathstring], e, { current: true })
                })

            }
            for (var k in totalpaths) {
                (function(e) {
                    var host = $(e.pathstring);
                    host.each(function(i, ele) {
                        var sizes = that.getSizes(ele);
                        that.addSelectedShadowDom(rootshadow, sizes, ele.tagName, e.processed, e.current);
                    })
                })(totalpaths[k])
            }
        },
        addResizeEvent: function() {
            var that = this;
            $(window).resize(function(e) {
                that.repainSelectedShadowDom(CaiyunScope.rootshadow, CaiyunScope.totalpaths, CaiyunScope.processedpaths, CaiyunScope.currentpaths);
            })
            $(document).bind("mousewheel", function(e) {
                that.repainSelectedShadowDom(CaiyunScope.rootshadow, CaiyunScope.totalpaths, CaiyunScope.processedpaths, CaiyunScope.currentpaths);
                // console.log(e)
                // e.preventDefault();
            })
        }
    }
    root.HightLight = HightLight;
})(window)