// Manage galleries
var fs = require('fs');
var utilsAdmin = require('./utils');

var init = function(params, callback) {
	var sqlClient = params.clients.sqlClient;
	var logger = params.clients.logger;

	switch(params.method) {
		case 'GET':
			// Get galleries
			var q = "SELECT * FROM galleries WHERE status='active'";

			sqlClient.query(q, function(error, sqlRows) {
				if (error) {
					callback({code:500, msg:"Unable to query database", error:q + "\n" + error});
					return;
				}

				var ret = (sqlRows) ? sqlRows : [];
				callback({code:200, msg:ret});
			});
			return;

		case 'POST':
			// Insert gallery
			if (! params.query.style) {
				callback({code:400, msg:"Missing param in query: style"});
				return;
			}

			var q = "INSERT INTO galleries (name, style_id, added_on, added_by) VALUES (" + sqlClient.escape(params.query.name) + ", " + sqlClient.escape(params.query.style) + ", NOW(), " + params.user + ")";
			sqlClient.query(q, function(error, sqlRows) {
				if (error) {
					callback({code:500, msg:"Unable to query database", error:q + "\n" + error});
					return;
				}

				// Get gallery ID to include in the path (to make sure it is unique)
				q = "SELECT * FROM galleries WHERE name=" + sqlClient.escape(params.query.name) + " ORDER BY id DESC LIMIT 1";
				sqlClient.query(q, function(error, sqlRows2) {
					if (error) {
						callback({code:500, msg:"Unable to query database", error:q + "\n" + error});
						return;
					}

					// Create directory for the gallery
					var pathDb = '/galleries/' + sqlRows2[0].id + '_' + utilsAdmin.sanitise(params.query.name, 'dir');
					var pathFs = params.documentRoot + pathDb;

					try {
						stat = fs.lstatSync(pathFs);
						logger.debug('Got stat data for file ' + pathFs);
					}
					catch (e) {
						// Create the directory
						fs.mkdirSync(pathFs);
						fs.mkdirSync(pathFs + '/thumbnails');
					}

					// Set gallery path as we now know the gallery ID
					q = "UPDATE galleries SET path=" + sqlClient.escape(pathDb) + " WHERE id=" + sqlRows2[0].id;
					sqlClient.query(q, function(error, sqlRows2) {
						if (error) {
							callback({code:500, msg:"Unable to query database", error:q + "\n" + error});
							return;
						}

						callback({code:200, msg: "OK"});
					});	
				});		
			});
			return;

		case 'DELETE':
			// Delete a gallery
			var q = "UPDATE galleries SET status='deleted', deleted_on=NOW(), deleted_by=" + params.user + " WHERE id=" + sqlClient.escape(params.query.id);
			sqlClient.query(q, function(error) {
				if (error) {
					callback({code:500, msg:"Unable to query database", error:q + "\n" + error});
					return;
				}
					callback({code:200, msg:"OK"});
			});
			return;

		default:
			callback({code:405, msg: "Method not accepted: " + params.method});
			return;
	}
}

module.exports = init;
