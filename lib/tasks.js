var Faire;
var internals = {};
internals.DEFAULT_STATUS = 'active';

internals.data = require('./models');

//This function checks that the input id is of the right type. it does not check if the id exists for an item in the database.
exports.isValidID = internals.isValidID = function isValidID(input) {
    var isValid = true;
    var original = input;
    
    input = parseInt(input);
    
    var isBad = isNaN(input) || original !== input;

    isValid = !isBad;

    return isValid;
}

var Tasks = {};

Tasks.add = function(input, callback) {
    var errorMessages = [];
    //validate fields
    if (!input.user) {
        errorMessages.push('Tasks.add: Object field "user" is required.');
    }
    if (!input.name) {
        errorMessages.push('Tasks.add: Object field "name" is required.');
    }
    if (!input.list) {
        errorMessages.push('Tasks.add: Object field "list" is required.');
    }
    
    if (errorMessages.length > 0) {
        callback(new Error(errorMessages));
    } else {
        var task_status = internals.DEFAULT_STATUS; //default
        if (input.status) {
            task_status = input.status;
        }
        Faire.Async.parallel({
            user: function(cb) {
                internals.data.user.findById(parseInt(input.user)).then(function(user) {
                    cb(null, user);
                });
            },
            list: function(cb) {
                internals.data.list.findById(parseInt(input.list)).then(function(list) {
                    cb(null, list);
                });
            }
        },
        function (err, results) {
            var user = results.user;
            var list = results.list;
            if (user == null) {
                //bad input or associated user doesn't exist
                errorMessages.push('The user does not exist.');
            }
            if (list == null) {
                //bad input or associated list doesn't exist
                errorMessages.push('The list does not exist.');
            }
            
            if (errorMessages.length > 0) {
                callback(new Error(errorMessages));
            } else {
                internals.data.task.create({ name: input.name, status: task_status }).then(function(newTask) {
                    newTask.setUser(user).then(function() {
                        newTask.setList(list).then(function() {
                            //success
                            callback(null, newTask);
                        });
                    });
                });
            }
        });
    }
}

Tasks.activate = function(input, callback) {
    var errorMessages = [];
    //test existence of fields
    if (!input.id) {
        errorMessages.push('Tasks.activate: Object field "id" is required.');
    }
    if (!input.user) {
        errorMessages.push('Tasks.activate: Object field "user" is required.');
    }
    input.id = parseInt(input.id);
    
    //validate fields
    if (!internals.isValidID(input.id)) {
        errorMessages.push('Tasks.activate: Object field "id" must be an integer.');
    }
    
    if (errorMessages.length > 0) {
        callback(new Error(errorMessages));
    } else {
        Faire.Tasks.isTaskVisible({ id: input.id, user: input.user }, function(err, isVisible) {
            if (!err) {
                if (isVisible) {
                    internals.data.task.find({ where: { id: input.id }, include: [internals.data.user] }).then(function(task) {
                        task.updateAttributes({
                            status: 'active'
                        }).then(function(output_task) {
                            var output = {};
                        
                            output.id = output_task.id;
                            output.name = output_task.name;
                            output.userid = output_task.user.id;
                            output.email = output_task.user.email;
                            output.createdAt = output_task.createdAt;
                            output.updatedAt = output_task.updatedAt;
                            output.status = output_task.status;
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

Tasks.inactivate = function(input, callback) {
    var errorMessages = [];
    //test existence of fields
    if (!input.id) {
        errorMessages.push('Tasks.inactivate: Object field "id" is required.');
    }
    if (!input.user) {
        errorMessages.push('Tasks.inactivate: Object field "user" is required.');
    }
    input.id = parseInt(input.id);
    
    //validate fields
    if (!internals.isValidID(input.id)) {
        errorMessages.push('Tasks.inactivate: Object field "id" must be an integer.');
    }
    
    if (errorMessages.length > 0) {
        callback(new Error(errorMessages));
    } else {
        Faire.Tasks.isTaskVisible({ id: input.id, user: input.user }, function(err, isVisible) {
            if (!err) {
                if (isVisible) {
                    internals.data.task.find({ where: { id: input.id }, include: [internals.data.user] }).then(function(task) {
                        try {
                            task.updateAttributes({
                                status: 'inactive'
                            }).then(function(output_task) {
                                var output = {};
                            
                                output.id = output_task.id;
                                output.name = output_task.name;
                                output.userid = output_task.user.id;
                                output.email = output_task.user.email;
                                output.createdAt = output_task.createdAt;
                                output.updatedAt = output_task.updatedAt;
                                output.status = output_task.status;
                                callback(null, output);
                            }).catch(function(e) {
                                console.log('task.inactive ERROR: ', e);
                            })
                        } catch (e) {
                            console.log('task.inactive ERROR2: ', e);
                        }
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

Tasks.delete = function(input, callback) {
    var errorMessages = [];
    //test existence of fields
    if (!input.id) {
        errorMessages.push('Tasks.delete: Object field "id" is required.');
    }
    if (!input.user) {
        errorMessages.push('Tasks.delete: Object field "user" is required.');
    }
    input.id = parseInt(input.id);
    
    //validate fields
    if (!internals.isValidID(input.id)) {
        errorMessages.push('Object field "taskid" must be an integer.');
    }
    
    if (errorMessages.length > 0) {
        callback(new Error(errorMessages));
    } else {
        Faire.Tasks.isTaskVisible({ id: input.id, user: input.user }, function(err, isVisible) {
            if (!err) {
                if (isVisible) {
                    internals.data.task.find({ where: { id: input.id }, include: [internals.data.user] }).then(function(task) {
                        task.updateAttributes({
                            status: 'deleted'
                        }).then(function(output_task) {
                            var output = {};
                        
                            output.id = output_task.id;
                            output.name = output_task.name;
                            output.userid = output_task.user.id;
                            output.email = output_task.user.email;
                            output.createdAt = output_task.createdAt;
                            output.updatedAt = output_task.updatedAt;
                            output.status = output_task.status;
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

Tasks.update = function(input, callback) {
    var errorMessages = [];
    //test existence of required fields
    if (!input.id) {
        errorMessages.push('Tasks.update: Object field "id" is required.');
    }
    if (!input.user) {
        errorMessages.push('Tasks.update: Object field "user" is required.');
    }
    input.id = parseInt(input.id);
    
    //validate fields
    if (!internals.isValidID(input.id)) {
        errorMessages.push('Tasks.update: Object field "id" must be an integer.');
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
        callback(new Error(errorMessages));
    } else {
        Faire.Tasks.isTaskVisible({ id: input.id, user: input.user }, function(err, isVisible) {
            if (!err) {
                if (isVisible) {
                    internals.data.task.find({ where: { id: input.id }, include: [internals.data.user] }).then(function(task) {
                        task.updateAttributes(updateThese).then(function(output_task) {
                            var output = {};
                        
                            output.id = output_task.id;
                            output.name = output_task.name;
                            output.userid = output_task.user.id;
                            output.email = output_task.user.email;
                            output.createdAt = output_task.createdAt;
                            output.updatedAt = output_task.updatedAt;
                            output.status = output_task.status;
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

Tasks.get = function(input, callback) {
    var errorMessages = [];
    //test existence of required fields
    if (!input.id) {
        errorMessages.push('Tasks.get: Object field "id" is required.');
    }
    if (!input.user) {
        errorMessages.push('Tasks.get: Object field "user" is required.');
    }
    
    if (errorMessages.length > 0) {
        callback(new Error(errorMessages));
    } else {
        Faire.Tasks.isTaskVisible({ id: input.id, user: input.user }, function(err, isVisible) {
            if (!err) {
                if (isVisible) {
                    internals.data.task.find({ where: { id: input.id }, include: [internals.data.user] }).then(function(task) {
                        var output = {};
                        if (task != null) {
                            output.id = task.id;
                            output.name = task.name;
                            output.userid = task.user.id;
                            output.email = task.user.email;
                            output.createdAt = task.createdAt;
                            output.updatedAt = task.updatedAt;
                            output.status = task.status;
                        }
                        
                        callback(null, output);
                    })
                } else {
                    return callback(new Error('User does not have permission for that action.'));
                }
            } else {
                return callback(err);
            }
        });
    }
}

Tasks.getAll = function(input, callback) {
    var errorMessages = [];
    //test existence of required fields
    if (!input.user) {
        errorMessages.push('Tasks.getAll: Object field "user" is required.');
    }
    if (!input.list) {
        errorMessages.push('Tasks.getAll: Object field "list" is required.');
    }
    
        
    //TODO: optional fields:
    // order, group, where, limit, offset
    //?TODO future: test if input is an array in case they pass an array of ids?
    //validate fields
    
    
    Faire.Lists.isListVisible({user: input.user, id: input.list}, function(err, listIsVisible) {
        if (err) {
            errorMessages.push(err);
        }
        
        if (errorMessages.length > 0) {
            callback(new Error(errorMessages));
        } else {
            if (listIsVisible) {
                //Base query
                var query = {
                    where: {
                        listId: input.list
                    },
                    include: [
                        internals.data.user
                    ]
                };
                
                //Optional changes to base query
                if (!input.includeDeleted) {
                    query.where.status = { $ne: 'deleted' };
                }
                
                internals.data.task.findAll(query).then(function(tasks) {
                    var output = [];
                    var total_count = tasks.length;
                    
                    for (var i = 0; i < total_count; i++) {
                        var output_single = {};

                        output_single.id = tasks[i].id;
                        output_single.name = tasks[i].name;
                        output_single.userid = tasks[i].user.id;
                        output_single.email = tasks[i].user.email;
                        output_single.createdAt = tasks[i].createdAt;
                        output_single.updatedAt = tasks[i].updatedAt;
                        output_single.status = tasks[i].status;
                        output_single.listid = tasks[i].listid;
                        
                        output.push(output_single);
                    }
                    callback(null, output);
                })
            } else {
                callback(null, []);
            }
        }
    });
}

Tasks.getListOfTask = function(input, callback) {
    var errorMessages = [];
    //test existence of required fields
    if (!input.id) {
        errorMessages.push('Tasks.getListOfTask: Object field "id" is required.');
    }
    
    if (errorMessages.length > 0) {
        callback(new Error(errorMessages));
    } else {
        internals.data.task.find({ where: { id: input.id } }).then(function(task) {
            var output = null;
            
            if (task != null) {
                output = task.listId;
            }

            callback(null, output);
        })
    }
}

Tasks.isTaskVisible = function(input, callback) {
    var errorMessages = [];
    //test existence of required fields
    if (!input.id) {
        errorMessages.push('Tasks.isTaskVisible: Object field "id" is required.');
    }
    if (!input.user) {
        errorMessages.push('Tasks.isTaskVisible: Object field "user" is required.');
    }
    
    if (errorMessages.length > 0) {
        callback(new Error(errorMessages));
    } else {
        Tasks.getListOfTask({ id: input.id }, function(err1, listOfTask) {
            if (err1) {
                return callback(err1);
            } else {
                if (listOfTask == null) {
                    return callback(null, false);
                } else {
                    Faire.Lists.isListVisible({user: input.user, id: listOfTask}, function(err2, listIsVisible) {
                        if (err2) {
                            return callback(err2);
                        } else {
                            return callback(null, listIsVisible);
                        }
                    });
                }
            }
        })
    }
}



module.exports = function(faire) {
    Faire = faire;
    return Tasks;
}
