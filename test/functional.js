var assert = require('assert');
var Faire = require('../lib');
var async = require('async');

describe('Faire.Task API', function() {
	var user_id_1;
	before(function(done) {
		var email = 'tester@test.com';
		var passwrd = 'shdi2389chs98w3jnh';
		
		var virt_modules = [];
		virt_modules.push(Faire.Scurvy);

		var db = require('../lib/models');
		db.init(virt_modules, function() {
			console.log('database setup complete');
			Faire.Scurvy.createUser({email: email, passwrd: passwrd, status: 'active'}, function(err, userball) {
				user_id_1 = userball.user.id
				done();
			});
		});
	})
	describe('#add()', function() {
		it('should return the task object after adding it to the database.', function(done) {
			var taskName = 'This is an example task.';
			Faire.Task.add({ user: user_id_1, name: taskName }, function(err, task) {
				assert(err == null);
				assert(task !== undefined);
				assert(task.id !== undefined);
				assert(task.name !== undefined && task.name === taskName);
				assert(task.status !== undefined && task.status === 'active');
				done();
			})
		})
		it('should return the task object with a nondefault status after adding it to the database.', function(done) {
			var taskName = 'This is an example task2.';
			var status_inactive = 'inactive';
			Faire.Task.add({ user: user_id_1, name: taskName, status: status_inactive }, function(err, task) {
				assert(err == null);
				assert(task !== undefined);
				assert(task.id !== undefined);
				assert(task.name !== undefined && task.name === taskName);
				assert(task.status !== undefined && task.status === status_inactive);
				done();
			})
		})
		it('should error out when required parameters "user" and "name" are missing.', function(done) {
			var taskName = 'This is an example task3.';
			Faire.Task.add({}, function(err, task) {
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
			Faire.Task.add({ user: user_id_1, name: taskName, status: status_inactive  }, function(err, task) {
				Faire.Task.activate({ id: task.id, user: userid}, function(err1, activatedTask) {
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
			Faire.Task.add({ user: user_id_1, name: taskName, status: status  }, function(err, task) {
				//missing both user and id
				Faire.Task.activate({}, function(err1, activatedTask1) {
					assert(err1 instanceof Error);
					assert(activatedTask1 === undefined);
					//missing user
					Faire.Task.activate({ id: task.id }, function(err2, activatedTask2) {
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
			Faire.Task.add({ user: user_id_1, name: taskName }, function(err, task) {
				Faire.Task.inactivate({ id: task.id, user: userid}, function(err1, inactivatedTask) {
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
			Faire.Task.add({ user: user_id_1, name: taskName  }, function(err, task) {
				//missing both user and id
				Faire.Task.inactivate({}, function(err1, inactivatedTask1) {
					assert(err1 instanceof Error);
					assert(inactivatedTask1 === undefined);
					//missing user
					Faire.Task.inactivate({ id: task.id }, function(err2, inactivatedTask2) {
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
			Faire.Task.add({ user: user_id_1, name: taskName }, function(err, task) {
				Faire.Task.delete({ id: task.id, user: user_id_1}, function(err1, deletedTask) {
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
			Faire.Task.add({ user: user_id_1, name: taskName  }, function(err, task) {
				//missing both user and id
				Faire.Task.delete({}, function(err1, deletedTask1) {
					assert(err1 instanceof Error);
					assert(deletedTask1 === undefined);
					//missing user
					Faire.Task.delete({ id: task.id }, function(err2, deletedTask2) {
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
			Faire.Task.add({ user: user_id_1, name: taskName }, function(err, task) {
				Faire.Task.update({ id: task.id, user: user_id_1, name: updatedTaskName }, function(err1, updatedTask) {
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
			Faire.Task.add({ user: user_id_1, name: taskName  }, function(err, task) {
				//missing both user and id
				Faire.Task.update({}, function(err1, updatedTask1) {
					assert(err1 instanceof Error);
					assert(updatedTask1 === undefined);
					//missing user
					Faire.Task.update({ id: task.id }, function(err2, updatedTask2) {
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
			Faire.Task.add({ user: user_id_1, name: taskName }, function(err, task) {
				Faire.Task.get({ id: task.id, user: user_id_1 }, function(err1, getTask) {
					assert(err1 == null);
					assert(getTask !== undefined);
					assert(getTask.id !== undefined && getTask.id === task.id);
					assert(getTask.name !== undefined && getTask.name === taskName);
					assert(getTask.status !== undefined);
					assert(getTask.updatedBy !== undefined);
					
					Faire.Task.get({ id: 9999999, user: user_id_1 }, function(err2, getTask2) {
						assert(err2 == null);
						assert(getTask2 !== undefined);
						assert(getTask.id === undefined);
					})
					done();
				})
			})
		})
		it('should error out when required parameters "user" and "id" are missing.', function(done) {
			var taskName = 'This is an example task13.';
			Faire.Task.add({ user: user_id_1, name: taskName  }, function(err, task) {
				//missing both user and id
				Faire.Task.get({}, function(err1, getTask1) {
					assert(err1 instanceof Error);
					assert(getTask1 === undefined);
					//missing user
					Faire.Task.get({ id: task.id }, function(err2, getTask2) {
						assert(err2 instanceof Error);
						assert(getTask2 === undefined);
						done();
					})
					
				})
			})
		})
	})
})
