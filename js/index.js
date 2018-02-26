+(function(window, document) {
    var nztrackUtil = window.nztrackUtil;
    var localUrl = location.href;
    var _token = null;
    var oneEvent = null;
    var action = '';
    var editPropIndex = 0;
    var selectPropTarget = null;
    var element_defs_bak = [];
    var selectionMode_bak = '';
    var allEventData = {
        events: []
    };

    /**
     * 通过csspath获得元素
     */
    var getElementsByCsspath = function() {
        if (oneEvent['element_defs'].length > 0) {
            return document.querySelectorAll(oneEvent['element_defs']['join'](','));
        }
        return [];
    }

    /**
     * 设置元素选择模式
     * @param {*} mode 
     */
    var setAutotrackModeSelected = function(mode) {
        if (!!oneEvent) {
            return oneEvent['selection_type'] == mode ? 'nz-editor-autotrack-selected' : '';
        }
        return '';
    }

    var getElementsFromEvents = function(events) {
        var cssPaths = [];
        var genCssPathsByOneEvent = function(event) {
            var selection_type = event['selection_type'];

            if (selection_type == 'custom') {
                var custom_css_selector = event['custom_css_selector'];
                if (custom_css_selector) {
                    cssPaths.push(custom_css_selector);
                }
            } else if (selection_type == 'similar') {
                var similar_css_selector = event['similar_css_selector'];
                if (similar_css_selector) {
                    cssPaths.push(similar_css_selector);
                }
            } else {
                var element_defs = event['element_defs'];
                if (element_defs && element_defs.length > 0) {
                    cssPaths = cssPaths.concat(element_defs);
                }
            }
        }
        if (events) {
            if (nztrackUtil.isArray(events)) {
                Array.from(events).forEach(function(event) {
                    genCssPathsByOneEvent(event);
                }, this);
            } else {
                genCssPathsByOneEvent(events);
            }
        }
        if (cssPaths.length > 0) {
            return document.querySelectorAll(cssPaths.join(','));
        }
        return [];
    }

    var style = `<link rel="stylesheet" href="editor/css/index.css" inline>`;
    var helpHtml = `<div class="nz-editor-app-loader-help">点击任意元素来创建事件</div>`;
    var cancelButtonHtml = `<nz-editor-button dotype="cancel" class="nz-editor-button nz-editor-button-primary">取消</nz-editor-button>`;
    var selectElementCancelButtonHtml =
        `<nz-editor-button dotype="selectElementDone" class="nz-editor-button nz-editor-button-primary">完成</nz-editor-button>
        <nz-editor-button dotype="selectElementCancel" class="nz-editor-button">取消</nz-editor-button>`;
    var selectPropCancelButtonHtml =
        `<nz-editor-button dotype="selectPropCancel" class="nz-editor-button">取消</nz-editor-button>`;
    var logoHtml = `<div class="nz-editor-app-loader-logo"></div>`;
    var buttonsHtml =
        `<nz-editor-event-menus></nz-editor-event-menus>
        <nz-editor-button dotype="create" class="nz-editor-button nz-editor-button-primary">创建事件</nz-editor-button>
        <nz-editor-button dotype="logout" class="nz-editor-button">退出</nz-editor-button>`;
    var centerButtonsHtml = function() {
        return `<div class="nz-editor-autotrack-modes">
            <div class="nz-editor-autotrack-mode nz-editor-autotrack-similar ` + setAutotrackModeSelected('similar') + `">自动</div>
            <div class="nz-editor-autotrack-mode nz-editor-autotrack-manual ` + setAutotrackModeSelected('manual') + `">手动</div>
            <div class="nz-editor-autotrack-mode nz-editor-autotrack-custom ` + setAutotrackModeSelected('custom') + `">自定义</div>
        </div>`;
    }

    xtag.register('nz-editor-loader', {
        lifecycle: {
            created: function() {
                var shadow = this.createShadowRoot();
                shadow.innerHTML = style +
                    `<div class="nz-editor-loader-inner">
                    <div class="nz-editor-app-loader-left">` + logoHtml + `</div>
                    <div class="nz-editor-app-loader-center"></div>
                    <div class="nz-editor-app-loader-right">
                        <div class="nz-editor-app-loader-buttons">` + buttonsHtml + `</div>
                    </div>
                    <div class="nz-editor-app-loader-clear"></div>
                </div>`;
            }
        },
        methods: {
            getShadowRoot: function() {
                return this.shadowRoot;
            },
            getLeft: function() {
                return this.getShadowRoot().querySelector(".nz-editor-app-loader-left");
            },
            getCenter: function() {
                return this.getShadowRoot().querySelector(".nz-editor-app-loader-center");
            },
            getRightButtons: function() {
                return this.getShadowRoot().querySelector(".nz-editor-app-loader-buttons");
            },
            //生成一个事件实例
            generateOneEvent: function() {
                oneEvent = {
                    name: '测试',
                    selection_type: 'similar',
                    properties: [],
                    custom_css_selector: '',
                    similar_css_selector: '',
                    element_defs: [],
                    defined_on_url: window.location.href
                }
            },
            //通过事件名获得事件对象
            getEventByName: function(name) {
                var events = this.getEvents();
                var filterEvents = events.filter(function(event) {
                    if (event.name.trim() == name.trim()) {
                        return event;
                    }
                });
                return filterEvents;
            },
            /**
             * 检查事件名是否存在
             */
            checkEventName: function(name) {
                return this.getEventByName(name).length == 0;
            },
            /**
             * 获得所有事件
             */
            getEvents: function() {
                return allEventData.events;
            },
            /**
             * 通过事件名编辑事件
             * @param {*} name 
             */
            editEvent: function(name) {
                var events = this.getEventByName(name);
                if (events.length > 0) {
                    action = 'edit';
                    oneEvent = events[0];
                    this.create();
                    this.createModal();
                    var shadowRoot = this.shadowRoot;
                    var selectModal = shadowRoot.querySelector('nz-editor-select-modal');
                    selectModal.shadowRoot.querySelector('div > div.nz-editor-select-dom-modal-save-row > input').value = name;
                }
            },
            /**
             * 对所有绑定事件的元素进行高亮处理
             */
            backfill: function(name, highlightOnly) {
                var that = this;
                var events = this.getEventByName(name);
                if (events.length > 0) {
                    var elements = getElementsFromEvents(events);
                    that.removeElementHighLightOutline();
                    Array.from(elements).forEach(function(element) {
                        that.createElementHighLightOutline(element);
                    }, this);
                }
            },
            /**
             * 设置元素高亮
             */
            createElementHighLightOutline: function(ele) {
                var shadowRoot = this.shadowRoot;
                var selectedElement = document.createElement('nz-editor-autotrack-selected-element');
                shadowRoot.appendChild(selectedElement);
                var selectedElementInner = selectedElement.shadowRoot.querySelector('.nz-editor-autotrack-selected-element-highlight');
                var bounds = nztrackUtil.getElementBounds(ele);
                var height = bounds.bottom - bounds.top + 'px';
                var left = (bounds.left + (window.scrollX || window.pageXOffset)) + 'px';
                var top = (bounds.top + (window.scrollY || window.pageYOffset)) + 'px';
                var width = bounds.right - bounds.left + 'px';
                selectedElementInner.style.width = width;
                selectedElementInner.style.height = height;
                selectedElementInner.style.left = left;
                selectedElementInner.style.top = top;
            },
            /**
             * 取消元素高亮
             */
            removeElementHighLightOutline: function() {
                var shadowRoot = this.shadowRoot;
                var elements = shadowRoot.querySelectorAll('nz-editor-autotrack-selected-element');
                Array.from(elements).forEach(function(element) {
                    element.parentNode.removeChild(element);
                }, this);
            },
            setElementHighLight: function() {
                try {
                    var that = this;
                    that.removeElementHighLightOutline();
                    var events = JSON.parse(JSON.stringify(this.getEvents()));
                    if (!!oneEvent) {
                        events.push(oneEvent);
                    }
                    var elements = getElementsFromEvents(events);
                    Array.from(elements).forEach(function(element) {
                        that.createElementHighLightOutline(element);
                    }, this);
                } catch (error) {
                    console.log(error);
                }
            },
            /**
             * 设置元素选择模式
             */
            setSelectionType: function(type) {
                oneEvent['selection_type'] = type;
            },
            resetSelection: function() {
                oneEvent['selection_type'] = type;
            },
            /**
             * 设置元素选择模式按钮相关事件
             */
            setModeButton: function() {
                var that = this;
                var shadowRoot = this.shadowRoot;
                this.getCenter().innerHTML = centerButtonsHtml();
                nzEvent(shadowRoot.querySelector('.nz-editor-autotrack-mode.nz-editor-autotrack-similar'))
                    .add('click', function() {
                        that.setSelectionType('similar');
                        that.setModeButton();
                        that.removeHighlight();
                        that.removePromptModal();
                        nzEditorInspector.stop();
                        oneEvent['similar_css_selector'] = generateGeneralCssSelector(document.querySelector(element_defs_bak[0]));
                    })
                nzEvent(shadowRoot.querySelector('.nz-editor-autotrack-mode.nz-editor-autotrack-manual'))
                    .add('click', function() {
                        that.setSelectionType('manual');
                        oneEvent['element_defs'] = JSON.parse(JSON.stringify(element_defs_bak));
                        that.setModeButton();
                        that.removeHighlight();
                        that.removePromptModal();
                        nzEditorInspector.restart(true);
                    })
                nzEvent(shadowRoot.querySelector('.nz-editor-autotrack-mode.nz-editor-autotrack-custom'))
                    .add('click', function() {
                        that.setSelectionType('custom');
                        that.createPromptModal();
                        that.setModeButton();
                        nzEditorInspector.stop();
                    })
                that.setElementHighLight();
            },
            /**
             * 设置导航左侧元素选选择提示
             */
            selectElement: function() {
                this.hideModal();
                element_defs_bak = JSON.parse(JSON.stringify(oneEvent['element_defs']));
                selectionMode_bak = oneEvent['selection_type'];
                var dom = document.querySelector(element_defs_bak[0]);
                oneEvent['similar_css_selector'] = !!dom ? generateGeneralCssSelector(dom) : '';
                var eles = getElementsByCsspath();
                this.getLeft().innerHTML = `<div class="nz-editor-app-loader-help">` + eles.length + `个元素被选择</div>`;
                this.getRightButtons().innerHTML = selectElementCancelButtonHtml;
                this.setModeButton();
            },
            /**
             * 选择属性
             */
            selectProperty: function() {
                this.hideModal();
                this.getLeft().innerHTML = `<div class="nz-editor-app-loader-help">点击任意元素来为你的事件添加属性</div>`;
                this.getRightButtons().innerHTML = selectPropCancelButtonHtml;
            },
            /**
             * 创建导航栏
             */
            create: function() {
                this.getLeft().innerHTML = helpHtml;
                this.getCenter().innerHTML = '';
                this.getRightButtons().innerHTML = cancelButtonHtml;
                this.removeSelectElementLayer();
            },
            /**
             * 点击导航栏取消按钮事件
             */
            cancel: function() {
                this.getLeft().innerHTML = logoHtml;
                this.getCenter().innerHTML = '';
                this.getRightButtons().innerHTML = buttonsHtml;
                oneEvent = null;
                action = '';
                this.removeModal();
                this.removeHighlight();
                this.removePromptModal();
                this.setElementHighLight();
            },
            /**
             * 移除高亮
             */
            removeHighlight: function(isProp) {
                var shadowRoot = this.shadowRoot;
                var highlightEleName = isProp ? 'nz-editor-autotrack-select-prop-layer' : 'nz-editor-autotrack-element';
                var highlight = shadowRoot.querySelector(highlightEleName);
                if (!!highlight) {
                    shadowRoot.removeChild(highlight);
                    selectPropTarget = null;
                }
            },
            /**
             * 移除事件选择弹出框
             */
            removeModal: function(isProp) {
                var shadowRoot = this.shadowRoot;
                var modalName = isProp ? 'nz-editor-select-prop-modal' : 'nz-editor-select-modal';
                var selectModal = shadowRoot.querySelector(modalName);
                if (!!selectModal) {
                    shadowRoot.removeChild(selectModal);
                }
            },
            /**
             * 隐藏事件选择弹出框
             */
            hideModal: function(isProp) {
                var shadowRoot = this.shadowRoot;
                var modalName = isProp ? 'nz-editor-select-prop-modal' : 'nz-editor-select-modal';
                var selectModal = shadowRoot.querySelector(modalName);
                if (!!selectModal) {
                    selectModal.style.display = 'none';
                }
            },
            showModal: function(isProp) {
                var shadowRoot = this.shadowRoot;
                var modalName = isProp ? 'nz-editor-select-prop-modal' : 'nz-editor-select-modal';
                var selectModal = shadowRoot.querySelector(modalName);
                if (!!selectModal) {
                    if (!isProp) {
                        this.setEleAndPropCount();
                    }
                    selectModal.style.display = 'block';
                }
            },
            /**
             * 创建自动选择元素模式的选择框
             */
            createSelectElementLayer: function(selectProp) {
                var shadowRoot = this.shadowRoot;
                var layerTagName = selectProp ? 'nz-editor-autotrack-select-prop-layer' : 'nz-editor-autotrack-select-element-layer';
                var layerClassName = selectProp ? '.nz-editor-autotrack-select-prop-highlight-layer' : '.nz-editor-autotrack-select-element-highlight-layer';
                var inspectorOutline = shadowRoot.querySelector(layerTagName);
                if (!!!inspectorOutline) {
                    inspectorOutline = document.createElement(layerTagName);
                    shadowRoot.appendChild(inspectorOutline);
                }
                return inspectorOutline.shadowRoot.querySelector(layerClassName);
            },
            /**
             * 删除自动选择元素模式的选择框
             */
            removeSelectElementLayer: function(isProp) {
                var shadowRoot = this.shadowRoot;
                var highlightEleName = isProp ? 'nz-editor-autotrack-select-prop-layer' : 'nz-editor-autotrack-select-element-layer';
                var highlight = shadowRoot.querySelector(highlightEleName);
                if (!!highlight) {
                    shadowRoot.removeChild(highlight);
                }
            },
            /**
             * 设置高亮框的位置
             */
            setSelectHighlightLayerPos: function(layer, ele) {
                var bounds = nztrackUtil.getElementBounds(ele);
                var height = bounds.bottom - bounds.top + 'px';
                var left = (bounds.left + (window.scrollX || window.pageXOffset)) + 'px';
                var top = (bounds.top + (window.scrollY || window.pageYOffset)) + 'px';
                var width = bounds.right - bounds.left + 'px';
                layer.style.width = width;
                layer.style.height = height;
                layer.style.left = left;
                layer.style.top = top;
                layer.style.transition = "opacity .5s";
                layer.style.opacity = "0.4";
            },
            /**
             * 创建高亮
             */
            createHighlight: function() {
                var shadowRoot = this.shadowRoot;
                var inspectorOutline = shadowRoot.querySelector('nz-editor-autotrack-element');
                if (!!!inspectorOutline) {
                    inspectorOutline = document.createElement('nz-editor-autotrack-element');
                    shadowRoot.appendChild(inspectorOutline);
                }
                return inspectorOutline.shadowRoot.querySelector('.nz-editor-autotrack-element-highlight');
            },
            /**
             * 设置高亮位置
             */
            setHighlightPos: function(highlight, ele) {
                var bounds = nztrackUtil.getElementBounds(ele);
                var height = bounds.bottom - bounds.top + 'px';
                var left = (bounds.left + (window.scrollX || window.pageXOffset)) + 'px';
                var top = (bounds.top + (window.scrollY || window.pageYOffset)) + 'px';
                var width = bounds.right - bounds.left + 'px';
                highlight.style.width = width;
                highlight.style.height = height;
                highlight.style.left = left;
                highlight.style.top = top;
                highlight.style.transition = "opacity .5s";
                highlight.style.opacity = "0.4";
            },
            /**
             * 设置弹出框位置
             */
            setModalPos: function(modal, ele) {
                var bounds = nztrackUtil.getElementBounds(ele);
                var height = bounds.bottom - bounds.top;
                var left = (bounds.left + (window.scrollX || window.pageXOffset));
                var top = (bounds.top + (window.scrollY || window.pageYOffset));
                modal.style.left = left + 'px';
                modal.style.top = (top + height) + "px";
            },
            /**
             * 设置添加事件弹出框中的元素和属性个数
             */
            setEleAndPropCount: function() {
                var that = this;
                var shadowRoot = this.shadowRoot;
                var selectModal = shadowRoot.querySelector('nz-editor-select-modal');
                var elements = getElementsFromEvents(oneEvent);
                var elelist = selectModal.shadowRoot.querySelector('.nz-editor-select-dom-modal-similar-elements > .nz-editor-added');
                elelist.innerHTML = "已经添加" + elements.length + "个元素";
                nzEvent(elelist).add('click', function() {
                    that.selectElement();
                });

                var proplist = selectModal.shadowRoot.querySelector('.nz-editor-select-dom-modal-properties > .nz-editor-added');
                proplist.innerHTML = "已经添加" + oneEvent.properties.length + "个属性";
                nzEvent(proplist).add('click', function() {
                    that.selectProperty();
                    if (oneEvent.properties.length > 0) {
                        editPropIndex = 0;
                        var firstProp = oneEvent.properties[editPropIndex];
                        var el = document.querySelector(firstProp['value']);
                        var selectModal = that.createModal(true, el);
                        that.setModalPos(selectModal, el);
                        var selectModal = shadowRoot.querySelector('nz-editor-select-prop-modal');
                        selectModal.shadowRoot.querySelector('div > div.nz-editor-select-dom-modal-save-row > input').value = firstProp.name;
                    }

                    nzEditorInspector.restart(true, true);
                });
            },
            /**
             * 创建模态框
             */
            createModal: function(isProp, target) {
                var modalName = '';
                var modalClass = '.nz-editor-select-dom-modal';
                if (isProp) {
                    selectPropTarget = target;
                    modalName = 'nz-editor-select-prop-modal';
                } else {
                    modalName = 'nz-editor-select-modal';
                }
                var shadowRoot = this.shadowRoot;
                var selectModal = shadowRoot.querySelector(modalName);
                if (!!!selectModal) {
                    selectModal = document.createElement(modalName);
                    shadowRoot.appendChild(selectModal);
                }
                if (!isProp) {
                    this.setEleAndPropCount();
                }
                return selectModal.shadowRoot.querySelector(modalClass);
            },
            /**
             * 创建输入模态框
             */
            createPromptModal: function() {
                var shadowRoot = this.shadowRoot;
                var selectModal = shadowRoot.querySelector('nz-editor-prompt');
                if (!!!selectModal) {
                    selectModal = document.createElement('nz-editor-prompt');
                    shadowRoot.appendChild(selectModal);
                }
                var value = oneEvent['custom_css_selector'];
                selectModal.shadowRoot.querySelector('.nz-editor-prompt-modal-input').value = value;
                return selectModal.shadowRoot.querySelector('.nz-editor-prompt-modal');
            },
            /**
             * 删除输入模态框
             */
            removePromptModal: function() {
                var shadowRoot = this.shadowRoot;
                var highlight = shadowRoot.querySelector('nz-editor-prompt');
                if (!!highlight) {
                    shadowRoot.removeChild(highlight);
                }
            },
            /**
             * 渲染已经创建的事件高亮
             */
            renderCreatedEventHighlight: function() {
                var events = allEventData['events'];
                Array.from(events).forEach(function(element) {

                }, this);
            },
            /**
             * 删除事件
             */
            deleteEvent: function(id) {
                var that = this;
                nztrackUtil.delEvent(_token, {
                    e_id: id
                }, function(res) {
                    that.remove();
                    document.body.appendChild(document.createElement('nz-editor-loader'));
                });
            },
            /**
             * 保存事件
             */
            saveEvent: function() {
                var that = this;
                var shadowRoot = this.shadowRoot;
                var selectModal = shadowRoot.querySelector('nz-editor-select-modal');
                var name = selectModal.shadowRoot.querySelector('.nz-editor-select-dom-modal-save-row-input').value;
                name = name.trim();
                if (action != 'edit' && !this.checkEventName(name)) {
                    alert('事件名已经存在');
                    return false;
                }
                oneEvent['name'] = name;
                if (oneEvent['selection_type'] == 'similar') {
                    oneEvent['similar_css_selector'] = oneEvent['element_defs'][0];
                }
                console.log(oneEvent);
                nzEditorInspector.stop();
                nztrackUtil.saveEvent(_token, oneEvent, function(res) {
                    if (res && res.original) {
                        if (res.original.status == 0) {
                            if (action != 'edit') {
                                allEventData.events.push(oneEvent);
                            }
                            that.setElementHighLight();
                            that.cancel();
                        }
                    }
                }, action);
            },
            /**
             * 设置事件
             */
            setEvent: function(target, selectEle) {
                var csspath = generateCssSelector(target);
                if (!selectEle) {
                    oneEvent['element_defs']['push'](csspath);
                } else {
                    var element_defs = oneEvent['element_defs'];
                    if (!element_defs.includes(csspath)) {
                        oneEvent['element_defs']['push'](csspath);
                    } else {
                        oneEvent['element_defs']['remove'](csspath);
                        this.removeSelectElementLayer();
                    }
                    this.setElementHighLight();
                }
                oneEvent['custom_css_selector'] = oneEvent['similar_css_selector'];
            },
            setProp: function() {
                var shadowRoot = this.shadowRoot;
                var selectPropModal = shadowRoot.querySelector('nz-editor-select-prop-modal');
                var name = selectPropModal.shadowRoot.querySelector('.nz-editor-select-dom-modal-save-row-input').value;
                if (!name) {
                    alert('请填写属性名称');
                    return false;
                }
                if (action != "edit") {
                    oneEvent['properties']['push']({
                        name: name.trim(),
                        value: generateCssSelector(selectPropTarget),
                        type: 'selector'
                    });
                } else {
                    oneEvent['properties'][editPropIndex] = {
                        name: name.trim(),
                        value: generateCssSelector(selectPropTarget),
                        type: 'selector'
                    }
                }

                selectPropTarget = null;
                this.removeModal(true);
                this.showModal();
                this.removeHighlight(true);
                nzEditorInspector.restart();
            },
            /**
             * 设置自定义csspath
             */
            setCustomCsspath: function() {
                try {
                    var shadowRoot = this.shadowRoot;
                    var promptModal = shadowRoot.querySelector('nz-editor-prompt');
                    var value = promptModal.shadowRoot.querySelector('.nz-editor-prompt-modal-input').value;
                    document.querySelectorAll(value);
                    oneEvent['custom_css_selector'] = value;
                    return true;
                } catch (error) {
                    alert('填写的css选择器无法获取到页面元素');
                    return false;
                }
            },
            setEventCancel: function() {
                oneEvent['element_defs'] = element_defs_bak;
                this.setElementHighLight();
            }
        }
    })

    /**
     * 为body和所有fixed定位的padding-top增加65
     * @param {*} hostElements 
     */
    var shiftHostPageDown = function(hostElements) {
        var bodyCss = getComputedStyle(document.body);
        var newPaddingTop = (parseInt(bodyCss[`padding-top`], 10) || 0) + 65;
        document.body.style.cssText += `; padding-top:` + newPaddingTop + `px !important; transition: padding 300ms cubic-bezier(0, 0, 0, 0.97);`;

        var hasAncestor = function(el, cssProp, vals) {
            for (var curEl = el.parentNode; curEl.parentNode; curEl = curEl.parentNode) {
                var parentCss = getComputedStyle(curEl);
                if (vals.includes(parentCss[cssProp])) {
                    return true;
                }
            }
            return false;
        };

        Array.from(hostElements).forEach(function(el) {
            var css = getComputedStyle(el);
            if (css.position === `fixed` || (css.position === `absolute` && !hasAncestor(el, `position`, [`absolute`, `fixed`, `relative`]))) {
                var origBodyStyles = document.body.style.cssText;
                var origElBounds = el.getBoundingClientRect();
                document.body.style[`padding-top`] = (parseInt(document.body.style[`padding-top`], 10) || 0) + 1 + `px`;
                var newElBounds = el.getBoundingClientRect();
                document.body.style.cssText = origBodyStyles;
                if (origElBounds.top === newElBounds.top) {
                    var newTop = (parseInt(css.top, 10) || 0) + 65;
                    el.style.cssText += `; top:` + newTop + `px !important;`;
                }
            }
        });
    };

    var update = function() {
        var editorLoader = document.querySelector('nz-editor-loader');
        var selectedElements = editorLoader.shadowRoot.querySelectorAll('nz-editor-autotrack-selected-element');
        Array.from(selectedElements).forEach(function(element) {
            var selectedElementInner = element.shadowRoot.querySelector('.nz-editor-autotrack-selected-element-highlight');
            var bounds = nztrackUtil.getElementBounds(selectedElementInner);
            var height = bounds.bottom - bounds.top + 'px';
            var left = (bounds.left + (window.scrollX || window.pageXOffset)) + 'px';
            var top = (bounds.top + (window.scrollY || window.pageYOffset)) + 'px';
            var width = bounds.right - bounds.left + 'px';
            selectedElementInner.style.width = width;
            selectedElementInner.style.height = height;
            selectedElementInner.style.left = left;
            selectedElementInner.style.top = top;
        });

    }

    window.nzLoader = {
        init: function(token) {
            _token = token;
            if (!(document && document.body)) {
                console.log('document还没有准备就绪, 500毫秒后重试...');
                var that = this;
                setTimeout(function() { that.init(token); }, 500);
                return false;
            }

            var eLoader = document.body.appendChild(document.createElement('nz-editor-loader'));
            if (eLoader) {
                shiftHostPageDown(document.querySelectorAll('*')); //为body和所有fixed定位的padding-top增加65
                nztrackUtil.getEventsByToken(token, function(res) {
                    allEventData['events'] = res.elist;
                    eLoader.setElementHighLight();
                });
                window.addEventListener(`resize`, function() {
                    update();
                });
                window.addEventListener(`scroll`, function() {
                    update();
                }, true);
            }
        }
    }
}(window, document));