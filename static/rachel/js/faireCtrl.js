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
			
		//init
		;(function() {
			$http({
				url: '/lists',
				method: 'GET',
				data: {}
			}).success(function(data, status, headers, config) {
				$scope.lists = data;
				console.log(data);
			}).error(function(data, status, headers, config) {
				console.log('there is an error: ' + status);
				console.log(data);
			})
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
        $scope.name = '';
        
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
        
        ;(function() {
            FaireService.getTasks($scope.params.listId, function(error, tasks){ 
                $scope.tasks = tasks;
            })
        })();
        
	})

// var changeTheme = function() {
	// var selectedTheme = $('#faireThemeOptions').val();
	// $.post( "/preferences/theme", {theme:selectedTheme}, function( data ) {
		// window.location.reload()
	// });
// }




