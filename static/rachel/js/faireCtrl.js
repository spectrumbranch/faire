angular.module('faireApp', ['ngTouch'])
	.controller('faireCtrl', function ($rootScope, $scope, $http) {
		$scope.lists = [];
		
		$scope.addNewListFormData = {};
		
		// var listOne = {};
		// listOne.name = 'Groceries';
		// listOne.tasks = [];
		// var taskOne = {};
		// taskOne.name = 'Avocado';
		// var taskTwo = {};
		// taskTwo.name = 'Coffee';
		// listOne.tasks.push(taskOne);
		// listOne.tasks.push(taskTwo);
		// $scope.lists.push(listOne);
		
		// var listTwo = {};
		// listTwo.name = 'Movies';
		// listTwo.tasks = [];
		// var movieOne = {};
		// movieOne.name = 'Aladdin';
		// var movieTwo = {};
		// movieTwo.name = 'Beauty & The Beast';
		// listTwo.tasks.push(movieOne);
		// listTwo.tasks.push(movieTwo);
		// $scope.lists.push(listTwo);
		
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

		
		$scope.addList = function() {
			$http({
				url: '/lists/add',
				method: 'POST',
				data: $scope.addNewListFormData
			}).success(function(data, status, headers, config) {
				$scope.lists.push(data);
				console.log(data);
				$scope.clearAddNewListFormData();
			}).error(function(data, status, headers, config) {
				console.log('there is an error adding the new list: ' + status);
				console.log(data);
			})
		}
		
		$scope.clearAddNewListFormData = function() {
			$scope.addNewListFormData = {};
		}
	});


// var changeTheme = function() {
	// var selectedTheme = $('#faireThemeOptions').val();
	// $.post( "/preferences/theme", {theme:selectedTheme}, function( data ) {
		// window.location.reload()
	// });
// }




