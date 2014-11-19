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
        var output_single = {};
    
        output_single.id = list.id;
        output_single.name = list.name;
        output_single.ownerId = list.owner.id;
        output_single.email = list.owner.email;
        output_single.createdAt = list.createdAt;
        output_single.updatedAt = list.updatedAt;
        output_single.status = list.status;
        output_single.sharedUsers = list.sharedUsers;
        
        Faire.Tasks.getAll({ user: userid, list: list.id }, function(err, tasks) {
            output_single.tasks = tasks;
            done(null, output_single);
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
        internals.data.User.find(userid).success(function(user) {
            list.addSharedUser(user, { write: true }).success(function() {
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
        internals.data.User.find(userid).success(function(user) {
            list.removeSharedUser(user).success(function() {
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
                internals.data.User.find(parseInt(input.user)).success(function(user) {
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
                internals.data.List.create({ name: input.name, status: list_status }).success(function(newList) {
                    newList.setOwner(user).success(function() {
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
        internals.data.List.find({ where: { id: input.id, OwnerId: input.user }, include: [{ model: internals.data.User, as: 'Owner' }] }).success(function(list) {
            list.updateAttributes({
                status: 'active'
            }).success(function(output_list) {
                var output = {};
            
                output.id = output_list.id;
                output.name = output_list.name;
                output.userid = output_list.owner.id;
                output.email = output_list.owner.email;
                output.createdAt = output_list.createdAt;
                output.updatedAt = output_list.updatedAt;
                output.status = output_list.status;
                callback(null, output);
            })
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
        internals.data.List.find({ where: { id: input.id, OwnerId: input.user }, include: [{ model: internals.data.User, as: 'Owner' }] }).success(function(list) {
            list.updateAttributes({
                status: 'inactive'
            }).success(function(output_list) {
                var output = {};
            
                output.id = output_list.id;
                output.name = output_list.name;
                output.ownerId = output_list.owner.id;
                output.email = output_list.owner.email;
                output.createdAt = output_list.createdAt;
                output.updatedAt = output_list.updatedAt;
                output.status = output_list.status;
                callback(null, output);
            })
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
        internals.data.List.find({ where: { id: input.id, OwnerId: input.user }, include: [{ model: internals.data.User, as: 'Owner' }] }).success(function(list) {
            list.updateAttributes({
                status: 'deleted'
            }).success(function(output_list) {
                var output = {};
            
                output.id = output_list.id;
                output.name = output_list.name;
                output.ownerId = output_list.owner.id;
                output.email = output_list.owner.email;
                output.createdAt = output_list.createdAt;
                output.updatedAt = output_list.updatedAt;
                output.status = output_list.status;
                callback(null, output);
            })
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
        callback(new Error(errorMessages));
    } else {
        internals.data.List.find({ where: { id: input.id, OwnerId: input.user }, include: [{ model: internals.data.User, as: 'Owner' }] }).success(function(list) {
            list.updateAttributes(updateThese).success(function(output_list) {
                var output = {};
            
                output.id = output_list.id;
                output.name = output_list.name;
                output.ownerId = output_list.owner.id;
                output.email = output_list.owner.email;
                output.createdAt = output_list.createdAt;
                output.updatedAt = output_list.updatedAt;
                output.status = output_list.status;
                callback(null, output);
            })
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
    
        var query = 'SELECT `List`.*, `Owner`.`id` AS `Owner.id`, `Owner`.`email` AS `Owner.email`, `Owner`.`salt` AS `Owner.salt`, `Owner`.`hash` AS `Owner.hash`, `Owner`.`createdAt` AS `Owner.createdAt`, `Owner`.`updatedAt` AS `Owner.updatedAt`, `SharedUsers`.`id` AS `SharedUsers.id`, `SharedUsers`.`email` AS `SharedUsers.email`, `SharedUsers`.`salt` AS `SharedUsers.salt`, `SharedUsers`.`hash` AS `SharedUsers.hash`, `SharedUsers`.`createdAt` AS `SharedUsers.createdAt`, `SharedUsers`.`updatedAt` AS `SharedUsers.updatedAt`, `SharedUsers.SharedList`.`write` AS `SharedUsers.SharedList.write`, `SharedUsers.SharedList`.`createdAt` AS `SharedUsers.SharedList.createdAt`, `SharedUsers.SharedList`.`updatedAt` AS `SharedUsers.SharedList.updatedAt`, `SharedUsers.SharedList`.`UserId` AS `SharedUsers.SharedList.UserId`, `SharedUsers.SharedList`.`ListId` AS `SharedUsers.SharedList.ListId` '+
        'FROM ('+
        'SELECT `List`.* FROM `List` '+
        'LEFT OUTER JOIN `SharedLists` AS `SharedUsers.SharedList` ON `List`.`id` = `SharedUsers.SharedList`.`ListId` '+
        'LEFT OUTER JOIN `User` AS `SharedUsers` ON `SharedUsers`.`id` = `SharedUsers.SharedList`.`UserId`'+
        'WHERE (`List`.`id`=? AND (`List`.`OwnerId`=? OR `SharedUsers`.`id`=?)) LIMIT 1'+
        ') AS `List` '+
        'LEFT OUTER JOIN `User` AS `Owner` ON `Owner`.`id` = `List`.`OwnerId` '+
        'LEFT OUTER JOIN `SharedLists` AS `SharedUsers.SharedList` ON `List`.`id` = `SharedUsers.SharedList`.`ListId` '+
        'LEFT OUTER JOIN `User` AS `SharedUsers` ON `SharedUsers`.`id` = `SharedUsers.SharedList`.`UserId`';
    
        internals.data.sequelize.query(query, internals.data.List, {raw:true}, [input.id,input.user,input.user]).success(function(list){
            var output = {};
            
            if (list != null && list.length > 0) {
                var list_record = list[0];
                
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
                    output.sharedUsers = sharedUsers || [];
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
    
    
    
        // internals.data.List.find({ 
            // where: internals.data.sequelize.and(
                // { id: input.id }, 
                // internals.data.sequelize.or(
                    // { OwnerId: input.user }, 
                    // { 'SharedUsers.id': input.user }
                // ) 
            // ),
            // include: [
                // { model: internals.data.Task },
                // { model: internals.data.User, as: 'Owner' }, 
                // { model: internals.data.User, as: 'SharedUsers' }
            // ] 
        // }).success(function(list) {
            // var output = {};
            // if (list != null) {
                // output.id = list.id;
                // output.name = list.name;
                // output.ownerId = list.owner.id;
                // output.email = list.owner.email;
                // output.createdAt = list.createdAt;
                // output.updatedAt = list.updatedAt;
                // output.status = list.status;
                // output.sharedUsers = list.sharedUsers;
            // }
            
            // callback(null, output);
        // })
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
        internals.data.List.findAll({ 
            where: internals.data.sequelize.or({ OwnerId: input.user }, { 'SharedUsers.id': input.user }), 
            include: [
                { model: internals.data.User, as: 'Owner' }, 
                { model: internals.data.User, as: 'SharedUsers' }
            ] 
        }).success(function(lists) {
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
        internals.data.List.find(input.id).success(function(list) {
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
        internals.data.List.find(input.id).success(function(list) {
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
        internals.data.List.count({ 
            where: internals.data.sequelize.and({ id: input.id }, internals.data.sequelize.or({ OwnerId: input.user }, { "SharedUsers.id": input.user })), 
            include: [
                { model: internals.data.User, as: 'SharedUsers' }
            ] 
        }).success(function(count) {
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
        internals.data.List.find({ where: { id: input.id }, include: [{ model: internals.data.User, as: 'SharedUsers' }] }).success(function(listWithSharedUsers) {
            var output;
            output = listWithSharedUsers.sharedUsers;
            callback(null, output);
        })
    }
};

module.exports = function(faire) {
    Faire = faire;
    return Lists;
}