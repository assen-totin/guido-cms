// Log out a user

var init = function(params, callback) {
	var sqlClient = params.clients.sqlClient;
	var logger = params.clients.logger;

	// Validate method
	if (params.method != "GET") {
		callback({code:405, msg:"Method not accepted: " + params.method});
		return;
	}

	if (! params.session) {
		callback({code:400, msg:"Session not provided"});
		return;
	}

	// Close the session
	var q = "UPDATE sessions SET closed_on=NOW() WHERE session_id='" + params.session + "'";
	sqlClient.query(q, function(error) {
		if (error) {
			callback({code:500, msg:"Unable to query database", error:error});
			return;
		}

		callback({code:200});
		logger.trace("Session closed: " + params.session);
	});
}

module.exports = init;
