// Upload a file

var init = function(params, callback) {
	var sqlClient = params.clients.sqlClient;
	var logger = params.clients.logger;

	var userId;

	// Validate method
	if (params.method != "POST") {
		callback({code:405, msg: "Method not accepted: " + params.method});
		return;
	}

	// If a file was not uploaded, return error
	var pathSource = params.upload.file.path;
	if (! pathSource) {
		callback({code:400, msg: "No file uploaded"});
		return;
	}

	// Move the file to the selected path (which must be a writable directory)
	var pathDest = params.documentRoot + params.query.path;
	var stat;
	try {
		stat = fs.lstatSync(pathDest);
		logger.debug('Got stat data for file ' + pathDest);
	}
	catch (e) {
		callback({code:404, msg: "Upload path not found: " + pathDest});
		return;
	}

	if (! stat.isDirectory()) {
		callback({code:400, msg: "Upload path is not a directory: " + pathDest});
		return;
	}

	// Sanitise file name
	var fileName = params.upload.file.name.replace('/', '_');

	// Append slash if missing and move the file
	if (pathDest.slice(-1) != '/')
		pathDest += '/';
	pathDest += fileName;

	fs.renameSync(pathSource, pathDest);

	callback({code:200, msg:"OK"});
}

module.exports = init;
