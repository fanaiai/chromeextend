+(function($, root) {
    var default_option = {
        ignoreallattributes: true,
        ignore: {
            class: function(name, value) {

            },
            id: function(name, value) {

            },
            attribute: function(name, value) {

            }
        }
    };
    var CssSelector = function(options) {
        this.options = $.extend(default_option, options || {});
        this.init();
        return this;
    }
    CssSelector.prototype = {
        constructor: CssSelector,
        init: function() {},
        /**
         * 获取css全路径
         *
         * @param  {HTMLElement} el - [description]
         */
        getFullSelector: function(el) {
            var csspath = [];
            for (; el && el.nodeType == 1 && el.nodeName != 'HTML'; el = el.parentNode) {
                csspath.unshift(el.nodeName + getAttribute(el, this.options));
            }
            console.log(csspath);
        },
        /**
         * 获取唯一路径
         *
         * @param  {HTMLElement} el - [description]
         */
        getUniqueSelector: function(el) {
            var csspath = [];
            for (; el && el.nodeType == 1 && el.nodeName != 'HTML'; el = el.parentNode) {
                var nodePath = el.nodeName + getAttribute(el, this.options);
                if ($(nodePath + ">" + csspath.join('>')).length <= 1) {
                    csspath.unshift(nodePath + getPseudo(el));
                    break;
                } else {
                    csspath.unshift(nodePath + getPseudo(el));
                }
            }
            path = {
                patharray: csspath,
                pathstring: csspath.join('>')
            }
            return path;
        },
        getMultiSelector: function(el) {

        },
        /**
         * 获取同类元素的通用css路径
         *
         * @return {string}      path       - [路径对象]
         */
        getSimilarSelector: function(path) {
            var similarpath = {};
            var childtags = [];
            for (var i = path.patharray.length; i >= 0; i--) {
                var $el = $(path.patharray.slice(0, i).join('>'));
                if ($el.siblings().length > 0) {
                    if (i <= 1) {
                    	similarpath=(this.getUniqueSelector($el.parent()[0]));
                    } else {
                        similarpath.patharray = path.patharray.slice(0, i - 1);
                    }
                    childtags.unshift($(path.patharray.slice(0, i).join('>'))[0].tagName)
                    break;
                } else {
                    childtags.unshift($(path.patharray.slice(0, i + 1).join('>'))[0].tagName)
                }
            }
            similarpath.patharray = similarpath.patharray.concat(childtags);
            similarpath.pathstring = similarpath.patharray.join('>');
            return similarpath;
        },
        /**
         * 获取同类元素的通用css路径数组
         *
         * @return {string}      path       - [路径对象]
         */
        getSimilarSelectorList:function(path){
        	var that=this;
        	var paths=[];
        	var similarpath=this.getSimilarSelector(path);
        	$.each($(similarpath.pathstring),function(i,ele){
        		paths.push(that.getUniqueSelector(ele));
        	})
        	return paths;
        }
    }

    function getAttribute(el, options) {
        var attributes = el.attributes;
        var attributestring = '';
        $.each(attributes, function(i, e) {
            if (e.name == 'class') {
                attributestring = attributestring + '.' + e.value.trim().replace(/\s+|\s+/g, '.');
            } else if (e.name == 'id') {
                attributestring = attributestring + '#' + e.value.trim().replace(/\s+|\s+/g, '#');
            } else if (!options.ignoreallattributes) {
                attributestring = attributestring + '[' + e.name + '=' + e.value + ']';
            }
        })
        return attributestring;
    }

    function getPseudo(el) {
        var index = $(el).index() + 1;
        return ':nth-child(' + index + ')';
    }
    window.CssSelector = CssSelector;
})(jQuery, window)