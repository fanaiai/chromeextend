+(function(window, undefined) {
    var nzEvent = window.nzEvent = function(element) {
        return new nzEvent.fn.init(element);
    };

    // nzEvent 对象构建
    nzEvent.fn = nzEvent.prototype = {
        init: function(element) {
            this.element = (element && element.nodeType == 1) ? element : document;
        },
        /**
         * 添加事件监听
         * 
         * @param {String} type 监听的事件类型
         * @param {Function} callback 回调函数
         */
        add: function(type, callback, useCapture) {
            var _that = this;
            if (_that.element.addEventListener) {
                //监听IE9，谷歌和火狐
                _that.element.addEventListener(type, callback, (useCapture || false));
            } else if (_that.element.attachEvent) {
                _that.element.attachEvent("on" + type, callback);
            } else {
                _that.element["on" + type] = callback;
            }
            return _that;
        },

        /**
         * 移除事件监听
         * 
         * @param {String} type 监听的事件类型
         * @param {Function} callback 回调函数
         */

        remove: function(type, callback, useCapture) {
            var _that = this;
            if (_that.element.removeEventListener) {
                //监听IE9，谷歌和火狐
                _that.element.removeEventListener(type, callback, (useCapture || false));
            } else if (_that.element.detachEvent) {
                _that.element.detachEvent("on" + type, callback);
            } else {
                delete _that.element["on" + type];
            }
            return _that;
        }
    }
    nzEvent.fn.init.prototype = nzEvent.fn;
})(window);