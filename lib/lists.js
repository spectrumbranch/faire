var Faire;
var internals = {};
internals.DEFAULT_STATUS = 'active';

internals.data = require('./models');

internals.getTasksForListClosure = function(list, userid) {
    return function(done) {
        Faire.Tasks.getAll({ user: userid, list: list.id }, function(err, tasks) {
            done(err, tasks);
        });
    };
};

internals.getAllClosure = function(list, userid) {
    return function(done) {
        Lists.get({ id: list.id, user: userid }, function(err1, getList) {
            done(null, getList);
        });
    };
};

internals.getAllParallelClosure = function(lists, userid, cb) {
    var fnlist = [];
    
    var total_count = lists.length;
    for (var i = 0; i < total_count; i++) {
        var list = lists[i];
        fnlist.push(internals.getAllClosure(list, userid));
    }
    return fnlist;
};

internals.shareClosure = function(list, userid) {
    return function(done) {
        internals.data.user.findById(userid).then(function(user) {
            list.addSharedUser(user, { write: true }).then(function() {
                done(null, userid);
            });
        });
    };
};

internals.shareParallelClosure = function(list, users) {
    var fnlist = [];
    
    for (var i = 0; i < users.length; i++) {
        var userid = users[i];
        fnlist.push(internals.shareClosure(list, userid));
    }
    
    return fnlist;
};

internals.unshareClosure = function(list, userid) {
    return function(done) {
        internals.data.user.findById(userid).then(function(user) {
            list.removeSharedUser(user).then(function() {
                done(null, userid);
            });
        });
    };
};

internals.unshareParallelClosure = function(list, users) {
    var fnlist = [];
    
    for (var i = 0; i < users.length; i++) {
        var userid = users[i];
        fnlist.push(internals.unshareClosure(list, userid));
    }
    
    return fnlist;
};

//This function checks that the input id is of the right type. it does not check if the id exists for an item in the database.
exports.isValidID = internals.isValidID = function isValidID(input) {
    var isValid = true;
    var original = input;
    
    input = parseInt(input);
    
    var isBad = isNaN(input) || original !== input;

    isValid = !isBad;

    return isValid;
}

var Lists = {};

Lists.add = function(input, callback) {
    var errorMessages = [];
    //validate fields
    if (!input.user) {
        errorMessages.push('Lists.add: Object field "user" is required.');
    }
    if (!input.name) {
        errorMessages.push('Lists.add: Object field "name" is required.');
    }
    
    if (errorMessages.length > 0) {
        callback(new Error(errorMessages));
    } else {
        var list_status = internals.DEFAULT_STATUS; //default
        if (input.status) {
            list_status = input.status;
        }
        Faire.Async.parallel({
            user: function(cb) {
                internals.data.user.findById(parseInt(input.user)).then(function(user) {
                    cb(null, user);
                });
            }
        },
        function (err, results) {
            var user = results.user;
            if (user == null) {
                //bad input or associated user doesn't exist
                errorMessages.push('The user does not exist.');
            }
            
            if (errorMessages.length > 0) {
                callback(new Error(errorMessages));
            } else {
                internals.data.list.create({ name: input.name, status: list_status }).then(function(newList) {
                    newList.setOwner(user).then(function() {
                        //success
                        newList.tasks = [];
                        callback(null, newList);
                    });
                });
            }
        });
    }
};

Lists.activate = function(input, callback) {
    var errorMessages = [];
    //test existence of fields
    if (!input.id) {
        errorMessages.push('Lists.activate: Object field "id" is required.');
    }
    if (!input.user) {
        errorMessages.push('Lists.activate: Object field "user" is required.');
    }
    input.id = parseInt(input.id);
    
    //validate fields
    if (!internals.isValidID(input.id)) {
        errorMessages.push('Lists.activate: Object field "id" must be an integer.');
    }
    
    if (errorMessages.length > 0) {
        callback(new Error(errorMessages));
    } else {
        Faire.Lists.isListVisible({user: input.user, id: input.id}, function(err, listIsVisible) {
            if (!err) {
                if (listIsVisible) {
                    internals.data.list.find({ where: { id: input.id }, include: [{ model: internals.data.user, as: 'Owner' }] }).then(function(list) {
                        list.updateAttributes({
                            status: 'active'
                        }).then(function(output_list) {
                            var output = {};
                        
                            output.id = output_list.id;
                            output.name = output_list.name;
                            output.userid = output_list.Owner.id;
                            output.email = output_list.Owner.email;
                            output.createdAt = output_list.createdAt;
                            output.updatedAt = output_list.updatedAt;
                            output.status = output_list.status;
                            return callback(null, output);
                        })
                    });
                } else {
                    return callback(new Error('User does not have permission for that action.'));
                }
            } else {
                return callback(err);
            }
        });
    }
}

Lists.inactivate = function(input, callback) {
    var errorMessages = [];
    //test existence of fields
    if (!input.id) {
        errorMessages.push('Lists.inactivate: Object field "id" is required.');
    }
    if (!input.user) {
        errorMessages.push('Lists.inactivate: Object field "user" is required.');
    }
    input.id = parseInt(input.id);
    
    //validate fields
    if (!internals.isValidID(input.id)) {
        errorMessages.push('Lists.inactivate: Object field "id" must be an integer.');
    }
    
    if (errorMessages.length > 0) {
        callback(new Error(errorMessages));
    } else {
        Faire.Lists.isListVisible({user: input.user, id: input.id}, function(err, listIsVisible) {
            if (!err) {
                if (listIsVisible) {
                    internals.data.list.find({ where: { id: input.id }, include: [{ model: internals.data.user, as: 'Owner' }] }).then(function(list) {
                        list.updateAttributes({
                            status: 'inactive'
                        }).then(function(output_list) {
                            var output = {};
                        
                            output.id = output_list.id;
                            output.name = output_list.name;
                            output.ownerId = output_list.Owner.id;
                            output.email = output_list.Owner.email;
                            output.createdAt = output_list.createdAt;
                            output.updatedAt = output_list.updatedAt;
                            output.status = output_list.status;
                            callback(null, output);
                        })
                    });
                } else {
                    return callback(new Error('User does not have permission for that action.'));
                }
            } else {
                return callback(err);
            }
        });
    }
}

Lists.delete = function(input, callback) {
    var errorMessages = [];
    //test existence of fields
    if (!input.id) {
        errorMessages.push('Lists.delete: Object field "id" is required.');
    }
    if (!input.user) {
        errorMessages.push('Lists.delete: Object field "user" is required.');
    }
    input.id = parseInt(input.id);
    
    //validate fields
    if (!internals.isValidID(input.id)) {
        errorMessages.push('Lists.delete: Object field "taskid" must be an integer.');
    }
    
    if (errorMessages.length > 0) {
        callback(new Error(errorMessages));
    } else {
		Faire.Lists.isListVisible({user: input.user, id: input.id}, function(err, listIsVisible) {
            if (!err) {
                if (listIsVisible) {
                    internals.data.list.find({ where: { id: input.id }, include: [{ model: internals.data.user, as: 'Owner' }] }).then(function(list) {
                        list.updateAttributes({
                            status: 'deleted'
                        }).then(function(output_list) {
                            var output = {};
                        
                            output.id = output_list.id;
                            output.name = output_list.name;
                            output.ownerId = output_list.Owner.id;
                            output.email = output_list.Owner.email;
                            output.createdAt = output_list.createdAt;
                            output.updatedAt = output_list.updatedAt;
                            output.status = output_list.status;
                            callback(null, output);
                        })
                    });
                } else {
                    return callback(new Error('User does not have permission for that action.'));
                }
            } else {
                return callback(err);
            }
        });
    }
};

Lists.update = function(input, callback) {
    var errorMessages = [];
    //test existence of required fields
    if (!input.id) {
        errorMessages.push('Lists.update: Object field "id" is required.');
    }
    if (!input.user) {
        errorMessages.push('Lists.update: Object field "user" is required.');
    }
    input.id = parseInt(input.id);
    
    //validate fields
    if (!internals.isValidID(input.id)) {
        errorMessages.push('Lists.update: Object field "id" must be an integer.');
    }
    
    //optional fields
    //name , status
    var updateThese = {};
    if (input.name) {
        updateThese.name = input.name;
    }
    if (input.status) {
        updateThese.status = input.status;
    }
    
    if (errorMessages.length > 0) {
        return callback(new Error(errorMessages));
    } else {
        Faire.Lists.isListVisible({user: input.user, id: input.id}, function(err, listIsVisible) {
            if (err) {
                return callback(new Error(err));
            }
            if (listIsVisible) {
                internals.data.list.find({ where: { id: input.id }, include: [{ model: internals.data.user, as: 'Owner' }] }).then(function(list) {
                    list.updateAttributes(updateThese).then(function(output_list) {
                        var output = {};
                    
                        output.id = output_list.id;
                        output.name = output_list.name;
                        output.ownerId = output_list.Owner.id;
                        output.email = output_list.Owner.email;
                        output.createdAt = output_list.createdAt;
                        output.updatedAt = output_list.updatedAt;
                        output.status = output_list.status;
                        return callback(null, output);
                    })
                });
            } else {
                return callback(new Error('User does not have permission for that action.'));
            }
        });
    }
};

Lists.get = function(input, callback) {
    var errorMessages = [];
    //test existence of required fields
    if (!input.id) {
        errorMessages.push('Lists.get: Object field "id" is required.');
    }
    if (!input.user) {
        errorMessages.push('Lists.get: Object field "user" is required.');
    }

    //?TODO future: test if input is an array in case they pass an array of ids?

    
    if (errorMessages.length > 0) {
        callback(new Error(errorMessages));
    } else {
        internals.data.list.find({ 
            where: { 
                id: input.id,
                [Faire.Sequelize.Op.or]: [{
                    '$SharedUsers.id$': input.user,
                }, {
                    OwnerId: input.user
                }]
            },
            include: [
                {
                    model: internals.data.user, 
                    as: 'SharedUsers',
                    required: false
                },
                {
                    model: internals.data.user,
                    as: 'Owner'
                }
            ]
        }).then(function(list_record) {
            var output = {};
            if (list_record != null) {
                
                output.id = list_record.id;
                output.name = list_record.name;
                var owner = {};
                owner.id = list_record.OwnerId;
                owner.email = list_record.Owner.email;
                
                output.owner = owner;
                
                output.createdAt = list_record.createdAt;
                output.updatedAt = list_record.updatedAt;
                output.status = list_record.status;
                
                Lists.getSharedUsers({ id: input.id }, function(err, sharedUsers) {
                    var _sharedUsers = [];

                    if (sharedUsers.length) {
                        for (var i = 0; i < sharedUsers.length; i++) {
                            var _sharedUser = {};
                            _sharedUser.id = sharedUsers[i].id;
                            _sharedUser.email = sharedUsers[i].email;
                            _sharedUsers.push(_sharedUser);
                        }
                    }

                    output.sharedUsers = _sharedUsers;
                    Faire.Tasks.getAll({ user: input.user, list: input.id }, function(err, tasks) {
                        output.tasks = tasks;
                        callback(null, output);
                    });
                });
            } else {
                //provides default situation if no record
                callback(null, output);
            }
        })
    }
};

Lists.getAll = function(input, callback) {
    var errorMessages = [];
    //test existence of required fields
    if (!input.user) {
        errorMessages.push('Lists.getAll: Object field "user" is required.');
    }
    //TODO: optional fields:
    // order, group, where, limit, offset
    //?TODO future: test if input is an array in case they pass an array of ids?

    if (errorMessages.length > 0) {
        callback(new Error(errorMessages));
    } else {
        //Base query
        var query = { 
            where: {
                [Faire.Sequelize.Op.or]: [{
                    '$SharedUsers.id$': input.user,
                }, {
                    OwnerId: input.user
                }]
            },
            include: [
                {
                    model: internals.data.user, 
                    as: 'SharedUsers',
                    required: false
                },
                {
                    model: internals.data.user,
                    as: 'Owner'
                }
            ]
        };
        
        //Optional changes to base query
        if (!input.includeDeleted) {
            query.where.status = { [Faire.Sequelize.Op.ne]: 'deleted' };
        }
        
        internals.data.list.findAll(query).then(function(lists) {
            Faire.Async.parallel(internals.getAllParallelClosure(lists, input.user), function(err, results) {
                callback(err, results);
            });
        })
    }
};

Lists.share = function(input, callback) {
    var errorMessages = [];
    //test existence of required fields
    if (!input.users || !Array.isArray(input.users) || (Array.isArray(input.users) && input.users.length == 0)) {
        errorMessages.push('Lists.share: Object field "users" is required and must be a non-empty array.');
    }
    if (!input.id) {
        errorMessages.push('Lists.share: Object field "id" is required.');
    }
    
    if (errorMessages.length > 0) {
        callback(new Error(errorMessages));
    } else {
        internals.data.list.findById(input.id).then(function(list) {
            Faire.Async.parallel(internals.shareParallelClosure(list,input.users), function(err, results) {
                callback(err, results);
            })
        });
    }
};

Lists.unshare = function(input, callback) {
    var errorMessages = [];
    //test existence of required fields
    if (!input.users || !Array.isArray(input.users) || (Array.isArray(input.users) && input.users.length == 0)) {
        errorMessages.push('Lists.unshare: Object field "users" is required and must be a non-empty array.');
    }
    if (!input.id) {
        errorMessages.push('Lists.unshare: Object field "id" is required.');
    }
    
    if (errorMessages.length > 0) {
        callback(new Error(errorMessages));
    } else {
        internals.data.list.findById(input.id).then(function(list) {
            Faire.Async.parallel(internals.unshareParallelClosure(list,input.users), function(err, results) {
                callback(err, results);
            })
        });
    }
};

Lists.isListVisible = function(input, callback) {
    var errorMessages = [];
    //test existence of required fields
    if (!input.user) {
        errorMessages.push('Lists.isListVisible: Field "user" is required.');
    }
    if (!input.id) {
        errorMessages.push('Lists.isListVisible: Field "id" is required.');
    }

    if (errorMessages.length > 0) {
        callback(new Error(errorMessages));
    } else {
        internals.data.list.count({ 
            where: { 
                id: input.id,
                [Faire.Sequelize.Op.or]: [{
                    '$SharedUsers.id$': input.user
                }, {
                    '$list.OwnerId$': input.user
                }]
            },
            include: [{
                model: internals.data.user, 
                as: 'SharedUsers',
                required: false
            }]
        }).then(function(count) {
            var output;
            
            if (count > 0) {
                output = true;
            } else {
                output = false;
            }
            
            callback(null, output);
        })
    }
};

Lists.getSharedUsers = function(input, callback) {
    var errorMessages = [];
    //test existence of required fields
    if (!input.id) {
        errorMessages.push('Lists.getSharedUsers: Object field "id" is required.');
    }

    if (errorMessages.length > 0) {
        callback(new Error(errorMessages));
    } else {
        internals.data.list.find({ where: { id: input.id }, include: [{ model: internals.data.user, as: 'SharedUsers' }] }).then(function(listWithSharedUsers) {
            var output;
            output = listWithSharedUsers.SharedUsers;
            callback(null, output);
        })
    }
};

module.exports = function(faire) {
    Faire = faire;
    return Lists;
}