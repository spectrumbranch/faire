function TaskCtrl($scope, $http) {
	$scope.tasks = [];
	
	$scope.addTask = function() {
		console.log('in here');
		$http({
			url: '/tasks/add',
			method: 'POST',
			data: { name: $scope.taskName }
		}).success(function(data, status, headers, config) {
		
			$scope.tasks.push(data);
			$scope.taskName = '';
			
			console.log($scope.tasks);
		}).error(function(data, status, headers, config) {
			console.log('there is an error: ' + status);
		})
	};
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

var setup_faire_add = function() {
	var input_selector = '#addItemInput';
	$(input_selector).on('keydown', function(e) {
		if (e.keyCode == 13) {
			e.preventDefault();
			
			console.log('enter');
			
			var input_task_name = $(input_selector).val();
			//empty
			$(input_selector).val('');
			
			$.post('/tasks/add', { name: input_task_name }, function(response) {
				console.log(response);
			})
		}
	});
}


$(document).ready(function() {
	setup_faire_menu();
	//setup_faire_add();
	
})