var assert = require('assert');
var Faire;
var db;
var Fixtures;

module.exports = function(faire, DB, fixtures) {
    Faire = faire;
    db = DB;
    Fixtures = fixtures;
}

describe('Faire.Users API', function() {
    var user_id_1
      , email1;
    before(function(done) {
        email1 = Fixtures.Preferences.Users[0].email;//'preftests@test.com';
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
    after(function() {
        db.close();
    })
    describe('#getByEmail', function() {
        it('should get the user object if it exists, else return null for the id', function(done) {
            Faire.Users.getByEmail({ email: email1 }, function(err, user) {
                //expect default
                assert(err == null);
                assert(user != null);
                assert(user.email == email1);
                assert(user.id == user_id_1);

                Faire.Users.getByEmail({ email: 'notexistingemail@nowhere.com' }, function(err2, userExpectedNull) {
                    try {
                        assert(err2 == null);
                        assert(userExpectedNull != null);
                        assert(userExpectedNull.email == 'notexistingemail@nowhere.com' );
                        assert(userExpectedNull.id == null);
                        done();
                    } catch (e) {
                        done(e);
                    }
                })
            });
        });
    })
})