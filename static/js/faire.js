var faire_menu_btn_status_default = false;
var faire_menu_btn_status = faire_menu_btn_status_default;
$('#faire-menu-btn').click(function() {
	console.log('test')
	if (!faire_menu_btn_status) {
		$('.faire-drop-menu').addClass('active');
	} else {
		$('.faire-drop-menu').removeClass('active');
	}
	faire_menu_btn_status = !faire_menu_btn_status;
});