+(function(window, document) {
    var nztrackUtil = window.nztrackUtil;
    var nzautotrack = window.nzautotrack;
    var nztrackConfigs = window.nztrackConfigs;

    var getHashParam = function(hash, param) {
        var matches = hash.match(new RegExp(param + '=([^&]*)'));
        return matches ? matches[1] : null;
    };

    /**
     * 加载编辑器
     */
    var _loadEditor = function(token) {
        window.nzLoader.init(token);
    }

    /**
     * 从sessionStorage获得参数
     */
    var editorParamsFromHash = function(hash) {
        try {
            var state = getHashParam(hash, 'nztrack_state');
            state = JSON.parse(decodeURIComponent(state));
            if (state['action'] == "nztrackeditor") {
                var expiresInSeconds = getHashParam(hash, 'nztrack_expires_in');
                var editorParams = {
                    'accessTokenExpiresAt': (new Date()).getTime() + (Number(expiresInSeconds) * 1000),
                    'projectId': state['projectId'],
                    'projectToken': state['token']
                };
                window.sessionStorage.setItem('nztrackEditorParams', JSON.stringify(editorParams));
            }

            if (state['desiredHash']) { //设置为用户原有的hash参数
                window.location.hash = state['desiredHash'];
            } else if (window.history) { // 删除hash参数
                history.replaceState('', document.title, window.location.pathname + window.location.search);
            } else {
                window.location.hash = '';
            }
            return editorParams;
        } catch (e) {
            console.error('Unable to parse data from hash', e);
            return null;
        }
    }

    /**
     * 我们需要一个token和一些状态来加载可视化编辑器，这些状态来自以下两个地方:
     * 1. URL参数
     * 2. 如果在上一页初始化的，就获取session storage 中的 `nztrackEditorParams`
     */
    var maybeLoadEditor = function(token) {
        try {
            var parseFromUrl = false;
            if (getHashParam(window.location.hash, 'nztrack_state')) {
                var state = getHashParam(window.location.hash, 'nztrack_state');
                state = JSON.parse(decodeURIComponent(state));
                parseFromUrl = state['action'] === 'nztrackeditor';
            }

            var editorParams;

            if (parseFromUrl) { // 如果能从URL参数中解析出来
                editorParams = editorParamsFromHash(window.location.hash);
            } else { // 在上一页初始化的
                editorParams = JSON.parse(window.sessionStorage.getItem('nztrackEditorParams') || '{}');
            }

            if (editorParams['projectToken'] && token === editorParams['projectToken']) {
                if ((editorParams['accessTokenExpiresAt'] - (new Date()).getTime()) <= 0) {
                    //登录已经超时
                }
                _loadEditor(token);
                return true;
            } else {
                return false;
            }
        } catch (e) {
            return false;
        }
    }

    /**
     * 设置配置
     * @param {*} configs 
     */
    var setConfig = function(configs) {
        for (var key in configs) {
            nztrackConfigs.set(key, configs[key]);
        }
    }

    window.nztrack = {
        init: function(token, configs) {
            configs && setConfig(configs);
            if (!!token) {
                //如果不是编辑则为已设置的元素绑定事件
                if (!maybeLoadEditor(token)) {
                    //设置开始时间
                    nztrackUtil.getStartTm();
                    //1、通过接口获得已配置的事件
                    //2、解析上一步的数据，取出其中的csspath去绑定事件
                    nztrackUtil.getEventsByToken(token, function(res) {
                        nzautotrack.init(res);
                    });
                }
            } else {
                console.log('没有设置token');
            }
        }
    };
}(window, document))