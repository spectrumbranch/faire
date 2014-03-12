var internals = {};

internals.home_view = function() {
	var request = this;
	var user = request.auth.credentials;
	console.log(user);
	
	var themeIndex = '';
	if (user.preference == null || user.preference.theme == null || user.preference.theme == '' || user.preference.theme == 'default') {
		themeIndex = 'themes/default/index';
	} else {
		themeIndex = 'themes/'+user.preference.theme+'/index';
	}
	
	return request.reply.view(themeIndex, {});
}

exports.home_view = internals.home_view;