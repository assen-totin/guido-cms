var http = require('http');
var url = require('url');
var fs = require('fs');
var SQL = require('./lib/sql');
var formidable = require('formidable');
var validateSession = require('./lib/session_validate');

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

// Helper function: Parse a JSON input
var parseJson = function(input) {
	var parts;
	try {
		parts = JSON.parse(input);

		// Simple types (string, int) parse without failures, so make sure we have an object
		if (parts === Object(parts))
			return parts;
		else
			return null;
	}
	catch (e) {
		return null;
	}
};

// Invoke the endpoint
var invoke = function(params, callback) {
	var endpoint = require(params.endpoint);
	endpoint(params, function(result) {
		callback(result);
		params.clients.sqlClient.end();
	});
};

var init = function(params, callback) {
	var logger = params.logger;

	// Connect SQL, pass it down
	var sqlClient = new SQL();
	sqlClient.connect(function(error){
		if (error) {
			callback({code:500, msg:"Unable to connect to database", error:error});
			return;
		}
		logger.debug("Connected SQL...");

		// Amend params
		params.clients = {};
		params.clients.sqlClient = sqlClient;
		params.clients.logger = params.logger;

		// Validate session cookie
		validateSession(params, function(result){
			if (result.code != 200) {
				callback(result);
				sqlClient.end();
				return;
			}

			// Amend params for endpoint
			params.session = (result.session) ? result.session : null;
			params.user = (result.user) ? result.user : null;
			params.level = (result.level) ? result.level : null;

			// For GET, extract params directly
			if (params.method == 'GET') {
				params.query = parseJson(params.urlParts.query);
				invoke(params, function(result2){
					callback(result2);
				});
				return;
			}

			// Else, extract params using formidable (because of multipart/form-data)
			else {
				var form = new formidable.IncomingForm();
				form.uploadDir = params.documentRoot + "/uploads";
				form.parse(params.request, function(error, query, upload) {
					if (error) {
						callback(error);
						return;
					}

					if (! params.query)
						params.query = {};

					var keys = Object.keys(query);
					for (var i=0; i<keys.length; i++) {
						if (parseJson(query[keys[i]]))
							params.query = parseJson(query[keys[i]]);
						else
							params.query[keys[i]] = query[keys[i]];
					}

					params.upload = upload;
					invoke(params, function(result2){
						callback(result2);
					});
					return;
				});
			}
		});
	});
};

module.exports = init;

