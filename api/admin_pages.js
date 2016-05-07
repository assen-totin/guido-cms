// Manage menu

var init = function(params, callback) {
	var sqlClient = params.clients.sqlClient;
	var logger = params.clients.logger;

	var userId;

	switch(params.method) {
		case 'GET':
			// Get the pages entries
			var q = "SELECT * FROM pages WHERE status='active' ORDER BY parent, position";

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
			// We always put the new entry last, so we need to get a position for it
			var q = "SELECT MAX(position) AS pos FROM pages WHERE parent=" + sqlClient.escape(params.query.parent);
			sqlClient.query(q, function(error, sqlRows) {
				if (error) {
					callback({code:500, msg:"Unable to query database", error:q + "\n" + error});
					return;
				}

				var position = 1;
				if (sqlRows.length)
					position = sqlRows[0].pos + 1;

				// Create new pages entry
				q = "INSERT INTO pages (parent, position, name, added_on, added_by) VALUES (" + sqlClient.escape(params.query.parent) + ", " + position + ", " + sqlClient.escape(params.query.name) + ", NOW(), " + params.user + ")";
				sqlClient.query(q, function(error) {
					if (error) {
						callback({code:500, msg:"Unable to query database", error:q + "\n" + error});
						return;
					}
					callback({code:200, msg:"OK"});
				});
			});
			return;

		case 'PUT':
			// Update menu
			if (! params.query.id) {
				callback({code:400, msg:"Missing param in query: id"});
				return;
			}

			var upd = "";

			// If up/down action is given, carry it on
			if (params.query.move) {
				var q = "SELECT position, parent FROM pages WHERE id=" + sqlClient.escape(params.query.id);
				sqlClient.query(q, function(error, sqlRows) {
					if (error) {
						callback({code:500, msg:"Unable to query database", error:q + "\n" + error});
						return;
					}

					var position = sqlRows[0].position;
					var parent = sqlRows[0].parent;
					var p = (params.query.move == 'up') ? "-1" : "+1";

					q = "UPDATE pages SET position=" + position +" WHERE parent=" + parent + " AND position=" + position + p;
					sqlClient.query(q, function(error, sqlRows) {
						if (error) {
							callback({code:500, msg:"Unable to query database", error:q + "\n" + error});
							return;
						}

						q = "UPDATE pages SET position=position" + p +" WHERE id="+ sqlClient.escape(params.query.id);
						sqlClient.query(q, function(error, sqlRows) {
							if (error) {
								callback({code:500, msg:"Unable to query database", error:q + "\n" + error});
								return;
							}

							callback({code:200, msg: "OK"});
						});
					});
				});

				return;
			}

			if (params.query.parent) {
				upd += (q.length) ? "," : "";
				upd += "parent=" + sqlClient.escape(params.query.parent);
			}
			if (params.query.position) {
				upd += (q.length) ? "," : "";
				upd += "position=" + sqlClient.escape(params.query.position);
			}
			if (params.query.name) {
				upd += (q.length) ? "," : "";
				upd += "name=" + sqlClient.escape(params.query.name);
			}

			var q = "UPDATE pages SET " + upd + " WHERE id=" + sqlClient.escape(params.query.id);
			sqlClient.query(q, function(error) {
				if (error) {
					callback({code:500, msg:"Unable to query database", error:q + "\n" + error});
					return;
				}
					callback({code:200, msg:"OK"});
			});
			return;

		case 'DELETE':
			// Delete a pages entry
			var q = "UPDATE pages SET status='deleted', deleted_on=NOW(), deleted_by=" + params.user + " WHERE id=" + sqlClient.escape(params.query.id);
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
