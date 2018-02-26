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
                            .catch-container{
                                width:100%;
                            }
                            .catch-container ul{
                                list-style: none;
                                line-height:28px;
                                font-size:14px;
                            }
                            a{
                                cursor: pointer;
                                color:blue;
                                margin-right:10px;
                                pointer-events:auto;
                            }
                            a:hover{
                                color:red;
                            }
                        </style>`;
            var innerHtml = `<div class="catch-container">
                <a class='startcatch'>开始选择</a>
                <ul>
                    <li><a class='selectone'>选择当前元素</a><a class='selectsimilar'>选择相似元素</a></li>
                    <li><a class='openone'>打开当前链接</a><a class='openall'>循环打开链接</a></li>
                    <li><a class='clearselection'>取消所有选择</a></li>
                </ul>
                <div>
                </div>
            </div>`;
            shadow.innerHTML = style + innerHtml;
            this.shadow = shadow;
            this.addShadowEvents();
        },
        addShadowEvents: function() {
            this.shadow.querySelector('.selectsimilar').onclick = function(e) {
                var similarpaths = CaiyunScope.cssselector.getSimilarSelectorList(CaiyunScope.uniquepath);
                CaiyunScope.totalpaths=CaiyunScope.totalpaths.concat(similarpaths.minus(CaiyunScope.totalpaths));
                HightLight.repainSelectedShadowDom(CaiyunScope.rootshadow,CaiyunScope.totalpaths)
            }
            this.shadow.querySelector('.startcatch').onclick = function(e) {
                CaiyunScope.startcatch=!CaiyunScope.startcatch;
            }
            this.shadow.querySelector('.clearselection').onclick = function(e) {
                CaiyunScope.totalpaths=[];
                HightLight.repainSelectedShadowDom(CaiyunScope.rootshadow,CaiyunScope.totalpaths)
            }
        }
    },
    events: {
        'click': function(e) {
            e.stopPropagation();
            //e.currentTarget still === your xtag element
        }
    }
});