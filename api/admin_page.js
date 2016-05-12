// Manage menu

var init = function(params, callback) {
	var sqlClient = params.clients.sqlClient;
	var logger = params.clients.logger;

	var userId;

	switch(params.method) {
		case 'GET':
			// Get the page
			var q = "SELECT * FROM pages_lang WHERE language_id=" + sqlClient.escape(params.query.language) + " AND page_id=" + sqlClient.escape(params.query.page);

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
			// Update page per language
			if (! params.query.language) {
				callback({code:400, msg:"Missing param in query: language"});
				return;
			}
			if (! params.query.page) {
				callback({code:400, msg:"Missing param in query: page"});
				return;
			}

			// Use a smart UPSERT
			var q = "INSERT into pages_lang (page_id, language_id, title, content, added_on, added_by) VALUES (" + sqlClient.escape(params.query.page) + ", " + sqlClient.escape(params.query.language) + ", " + sqlClient.escape(params.query.title) + ", " + sqlClient.escape(params.query.content) + ", NOW(), " + params.user + ") ON DUPLICATE KEY UPDATE title=" + sqlClient.escape(params.query.title) + ", content=" + sqlClient.escape(params.query.content) + ", updated_on=NOW(), updated_by=" + params.user;

			sqlClient.query(q, function(error, sqlRows) {
				if (error) {
					callback({code:500, msg:"Unable to query database", error:q + "\n" + error});
					return;
				}

				callback({code:200, msg: "OK"});
			});
			return;

		case 'DELETE':
			//FIXME
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
