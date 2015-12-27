angular.module('faire.service', []).service('FaireService', ['$http', function FaireService($http){
    var Workspace = this;
    Workspace.lists = [];
    
    this.getCachedListById = function(listId) {
        var output = null;
        for (var i = 0; i < Workspace.lists.length; i++) {
            if (listId == Workspace.lists[i].id) {
                output = Workspace.lists[i];
                break;
            }
        };
        return output;
    };
    
    this.getListById = function(listId, cb) {
        var cachedList = this.getCachedListById(listId);
        if (cachedList == null) {
            this.getDBListById(listId, function(err, list) {
                cb(err, list);
            });
        } else {
            cb(null, cachedList);
        }
    };
    
    this.getDBListById = function(listId, cb) {
        $http({
			url: '/lists/' + listId,
			method: 'GET'
		}).success(function(data, status, headers, config) {
			console.log(data);
			cb(null, data);
		}).error(function(data, status, headers, config) {
			console.log('there is an error getting db list by id: ' + status);
			console.log(data);
			cb(data);
		})	
    };

	this.addList = function(addNewListFormData, cb) {
		$http({
			url: '/lists/add',
			method: 'POST',
			data: addNewListFormData
		}).success(function(data, status, headers, config) {
			//$scope.lists.push(data); TODO
			console.log(data);
			cb(null, data);
		}).error(function(data, status, headers, config) {
			console.log('there is an error adding the new list: ' + status);
			console.log(data);
			cb(data);
		})
	}
    
    this.getLists = function(cb) {
        $http({
            url: '/lists',
            method: 'GET',
            data: {}
        }).success(function(data, status, headers, config) {
            Workspace.lists = data;
            console.log(data);
            cb(null, Workspace.lists);
        }).error(function(data, status, headers, config) {
            console.log('there is an error: ' + status);
            console.log(data);
            cb(data);
        })
    };
	
	this.getTasks = function(listId, cb) {
		$http({
			url: '/lists/' + listId + '/tasks',
			method: 'GET'
		}).success(function(data, status, headers, config) {
			console.log(data);
			cb(null, data);
		}).error(function(data, status, headers, config) {
			console.log('there is an error adding the new list: ' + status);
			console.log(data);
			cb(data);
		})	
	}
    
    this.addTask = function(task, cb) {
        //task is like { list: #, name: 'task name' }
        $http({
            url: '/tasks/add',
            method: 'POST',
            data: task
        }).success(function(data, status, headers, config) {
            console.log(data);
            cb(null, data);
        }).error(function(data, status, headers, config) {
            console.log('there is an error adding the new task: ' + status);
            console.log(data);
            cb(data);
        })
    }
	
    this.updateTask = function(task, cb) {
        //task is like { list: #, name: 'task name' }
		var id = task.id;
        var _task = task;
		delete _task.id;
        $http({
            url: '/tasks/' + id + '/update',
            method: 'POST',
            data: _task
        }).success(function(data, status, headers, config) {
            console.log(data);
            cb(null, data);
        }).error(function(data, status, headers, config) {
            console.log('there is an error updating the task: ' + status);
            console.log(data);
            cb(data);
        })
    }	

    this.deleteTask = function(task, cb) {
        //task is like { list: #, name: 'task name' }
		var id = task.id;
        var _task = task;
		delete _task.id;
        $http({
            url: '/tasks/' + id + '/delete',
            method: 'POST'
        }).success(function(data, status, headers, config) {
            console.log(data);
            cb(null, data);
        }).error(function(data, status, headers, config) {
            console.log('there is an error deleting the task: ' + status);
            console.log(data);
            cb(data);
        })
    }	
	
    this.inactivateTask = function(task, cb) {
        //task is like { list: #, name: 'task name' }
		var id = task.id;
        var _task = task;
		delete _task.id;
        $http({
            url: '/tasks/' + id + '/inactivate',
            method: 'POST',
        }).success(function(data, status, headers, config) {
            console.log(data);
            cb(null, data);
        }).error(function(data, status, headers, config) {
            console.log('there is an error deleting the task: ' + status);
            console.log(data);
            cb(data);
        })
    }

    this.activateTask = function(task, cb) {
        //task is like { list: #, name: 'task name' }
		var id = task.id;
        var _task = task;
		delete _task.id;
        $http({
            url: '/tasks/' + id + '/activate',
            method: 'POST',
        }).success(function(data, status, headers, config) {
            console.log(data);
            cb(null, data);
        }).error(function(data, status, headers, config) {
            console.log('there is an error deleting the task: ' + status);
            console.log(data);
            cb(data);
        })
    }
	
    this.updateList = function(list, cb) {
		var id = list.id;
        var _list = list;
		delete _list.id;
        $http({
            url: '/lists/' + id + '/update',
            method: 'POST',
            data: _list
        }).success(function(data, status, headers, config) {
            console.log(data);
            cb(null, data);
        }).error(function(data, status, headers, config) {
            console.log('there is an error updating the list: ' + status);
            console.log(data);
            cb(data);
        })
    }
	
	this.getUserByEmail = function(email, cb){
        $http({
            url: '/users/by-email/' + email,
            method: 'GET'
        }).success(function(data, status, headers, config) {
            console.log(data);
            cb(null, data);
        }).error(function(data, status, headers, config) {
            console.log('there is an error getting user by email: ' + status);
            console.log(data);
            cb(data);
        })	
	}
	
	this.shareList = function(input, cb) {
        //input is like { listId: #, userIds: [#, ... , #] }
		var listId = input.listId;
        var userIds = input.userIds;
        $http({
            url: '/lists/' + listId + '/share',
            method: 'POST',
			data: { users: userIds }
        }).success(function(data, status, headers, config) {
            console.log(data);
            cb(null, data);
        }).error(function(data, status, headers, config) {
            console.log('there is an error sharing the task: ' + status);
            console.log(data);
            cb(data);
        })
    }	
}]);