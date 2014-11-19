var assert = require('assert');
var Faire;
var db;
var Fixtures;


module.exports = function(faire, DB, fixtures) {
    Faire = faire;
    db = DB;
    Fixtures = fixtures;
}

describe('Faire.Tasks API', function() {
    var user_id_1, user_id_2, user_id_3;
    var list_id_1;
    before(function(done) {
        var email1 = Fixtures.Tasks.Users[0].email;//'tester@test.com';
        var passwrd1 = Fixtures.Tasks.Users[0].password;//'shdi2389chs98w3jnh';
        
        var email2 = Fixtures.Tasks.Users[1].email;//'getalltester@test.com';
        var passwrd2 = Fixtures.Tasks.Users[1].password;//'fsdoifushdf98w33h2';
        
        var email3 = Fixtures.Tasks.Users[2].email;//'hasnotasks@test.com';
        var passwrd3 = Fixtures.Tasks.Users[2].password;//'dskn2398fuisesSQ19';
        
        
        var virt_modules = [];
        virt_modules.push(Faire.Scurvy);

        
        db.init(virt_modules, function() {
            console.log('-------- database setup complete --------');
            Faire.Async.parallel([
                function(cb) {
                    Faire.Scurvy.createUser({email: email1, passwrd: passwrd1, status: 'active'}, function(err, userball1) {
                        user_id_1 = userball1.user.id
                        cb(null);
                    })
                },
                function(cb) {
                    Faire.Scurvy.createUser({email: email2, passwrd: passwrd2, status: 'active'}, function(err, userball2) {
                        user_id_2 = userball2.user.id;
                        cb(null);
                    })
                },
                function(cb) {
                    Faire.Scurvy.createUser({email: email3, passwrd: passwrd3, status: 'active'}, function(err, userball3) {
                        user_id_3 = userball3.user.id;
                        cb(null);
                    })
                }
            ],
            function(err, results) {
                Faire.Lists.add({user: user_id_1, name: 'list for tasks'}, function(err, list) {
                    list_id_1 = list.id;
                    done();
                })
            });
        });
    })
    describe('#add()', function() {
        it('should return the task object after adding it to the database.', function(done) {
            var taskName = 'This is an example task.';
            Faire.Tasks.add({ user: user_id_1, name: taskName, list: list_id_1 }, function(err, task) {
                assert(err == null);
                assert(task !== undefined);
                assert(task.id !== undefined);
                assert(task.name !== undefined && task.name === taskName);
                assert(task.status !== undefined && task.status === 'active');
                assert(task.ListId !== undefined && task.ListId === list_id_1);
                done();
            })
        })
        it('should return the task object with a nondefault status after adding it to the database.', function(done) {
            var taskName = 'This is an example task2.';
            var status_inactive = 'inactive';
            Faire.Tasks.add({ user: user_id_1, name: taskName, status: status_inactive, list: list_id_1 }, function(err, task) {
                assert(err == null);
                assert(task !== undefined);
                assert(task.id !== undefined);
                assert(task.name !== undefined && task.name === taskName);
                assert(task.status !== undefined && task.status === status_inactive);
                assert(task.ListId !== undefined && task.ListId === list_id_1);
                done();
            })
        })
        it('should error out when required parameter "user" is missing.', function(done) {
            var taskName = 'This is an example task3.';
            Faire.Tasks.add({name: taskName, list: list_id_1}, function(err, task) {
                assert(err instanceof Error);
                assert(task === undefined);
                done();
            })
        })
        it('should error out when required parameter "name" is missing.', function(done) {
            Faire.Tasks.add({ user: user_id_1, list: list_id_1 }, function(err, task) {
                assert(err instanceof Error);
                assert(task === undefined);
                done();
            })
        })
        it('should error out when required parameter "list" is missing.', function(done) {
            var taskName = 'This is an example task4.';
            Faire.Tasks.add({ user: user_id_1, name: taskName }, function(err, task) {
                assert(err instanceof Error);
                assert(task === undefined);
                done();
            })
        })
    })
    
    describe('#activate()', function() {
        it('should return the activated task object after activating it in the database.', function(done) {
            var taskName = 'This is an example task4.';
            var status_inactive = 'inactive';
            var status_active = 'active';
            Faire.Tasks.add({ user: user_id_1, name: taskName, status: status_inactive, list: list_id_1 }, function(err, task) {
                Faire.Tasks.activate({ id: task.id, user: user_id_1}, function(err1, activatedTask) {
                    assert(err1 == null);
                    assert(activatedTask !== undefined);
                    assert(activatedTask.id !== undefined && activatedTask.id === task.id);
                    assert(activatedTask.name !== undefined && activatedTask.name === taskName);
                    assert(activatedTask.status !== undefined && activatedTask.status === status_active);
                    done();
                })
            })
        })
        it('should error out when required parameters "user" and "id" are missing.', function(done) {
            var taskName = 'This is an example task5.';
            var status_inactive = 'inactive';
            Faire.Tasks.add({ user: user_id_1, name: taskName, status: status_inactive, list: list_id_1  }, function(err, task) {
                //missing both user and id
                Faire.Tasks.activate({}, function(err1, activatedTask1) {
                    assert(err1 instanceof Error);
                    assert(activatedTask1 === undefined);
                    //missing user
                    Faire.Tasks.activate({ id: task.id }, function(err2, activatedTask2) {
                        assert(err2 instanceof Error);
                        assert(activatedTask2 === undefined);
                        done();
                    })
                    
                })
            })
        })
    })
    
    describe('#inactivate()', function() {
        it('should return the inactivated task object after inactivating it in the database.', function(done) {
            var taskName = 'This is an example task6.';
            var status_inactive = 'inactive';
            Faire.Tasks.add({ user: user_id_1, name: taskName, list: list_id_1 }, function(err, task) {
                Faire.Tasks.inactivate({ id: task.id, user: user_id_1}, function(err1, inactivatedTask) {
                    assert(err1 == null);
                    assert(inactivatedTask !== undefined);
                    assert(inactivatedTask.id !== undefined && inactivatedTask.id === task.id);
                    assert(inactivatedTask.name !== undefined && inactivatedTask.name === taskName);
                    assert(inactivatedTask.status !== undefined && inactivatedTask.status === status_inactive);
                    done();
                })
            })
        })
        it('should error out when required parameters "user" and "id" are missing.', function(done) {
            var taskName = 'This is an example task7.';
            var status_inactive = 'inactive';
            Faire.Tasks.add({ user: user_id_1, name: taskName, list: list_id_1 }, function(err, task) {
                //missing both user and id
                Faire.Tasks.inactivate({}, function(err1, inactivatedTask1) {
                    assert(err1 instanceof Error);
                    assert(inactivatedTask1 === undefined);
                    //missing user
                    Faire.Tasks.inactivate({ id: task.id }, function(err2, inactivatedTask2) {
                        assert(err2 instanceof Error);
                        assert(inactivatedTask2 === undefined);
                        done();
                    })
                    
                })
            })
        })
    })
    
    describe('#delete()', function() {
        it('should return the deleted task object after deleting it in the database.', function(done) {
            var taskName = 'This is an example task8.';
            var status_deleted = 'deleted';
            Faire.Tasks.add({ user: user_id_1, name: taskName, list: list_id_1 }, function(err, task) {
                Faire.Tasks.delete({ id: task.id, user: user_id_1}, function(err1, deletedTask) {
                    assert(err1 == null);
                    assert(deletedTask !== undefined);
                    assert(deletedTask.id !== undefined && deletedTask.id === task.id);
                    assert(deletedTask.name !== undefined && deletedTask.name === taskName);
                    assert(deletedTask.status !== undefined && deletedTask.status === status_deleted);
                    done();
                })
            })
        })
        it('should error out when required parameters "user" and "id" are missing.', function(done) {
            var taskName = 'This is an example task9.';
            var status_deleted = 'deleted';
            Faire.Tasks.add({ user: user_id_1, name: taskName, list: list_id_1 }, function(err, task) {
                //missing both user and id
                Faire.Tasks.delete({}, function(err1, deletedTask1) {
                    assert(err1 instanceof Error);
                    assert(deletedTask1 === undefined);
                    //missing user
                    Faire.Tasks.delete({ id: task.id }, function(err2, deletedTask2) {
                        assert(err2 instanceof Error);
                        assert(deletedTask2 === undefined);
                        done();
                    })
                    
                })
            })
        })
    })
    
    describe('#update()', function() {
        it('should return the updated task object after updating it in the database.', function(done) {
            var taskName = 'This is an example task10.';
            var updatedTaskName = 'This is task10 updated with something new';
            Faire.Tasks.add({ user: user_id_1, name: taskName, list: list_id_1 }, function(err, task) {
                Faire.Tasks.update({ id: task.id, user: user_id_1, name: updatedTaskName }, function(err1, updatedTask) {
                    assert(err1 == null);
                    assert(updatedTask !== undefined);
                    assert(updatedTask.id !== undefined && updatedTask.id === task.id);
                    assert(updatedTask.name !== undefined && updatedTask.name === updatedTaskName);
                    assert(updatedTask.status !== undefined);
                    done();
                })
            })
        })
        it('should error out when required parameters "user" and "id" are missing.', function(done) {
            var taskName = 'This is an example task11.';
            Faire.Tasks.add({ user: user_id_1, name: taskName, list: list_id_1 }, function(err, task) {
                //missing both user and id
                Faire.Tasks.update({}, function(err1, updatedTask1) {
                    assert(err1 instanceof Error);
                    assert(updatedTask1 === undefined);
                    //missing user
                    Faire.Tasks.update({ id: task.id }, function(err2, updatedTask2) {
                        assert(err2 instanceof Error);
                        assert(updatedTask2 === undefined);
                        done();
                    })
                    
                })
            })
        })
    })
    
    describe('#get()', function() {
        it('should return the task object keyed by the given id. if the task does not exist, return empty', function(done) {
            var taskName = 'This is an example task12.';
            Faire.Tasks.add({ user: user_id_1, name: taskName, list: list_id_1 }, function(err, task) {
                Faire.Tasks.get({ id: task.id, user: user_id_1 }, function(err1, getTask) {
                    assert(err1 == null);
                    assert(getTask !== undefined);
                    assert(getTask.id !== undefined && getTask.id === task.id);
                    assert(getTask.name !== undefined && getTask.name === taskName);
                    assert(getTask.status !== undefined);
                    assert(getTask.updatedAt !== undefined);
                    assert(getTask.createdAt !== undefined);
                    
                    Faire.Tasks.get({ id: 9999999, user: user_id_1 }, function(err2, getTask2) {
                        assert(err2 == null);
                        assert(getTask2 !== undefined);
                        assert(getTask2.id === undefined);
                        done();
                    })
                })
            })
        })
        it('should error out when required parameters "user" and "id" are missing.', function(done) {
            var taskName = 'This is an example task13.';
            Faire.Tasks.add({ user: user_id_1, name: taskName, list: list_id_1 }, function(err, task) {
                //missing both user and id
                Faire.Tasks.get({}, function(err1, getTask1) {
                    assert(err1 instanceof Error);
                    assert(getTask1 === undefined);
                    //missing user
                    Faire.Tasks.get({ id: task.id }, function(err2, getTask2) {
                        assert(err2 instanceof Error);
                        assert(getTask2 === undefined);
                        done();
                    })
                    
                })
            })
        })
    })
    
    describe('#getAll()', function() {
        it('should return all tasks for a given user if no filters are applied. if there are no tasks for that user, return empty', function(done) {
            var taskName = 'This is an example task14.';
            Faire.Tasks.add({ user: user_id_1, name: taskName, list: list_id_1 }, function(err, task) {
                Faire.Tasks.getAll({ user: user_id_1, list: list_id_1 }, function(err1, getAllTasks1) {
                    assert(err1 == null);
                    assert(getAllTasks1 !== undefined && Array.isArray(getAllTasks1) && getAllTasks1.length > 0);
                    assert(getAllTasks1[0].id !== undefined);
                    assert(getAllTasks1[0].name !== undefined);
                    assert(getAllTasks1[0].status !== undefined);
                    assert(getAllTasks1[0].updatedAt !== undefined);
                    assert(getAllTasks1[0].createdAt !== undefined);
                    
                    //User 3 has no tasks in that list
                    Faire.Tasks.getAll({ user: user_id_3, list: list_id_1 }, function(err2, getAllTasks2) {
                        assert(err2 == null);
                        assert(getAllTasks2 !== undefined && Array.isArray(getAllTasks2) && getAllTasks2.length == 0);
                        assert(getAllTasks2.id === undefined);
                        done();
                    })
                })
            })
        })
        it('should error out when required parameter "user" is missing.', function(done) {
            var taskName = 'This is an example task15.';
            Faire.Tasks.getAll({ list: list_id_1 }, function(err1, getAllTasks1) {
                assert(err1 instanceof Error);
                assert(getAllTasks1 === undefined);
                done();
            })
        })
        it('should error out when required parameter "list" is missing.', function(done) {
            var taskName = 'This is an example task to test input validation.';
            Faire.Tasks.getAll({ user: user_id_3 }, function(err1, getAllTasks1) {
                assert(err1 instanceof Error);
                assert(getAllTasks1 === undefined);
                done();
            })
        })
    })
    
    describe('#getListOfTask()', function() {
        it('should return the list id of the task provided, if the task exists. if it does not exist, return null', function(done) {
            var taskName = 'This is an example task testing getListOfTask().';
            Faire.Tasks.add({ user: user_id_1, name: taskName, list: list_id_1 }, function(err, task) {
            
                Faire.Tasks.getListOfTask({ id: task.id }, function(err1, listIdOfTask) {
                    assert(err1 == null);
                    assert(listIdOfTask === list_id_1);
                    
                    Faire.Tasks.getListOfTask({ id: 99999999 }, function(err2, listIdOfTask2) {
                        assert(err2 == null);
                        assert(listIdOfTask2 == null);
                        done();
                    })
                });
            })
        })
        it('should error out when required parameter "id" is missing.', function(done) {
            Faire.Tasks.getListOfTask({}, function(err1, listIdOfTask) {
                assert(err1 instanceof Error);
                assert(listIdOfTask === undefined);
                done();
            })
        })
    })
})