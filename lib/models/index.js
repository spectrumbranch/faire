var Sequelize = require('sequelize');

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
        name: 'task',
        file: 'task'
    },
    {
        name: 'preference',
        file: 'preference'
    },
    {
        name: 'list',
        file: 'list'
    },
    {
        name: 'sharedlists',
        file: 'sharedlists'
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
        model.user.hasMany(model.task);
        model.task.belongsTo(model.user);
        model.user.hasOne(model.preference);
        model.preference.belongsTo(model.user);
        
        model.list.hasMany(model.task);
        model.task.belongsTo(model.list);
        
        model.list.belongsTo(model.user, { as: 'Owner', foreignKey: 'OwnerId' });
        model.list.belongsToMany(model.user, { as: 'SharedUsers', through: model.sharedlists });
        model.user.belongsToMany(model.list, { as: 'SharedLists', through: model.sharedlists });
        
        //testing config
        var syncConfig = {};
        switch (process.env.NODE_ENV) {
            case 'test_travis':
            case 'test':
                console.log('*** TEST MODE');
                syncConfig = { force: true };
                break;
        }
        //create tables if they don't already exist
        sequelize.sync(syncConfig).then(function() {
            console.log('Successfully completed Faire sync()!');
            done();
        }).catch(function(error) {
            console.log('Error during Faire sync(): ', error);
            done();
        });
    })(module.exports);
};

module.exports.sequelize = sequelize;
