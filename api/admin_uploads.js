// Upload a file
var fs = require('fs');

var init = function(params, callback) {
	var sqlClient = params.clients.sqlClient;
	var logger = params.clients.logger;

	var userId;

	switch(params.method) {
		case 'GET':
			// If an ID is given, get the file and all its versions; else, get all files
			var q;
			if (params.query && params.query.id)
				q = "SELECT * FROM uploads WHERE id=" + sqlClient.escape(params.query.id);
			else
				q = "SELECT * FROM uploads WHERE status='active' ORDER BY name";

			sqlClient.query(q, function(error, sqlRows) {
				if (error) {
					callback({code:500, msg:"Unable to query database", error:q + "\n" + error});
					return;
				}

				var ret = (sqlRows) ? sqlRows : [];
				callback({code:200, msg:ret});
			});
			return;

		case 'DELETE':
			// Delete a file with all its versions; update DB
			var q = "SELECT path FROM uploads WHERE gid=" + sqlClient.escape(params.query.id);
			sqlClient.query(q, function(error, sqlRows) {
				if (error) {
					callback({code:500, msg:"Unable to query database", error:q + "\n" + error});
					return;
				}

				// Delete files
				for (var i=0; i<sqlRows.length; i++)
					fs.unlinkSync(sqlRows[i].path);

				// Update DB
				q = "UPDATE uploads SET status='deleted', deleted_on=NOW(), deleted_by=" + params.user + " WHERE gid=" + sqlClient.escape(params.query.id);
				sqlClient.query(q, function(error, sqlRows) {
					if (error) {
						callback({code:500, msg:"Unable to query database", error:q + "\n" + error});
						return;
					}

					callback({code:200, msg:"OK"});
				});
			});
			return;

		default:
			callback({code:405, msg: "Method not accepted: " + params.method});
			return;
	}
}

module.exports = init;
