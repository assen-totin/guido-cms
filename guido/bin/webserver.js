var http = require('http');
var url = require('url');
var fs = require('fs');
var path = require('path');

// We read the web server config from the app package
var config = require('../../app/conf/webserver.conf.js');
var configApp = require('../../app/conf/app.conf.js');
var Logger = require('../js/logger');
var logger = new Logger(config.logger);

// Try to get GUIdo config for current app; if not available, set defaults
var cookieName;
try {
	var guidoConf = require('../../app/conf/guidoConf');
	cookieName = guidoConf.cookie_f5;
}
catch (e) {
	cookieName = 'guido_f5';
}

// Set DocumentRoot - two directories higher
var documentRoot = path.resolve(__dirname, '..', '..');

// Helper function to get content type from a dir
var getContentType = function(dir) {
	var partsDir = dir.split('/');
	var partsFile = partsDir[partsDir.length - 1].split('.');
	var extension = partsFile[partsFile.length - 1].toLowerCase();
	switch(extension) {
		case 'txt':
		case 'index':
			return 'text/plain; charset=utf-8';
		case 'htm':
		case 'html':
			return 'text/html; charset=utf-8';
		case 'css':
			return 'text/css';
		case 'js':
			return 'application/javascript';
		case 'zip':
			return 'application/zip';
		case 'jpg':
		case 'jpeg':
			return 'image/jpeg';
		case 'png':
			return 'image/png';
		case 'gif':
			return 'image/gif';
		case 'ico':
			return 'image/x-icon';
		case 'swf':
			return 'application/x-shockwave-flash';
		case 'woff':
			return 'application/x-font-woff';
		case 'otf':
			return 'font/opentype';
		case 'ttf':
			return 'font/ttf';
		default:
			return 'application/octet-stream';
	}
};

// Helper function to get index file
var getIndex = function(dir) {
	var indices = ['index.html', 'index.htm'];
	var file;

	var dir2 = dir;
	if (dir.slice(-1) != '/')
		dir2 += '/';

	for (var i=0; i<indices.length; i++) {
		try { 
			file = dir2 + indices[i];
			stat = fs.lstatSync(file);
			logger.debug('Found ' + indices[i] + ' in directory ' + dir);
			return file;
		}
		catch(e) {
			logger.debug('Index ' + indices[i] + ' not found in directory ' + dir);
		}
	}
	return null;
};

// Helper function: Parse a URL string
var parseUrl = function(input) {
	var parts;
	try {
		parts = url.parse(input, true);
		return parts;
	}
	catch (e) {
		return null;
	}
};

// Main server code
var server = http.createServer(function(request, response) {
	logger.trace("Processing new request...");

	// Helper function: send a response to client
	var httpResponse = function(input) {
		response.statusCode = input.code ? input.code : 500;

		// Default headers to disable browser caching
		response.setHeader('Cache-control', "no-cache");
		response.setHeader('Cache-control', "no-store");
		response.setHeader('Pragma', "no-cache");
		response.setHeader('Expires', 0);

		// Custom headers
		if (input.headers) {
			var keys = Object.keys(input.headers);
			for (var i=0; i<keys.length; i++) {
				response.setHeader(keys[i], input.headers[keys[i]]);			
			}
		}

		// CORS headers
		if (request.headersLowerCase.origin && configApp.api.cors && (configApp.api.cors.length > 0)) {
			var urlOrigin;
			try {
				 urlOrigin = url.parse(request.headersLowerCase.origin);
			}
			catch(e) {
				urlOrigin = {host: null};
			}

			for (var i=0; i<configApp.api.cors.length; i++) {
				var urlCors;

				if (configApp.api.cors[i] == '*') {
					response.setHeader('Access-Control-Allow-Origin', request.headersLowerCase.origin);
					break;
				}

				try {
					 urlCors = url.parse(configApp.api.cors[i]);
				}
				catch(e) {
					urlCors = {host: null};
				}

				if (urlOrigin.hostname == urlCors.host) {
					response.setHeader('Access-Control-Allow-Origin', request.headersLowerCase.origin);
					break;
				}
			}
		}

		// Send message (for FD: send the file; for object: stringify; for text: send plain)
		if (input.fd) {
			var rs = fs.createReadStream(null, {fd: input.fd, flags: 'r'});
			rs.on('readable', function(){
				var chunk;
				while ((chunk = rs.read(1500)) !== null)
					response.write(chunk);
			});
			rs.on('end', function(){
				response.end();
			});
		}
		else if (input.msg) {
			if (typeof input.msg == 'object') {
				response.setHeader('Content-type', 'application/json');
				response.write(JSON.stringify(input.msg));
			}
			else {
				response.setHeader('Content-type', 'text/plain; charset=utf-8');
				response.write(input.msg);
			}
			response.end();
		}
		else {
			response.end();
		}

		// Log message
		if (input.msg) {
			var msg = (typeof input.msg == 'object') ? JSON.stringify(input.msg) : input.msg;
			var logMsg = (input.error) ? msg + "\n" + input.error : msg;
			if ((response.statusCode >= 400) && (response.statusCode <= 499)) 
				logger.warning(logMsg);
			else if ((response.statusCode >= 500) && (response.statusCode <= 599)) 
				logger.error(logMsg);
			else
				logger.trace(logMsg);

			// HTTP Log entry
			logger.http('[RESPONSE]' + msg);
		}
	};

	// MAIN ENTRY POINT

	// Check protocol version
	if ((request.httpVersion != '1.0') && (request.httpVersion != '1.1')) {
		httpResponse({code:505, msg:"HTTP version not supported: " + request.httpVersion});
		return;
	}

	// Parse URL
	var urlParts = parseUrl(request.url);
	if (! urlParts) {
		httpResponse({code:400, msg:"URL failed to parse: " + request.url});
		return;
	}

	// Make sure headers are all lower-case
	request.headersLowerCase = {};
	var headerKeys = Object.keys(request.headers);
	for (var i=0; i<headerKeys.length; i++) {
		var key = headerKeys[i].toLowerCase();
		request.headersLowerCase[key] = request.headers[headerKeys[i]];
	}

	// Log request to HTTP log
	var remoteAddress = (request.headersLowerCase['x-forwarded-for']) ? request.headersLowerCase['x-forwarded-for'] : request.connection.remoteAddress;
	logger.http('[' + remoteAddress + '][' + request.method + ']' + request.url);

	// For OPTIONS, respond immediately
	if (request.method == 'OPTIONS') {
		var resp = {
			code:200, 
			msg: "OPTIONS OK, go on!", 
			headers: {
				'Access-Control-Allow-Headers': 'X-Session-Id',
				'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE'
			}
		}
		httpResponse(resp);
		return;
	}

	var resp = {};
	var cookie = null;

	// For other methods, determine target
	var file = documentRoot + urlParts.pathname;
	logger.debug('Looking up file ' + file);

	// If this is an API request, amend with file extenstion
	var isApi = false;
	if (configApp.api.prefix && (urlParts.pathname.indexOf(configApp.api.prefix) == 0)) {
		isApi = true;
		file += '.js';
	}

	// If file does not exist, redirect to index
	var stat;
	try {
		stat = fs.lstatSync(file);
		logger.debug('Got stat data for file ' + file);
	}
	catch (e) {
		logger.debug('Could not stat file ' + file);
		logger.debug('Returning redirect to index');
		resp.code = 302;
		resp.headers = [],
		resp.headers['Location'] = '/index.html';
		resp.headers['Set-cookie'] = cookieName + '=' + urlParts.pathname + '; Path=/';
		if (urlParts.host) 
			resp.headers['Set-cookie'] += '; Domain=' + urlParts.host;
		resp.msg = "Moved";
		logger.debug('Returning cookie: ' + resp.headers['Set-cookie']);
		httpResponse(resp);
		return;
	}

	// Check if the file is a special file and reject it
	if (stat.isBlockDevice() || stat.isCharacterDevice() || stat.isFIFO() || stat.isSocket() || stat.isSymbolicLink()) {
		logger.debug('Special file detected, denying access to ' + file);
		resp.code = 404;
		resp.msg = "File type not allowed: " + urlParts.pathname;
		httpResponse(resp);
		return;
	}

	// Check if the file is directory and seek an index file
	if (stat.isDirectory()) {
		logger.debug('File is a directory, getting index ' + file);
		var file2 = getIndex(file);
		if (file2) {
			logger.debug('Got index from directory ' + file);
			file = file2;
		}
		else {
			logger.debug('Could not get index from directory ' + file);
			resp.code = 403;
			resp.msg = "Directory listing denied for " + file;
			httpResponse(resp);
			return;
		}
	}

	// Check if the file is an API file
	if (isApi) {
		var api = require(documentRoot + configApp.api.prefix + configApp.api.loader);
		var paramsApi = {
			documentRoot: documentRoot,
			config: configApp,
			logger: logger,
			endpoint: file,
			urlParts: urlParts,
			request: request,
			headers: request.headersLowerCase,
			method: request.method,
		}
		api(paramsApi, function(response) {
			httpResponse(response);
		});
		return;
	}

	// We only serve static to GET requests
	if (request.method != 'GET') {
		resp.code = 405;
		resp.msg = "Unsupported method " + request.method + " for file " + file;
		httpResponse(resp);
		return;
	}

	// Serve static file
	logger.debug('Serving file ' + file);
	resp.code = 200;
	resp.headers = [],
	resp.headers['Content-type'] = getContentType(file);
	if (cookie) 
		resp.headers['Set-cookie'] = cookie;
	resp.fd = fs.openSync(file, 'r');
	httpResponse(resp);
});

server.listen(config.http.port, config.http.host);
logger.notice("Started GUIdo web server on port " + config.http.port + " with DocumentRoot " + documentRoot);


