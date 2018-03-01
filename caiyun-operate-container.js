xtag.register('caiyun-operate-container', {
    content: '',
    lifecycle: {
        created: function() {
            this.createDom();
        },
        inserted: function() {
            // console.log("inserted,插入标签");

        },
        removed: function() {
            console.log("removed,删除标签");
        },
        attributeChanged: function(attrName, oldValue, newValue) {
            console.log("attributeChanged", attrName, oldValue, newValue);
        }
    },
    methods: {
        createDom: function() {
            var shadow = this.createShadowRoot();
            var style = `<style type="text/css">
                            table {
                                border-collapse: collapse;
                                border-spacing: 0;
                            }
                            .catch-container{
                                width: 100%;
                                border-radius: 3px;
                                box-sizing: border-box;
                                font-size:12px;
                                font-family:'微软雅黑';
                                text-align:left;
                            }
                            .catch-container>div>div{
                                padding:10px;
                                border-top: 1px solid rgb(170, 170, 170);
                            }
                            .catch-container ul{
                                list-style: none;
                                line-height:28px;
                                font-size:14px;
                                padding: 0;
                            }
                            .catch-container ul li{
                                padding:0 10px;
                                background:rgb(251, 247, 247);
                            }
                            a{
                                cursor: pointer;
                                color:rgb(255, 73, 0);
                                margin-right:10px;
                                pointer-events:auto;
                            }
                            a:hover{
                                color:red;
                            }
                            h5{
                                font-size: 16px;
                                line-height: 40px;
                                margin: 0;
                                text-align: center;
                                cursor:move;
                            }
                            .ope,.info{
                                line-height: 30px;
                                 background:#eee;
                            }
                            .ope a{
                                color:rgb(20, 150, 245);
                                font-size:14px;
                            }
                            textarea{
                                width:100%;
                                height:60px;
                                box-sizing:border-box;
                            }
                            p{
                                margin:0;
                            }
                            .selected-container{
                                background:#fff;
                                overflow:auto;
                                max-height:300px;
                            }
                            .extractattr-container,.extracttxt-container{
                            }
                            #infotable{
                            }
                            #infotable td{
                                    border: 1px solid rgb(238, 238, 238);
                                    max-height: 30px;
                                    height: 30px;
                                    overflow: hidden;
                                    white-space: nowrap;
                                    max-width: 200px;
                                    text-overflow: ellipsis;
                            }
                            .inner-container{
                                height:calc(100% - 40px);
                                overflow:auto;
                            }
                            .extractattr-container a,.extracttxt-container a{
                                font-size:12px;
                                color:rgb(61, 165, 20);
                            }
                            input{
                                display:block;
                                margin-top:10px;
                            }
                            div>input:first-child{
                                margin-top:0;
                            }
                            .extractattr-container,.extracttxt-container{
                                padding: 10px 10px 0 10px;
                                background: rgb(238, 238, 238);
                            }
                        </style>`;
            var innerHtml = `
                <div class="catch-container">
                        <h5>操作提示</h5>
                        <div class="inner-container">
                        <div class="ope">
                            <a class='startcatch'>开始选择页面元素</a>
                            <a class='clearselection'>清除所有选择</a>
                        </div>
                        
                        <!-- 进一个页面中需要采集链接的时候 -->
                        <div class="selectone-container select-div">
                            <p>已选择1个普通/链接元素，您可以继续选择，或进行以下操作：</p>
                            <ul>
                                <li class="confirmone"><a>仅选此元素</a></li>
                                <li class="selectsimilar"><a>选择同类元素</a></li>
                                <li class="clickone"><a>点击该元素内的链接</a></li>
                                <li class="cancelselected"><a>取消选择</a></li>
                                <li class="finish"><a>完成并保存</a></li>
                            </ul>
                        </div>
                        <div class="selectone-ope-container select-div">
                            <p>已选择1个元素，您可以继续选取其他元素，或进行以下操作：</p>
                            <ul>
                                <li class="clickone"><a>点击该元素内的链接</a></li>
                                <li>
                                    <a class="extracttxt">提取文本</a>
                                    <div class="extracttxt-container">
                                        <input type="text" placeholder="字段名称" class="fieldname"/>
                                        <a class="savetxt">保存</a>
                                    </div>
                                </li>
                                <li>
                                    <a class="extractattr">提取属性</a>
                                    <div class="extractattr-container">
                                        <input type="text" placeholder="字段名称" class="fieldname"/>
                                        <input type="text" placeholder="属性名称" class="attrname"/>
                                        <a class="saveattr">保存</a>
                                    </div>
                                </li>
                                <li class="cancelselected"><a>取消选择</a></li>
                                <li class="finish"><a>完成并保存</a></li>
                            </ul>
                        </div>
                        <div class="selectmul-ope-container select-div">
                            <p>已选择<span id="currentelenum"></span>个元素，您可以继续选择，或进行以下操作：</p>
                            <ul>
                                <li class="selectsimilar"><a>选择当前元素的同类元素</a></li>
                                <li class="clickall"><a>循环点击这些元素内的链接</a></li>
                                <li>
                                    <a class="extracttxt">循环提取文本</a>
                                    <div class="extracttxt-container">
                                        <input type="text" placeholder="字段名称" class="fieldname"/>
                                        <a class="savetxt">保存</a>
                                    </div>
                                </li>
                                <li>
                                    <a class="extractattr">循环提取属性</a>
                                    <div class="extractattr-container">
                                        <input type="text" placeholder="字段名称" class="fieldname"/>
                                        <input type="text" placeholder="属性名称" class="attrname"/>
                                        <a class="saveattr">保存</a>
                                    </div>
                                </li>
                                <li class="cancelselected"><a>取消选择</a></li>
                                <li class="finish"><a>完成并保存</a></li>
                            </ul>
                        </div>
                        <!--<div class="info">
                            <textarea id="csspath"></textarea>
                            <a class="applynewpath">应用新css路径</a>
                        </div>-->
                        <div class="selected-container">
                            <p>已配置元素</p>
                            <table id="infotable">
                            </table>
                        </div>
                        </div>
                    </div>
            `;
            shadow.innerHTML = style + innerHtml;
            this.shadow = CaiyunScope.operateshadow = shadow;
            CaiyunScope.opeshadowcon = shadow.querySelector('.catch-container');
            this.addShadowEvents();
            CaiyunScope.checkStep();
            this.extradata = [];
            this.css_selecter = [];
        },
        addShadowEvents: function() {
            var that = this;
            $shadowcontainer = $(this.shadow.querySelector('.catch-container'));
            $shadowcontainer.mousedown(function(e) {
                if (e.target.tagName != 'H5') {
                    e.stopPropagation();
                }
            })
            $shadowcontainer.click(function(e) {
                var $el = $(e.target);
                var classname = $(e.target).attr("class") || $(e.target).parent().attr("class");
                switch (classname) {
                    case 'confirmone':
                        CaiyunScope.checkStep(true);
                        break;
                    case 'selectsimilar':
                        var similarpaths = CaiyunScope.cssselector.getSimilarSelectorList(CaiyunScope.uniquepath);
                        CaiyunScope.totalpaths = CaiyunScope.totalpaths.concat(similarpaths.minus(CaiyunScope.totalpaths));
                        CaiyunScope.currentpaths=CaiyunScope.totalpaths;
                        HightLight.repainSelectedShadowDom(CaiyunScope.rootshadow, CaiyunScope.totalpaths, CaiyunScope.processedpaths);
                        CaiyunScope.checkStep();
                        break;
                    case 'startcatch':
                        CaiyunScope.startcatch = !CaiyunScope.startcatch;
                        $(e.target).text(CaiyunScope.startcatch ? '停止选择页面元素' : '开始选择页面元素');
                        break;
                    case 'clearselection':
                        CaiyunScope.totalpaths = [];
                        CaiyunScope.currentpaths=[];
                        CaiyunScope.processedpaths=[];
                        that.extradata=[];
                        that.rendInfo();
                        HightLight.repainSelectedShadowDom(CaiyunScope.rootshadow, CaiyunScope.totalpaths, CaiyunScope.processedpaths);
                        CaiyunScope.checkStep();
                        break;
                    case 'clickone':
                        that.css_selecter.push(CaiyunScope.uniquepath);
                        var openpage = {
                            "extradata": that.extradata,
                            "css_selecter": that.css_selecter
                        }
                        CaiyunSteps.push(openpage);
                        var el_a;
                        $.each(CaiyunScope.currentpaths,function(i,ele){
                            var $el=$(ele.pathstring);
                            if($(ele.pathstring)[0].tagName=='A'){
                                el_a=$(ele.pathstring).attr('href');
                                return false;
                            }
                            else{
                                if($el.find('a')[0]){
                                    el_a=$($el.find('a')[0]).attr('href');
                                    return false;
                                }
                            }
                            
                        })
                        if(!el_a){
                            alert('当前所选元素中没有可打开的链接！！');
                        }
                        else{
                            window.open(el_a,'_top');
                        }
                        break;
                    case 'clickall':
                        that.css_selecter = CaiyunScope.totalpaths;
                        var openpage = {
                            "extradata": that.extradata,
                            "css_selecter": that.css_selecter
                        }
                        CaiyunSteps.push(openpage);
                        var el_a;
                        $.each(CaiyunScope.currentpaths,function(i,ele){
                            var $el=$(ele.pathstring);
                            if($(ele.pathstring)[0].tagName=='A'){
                                el_a=$(ele.pathstring).attr('href');
                                return false;
                            }
                            else{
                                if($el.find('a')[0]){
                                    el_a=$($el.find('a')[0]).attr('href');
                                    return false;
                                }
                            }
                            
                        })
                        if(!el_a){
                            alert('当前所选元素中没有可打开的链接！！');
                        }
                        else{
                            window.open(el_a,'_top');
                        }
                        break;
                    case 'extracttxt':
                        $el.next('.extracttxt-container').toggle();
                        break;
                    case 'extractattr':
                        $el.next('.extractattr-container').toggle();
                        break;
                    case 'savetxt':
                        var extradata = {
                            "name": $el.parent().children('.fieldname').val(),
                            "extratype": "txt",
                            "css_selecter": CaiyunScope.currentpaths
                        }
                        $el.parent().hide();
                        that.extradata.push(extradata);
                        that.rendInfo();
                        CaiyunScope.processedpaths = CaiyunScope.processedpaths.concat(CaiyunScope.totalpaths);
                        CaiyunScope.currentpaths=CaiyunScope.totalpaths;
                        CaiyunScope.totalpaths = [];
                        HightLight.repainSelectedShadowDom(CaiyunScope.rootshadow, CaiyunScope.totalpaths, CaiyunScope.processedpaths);
                        break;
                    case 'saveattr':
                        var extradata = {
                            "name": $el.parent().children('.fieldname').val(),
                            "attr_name": $el.parent().children('.attrname').val(),
                            "extratype": "attr",
                            "css_selecter": CaiyunScope.currentpaths
                        }
                        $el.parent().hide();
                        that.extradata.push(extradata);
                        that.rendInfo();
                        CaiyunScope.processedpaths = CaiyunScope.processedpaths.concat(CaiyunScope.totalpaths);
                        CaiyunScope.currentpaths=CaiyunScope.totalpaths;
                        CaiyunScope.totalpaths = [];
                        HightLight.repainSelectedShadowDom(CaiyunScope.rootshadow, CaiyunScope.totalpaths, CaiyunScope.processedpaths);
                        break;
                    case 'cancelselected':
                        CaiyunScope.processedpaths.deleteArray(CaiyunScope.currentpaths);
                        if(CaiyunScope.currentpaths.length>0){
                        that.extradata.pop();}
                        CaiyunScope.currentpaths=CaiyunScope.totalpaths=[];
                        that.rendInfo();
                        HightLight.repainSelectedShadowDom(CaiyunScope.rootshadow, CaiyunScope.totalpaths, CaiyunScope.processedpaths);
                        break;
                    case 'finish':
                        var openpage = {
                            "extradata": that.extradata,
                            "css_selecter": []
                        }
                        CaiyunSteps.push(openpage);
                        localStorage.setItem('caiyunsteps', JSON.stringify(CaiyunSteps));
                        break;
                }

            })
            $shadowcontainer.find('.applynewpath').click(function(e) {
                CaiyunScope.totalpaths.splice(CaiyunScope.totalpaths.includeItem(CaiyunScope.uniquepath), 1)
                CaiyunScope.uniquepath = CaiyunScope.cssselector.getUniqueSelector($(that.shadow.querySelector('#csspath').value)[0]);
                if (CaiyunScope.totalpaths.includeItem(CaiyunScope.uniquepath) <= -1) {
                    CaiyunScope.totalpaths.push(CaiyunScope.uniquepath);
                }
                HightLight.repainSelectedShadowDom(CaiyunScope.rootshadow, CaiyunScope.totalpaths, CaiyunScope.processedpaths);
                CaiyunScope.checkStep();
            })
        },
        rendInfo: function() {
            var that=this;
            var $infotable=$(CaiyunScope.opeshadowcon).find("#infotable");
            $infotable.empty();
            var infolist=getExtractInfo(that.extradata);
            $.each(infolist,function(i,ele){
                var inner='<tr>'+
                '<td title="'+ele.name+'">'+ele.name+'</td>'+
                '<td title="'+ele.value+'">'+ele.value+'</td>'+
                '<td title="'+ele.attr_name+'">'+ele.attr_name+'</td>'+
                '<td title="'+ele.type_name+'">'+ele.type_name+'</td>'+
                '<td title="'+ele.path+'">'+ele.path+'</td>'+
                '</tr>'
                $infotable.append(inner);
            })
        }
    },
    events: {
        'click': function(e) {
            e.stopPropagation();
            //e.currentTarget still === your xtag element
        }
    }
});