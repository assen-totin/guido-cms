/**
 * SQL wrapper module for Node.js
 * Limited support for MySQL and SQLite3 (connect, query, escape, end).
 */

var ConfigLoader = require('./config');

var wrapper = function() {
	this.config = ConfigLoader('sql');

	// Database connection
	this.db = null;
};

wrapper.prototype.connect = function(callback) {
	var config = ConfigLoader(this.config.use);

	switch(this.config.use) {
		case 'mysql':		
			var mysql = require('mysql');
			this.db = mysql.createConnection(this.config.mysql);
			this.db.connect(function(error){
				if (callback)
					callback(error);
			});
			break;
		case 'sqlite3':
			var sqlite3 = require('sqlite3');
			this.db = new sqlite3.Database(this.config.sqlite3.database, function(error, result){
				if (callback)
					callback(error, result);
			});
			break;
	}

};

wrapper.prototype.query = function(query, callback) {
	switch(this.config.use) {
		case 'mysql':
			this.db.query(query, function(error, result){
				if (callback)
					callback(error, result);
			});
			break;
		case 'sqlite3':
			this.db.all(query, function(error, result) {
				if (callback)
					callback(error, result);
			})
			break;
	}
};

wrapper.prototype.escape = function(value) {
	switch(this.config.use) {
		case 'mysql':
			return this.db.escape(value);
		case 'sqlite3':
			// SQLite has no own escaping funciton, so we create a simple one -only for numbers, strings and booleans
			return this._escapeSqlite3(value);
	}
};

wrapper.prototype.end = function() {
	switch(this.config.use) {
		case 'mysql':
			this.db.end();
			break;
		case 'sqlite3':
			this.db.close();
			break;
	}
};

// Service function to escape strings in SQLite3 style
wrapper.prototype._escapeSqlite3 = function(val) {
	if (val === undefined || val === null)
		return 'NULL';

	switch (typeof val) {
		case 'boolean': return (val) ? 'true' : 'false';
		case 'number': return val+'';
	}

	if (val instanceof Date)
		return 'NULL';

	if (Buffer.isBuffer(val))
		return 'NULL';

	if (Array.isArray(val))
		return 'NULL';

	if (typeof val === 'object')
		return 'NULL';

	val = val.replace(/[\0\n\r\b\t\\\'\"\x1a]/g, function(s) {
		switch(s) {
			case "\0": return "\\0";
			case "\n": return "\\n";
			case "\r": return "\\r";
			case "\b": return "\\b";
			case "\t": return "\\t";
			case "\x1a": return "\\Z";
			case "\'": return "''";
			default: return "\\"+s;
		}
	});

	return "'"+val+"'";
};


module.exports = wrapper;

