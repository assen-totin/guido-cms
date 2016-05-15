// Upload a file
var fs = require('fs');
var gd = require('node-gd');
var utilsAdmin = require('./utils');

var loadImage = function(path) {
	var parts = path.split('.');

	switch (parts[parts.length-1].toLowerCase()) {
		case 'jpg':
		case 'jpeg':
		case 'jpe':
			return gd.openJpeg(path);
		case 'png':
			return gd.openPng(path);
		case 'gif':
			return gd.openGif(path);
	}
	return null;
};

var saveImage = function(image, path) {
	var parts = path.split('.');
	switch (parts[parts.length-1].toLowerCase()) {
		case 'jpg':
		case 'jpeg':
		case 'jpe':
			return image.saveJpeg(path, 100, function(error){
				console.log(error);
			});
		case 'png':
			return image.savePng(path, 9);
		case 'gif':
			return image.saveGif(path);
	}
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
		var pathFs;
		var pathDb;
		var stat;
		if (params.query && params.query.path) {
			pathDb = utilsAdmin.sanitise(params.query.path, 'dir');
			pathFs = params.documentRoot + pathDb;
		
			try {
				stat = fs.lstatSync(pathFs);
				logger.debug('Got stat data for file ' + pathFs);
			}
			catch (e) {
				callback({code:404, msg: "Upload path not found: " + pathFs});
				return;
			}

			// Path must be a dir
			if (! stat.isDirectory()) {
				callback({code:400, msg: "Upload path is not a directory: " + pathFs});
				return;
			}
		}
		else {
			var d = new Date();
			pathDb = '/uploads/' + d.getFullYear() + '/' + (d.getMonth() + 1);
			pathFs = params.documentRoot + pathDb;

			try {
				stat = fs.lstatSync(pathFs);
				logger.debug('Got stat data for file ' + pathFs);
			}
			catch (e) {
				// Create the directory
				fs.mkdirSync(params.documentRoot + '/uploads/' + d.getFullYear());
				fs.mkdirSync(pathFs);
			}		
		}

		// Append slash if missing and move the file
		if (pathFs.slice(-1) != '/')
			pathFs += '/';
		pathFs += utilsAdmin.sanitise(params.upload.file.name, 'name');

		// Register upload as gallery image
		if (params.query.gallery) {
			// Get gallery data
			var q = "SELECT * FROM galleries g JOIN gallery_styles gs ON g.style_id=gs.id WHERE g.id=" + sqlClient.escape(params.query.gallery);
			sqlClient.query(q, function(error, sqlRows) {
				if (error) {
					callback({code:500, msg:"Unable to query database", error:q + "\n" + error});
					return;
				}

				// Register
				q = "INSERT INTO gallery_images (gallery_id, added_on, added_by) VALUES (" + sqlClient.escape(params.query.gallery) + ", NOW(), " + params.user + ")";
				sqlClient.query(q, function(error) {
					if (error) {
						callback({code:500, msg:"Unable to query database", error:q + "\n" + error});
						return;
					}

					// Get the ID of the new gallery image
					q = "SELECT * FROM gallery_images WHERE gallery_id=" + sqlClient.escape(params.query.gallery) + " ORDER BY id DESC LIMIT 1";
					sqlClient.query(q, function(error, sqlRows2) {
						if (error) {
							callback({code:500, msg:"Unable to query database", error:q + "\n" + error});
							return;
						}

						// Override paths with the gallery-specific value from DB
						var newFilename = sqlRows2[0].id + '_' + utilsAdmin.sanitise(params.upload.file.name, 'name');
						pathDb = sqlRows[0].path + '/' + newFilename;
						pathFs = params.documentRoot + pathDb;
						var pathThumbs = params.documentRoot + sqlRows[0].path + '/thumbnails/' + newFilename;

						// Update path of the new gallery image
						q = "UPDATE gallery_images SET path=" + sqlClient.escape(pathDb) + " WHERE id=" + sqlRows2[0].id;
						sqlClient.query(q, function(error, sqlRows2) {
							if (error) {
								callback({code:500, msg:"Unable to query database", error:q + "\n" + error});
								return;
							}

							// Move image to its proper name so that we can take its type, then load
							var pathTmp = pathSource + '.' + utilsAdmin.sanitise(params.upload.file.name, 'name');
							fs.renameSync(pathSource, pathTmp);
							var image = loadImage(pathTmp);
							// Resize image
							if (sqlRows[0].image_width && sqlRows[0].image_height) {
								var imageResized = gd.createTrueColorSync(sqlRows[0].image_width, sqlRows[0].image_height);
								image.copyResized(imageResized, 0, 0, 0, 0, sqlRows[0].image_width, sqlRows[0].image_height, image.width, image.height);
								saveImage(imageResized, pathFs);
							}
							else
								fs.renameSync(pathTmp, pathFs);

							// Thumbnail
							if (sqlRows[0].thumb_width && sqlRows[0].thumb_height) {
								var imageThumb = gd.createTrueColorSync(sqlRows[0].thumb_width, sqlRows[0].thumb_height);

								// Check if thumb has the same ratio as original; else, create thumbnail from center
								var ratio = parseInt(10 * image.width / image.height);
								var ratioThumb = parseInt(10 * sqlRows[0].thumb_width / sqlRows[0].thumb_height);
								var fromWidth = 0;
								var fromHeight = 0;
								if (ratio > ratioThumb) 
									// Original is wider than thumbnail
									fromWidth = parseInt((image.width - ratioThumb/ratio * image.width) / 2);
								else if (ratio < ratioThumb) 
									// Original is taller than thumbnail
									fromHeight = parseInt((image.height - ratio/ratioThumb * image.height) / 2);

								image.copyResized(imageThumb, fromWidth, fromHeight, 0, 0, sqlRows[0].thumb_width, sqlRows[0].thumb_height, image.width, image.height);
								saveImage(imageThumb, pathThumbs);
							}

							// Unlink original
							fs.unlinkSync(pathTmp);

							callback({code:200, msg:"OK"});
						});
					});
				});
			});
		}

		// Register upload as regular upload
		else {
			// Move the file
			fs.renameSync(pathSource, pathFs);

			var q = "INSERT INTO uploads (name, path, added_on, added_by) VALUES (" + sqlClient.escape(utilsAdmin.sanitise(params.upload.file.name, 'name')) + ", " + sqlClient.escape(pathDb) + ", NOW(), " + params.user + ")";
			sqlClient.query(q, function(error) {
				if (error) {
					callback({code:500, msg:"Unable to query database", error:q + "\n" + error});
					return;
				}

				// Get the ID of the newly uploaded file
				q = "SELECT id FROM  uploads WHERE path=" + sqlClient.escape(pathDb) + " ORDER BY id DESC LIMIT 1";
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
