var assert = require('assert');
var Faire = require('../lib');
var async = require('async');

describe('Faire.Task API', function() {
	describe('#add()', function() {
		it('should return the task object after adding it to the database.', function(done) {
			var taskName = 'This is an example task.';
			Faire.Task.add({ user: 1, name: taskName }, function(err, task) {
				assert(err == null);
				assert(task !== undefined);
				assert(task.name !== undefined && task.name = taskName);
				assert(task.status !== undefined && task.status === 'active');
				done();
			})
		})
		it('should return the task object with a nondefault status after adding it to the database.', function(done) {
			var taskName = 'This is an example task2.';
			var status = 'inactive';
			Faire.Task.add({ user: 1, name: taskName, status: status }, function(err, task) {
				assert(err == null);
				assert(task !== undefined);
				assert(task.name !== undefined && task.name = taskName);
				assert(task.status !== undefined && task.status === status);
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
			Faire.Task.add({ user: 1, name: 'some task', status: status  }, function(err, task) {
				Faire.Task.activate(task.id, function(err, task) {
					assert(err == null);
					assert(task !== undefined);
					assert(task.name !== undefined && task.name = taskName);
					assert(task.status !== undefined && task.status === status_active);
					done();
				})
			})
		})
	})
	
})