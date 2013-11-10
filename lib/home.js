var internals = {};

internals.home_view = function() {
	return this.reply.view('index', {});
}

exports.home_view = internals.home_view;