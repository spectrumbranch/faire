angular.module('faire.service', []).service('FaireService', ['$http', function FaireService($http){

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
	
}]);