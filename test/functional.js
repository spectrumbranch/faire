var Faire = require('../lib');
var db = require('../lib/models');


//Tasks
require('./functional/tasks')(Faire, db);

//Preferences
require('./functional/preferences')(Faire, db);
