// Create a new session

var init = function(params, callback) {
	var sqlClient = params.clients.sqlClient;
	var logger = params.clients.logger;
	var userId = params.userId;

	// Close any previous session for this user
	q = "UPDATE sessions SET closed_on=NOW() WHERE user_id=" + userId;
	sqlClient.query(q, function(error) {
		if (error) {
			callback({code:500, msg:"Unable to query database", error:q + "\n" + error});
			return;
		}

		// Generate a random session ID as UUID-4
		var sessionId = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(
			/[xy]/g, function(c) {
			var r = Math.random() * 16 | 0, v = c === 'x' ? r : (r & 0x3 | 0x8);
			return v.toString(16);
		});

		// Add session ID to sessions table
		q = "INSERT INTO sessions (user_id, session_id, created_on) VALUES (" + userId + ", '" + sessionId + "', NOW())";
		sqlClient.query(q, function(error2) {
			if (error2) {
				callback({code:500, msg:"Unable to query database", error:q + "\n" + error2});
				return;
			}

			// Send a cookie for regular front-ends and custom header for CORS clients
			var resp = {
				code: 200,
				headers:{
					'Set-Cookie': 'session=' + sessionId,
					'X-Session-Id': sessionId,
					'Access-Control-Expose-Headers': 'X-Session-Id'
				}
			};

			callback(resp);
			logger.trace("User logged in: " + params.query.username);
		});
	});
}

module.exports = init;
