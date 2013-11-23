angular.module('faireApp', ['ngTouch'])
	.controller('TaskCtrl', function ($rootScope, $scope, $http) {
		//$scope.tasks = {};
		$scope.indexer = {};
		$scope.tasks = [];
		
		$scope.addToIndex = function(task) {
			$scope.tasks.push($scope.indexer[task.id] = task);
		};
		
		$scope.updateIndex = function(input) {
			for (var i = 0; i < $scope.tasks.length; i++) {
				if (input.id == $scope.tasks[i].id) {
					$scope.tasks[i] = $scope.indexer[input.id] = input;
					break;
				}
			}
		};
		
		$scope.getFromIndex = function(id) {
			return $scope.indexer[id];
		};
		
		;(function() {
			//console.log('initialize');
			$http({
				url: '/tasks',
				method: 'GET',
				data: {}
			}).success(function(data, status, headers, config) {
				angular.forEach(data, function(task) {
					$scope.addToIndex(task);
				})
			}).error(function(data, status, headers, config) {
				console.log('there is an error: ' + status);
				console.log(data);
			})
		})();
		$scope.hasNoTasks = function() {
			return $scope.tasks.length == 0;
		};
		$scope.addTask = function() {
			$http({
				url: '/tasks/add',
				method: 'POST',
				data: { name: $scope.taskName }
			}).success(function(data, status, headers, config) {
				$scope.addToIndex(data);
				//reset input box to blank
				$scope.taskName = '';
			}).error(function(data, status, headers, config) {
				console.log('there is an error: ' + status);
				console.log(data);
			})
		};
		
		$scope.editTask = function(id) {
			console.log('swipe left for id ' + id);
			
			var task = $scope.getFromIndex(id);
			$scope.editTaskName = task.name;
			$scope.editTaskId = task.id;
			show_faire_modal(true);
		}
		
		$scope.performEditTask = function(id) {
			console.log("performEditTask  " + id );
			
			$http({
				url: '/tasks/'+id+'/update',
				method: 'POST',
				data: { name: $scope.editTaskName }
			}).success(function(data, status, headers, config) {
				$scope.updateIndex(data);
				//reset input box to blank
				show_faire_modal(false);
				$scope.editTaskName = '';
				$scope.editTaskId = '';
			}).error(function(data, status, headers, config) {
				console.log('there is an error: ' + status);
				console.log(data);
				show_faire_modal(false);
			})
		}
		
		$scope.toggleTask = function(id) {
			console.log('toggleTask');
			console.log(id);
			//$scope.index[task.id] = task; //etc
			//$scope.updateIndex(task);
			
			var task = $scope.getFromIndex(id);
			var statusAction = '';
			if (task.status == 'active') {
				statusAction = 'inactivate';
			} else if (task.status == 'inactive') {
				statusAction = 'activate';
			}
			
			$http({
				url: '/tasks/'+id+'/'+statusAction,
				method: 'POST',
				data: {}
			}).success(function(data, status, headers, config) {
				$scope.updateIndex(data);
				//$scope.tasks.push(data);
				//$scope.taskName = '';
			}).error(function(data, status, headers, config) {
				console.log('there is an error: ' + status);
				console.log(data);
			})
		}
	});


	
var show_faire_modal = function(show) {
	var faireModal = $('#faireModal');//.empty();
	if (show) {
		faireModal.foundation('reveal', 'open');
	} else {
		faireModal.foundation('reveal', 'close');
	}
}





var setup_faire_menu = function() {
	var faire_menu_btn_status_default = false;
	var faire_menu_btn_status = faire_menu_btn_status_default;
	$('#faire-menu-btn').click(function() {
		if (!faire_menu_btn_status) {
			$('.faire-drop-menu').addClass('active');
		} else {
			$('.faire-drop-menu').removeClass('active');
		}
		faire_menu_btn_status = !faire_menu_btn_status;
	});
}



$(document).ready(function() {
	setup_faire_menu();
	
})
