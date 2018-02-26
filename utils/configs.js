+(function(window, document) {
    var HTTP_PROTOCOL = (('https:' === document.location.protocol) ? 'https://' : 'http://');

    var DEFAULT_CONFIGS = {
        settrack: false,
        // api_host: HTTP_PROTOCOL + '221.122.73.190:8081',
        api_host: HTTP_PROTOCOL + '127.0.0.1:20085',
        getProjectByTokenUrl: '/api/getProjectByToken/',
        getEventsByTokenUrl: '/api/getEventByToken/',
        saveEventUrl: '/api/add/',
        editEventUrl: '/api/edit/',
        delEventUrl: '/api/eventDel/',
        saveTrackEventUrl: '/api/eventReceive/',
    }

    window.nztrackConfigs = {
        set: function(config_name, config_value) {
            if (DEFAULT_CONFIGS.hasOwnProperty(config_name)) {
                DEFAULT_CONFIGS[config_name] = config_value;
            }
        },
        get: function(config_name, isNotUrl) {
            if (DEFAULT_CONFIGS.hasOwnProperty(config_name)) {
                return !!!isNotUrl ? DEFAULT_CONFIGS['api_host'] + DEFAULT_CONFIGS[config_name] : DEFAULT_CONFIGS[config_name];
            }
        }
    }

}(window, document));