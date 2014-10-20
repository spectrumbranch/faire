angular.module('faireApp', ['ngTouch'])
	.controller('faireCtrl', function ($rootScope, $scope, $http) {
		$scope.lists = [];
		var listOne = {};
		listOne.name = 'Groceries';
		listOne.tasks = [];
		var taskOne = {};
		taskOne.name = 'Avocado';
		var taskTwo = {};
		taskTwo.name = 'Coffee';
		listOne.tasks.push(taskOne);
		listOne.tasks.push(taskTwo);
		$scope.lists.push(listOne);
		
		var listTwo = {};
		listTwo.name = 'Movies';
		listTwo.tasks = [];
		var movieOne = {};
		movieOne.name = 'Aladdin';
		var movieTwo = {};
		movieTwo.name = 'Beauty & The Beast';
		listTwo.tasks.push(movieOne);
		listTwo.tasks.push(movieTwo);
		$scope.lists.push(listTwo);
	});


// var changeTheme = function() {
	// var selectedTheme = $('#faireThemeOptions').val();
	// $.post( "/preferences/theme", {theme:selectedTheme}, function( data ) {
		// window.location.reload()
	// });
// }




