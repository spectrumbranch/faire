angular.module('faireApp', ['ngTouch','ngRoute', 'faire.service']).config(['$routeProvider', function($routeProvider) {
    $routeProvider
        .when('/', {
            templateUrl: 'rachel/views/home.html',
            controller: 'FaireHomeController'
        })
        .when('/list/new', {
            templateUrl: 'rachel/views/create-list.html',
            controller: 'FaireCreateListController'
        })
        .when('/list/:listId', {
            templateUrl: 'rachel/views/list.html',
            controller: 'FaireViewListController'
        })
        .otherwise({
            redirectTo: '/'
        });
}])
.controller('FaireHomeController', function ($scope, $http, FaireService, $location) {
    $scope.lists = [];
	
	$scope.homeTasksOrderBy = function(task) {
		switch (task.status) {
			case 'active':
				return 1;
				break;
			case 'inactive':
				return 3;
				break;
			case 'deleted':
			default:
				return 5;
		}
	}
    
    //init
    ;(function() {
        FaireService.getLists(function(err, lists) {
            $scope.lists = lists;
        });
    })();
})
.controller('FaireCreateListController', function ($scope, $http, FaireService, $location) {
    $scope.addNewListFormData = {};
    
    $scope.clearAddNewListFormData = function() {
        $scope.addNewListFormData = {};
    }
    
    $scope.addList = function(){
        FaireService.addList($scope.addNewListFormData, function(error, data){
            if (error){
                // TODO
            } else {
                $scope.clearAddNewListFormData();
                $location.path('/list/' + data.id);
            }
        })
    }
})
.controller('FaireViewListController', function ($scope, $http, $routeParams, FaireService, $location) {
    $scope.params = $routeParams;
    $scope.tasks = [];
    $scope.name = ''; //input field for new tasks
    $scope.list = { name: '' };
    
    $scope.addTask = function() {
        if ($scope.name.length > 0) {
            FaireService.addTask({ list: $scope.params.listId, name: $scope.name }, function(error, addedTask) {
                if (error) {
                    console.log('FaireViewListController::addTask error: ',error);
                } else {
                    $scope.name = '';
                    $scope.tasks.push(addedTask);
                }
            });
        } else {
            //TODO inform user to fill in the field
        }
    }
		
    $scope.updateTask = function(task, cb) {
        FaireService.updateTask({ id: task.id, name: task.name, status: task.status }, function(error, updatedTask) {
            if (error) {
                console.log('FaireViewListController::updateTask error: ',error);
            } else {
                //TODO update task in scope
            }
            cb();
        });
    }

    $scope.deleteTask = function(task) {
        FaireService.deleteTask({ id: task.id }, function(error, deletedTask) {
            if (error) {
                console.log('FaireViewListController::deleteTask error: ',error);
            } else {
				updateTaskStatus(deletedTask);
            }
        });
    }
	
    $scope.inactivateTask = function(task) {
        FaireService.inactivateTask({ id: task.id }, function(error, inactivatedTask) {
            if (error) {
                console.log('FaireViewListController::deleteTask error: ',error);
            } else {
				updateTaskStatus(inactivatedTask);
            }
        });
    }	
	
    $scope.activateTask = function(task) {
        FaireService.activateTask({ id: task.id }, function(error, activatedTask) {
            if (error) {
                console.log('FaireViewListController::deleteTask error: ',error);
            } else {
				updateTaskStatus(activatedTask);
            }
        });
    }	

	function updateTaskStatus(task){
		for (var i=0; i < $scope.tasks.length; i++){
			if($scope.tasks[i].id == task.id){
				$scope.tasks[i].status = task.status;
			}
		}	
	}
	
	$scope.toggleTaskActivity = function(task){
		if (task.status == 'active'){
			$scope.inactivateTask(task);
		} else{
			$scope.activateTask(task);
		}
	}
	
    $scope.handleEdit = function(task){
        if(task.edit) {
            $scope.updateTask(task, function () {
                //
            });
        }
        
        task.edit = !task.edit;
    }

    $scope.updateList = function(list, cb) {
        FaireService.updateList({ id: list.id, name: list.name, status: list.status }, function(error, updatedList) {
            if (error) {
                console.log('FaireViewListController::updateList error: ',error);
            } else {
                //TODO update task in scope
            }
            cb();
        });
    }	
	
    $scope.handleListEdit = function(list){
        if(list.edit) {
            $scope.updateList(list, function () {
                //
            });
        }
        
        list.edit = !list.edit;
    }
    
    ;(function() {
        FaireService.getListById($scope.params.listId, function(error, list) {
            $scope.list = list;
        });
        FaireService.getTasks($scope.params.listId, function(error, tasks){ 
            $scope.tasks = tasks;
        });
    })();
    
})

// var changeTheme = function() {
	// var selectedTheme = $('#faireThemeOptions').val();
	// $.post( "/preferences/theme", {theme:selectedTheme}, function( data ) {
		// window.location.reload()
	// });
// }




