+(function(root, document) {
    "use strict";
    var $editorLoader = null, //编辑器对象
        $selectEle = false, //是否选择元素
        $selectProp = false, //是否选择属性
        $excludeTagName = ["nz-editor-loader", "body", "html"]; //排除的节点名称

    /**
     * 阻止默认事件
     * @param {*} e 
     */
    var _preventDefault = function(e) {
        if (e.preventDefault) {
            e.preventDefault();
        } else {
            e.returnValue = false;
        }
    }

    /**
     * 防止事件冒泡
     * @param {*} e 
     */
    var _stopPropagation = function(e) {
        if (e.stopPropagation) {
            e.stopPropagation()
        } else {
            e.cancelBubble = true;
        }
    }

    /**
     * 鼠标移入后的操作
     * @param {*} ele 
     */
    var _nodeHovered = function(ele) {
        if ($selectEle) {
            var inspectorOutline = $editorLoader.createSelectElementLayer($selectProp);
            $editorLoader.setSelectHighlightLayerPos(inspectorOutline, ele);
        } else {
            var inspectorOutline = $editorLoader.createHighlight();
            $editorLoader.setHighlightPos(inspectorOutline, ele);
        }
    };

    /**
     * 显示创建事件的对话框
     * @param {*} ele 
     */
    var _showCreateEventModal = function(ele) {
        if (!$selectProp) {
            $editorLoader.generateOneEvent();
        }
        var selectModal = $editorLoader.createModal($selectProp, ele);
        $editorLoader.setModalPos(selectModal, ele);
    }

    /**
     * 鼠标移入后的操作
     * @param {*} event 
     */
    var _mouseOverDOMNode = function(event) {
        _preventDefault(event);
        _stopPropagation(event);
        var tagName = event.target.tagName.toLowerCase();
        if (!$excludeTagName.includes(tagName)) {
            _nodeHovered(event.target);
        }
    };

    /**
     * 鼠标移除后的操作
     * @param {*} event 
     */
    var _mouseOutDOMNode = function(event) {
        _preventDefault(event);
        _stopPropagation(event);
        $editorLoader.removeSelectElementLayer($selectProp);
    };

    /**
     * 点击事件
     * @param {*} event 
     */
    var _clickOnDOMNode = function(event) {
        var tagName = event.target.tagName.toLowerCase();
        if (!$excludeTagName.includes(tagName)) {
            _preventDefault(event);
            _stopPropagation(event);
            _showCreateEventModal(event.target);
            if (!$selectProp) {
                $editorLoader.setEvent(event.target, $selectEle);
            }
        }
    };

    /**
     * 给元素绑定事件
     */
    var _setUpEvents = function() {
        $editorLoader = document.querySelector('nz-editor-loader');
        document.addEventListener('mouseover', _mouseOverDOMNode);
        document.addEventListener('mouseout', _mouseOutDOMNode);
        document.addEventListener('click', _clickOnDOMNode, true);
    };

    /**
     * 取消元素事件绑定
     * @param {*} callback 
     */
    var _dropDownEvents = function(callback) {
        document.removeEventListener('mouseover', _mouseOverDOMNode);
        document.removeEventListener('mouseout', _mouseOutDOMNode);
        document.removeEventListener('click', _clickOnDOMNode, true);
    }

    root.nzEditorInspector = {
        start: function(selectEle, selectProp) { //启动
            $selectEle = !!selectEle;
            $selectProp = !!selectProp;
            _setUpEvents();
        },
        stop: function(selectEle, selectProp) { //停止
            $selectEle = !!selectEle;
            $selectProp = !!selectProp;
            _dropDownEvents();
        },
        restart: function(selectEle, selectProp) {
            $selectEle = !!selectEle;
            $selectProp = !!selectProp;
            _dropDownEvents();
            _setUpEvents();
        }
    };
}(window, document));