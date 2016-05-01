// Log in a user (from local DB)
var createSession = require('./lib/session_create');
var passwd = require('./lib/password');

var init = function(params, callback) {
	var sqlClient = params.clients.sqlClient;
	var logger = params.clients.logger;

	var userId;

	// Validate method
	if (params.method != "POST") {
		callback({code:405, msg: "Method not accepted: " + params.method});
		return;
	}

	// Mandatory params
	var mandatoryParams = ['username', 'password'];
	for (var i=0; i<mandatoryParams.length; i++) {
		if (! params.query.hasOwnProperty(mandatoryParams[i])) {
			callback({code:400, msg:"Missing param in query: " + mandatoryParams[i]});
			return;
		}
	}

	var username = sqlClient.escape(params.query.username);

	var q = "SELECT id, password FROM users WHERE username=" + username + " AND status='active'";
	sqlClient.query(q, function(error, sqlRows) {
		if (error) {
			callback({code:500, msg:"Unable to query database", error:q + "\n" + error});
			return;
		}

		if (sqlRows.length > 0) {
			if (passwd.checkPassword(sqlRows[0].password, params.query.password)) {
				params.userId = sqlRows[0].id;
				createSession(params, function(resp) {
					callback(resp);
				});
				return;
			}
		}

		callback({code:403, msg:"Wrong username or password"});
	});
}

module.exports = init;
