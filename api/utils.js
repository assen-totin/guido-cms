var sanitise = function(path, type) {
	var ret = path;

	switch(type) {
		case 'name':
			ret = ret.replace('/', '_');
		case 'dir':
			ret = ret.replace('..', '__');
	}

	return ret;
};

module.exports = {
	sanitise: sanitise,
};
