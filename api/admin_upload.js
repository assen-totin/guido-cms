// Upload a file
var fs = require('fs');
var utilsAdmin = require('./utils');

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

	// If we are uploading a new version, append a timestamp to old file, update DB and reuse the path for the new file
	if (params.query && params.query.id) {
		var uploadId = sqlClient.escape(params.query.id);

		// Get the original path to reuse
		var q = "SELECT path, name, gid FROM uploads WHERE id=" + uploadId;
		sqlClient.query(q, function(error, sqlRows) {
			if (error) {
				callback({code:500, msg:"Unable to query database", error:q + "\n" + error});
				return;
			}

			if (! sqlRows.length) {
				callback({code:404, msg:"Unable to find existing file with ID " + uploadId});
				return;
			}

			var gid = sqlRows[0].gid;
			var path = sqlRows[0].path;

			// Append timestamp to old file name
			var now = Date.now();
			var pathReplaced = path + '.' + now;
			fs.renameSync(path, pathReplaced);

			// Move the newly uploaded file to original path
			fs.renameSync(pathSource, sqlRows[0].path);

			// Register upload
			q = "INSERT INTO uploads (name, path, added_on, added_by) VALUES ('" +  sqlRows[0].name + "', '" + path + "', NOW(), " + params.user + ")";
			sqlClient.query(q, function(error) {
				if (error) {
					callback({code:500, msg:"Unable to query database", error:q + "\n" + error});
					return;
				}

				// Get the ID of the newly uploaded file
				q = "SELECT id FROM uploads WHERE path='" + path + "' ORDER BY id DESC LIMIT 1";
				sqlClient.query(q, function(error, sqlRows2) {
					if (error) {
						callback({code:500, msg:"Unable to query database", error:q + "\n" + error});
						return;
					}

					var gidNew = sqlRows2[0].id;

					// Update the previous record: status, path, ID
					q = "UPDATE uploads SET status='replaced', path='" + pathReplaced + "' WHERE id=" + uploadId;
					sqlClient.query(q, function(error) {
						if (error) {
							callback({code:500, msg:"Unable to query database", error:q + "\n" + error});
							return;
						}

						// Update GID in all pevious records with the 
						q = "UPDATE uploads SET gid=" + gidNew + " WHERE gid=" + gid + " OR id=" + gidNew;
						sqlClient.query(q, function(error) {
							if (error) {
								callback({code:500, msg:"Unable to query database", error:q + "\n" + error});
								return;
							}

							callback({code:200, msg:"OK"});
							return;
						});
					});
				});
			});
		});
	}

	// If we are uploading a new file, do it the regular way
	else {
		// See if we were given a path; else, set a default hierarchy
		var pathDest;
		var stat;
		if (params.query && params.query.path) {
			pathDest = params.documentRoot + '/' + utilsAdmin.sanitise(params.query.path, 'dir');
		
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
			pathDest = params.documentRoot + '/uploads/' + d.getFullYear() + '/' + (d.getMonth() + 1);

			try {
				stat = fs.lstatSync(pathDest);
				logger.debug('Got stat data for file ' + pathDest);
			}
			catch (e) {
				// Create the directory
				fs.mkdirSync(params.documentRoot + '/uploads/' + d.getFullYear());
				fs.mkdirSync(pathDest);
			}		
		}

		// Append slash if missing and move the file
		if (pathDest.slice(-1) != '/')
			pathDest += '/';
		pathDest += utilsAdmin.sanitise(params.upload.file.name, 'name');

		// Move the file
		fs.renameSync(pathSource, pathDest);

		// Register upload as gallery image
		if (params.query.gallery) {
			//FIXME: read gallery data, resize image and register it
			console.log("Gallery upload!");
		}

		// Register upload as regular upload
		else {
			var q = "INSERT INTO uploads (name, path, added_on, added_by) VALUES (" + sqlClient.escape(utilsAdmin.sanitise(params.upload.file.name, 'name')) + ", " + sqlClient.escape(pathDest) + ", NOW(), " + params.user + ")";
			sqlClient.query(q, function(error) {
				if (error) {
					callback({code:500, msg:"Unable to query database", error:q + "\n" + error});
					return;
				}

				// Get the ID of the newly uploaded file
				q = "SELECT id FROM  uploads WHERE path=" + sqlClient.escape(pathDest) + " ORDER BY id DESC LIMIT 1";
				sqlClient.query(q, function(error, sqlRows) {
					if (error) {
						callback({code:500, msg:"Unable to query database", error:q + "\n" + error});
						return;
					}

					var gidNew = sqlRows[0].id;

					// Update the previous record: status, path, ID
					q = "UPDATE uploads SET gid=" + gidNew + " WHERE id=" + gidNew;
					sqlClient.query(q, function(error) {
						if (error) {
							callback({code:500, msg:"Unable to query database", error:q + "\n" + error});
							return;
						}

						callback({code:200, msg:"OK"});
					});
				});
			});
		}
	}
}

module.exports = init;
