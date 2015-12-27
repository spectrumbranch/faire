var Faire = require('../lib');
var db = require('../lib/models');
var Fixtures = require('./fixtures');


//Tasks
require('./functional/tasks')(Faire, db, Fixtures);

//Lists
require('./functional/lists')(Faire, db, Fixtures);

//Preferences
require('./functional/preferences')(Faire, db, Fixtures);

//Users
require('./functional/users')(Faire, db, Fixtures);