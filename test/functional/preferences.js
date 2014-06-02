var assert = require('assert');
var Faire;
var db;
var Fixtures;

module.exports = function(faire, DB, fixtures) {
	Faire = faire;
	db = DB;
	Fixtures = fixtures;
}

describe('Faire.Preferences API', function() {
	var user_id_1;
	var theme_1 = 'default';
	before(function(done) {
		var email1 = Fixtures.Preferences.Users[0].email;//'preftests@test.com';
		var passwrd1 = Fixtures.Preferences.Users[0].password;//'dfdiuw437thudsriweaw3';

		var virt_modules = [];
		virt_modules.push(Faire.Scurvy);

		db.init(virt_modules, function() {
			console.log('-------- database setup complete --------');
			Faire.Scurvy.createUser({email: email1, passwrd: passwrd1, status: 'active'}, function(err, userball1) {
				user_id_1 = userball1.user.id
				done();
			});
		});
	})
	describe('#preferences', function() {
		it('should change the set theme in the preferences object and return the changed object', function(done) {
			Faire.Preferences.get({ user: user_id_1 }, function(err, preference) {
				//expect default
				assert(err == null);
				assert(preference != null);
				assert(preference.theme == 'default');
				
				Faire.Preferences.setTheme( { user: user_id_1, theme: 'notdefault' }, function(err2, changedPrefs) {
					assert(err2 == null);
					assert(changedPrefs != null);
					assert(changedPrefs.theme == 'notdefault');
					
					Faire.Preferences.get({ user: user_id_1 }, function(err3, getUpdatedPrefs) {
						assert(err3 == null);
						assert(getUpdatedPrefs != null);
						assert(getUpdatedPrefs.theme == 'notdefault');
						done();
					})
				})
			});
		});
	})
})