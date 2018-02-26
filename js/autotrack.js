+(function(window, document) {
    var nzEvent = window.nzEvent;
    // 指定一些全局变量
    var ELEMENT_NODE = 1;
    var TEXT_NODE = 3;
    var LIB_VERSION = '1.0';

    var projectId = "";
    var uuid = nztrackUtil.getUUID();
    var suid = ""; //来源系统用户id， 如手机号、 邮箱等
    var suidt = ""; //来源系统用户id来源类型 微博 / 微信 / 手机号

    var _isTag = function(el, tag) {
        return el && el.tagName && el.tagName.toLowerCase() === tag.toLowerCase();
    }

    /**
     * 要监测的DOM事件
     */
    var _bindEvent = function(element, handler) {
        if (!element || _isTag(element, 'html') || element.nodeType !== ELEMENT_NODE) {
            return false;
        }
        var listenType = 'click';
        var tag = element.tagName.toLowerCase();
        switch (tag) {
            case 'html':
                return false;
            case 'form':
                listenType = 'submit';
                break;
            case 'input':
                if (['button', 'submit'].indexOf(element.getAttribute('type')) !== -1) {
                    listenType = 'change';
                }
                break;
            case 'select':
            case 'textarea':
                listenType = 'change';
                break;
        }
        nzEvent(element).remove(listenType, handler).add(listenType, handler);
    }

    /**
     * 获得文本框的值
     */
    var _getInputValue = function(input) {
        var value = null;
        var type = input.type.toLowerCase();
        switch (type) {
            case 'checkbox':
                if (input.checked) {
                    value = [input.value];
                }
                break;
            case 'radio':
                if (input.checked) {
                    value = input.value;
                }
                break;
            default:
                value = input.value;
                break;
        }
        return value;
    }

    /**
     * 获得下拉框的值
     */
    var _getSelectValue = function(select) {
        var value;
        if (select.multiple) {
            var values = [];
            select.querySelectorAll('[selected]').forEach(function(option) {
                values.push(option.value);
            })
            value = values;
        } else {
            value = select.value;
        }
        return value;
    }

    /**
     * 监测是否包含属性
     */
    var _includeProperty = function(input, value) {
        if (value === null) {
            return false;
        }

        // 排除隐藏域和密码框字段
        var type = input.type || '';
        switch (type.toLowerCase()) {
            case 'hidden':
                return false;
            case 'password':
                return false;
        }

        // 排除包含敏感信息的字段
        var name = input.name || input.id || '';
        var sensitiveNameRegex = /^cc|cardnum|ccnum|creditcard|csc|cvc|cvv|exp|pass|seccode|securitycode|securitynum|socialsec|socsec|ssn/i;
        if (sensitiveNameRegex.test(name.replace(/[^a-zA-Z0-9]/g, ''))) {
            return false;
        }

        if (typeof value === 'string') {
            // 检查是否是卡号
            // https://www.safaribooksonline.com/library/view/regular-expressions-cookbook/9781449327453/ch04s20.html
            var ccRegex = /^(?:(4[0-9]{12}(?:[0-9]{3})?)|(5[1-5][0-9]{14})|(6(?:011|5[0-9]{2})[0-9]{12})|(3[47][0-9]{13})|(3(?:0[0-5]|[68][0-9])[0-9]{11})|((?:2131|1800|35[0-9]{3})[0-9]{11}))$/;
            if (ccRegex.test((value || '').replace(/[\- ]/g, ''))) {
                return false;
            }
            var ssnRegex = /(^\d{3}-?\d{2}-?\d{4}$)/;
            if (ssnRegex.test(value)) {
                return false;
            }
        }
        return true;
    }

    /**
     * 获得表单字段值
     */
    var _getFormFieldValue = function(field) {
        var val;
        switch (field.tagName.toLowerCase()) {
            case 'input':
                val = _getInputValue(field);
                break;
            case 'select':
                val = _getSelectValue(field);
                break;
            default:
                val = field.value || field.textContent;
                break;
        }
        return _includeProperty(field, val) ? val : null;
    }

    /**
     * 获得表单字段属性
     */
    var _getFormFieldProperties = function(form) {
        var formFieldProps = {};
        form.elements.forEach(function(field) {
            var name = field.getAttribute('name') || field.getAttribute('id');
            if (name !== null) {
                var val = _getFormFieldValue(field);
                if (_includeProperty(field, val)) {
                    var prevFieldVal = formFieldProps[name];
                    if (prevFieldVal !== undefined) { // 合并相同属性名的值
                        formFieldProps[name] = [].concat(prevFieldVal, val);
                    } else {
                        formFieldProps[name] = val;
                    }
                }
            }
        }, this);
        return formFieldProps;
    }

    /**
     * 导出自定义属性值
     */
    var _extractCustomPropertyValue = function(customProperty) {
        var propValues = [];
        document.querySelectorAll(customProperty).forEach(function(matchedElem) {
            var val = "";
            if (['input', 'select'].indexOf(matchedElem.tagName.toLowerCase()) > -1) {
                val = matchedElem['value'];
            } else if (matchedElem['textContent']) {
                val = matchedElem['textContent'];
            }
            if (_includeProperty(matchedElem, val)) {
                propValues.push(val);
            }
        });
        return propValues.join(', ');
    }

    var _getDefaultProperties = function() {
        return {
            "st": nztrackUtil.getStartTm(),
            "uuid": uuid,
            "suid": suid, //来源系统用户id， 如手机号、 邮箱等
            "suidt": suidt, //来源系统用户id来源类型 微博 / 微信 / 手机号
            "os": nzdetector.os.name,
            "os_version": nzdetector.os.version,
            "browser": nzdetector.browser.name,
            "browser_version": nzdetector.browser.version,
            "refer": document.referrer,
            "dev": nzdetector.device.name,
            "dev_version": (nzdetector.device.fullVersion == "-1" || nzdetector.device.fullVersion == "null" ? "" : nzdetector.fullVersion.name),
            "is_mobile": nztrackUtil.isMobile(),
            "screen ": screen.width + "*" + screen.height,
            "lib_type": "web",
            "lib_version": LIB_VERSION,
            "host": location.host,
            "Imei": "",
            "Idfa": "",
            "sh": scrollY, //"滚动宽高"
            "current_url": location.href, //"网站URL"
            "pathname": location.pathname,
            "tt": document.title,
            "net_type": ""
        }
    }

    /**
     * 获得自定义属性
     */
    var _getCustomProperties = function(dom, properties) {
        var _props = {};
        properties.forEach(function(property) {
            var type = property['type'];
            var name = property['name'];
            var value = property['value'];
            switch (type) {
                case 'e-obj-attr':
                    _props[name] = dom.getAttribute(value);
                    break;
                case 'selector':
                    _props[name] = _extractCustomPropertyValue(value);
                    break;
                case 'jsvar':
                    try {
                        _props[name] = eval(value);
                    } catch (error) {
                        // console.log(error);
                        _props[name] = '';
                    }
                    break;
                default:
                    _props[name] = value;
                    break;
            }
        });
        return _props;
    }

    var _bindEventByCssPath = function(csspath, event) {
        var dom = document.querySelector(csspath);
        if (!dom) {
            setTimeout(function() { _bindEventByCssPath(csspath, event); }, 500);
            return false;
        }
        _bindEvent(dom, function(e) {
            var props = {
                itemid: '',
                properties: _getCustomProperties(dom, event['properties'])
            };
            Object.assign(props, _getDefaultProperties());
            nztrackUtil.saveTrackEvent({
                e_id: event['e_id'],
                event: event['name'],
                p_id: projectId,
                properties: props
            });
        });
    }

    /**
     * 通过csspath绑定监测事件及属性
     * @param {*} cssPaths 
     * @param {*} properties 
     * @param {*} event 
     */
    var _bindEventToDomByCssPath = function(event) {
        var cssPaths = getCssPath(event);
        if (!!cssPaths) {
            cssPaths.forEach(function(csspath) {
                _bindEventByCssPath(csspath, event);
            });
        }
    }

    var getCssPath = function(event) {
        var cssPaths = "";
        var selection_type = event['selection_type'];
        switch (selection_type) {
            //自动
            case 'custom':
                if (event['custom_css_selector']) {
                    cssPaths = event['custom_css_selector'].split(',');
                }
                // cssPaths = event['custom_css_selector'];
                break;
            case 'similar':
                if (event['similar_css_selector']) {
                    cssPaths = event['similar_css_selector'].split(',');
                }
                // cssPaths = event['similar_css_selector'];
                break;
            default:
                // cssPaths = event['element_defs']['join'](',');
                break;
        }
        return cssPaths;
    }

    window.nzautotrack = {
        init: function(res) {
            try {
                projectId = res.pid;
                var events = res.elist;
                if (events && nztrackUtil.isArray(events)) {
                    events.forEach(function(event) {
                        _bindEventToDomByCssPath(event);
                    });
                }
            } catch (error) {
                _bindEventToDomByCssPath();
            }
        },
        track: function(token, event) {
            if (token && event) {
                _bindEventToDomByCssPath(event);
            }
        }
    };
}(window, document))