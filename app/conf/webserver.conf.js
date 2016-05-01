// GUIdo Web Server config

var paramsLogger = {
	log_level: 6,   // LOG_LEVEL_DEBUG
	app_name: 'API',
	http_log: '/var/log/httpd/guido.log'
};

var paramsHttp = {
	host: '0.0.0.0',
	port: 8080,
};

var paramsApi = {
	path: '/api'	// Relative to DocumentRoot; must be the same in app; set to '' to disable API
};

var config = {
        logger: paramsLogger,
        http: paramsHttp,
		api: paramsApi,
};

module.exports = config;

