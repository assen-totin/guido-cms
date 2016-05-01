/**
 * Configuration loading module for Node.js
 */

var fs = require('fs');
var sysConfDir = '/etc/guido';
var localConfDir = __dirname + '/../config';

var loader = function(configFile) {
	if (! configFile)
		return null;

	// If file name does not end in .js, append so
	if (configFile.indexOf('.js') != (configFile.length - 3))
		configFile += '.js';
	else if (configFile.length < 4)
		configFile += '.js';

	var path;

	// Try loading from global configuration directory, environment-specific
	if (process.env.NODE_ENV) {
		path = sysConfDir + '/' + process.env.NODE_ENV + '/' + configFile;
		if (fs.existsSync(path)) 
			return require(path);
	}

	// Try loading from global configuration directory
	path = sysConfDir + '/' + configFile;
	if (fs.existsSync(path)) 
		return require(path);

	// Try loading from local config directory, environment-specific
	if (process.env.NODE_ENV) {
		path = localConfDir + '/' + process.env.NODE_ENV + '/' + configFile;
		if (fs.existsSync(path)) 
			return require(path);
	}

	// Try loading from local config directory
	path = localConfDir + '/' + configFile;
	if (fs.existsSync(path)) 
		return require(path);

	// Try loading DEV from local config directory
	path = localConfDir + '/dev/' + configFile;

	if (fs.existsSync(path)) 
		return require(path);

	return null;
};

module.exports = loader;
