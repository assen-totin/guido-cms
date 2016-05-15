// Manage gallery styles

var init = function(params, callback) {
	var sqlClient = params.clients.sqlClient;
	var logger = params.clients.logger;

	switch(params.method) {
		case 'GET':
			// Get galleries
			var q = "SELECT * FROM gallery_styles WHERE status='active'";

			sqlClient.query(q, function(error, sqlRows) {
				if (error) {
					callback({code:500, msg:"Unable to query database", error:q + "\n" + error});
					return;
				}

				var ret = (sqlRows) ? sqlRows : [];
				callback({code:200, msg:ret});
			});
			return;

		default:
			callback({code:405, msg: "Method not accepted: " + params.method});
			return;
	}
}

module.exports = init;
