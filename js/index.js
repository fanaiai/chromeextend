// 判断彩云是否登录
// $.ajax({
//     type:"post",
//     url:"http://caiyun.newssdk.com/caiyun/task/getlang",
//     data:{
//         // "checked":3182,
//         // "enable_node_type":"site"
//     },
//     success:function(res){
//         console.log(res);
//     }
// })
function getLoginInfo(){
    var taskid=getQuery('taskid');
    var step=getQuery('step');
    return true;
}
chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) { //获取用户名
    if (request.cmd == 'test') console.log(request.value);
});
(function(root) {
    root.CaiyunSteps = [];
    chrome.storage.local.get({ caiyunstep:1 }, function(items) {
        console.log(items.caiyunstep)
        root.caiyunstep = getQuery("caiyunstep") || items.caiyunstep;
        chrome.storage.local.set({ caiyunstep: caiyunstep }, function() {
        });
    });
    chrome.storage.local.get({ caiyunsteps:[] }, function(items) {
        root.CaiyunSteps = (caiyunstep>1)?items.caiyunsteps:[];
        console.log(root.CaiyunSteps)
        chrome.storage.local.set({ caiyunsteps: CaiyunSteps }, function() {
        });
    });
    root.CaiyunPostDataTemp = {
        "url": '',
        "setting": {
            "seed_type": "url_single", //单个url
            "seed_urls": "http://nc.auto.sina.com.cn/shcs/list.shtml",
            "protocol": "http"
        },
        "css_selecter": [],
        "extradata": [{
            "name": "链接标题",
            "extratype": "txt",
            "css_selecter": []
        }],
        "openpage": {
            "css_selecter": [],
            "extradata": [{
                "name": "链接标题",
                "extratype": "txt",
                "css_selecter": []
            }],
            "openpage": {}
        }
    }
    root.CaiyunPostData = {
        "url": '',
        "setting": {
            "seed_type": "url_single", //单个url
            "seed_urls": "http://nc.auto.sina.com.cn/shcs/list.shtml",
            "protocol": "http"
        },
        taskid:-1
    }
    root.CaiyunScope = {
        cssselector: new CssSelector({}),
        uniquepath: {},
        totalpaths: [],
        processedpaths: [],
        currentpaths: [],
        rootshadow: {},
        startcatch: false,
        operateshadow: {},
        opeshadowcon: {},
        selectmode: 0 //操作状态：0 初始 ,1 选择了一个元素，2 确定选择一个元素 ，3 选择多个元素
    }
    root.CaiyunScope.checkStep = function(confirmone) {
        $(CaiyunScope.opeshadowcon).find('.extracttxt-container').hide();
        $(CaiyunScope.opeshadowcon).find('.extractattr-container').hide();
        $(CaiyunScope.opeshadowcon).find(".select-div").hide();
        CaiyunScope.selectmode = confirmone ? 2 : (CaiyunScope.totalpaths.length <= 0 ? 0 : (CaiyunScope.totalpaths.length == 1 ? 1 : 3));
        switch (CaiyunScope.selectmode) {
            case 1:
                $(CaiyunScope.opeshadowcon).find(".selectone-container").show();
                break;
            case 2:
                $(CaiyunScope.opeshadowcon).find(".selectone-ope-container").show();
                console.log('one-ope')
                break;
            case 3:
                $(CaiyunScope.opeshadowcon).find("#currentelenum").text(CaiyunScope.currentpaths.length);
                $(CaiyunScope.opeshadowcon).find(".selectmul-ope-container").show();
                break;
            default:
                $(CaiyunScope.opeshadowcon).find(".select-div").hide();
                break;
        }
    }

})(window)
$(document).ready(function() {
    if(!getLoginInfo()){
        return false;
    }
    CaiyunPostData.url = window.location.href;
    $("body").append("<div id='caiyun-root' class='caiyun-root caiyun-highlight' style='width:0;height:0'></div>");
    $("body").append("<caiyun-operate-container></caiyun-operate-container>");
    CaiyunScope.rootshadow = $("#caiyun-root")[0].createShadowRoot();
    window.HightLight = new HightLight(CaiyunScope.rootshadow, {});
    $(document).click(function(e) {
        var el = e.target;
        if (CaiyunScope.startcatch) {
            e.preventDefault();
            CaiyunScope.uniquepath = CaiyunScope.cssselector.getUniqueSelector(el);
            // CaiyunScope.operateshadow.querySelector("#csspath").value=CaiyunScope.uniquepath.pathstring;
            if (CaiyunScope.totalpaths.includeItem(CaiyunScope.uniquepath) <= -1) {
                CaiyunScope.totalpaths.push(CaiyunScope.uniquepath);
                CaiyunScope.currentpaths = CaiyunScope.totalpaths;
                HightLight.repainSelectedShadowDom(CaiyunScope.rootshadow, CaiyunScope.totalpaths, CaiyunScope.processedpaths,CaiyunScope.currentpaths);
            } else {
                CaiyunScope.totalpaths.splice(CaiyunScope.totalpaths.includeItem(CaiyunScope.uniquepath), 1);
                CaiyunScope.currentpaths = CaiyunScope.totalpaths;
                HightLight.repainSelectedShadowDom(CaiyunScope.rootshadow, CaiyunScope.totalpaths, CaiyunScope.processedpaths,CaiyunScope.currentpaths);
            }
            CaiyunScope.checkStep();
        }
    })
    $(document).mouseover(function(e) {
        if (CaiyunScope.startcatch && e.target.tagName != 'CAIYUN-OPERATE-CONTAINER' && e.target.tagName != 'BODY') {
            var ele = e.target;
            var sizes = HightLight.getSizes(ele);
            HightLight.addHoverShadowDom(CaiyunScope.rootshadow, sizes);
        }
    })

    var mousedown = false;
    var targettop = 0;
    var targetleft = 0;
    var eletop = 0,
        eleleft = 0;
    $(document).mousedown(function(e) {
        if (e.target.tagName == 'CAIYUN-OPERATE-CONTAINER') {
            e.stopPropagation();
            mousedown = true;
            targettop = e.clientY;
            targetleft = e.clientX;
            eletop = parseFloat($(e.target).css('top'));
            eleleft = parseFloat($(e.target).css('left'));
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