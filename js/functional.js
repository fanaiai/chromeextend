+(function(window, document) {
    var nztrackUtil = window.nztrackUtil;
    var nzautotrack = window.nzautotrack;
    var token = '';
    var pid = '';
    var savedEvent = [];
    var eventlist = [];
    var runninglist = [];

    /**
     * 通过事件名获得事件对象
     */
    var getEventByName = function(name) {
        var filterEvents = savedEvent.filter(function(event) {
            if (event.name.trim() == name.trim()) {
                return event;
            }
        });
        return filterEvents;
    }

    /**
     * txt|e-obj-attr|selector|jsvar
     * @param {*} valuetype 
     */
    var analysisValuetype = function(valuetype, key) {
        var arr = valuetype.split(/(txt|e-obj-attr|selector|jsvar)\|/);
        if (arr.length == 1) {
            return {
                'name': key || '',
                'type': 'txt',
                'value': arr[0]
            }
        } else if (arr.length > 1) {
            var type = arr[1];
            var value = arr[2];
            var res = {
                'name': key || '',
                'type': type,
                'value': value
            };
            return res;
        }
    }

    var genattr = function(attrs) {
        var _props = [];
        for (var key in attrs) {
            if (attrs.hasOwnProperty(key)) {
                var element = attrs[key];
                _props.push(analysisValuetype(element, key));
            }
        }
        return _props;
    }

    var getEventList = function(callback) {
        var elist = nztrackUtil.storage().getItem(token);
        if (elist) {
            callback && callback(elist);
        } else {
            nztrackUtil.getEventsByToken(token, function(res) {
                nztrackUtil.storage().setItem(token, res, 60 * 60 * 24);
                callback && callback(res);
            })
        }
    }

    var _execute_array = function() {
        if (eventlist.length == 0) {
            return false;
        }
        var array = eventlist.shift();
        if (array && array.length > 1) {
            runninglist.push(array);
            var event_name = array[0];
            var event_detail = array[1];
            switch (event_name) {
                case 'init':
                    token = event_detail['token'];
                    getEventList(function(res) {
                        if (res) {
                            pid = res.pid;
                            savedEvent = res.elist;
                            nzautotrack.init(res);
                        }
                        runninglist.shift();
                        _execute_array();
                    });
                    break;
                case 'user':
                    var username = analysisValuetype(event_detail['username']);
                    var phone = '';
                    var email = ''
                    var ascontact = '';
                    runninglist.shift();
                    _execute_array();
                    break;
                case 'event':
                    var ename = event_detail['ename'];
                    if (ename) {
                        var selector = event_detail['selector'];
                        var properties = genattr(event_detail['attrs']);
                        var event = getEventByName(ename);
                        var saveEventObj = {
                            name: ename,
                            selection_type: 'similar',
                            properties: properties,
                            custom_css_selector: '',
                            similar_css_selector: selector,
                            element_defs: [],
                            defined_on_url: window.location.href
                        }
                        if (event.length == 0) {
                            nztrackUtil.saveEvent(token, saveEventObj, function(res) {
                                if (res && res.event_content) {
                                    var eventContent = JSON.parse(res.event_content);
                                    eventContent['e_id'] = res.event_id;
                                    var elist = nztrackUtil.storage().getItem(token);
                                    elist.elist.push(eventContent);
                                    nztrackUtil.storage().setItem(token, elist, 60 * 5);
                                    nzautotrack.track(token, eventContent);
                                }
                            });
                        } else {
                            saveEventObj['e_id'] = event[0]['e_id'];
                            if (!nztrackUtil.equalObject(event[0], saveEventObj, true)) {
                                nztrackUtil.saveEvent(token, event[0]['e_id'], function() {}, 'edit');
                            }
                        }
                    }
                    runninglist.shift();
                    _execute_array();
                    break;
            }
        }
    }

    var saveEventAndTrack = function() {
        _execute_array();
    }

    var nzautotrackor = window.nzautotrackor = function(moli) {
        //设置开始时间
        nztrackUtil.getStartTm();
        if (window['_moli'] && nztrackUtil.isArray(window['_moli'])) {
            eventlist = window['_moli'] || [];
            saveEventAndTrack();
        }
        return this;
    };
    nzautotrackor.prototype = {
        push: function(moli) {
            eventlist.push(moli);
            if (runninglist.length == 0) {
                saveEventAndTrack();
            }
        }
    };
    window['_moli'] = new nzautotrackor();
}(window, document))