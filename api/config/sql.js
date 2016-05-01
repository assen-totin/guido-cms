// External connections

var paramsMysql = {
	host     : 'localhost',
	user     : 'root',
	password : '',
	database : 'guido'
};

var paramsSqlite3 = {
	database: '/usr/lib/guido/guido.sqlite',
};

// Which DB to use
var use = 'mysql';

var config = {
	mysql: paramsMysql,
	sqlite3: paramsSqlite3,
	use: use,

}

module.exports = config;
