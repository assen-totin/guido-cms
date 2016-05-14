// Manage galleries
var fs = require('fs');
var utilsAdmin = require('./utils');

var init = function(params, callback) {
	var sqlClient = params.clients.sqlClient;
	var logger = params.clients.logger;

	var userId;

	switch(params.method) {
		case 'GET':
			// Get galleries
			var q = "SELECT * FROM galleries WHERE status='active';

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

				// Create directory for the gallery
				pathDest = params.documentRoot + '/galleries/' + utilsAdmin.sanitise(params.query.path, 'dir');

				try {
					stat = fs.lstatSync(pathDest);
					logger.debug('Got stat data for file ' + pathDest);
				}
				catch (e) {
					// Create the directory
					fs.mkdirSync(pathDest);
				}

				callback({code:200, msg: "OK"});
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
