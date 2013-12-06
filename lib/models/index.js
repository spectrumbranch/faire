var Sequelize = require('sequelize');
var async = require('async');

var db_config_to_use = '';
switch (process.env.NODE_ENV) {
    case 'test_travis':
        db_config_to_use = '../../config/database.test_travis';
        break;
	case 'test':
		db_config_to_use = '../../config/database.test';
        break;
    case undefined:
    case 'production':
    case 'development':
        db_config_to_use = '../../config/database';
        break;
}
var dbconfig = require(db_config_to_use).config;

var dbname = dbconfig.db;
var dbhostname = dbconfig.hostname;
var dbport = dbconfig.port;
var dbuser = dbconfig.user;
var dbpassword = dbconfig.password;

var sequelize = new Sequelize(dbname, dbuser, dbpassword, {
    host: dbhostname,
    port: dbport
});

//list all faire models that will be loaded
var models = [
    {
        name: 'Task',
        file: 'task'
    },
	{
		name: 'Preference',
		file: 'preference'
	}
];

models.forEach(function(model) {
    module.exports[model.name] = sequelize.import(__dirname + '/' + model.file);
});

module.exports.init = function(virt_modules, done) {
    for (var i = 0; i < virt_modules.length; i++) {
        virt_modules[i].loadModels(module.exports);
    }
    (function(model) {
        //scurvy associations
        var scurvy = require('../').Scurvy;
        scurvy.setupAssociations(model);

        //faire associations
        model.User.hasMany(model.Task);
        model.Task.belongsTo(model.User);
		model.User.hasOne(model.Preference);
		model.Preference.belongsTo(model.User);

		//testing config
		var syncConfig = {};
		switch (process.env.NODE_ENV) {
			case 'test_travis':
			case 'test':
				syncConfig = { force: true };
				break;
		}
		
        //create tables if they don't already exist
        scurvy.setupSync(model, function(err) {
            if (err) { console.log('Error when trying to sync scurvy tables.'); }
			async.parallel({
				task: function(cb) {
					model.Task.sync(syncConfig).success(function() {
						cb();
					}).error(function(error) { console.log('Error during Task.sync(): ' + error); });
				},
				preference: function(cb) {
					model.Preference.sync(syncConfig).success(function() {
						cb();
					}).error(function(error) { console.log('Error during Preference.sync(): ' + error); });
				}
			}, function (errFaireSync, resultFaireSync) {
				done();
			});
            //faire tables
            
        }, syncConfig);
    })(module.exports);
};

module.exports.sequelize = sequelize;
