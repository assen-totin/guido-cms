// Manage menu

var init = function(params, callback) {
	var sqlClient = params.clients.sqlClient;
	var logger = params.clients.logger;

	var userId;

	switch(params.method) {
		case 'GET':
			// Get the pages entries
			var q = "SELECT * FROM languages ORDER BY name_en";

			sqlClient.query(q, function(error, sqlRows) {
				if (error) {
					callback({code:500, msg:"Unable to query database", error:q + "\n" + error});
					return;
				}

				var ret = (sqlRows) ? sqlRows : [];
				callback({code:200, msg:ret});
			});
			return;

		case 'PUT':
			// Update menu
			if (! params.query.id) {
				callback({code:400, msg:"Missing param in query: id"});
				return;
			}

			var q = "UPDATE languages SET status='active' WHERE id="+ sqlClient.escape(params.query.id);

			sqlClient.query(q, function(error) {
				if (error) {
					callback({code:500, msg:"Unable to query database", error:q + "\n" + error});
					return;
				}

				callback({code:200, msg: "OK"});
			});
			return;

		case 'DELETE':
			// Update menu
			if (! params.query.id) {
				callback({code:400, msg:"Missing param in query: id"});
				return;
			}

			var q = "UPDATE languages SET status='inactive' WHERE id="+ sqlClient.escape(params.query.id);

			sqlClient.query(q, function(error) {
				if (error) {
					callback({code:500, msg:"Unable to query database", error:q + "\n" + error});
					return;
				}

				callback({code:200, msg: "OK"});
			});
			return;


		default:
			callback({code:405, msg: "Method not accepted: " + params.method});
			return;
	}
}

module.exports = init;
