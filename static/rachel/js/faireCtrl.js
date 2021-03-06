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
        .when('/profile', {
            templateUrl: 'rachel/views/profile.html',
            controller: 'FaireProfileController'
        })		
        .when('/list/:listId', {
            templateUrl: 'rachel/views/list.html',
            controller: 'FaireViewListController'
        })
        .otherwise({
            redirectTo: '/'
        });
}])

.controller('FaireGlobalController', function ($scope, $http, FaireService, $location) {
	var vm = this;
	vm.version = '...';
    vm.getVersion = function() {
        FaireService.getVersion(function(error, version) {
            if (error) {
                console.log('FaireGlobalController::getVersion error: ',error);
            } else {
                vm.version = version;
            }
        });
    }
	vm.getVersion();
})

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

.controller('FaireProfileController', function ($scope, $http, FaireService, $location) {
	
	$scope.availableThemes = [];
	$scope.selectedTheme = '';

	//TODO put into init function
	$(document).foundation('reveal', 'reflow');
	
    $scope.changeTheme = function() {
		if($scope.selectedTheme !== ''){
			FaireService.changeTheme($scope.selectedTheme, function(error, changedTheme) {
				if (error) {
					console.log('FaireProfileController::editTheme error: ',error);
				}
				
				$scope.closeThemeModal();
				window.location.reload();
			});
		}
    }
	
	$scope.closeThemeModal = function() {
		$('#editThemeModal').foundation('reveal', 'close');
	}
	
	$scope.getThemes = function() {
        FaireService.getThemes(function(error, availableThemes) {
            if (error) {
                console.log('FaireProfileController::getThemes error: ',error);
            } else {
                $scope.availableThemes = availableThemes;
				console.log($scope.availableThemes);
            }
        });
    }
	
	$scope.getThemeSelected = function() {
        FaireService.getThemeSelected(function(error, selectedTheme) {
            if (error) {
                console.log('FaireProfileController::getThemeSelected error: ',error);
            } else {
                $scope.selectedTheme = selectedTheme;
				console.log($scope.selectedTheme);
            }
        });
    }
	
	$scope.getThemeSelected();
	$scope.getThemes();
})

.controller('FaireViewListController', function ($scope, $http, $routeParams, FaireService, $location) {
    $scope.params = $routeParams;
    $scope.tasks = [];
    $scope.name = ''; //input field for new tasks
    $scope.list = { name: '' };
	
	//TODO put into init function
	$(document).foundation('reveal', 'reflow');
    
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

    $scope.deleteList = function(list) {
        FaireService.deleteList({ id: list.id }, function(error, deletedList) {
            if (error) {
                console.log('FaireViewListController::deleteList error: ',error);
            }
			
			$scope.closeDeleteModal();
        });
    }
	
	$scope.closeDeleteModal = function() {
		$('#deleteListModal').foundation('reveal', 'close');
	}	
	
	$scope.shareList = function(list){
		if ($scope.shareUser != ""){
			var shareUser = $scope.shareUser;
			$scope.shareUser = '';
			FaireService.getUserByEmail(shareUser, function(error, user){
				if(error){
					console.log('FaireViewListController::shareList error: ',error);
				} else {
					if (user.id == null){
						//User does not exist
						//TODO
					} else {
						//share list
						FaireService.shareList({listId: list.id, userIds: [user.id]}, function(error2, sharedUsers){
							if (error2) {
								console.log('FaireViewListController::shareList error2: ', error2);
							} else {
								//list was shared successfully
							}
						});
					}
				}
				
				window.location.reload();
			});
		}
	}
 
	$scope.unshareList = function(list, userToUnshare){

		FaireService.unshareList({listId: list.id, userIds: [userToUnshare]}, function(error2, unsharedUsers){
			if (error2) {
				console.log('FaireViewListController::unshareList error2: ', error2);
			} else {
				//list was unshared successfully
			}
			
			$scope.closeUnshareModal();
			window.location.reload();
		});

	}

	$scope.closeUnshareModal = function() {
		$('#unshareListModal').foundation('reveal', 'close');
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




