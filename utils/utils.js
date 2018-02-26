+(function(window, document) {
    window.nztrackUtil = {
        delEvent: function(token, oneEvent, success, fail) {
            this.jsonp(window.nztrackConfigs.get("delEventUrl") + Base64.encode(JSON.stringify({
                token: token,
                data: oneEvent
            })), success, fail, 'nztrackcbdata');
        },
        saveTrackEvent: function(event) {
            var img = new Image();
            img.src = window.nztrackConfigs.get("saveTrackEventUrl") + Base64.encode(JSON.stringify(event));
        },
        saveEvent: function(token, oneEvent, success, action, fail) {
            var url = (action == 'edit' ? window.nztrackConfigs.get("editEventUrl") : window.nztrackConfigs.get("saveEventUrl"));
            this.jsonp(url + Base64.encode(JSON.stringify({
                token: token,
                source: location.href,
                data: oneEvent
            })), success, fail, 'nztrackcbdata');
        },
        getEventsByToken: function(token, callback) {
            var that = this;
            var url = window.nztrackConfigs.get("getEventsByTokenUrl") + token;
            this.jsonp(url, function(res) {
                if (res && res.original) {
                    callback({ 'elist': [], 'pid': '' });
                } else {
                    callback(res);
                }
            }, function() {
                callback({ 'elist': [], 'pid': '' });
            }, 'nztrackcbdata');
        },
        getProjectByToken: function(token, success, fail) {
            var url = window.nztrackConfigs.get("getProjectByTokenUrl") + token;
            this.jsonp(url, success, fail, 'nztrackcbdata');
        },
        /**
         * 返回指定变量的数据类型
         * @param  {Any} data
         * @return {String}
         */
        type: function(data) {
            return Object.prototype.toString.call(data).slice(8, -1);
        },
        /**
         * 判断两个数组是否相等
         * 浅度相等：两数组toString一样
         * 深度相等的判断规则：
         *   1.长度相等
         *   2.俩数组的每一项：
         *      若为数组：参考本函数规则。
         *      若为对象：参考equalObject的规则。
         *      其他的数据类型，要求===判断为true
         * @param  {[type]} arr1
         * @param  {[type]} arr2
         * @param  {[type]} deepCheck
         * @return {[type]}
         */
        equalArray: function(arr1, arr2, deepCheck) {
            if (arr1 === arr2) {
                return true;
            };
            // 长度不等，不用继续判断
            if (arr1.length !== arr2.length) {
                return false;
            };
            // 浅度检查
            if (!deepCheck) {
                return arr1.toString() === arr2.toString();
            };
            // 判断每个基本数据类型是否一样
            var type1, type2; // 数组每一项的数据类型
            for (var i = 0; i < arr1.length; i++) {
                type1 = this.type(arr1[i]);
                type2 = this.type(arr2[i]);

                // 数据类型不一样，无需判断
                if (type1 !== type2) {
                    return false;
                };

                if (type1 === "Array") {
                    if (!this.equalArray(arr1[i], arr2[i], true)) {
                        return false;
                    };
                } else if (type1 === 'Object') {
                    if (!this.equalObject(arr1[i], arr2[i], true)) {
                        return false;
                    };
                } else if (arr1[i] !== arr2[i]) {
                    return false;
                };
            };
            return true;
        },
        /**
         * 对比两个function是否一样
         * 主要对比两者toString是否一样，
         * 对比会去掉函数名进行对比，其它哪怕差个回车都会返回false
         * 
         * @param  {[type]} fn1
         * @param  {[type]} fn2
         * @return {[type]}
         */
        equalFunction: function(fn1, fn2) {
            var type1 = this.type(fn1),
                type2 = this.type(fn2);
            if (type1 !== type2 || type1 !== 'Function') {
                return false;
            };
            if (fn1 === fn2) {
                return true;
            };
            var reg = /^function[\s]*?([\w]*?)\([^\)]*?\){/;
            var str1 = fn1.toString().replace(reg, function($, $1) {
                return $.replace($1, "");
            });
            var str2 = fn2.toString().replace(reg, function($, $1) {
                return $.replace($1, "");
            });

            if (str1 !== str2) {
                return false;
            };
            return true;
        },
        /**
         * 判断两个对象是否相等
         * 浅度判断：
         *      1.只判断obj的第一层属性总数是否一样
         *      2.值的===判断是否为真
         * 深度判断：
         *      值为对象，参考本规则
         *      值为数组，参考equalArray的深度判断
         *      值为其他类型，用===判断
         * @param  {[type]} obj1
         * @param  {[type]} obj2
         * @param  {[type]} deepCheck
         * @return {[type]}
         */
        equalObject: function(obj1, obj2, deepCheck) {
            if (obj1 === obj2) {
                return true;
            };
            // 属性总数不等，直接返回false
            var size1 = 0;
            for (var key in obj1) {
                size1++;
            }
            var size2 = 0;
            for (var key in obj2) {
                size2++;
            }
            if (size1 !== size2) {
                return false;
            };

            if (!deepCheck) { // 浅度判断
                for (var key in obj1) {
                    if (obj1[key] !== obj2[key]) {
                        return false;
                    };
                }
                return true;
            };
            var type1, type2;
            for (var key in obj1) {
                type1 = this.type(obj1[key]);
                type2 = this.type(obj2[key]);
                if (type1 !== type2) {
                    return false;
                };
                if (type1 === "Object") {
                    if (!this.equalObject(obj1[key], obj2[key], true)) {
                        return false;
                    };
                } else if (type1 === "Array") {
                    if (!this.equalArray(obj1[key], obj2[key], true)) {
                        return false;
                    };
                } else if (obj1[key] !== obj2[key]) {
                    return false;
                };
            }
            return true;
        },
        isArray: function(o) {
            try {
                return this.type(o) === 'Array';
            } catch (error) {
                return false;
            }
        },
        inArray: function(v, arr) {
            var len = arr.length;
            for (var i = 0; i < len; i++) {
                if (v == arr[i]) {
                    return true;
                }
            }
            return false;
        },
        jsonp: function(url, success, fail, callbackName) {
            if (callbackName) {
                callbackName += this.shuffUUID();
                window[callbackName] = function(data) {
                    typeof(success) == 'function' && success(data);
                    delete window[callbackName];
                }
            }
            var head = document.getElementsByTagName('head')[0];
            var script = document.createElement('script');
            script.type = 'text/javascript';
            script.src = url + '?callback=' + callbackName;
            script.async = true;
            script.onload = script.onreadystatechange = function() {
                if ((!script.readyState || script.readyState === "loaded" || script.readyState === "complete")) {
                    script.onload = script.onreadystatechange = null;
                    if (head && script.parentNode) {
                        head.removeChild(script);
                    }
                } else {
                    typeof(fail) == 'function' && fail();
                }
            };
            script.onerror = function() {
                typeof(fail) == 'function' && fail();
            }
            head.appendChild(script);
        },
        storage: function(isSession) {
            var that = this;
            return {
                'getItem': function(name) {
                    //假如浏览器支持本地存储则从localStorage里getItem，否则乖乖用Cookie
                    if (isSession && window.sessionStorage) {
                        var record = JSON.parse(sessionStorage.getItem(name));
                        if (!record) {
                            return '';
                        }
                        return JSON.parse(record.value);
                    } else if (window.localStorage) {
                        var record = JSON.parse(localStorage.getItem(name));
                        if (!record) {
                            return '';
                        }
                        if (new Date().getTime() / 1000 < record.timestamp) {
                            try {
                                return JSON.parse(record.value);
                            } catch (error) {
                                return record.value;
                            }
                        } else {
                            return '';
                        }
                    } else {
                        return that.getCookie(name);
                    }
                },
                'setItem': function(name, value, expires, domain, path) {
                    //假如浏览器支持本地存储则调用localStorage，否则乖乖用Cookie
                    if (window.localStorage) {
                        var record = { 'value': value };

                        if (domain != null) {
                            record['domain'] = domain;
                        }
                        if (path != null) {
                            record['path'] = path;
                        }

                        if (expires != null) {
                            var expirationMS = expires * 1000;
                            record['timestamp'] = new Date().getTime() + expirationMS;
                        }
                        if (isSession) {
                            sessionStorage.setItem(name, JSON.stringify(record));
                        } else {
                            localStorage.setItem(name, JSON.stringify(record));
                        }
                    } else {
                        that.setCookie(name, value, expires, domain, path);
                    }
                }
            }
        },

        /**
         * 保存数据到cookie
         */
        setCookie: function(name, value, expires, domain, path) {
            //explorer will do the rest of replace,update;
            var cookiestr = name + "=" + escape(value) + ";";
            if (expires != null) {
                var date = new Date();
                date.setTime(date.getTime() + expires * 1000);
                cookiestr += "expires=" + date.toGMTString() + ";";
            }
            if (domain != null) {
                cookiestr += "domain=" + domain + ";";
            }
            if (path != null) {
                cookiestr += "path=" + path + ";";
            }
            document.cookie = cookiestr;
        },

        /**
         * 从cookie中获得数据
         */
        getCookie: function(name) {
            var mycookie = document.cookie;
            var start1 = mycookie.indexOf(name + "=");
            if (start1 == -1)
                return "";
            else {
                start = mycookie.indexOf("=", start1) + 1;
                var end = mycookie.indexOf(";", start);
                if (end == -1) {
                    end = mycookie.length;
                }
                var value = unescape(mycookie.substring(start, end));
                if (value == null) {
                    return "";
                } else {
                    return value;
                }
            }
        },

        getCookieDomain: function() {
            if (document.domain == "localhost") {
                return null;
            }
            var dm = document.domain;
            var retDm = dm;
            var wp = dm.indexOf("www.");
            var sp = dm.indexOf("ssl.");
            if (wp == 0 || sp == 0) {
                retDm = dm.substr(4);
            }
            //可能出现在倒数第二位置的字符串
            var part2EndList = ['com', 'net', 'org', 'co', 'gov'];
            //.切分域名，判断真实顶级domain
            var parts = retDm.split('.');
            //看是否是ip，则判断最后一个是否是数字即可
            if (parts.length == 4) {
                var p3 = parts[3];
                if (isNaN(p3) == false) { //是数字
                    return retDm;
                }
            }
            //余下是域名
            if (parts.length == 2) {
                retDm = "." + retDm;
            } else if (parts.length > 2) {
                //倒数第二是否在part2EndList内，如果在，则是双尾域名，取后3部分为domain
                if (this.inArray(parts[parts.length - 2], part2EndList)) {
                    retDm = "." + parts[parts.length - 3] + "." + parts[parts.length - 2] + "." + parts[parts.length - 1];
                } else {
                    //否则，取后2部分为domain
                    retDm = "." + parts[parts.length - 2] + "." + parts[parts.length - 1];
                }
            } else {
                //==1的情况
                retDm = dm;
            }

            return retDm;
        },
        //获得、设置开始时间
        getStartTm: function() {
            var starttm = this.storage(true).getItem('_nz_autotrack_cookie_key_strattm');
            if (starttm == "" || starttm == null || isNaN(starttm)) {
                var date = new Date();
                starttm = date.getTime();
                var dm = this.getCookieDomain();
                this.storage(true).setItem('_nz_autotrack_cookie_key_strattm', starttm, null, dm, "/");
            }
            return starttm;
        },

        /**
         * 是否是手机
         */
        isMobile: function() {
            var ua = navigator.userAgent;
            var isAndroid = /Android/i.test(ua);
            var isBlackBerry = /BlackBerry/i.test(ua);
            var isWindowPhone = /IEMobile/i.test(ua);
            var isIOS = /iPhone|iPad|iPod/i.test(ua);
            var isMobile = isAndroid || isBlackBerry || isWindowPhone || isIOS;
            return isMobile;
        },

        /**
         * 获得UUID
         */
        getUUID: function() {
            var uuid = this.storage().getItem('_nz_autotrackor_sdk_uuid');
            if (!uuid) {
                uuid = this.shuffUUID();
                this.storage().setItem('_nz_autotrackor_sdk_uuid', uuid, 60 * 60 * 24 * 365, location.hostname, '/');
            }
            return uuid;
        },

        /** 生成32位随机数 */
        shuffUUID: function() {
            var dict = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '0',
                'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm',
                'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z'
            ];
            var num = dict.length;
            var uuid = "";
            var sum = 0;
            for (var i = 0; i < 31; i++) {
                var idx = Math.floor(Math.random() * num);
                var ch = dict[idx];
                sum += ch.charCodeAt(0);
                uuid += ch;
            }
            //生成校验位
            uuid += String.fromCharCode((sum % 26 + 97));
            return uuid;
        },
        /**获得元素的bottom、height、left、right、top、width等信息 */
        getElementBounds: function(el) {
            var bounds;
            var allChildrenAreElements = el.children.length === el.childNodes.length;
            if (el.tagName.toLowerCase() === 'a' && el.children.length > 0 && allChildrenAreElements) {
                Array.from(el.children)
                    .filter(function(child) { // 排除行内元素和隐藏元素
                        var styles = getComputedStyle(child);
                        return !(child.tagName === 'a' || styles.display === 'none');
                    })
                    .forEach(function(child) {
                        var b = child.getBoundingClientRect();
                        if (!bounds) {
                            bounds = {
                                top: b.top,
                                right: b.right,
                                bottom: b.bottom,
                                left: b.left,
                            };
                        }
                        if (b.top < bounds.top) {
                            bounds.top = b.top;
                        }
                        if (b.right > bounds.right) {
                            bounds.right = b.right;
                        }
                        if (b.bottom > bounds.bottom) {
                            bounds.bottom = b.bottom;
                        }
                        if (b.left < bounds.left) {
                            bounds.left = b.left;
                        }
                    });
            } else {
                bounds = el.getBoundingClientRect();
            }

            if (!bounds) {
                bounds = {
                    top: 0,
                    right: 0,
                    bottom: 0,
                    left: 0,
                };
            }
            return bounds;
        }
    }

}(window, document));