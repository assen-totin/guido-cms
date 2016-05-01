// Validate a session
var url = require('url');

var init = function(params, callback) {
	var sqlClient = params.clients.sqlClient;
	var logger = params.clients.logger;
	var sessionId;

	// For certain paths we always return OK (these are accessible without session ID):
	switch(params.urlParts.pathname) {
		case params.config.api.prefix + '/admin_login':
//		case '/user_signup':
//		case '/common_get_api':
//		case '/common_get_template':
			callback({code:200});
			return;
	}

	// Session ID via dedicated header (CORS clients)
	if (params.headers['x-session-id'])
		sessionId = params.headers['x-session-id'];
	else if (params.headers.cookie) {
		// Validate cookie name is correct
		var cookies = params.headers.cookie.split(";");
		for (var i=0; i<cookies.length; i++) {
			var parts = cookies[i].split("=");
			if (parts[0].trim() == "session") {
				sessionId = parts[1].trim();
				break;
			}
		}
	}

	// Verify we have a session ID
	if (! sessionId) {
		callback({code:401, msg:"No session provided", headers: {'WWW-Authenticate':'None'}});
		return;
	}

	// Validate session ID
	var q = "SELECT COUNT(*) AS res, s.user_id FROM sessions s JOIN users u ON u.id=s.user_id WHERE s.session_id=" + sqlClient.escape(sessionId) + " AND s.closed_on IS NULL";
	sqlClient.query(q, function(error, sqlRows) {
		if (error) {
			callback({code:500, msg:"Unable to query database", error:q + "\n" + error});
			return;
		}

		if (sqlRows[0].res == 0) {
			callback({code:401, msg:"Not logged in or session has expired.", headers: {'WWW-Authenticate':'None'}});
			return;
		}

		var ret = {
			code:200, 
			session:sessionId, 
			user:sqlRows[0].user_id, 
			level:sqlRows[0].level
		};

		callback(ret);
	});
}

module.exports = init;
