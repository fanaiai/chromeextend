(function(root) {
    root.CaiyunScope = {
        cssselector: new CssSelector({}),
        uniquepath: {},
        totalpaths: [],
        rootshadow: {},
        startcatch: false
    }
    root.CaiyunPostData = {
        url: ''
    }
})(window)
$(document).ready(function() {
    CaiyunPostData.url = window.location.href;
    console.log("加载成功", CaiyunPostData.url);
    $("body").append("<caiyun-operate-container></caiyun-operate-container>");
    $("body").append("<div id='caiyun-root' class='caiyun-root caiyun-highlight' style='width:0;height:0'></div>");
    CaiyunScope.rootshadow = $("#caiyun-root")[0].createShadowRoot();
    window.HightLight = new HightLight(CaiyunScope.rootshadow, {});
    $(document).click(function(e) {
        var el = e.target;
        if (CaiyunScope.startcatch) {
            e.preventDefault();
            CaiyunScope.uniquepath = CaiyunScope.cssselector.getUniqueSelector(el);
            if (CaiyunScope.totalpaths.includeItem(CaiyunScope.uniquepath) <= -1) {
                CaiyunScope.totalpaths.push(CaiyunScope.uniquepath);
                HightLight.repainSelectedShadowDom(CaiyunScope.rootshadow, CaiyunScope.totalpaths);
            } else {
                CaiyunScope.totalpaths.splice(CaiyunScope.totalpaths.includeItem(CaiyunScope.uniquepath), 1);
                HightLight.repainSelectedShadowDom(CaiyunScope.rootshadow, CaiyunScope.totalpaths);
            }
        }
    })
    $(document).mouseover(function(e) {
        if (CaiyunScope.startcatch && e.target.tagName != 'CAIYUN-OPERATE-CONTAINER') {
            var ele = e.target;
            var sizes = HightLight.getSizes(ele);
            HightLight.addHoverShadowDom(CaiyunScope.rootshadow, sizes);
        }
    })

    var mousedown = false;
    var targettop = 0;
    var targetleft = 0;
    var eletop=0,eleleft=0;
    $(document).mousedown(function(e) {
        if (e.target.tagName == 'CAIYUN-OPERATE-CONTAINER') {
            e.stopPropagation();
            mousedown = true;
            targettop = e.clientY;
            targetleft = e.clientX;
            eletop=parseFloat($(e.target).css('top'));
            eleleft=parseFloat($(e.target).css('left'));
        }
    })
    $(document).mousemove(function(e) {
        if (e.target.tagName == 'CAIYUN-OPERATE-CONTAINER' && mousedown) {
            e.stopPropagation();
            var top = eletop + e.clientY - targettop;
            var left = eleleft + e.clientX - targetleft;
            if (mousedown) {
                $(e.target).css({
                    top: top + 'px',
                    left: left + 'px'
                })
            }
        }
    })
    $(document).mouseup(function(e) {
            mousedown = false;
    })
})