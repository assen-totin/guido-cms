// A small module to encrypt passwords and make them look like resulting from MySQL PASSWORD() while in fact they are not

var crypto = require('crypto');

var getSalt = function() {
	var salt = 'xxxxxxxx'.replace(/[xy]/g, function(c) {
		var r = Math.random() * 16 | 0, v = c === 'x' ? r : (r & 0x3 | 0x8);
		return v.toString(16);
	}).toUpperCase();
	return salt;
};

var encryptPassword = function(password, salt) {
	var md5sum = crypto.createHash('md5');
	md5sum.update(password);

	if (! salt)
		salt = getSalt();
	md5sum.update(salt);

	var hash = md5sum.digest('hex')
	return("*" + salt + hash.toUpperCase());
};

var checkPassword = function(saved, user) {
	if (! saved)
		return false;
	if (saved.length < 41)
		return false;

	var salt = saved.substring(1,9);
	var enc = encryptPassword(user, salt);
	return (enc == saved);
};

var init = {
	encryptPassword: encryptPassword,
	checkPassword: checkPassword,
};

module.exports = init;

