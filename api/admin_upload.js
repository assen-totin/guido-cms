// Upload a file

var sanitise = function(path, type) {
	var ret = path;

	switch(type) {
		case 'name':
			ret = ret.replace('/', '_');
		case 'dir':
			ret = ret.replace('..', '__');
	}

	return ret;
};

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

	// See if we were given a path; else, set a default hierarchy
	var pathDest;
	var stat;
	if (params.query.path) {
		pathDest = params.documentRoot + '/upload' + sanitise(params.query.path, 'dir');
		
		try {
			stat = fs.lstatSync(pathDest);
			logger.debug('Got stat data for file ' + pathDest);
		}
		catch (e) {
			callback({code:404, msg: "Upload path not found: " + pathDest});
			return;
		}

		// Path must be a dir
		if (! stat.isDirectory()) {
			callback({code:400, msg: "Upload path is not a directory: " + pathDest});
			return;
		}
	}
	else {
		var d = new Date();
		pathDest = params.documentRoot + '/upload' + d.getFullYear() + '/' + d.getMonth();

		try {
			stat = fs.lstatSync(pathDest);
			logger.debug('Got stat data for file ' + pathDest);
		}
		catch (e) {
			// Create the directory
			fs.mkdirSync(params.documentRoot + '/upload' + d.getFullYear(), 755);
			fs.mkdirSync(pathDest, 755);
		}		
	}

	// Append slash if missing and move the file
	if (pathDest.slice(-1) != '/')
		pathDest += '/';
	pathDest += sanitise(params.upload.file.name, 'name');

	fs.renameSync(pathSource, pathDest);

	callback({code:200, msg:"OK"});
}

module.exports = init;
