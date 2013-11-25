$(document).ready(function () {
	registerSuccessful();
});

var registerSuccessful = function() {
	var response=window.location.search.replace("?","");
	if (response == "registerSuccessful") {
		$('#faireLoginModalMessage').empty()
			.append('Registration was successful! Please check your email for a confirmation link.')
			.append('<br /><br /><input type="button" value="Okay!" class="button success radius" onclick="$(\'#faireLoginModal\').foundation(\'reveal\', \'close\')"/>');
		$('#faireLoginModal').foundation('reveal', 'open');
	} else if (response =='confirmed') {
		$('#faireLoginModalMessage').empty()
			.append('Your account has been successfully confirmed! Please log in')
			.append('<br /><br /><input type="button" value="Okay!" class="button success radius" onclick="$(\'#faireLoginModal\').foundation(\'reveal\', \'close\')"/>');
		$('#faireLoginModal').foundation('reveal', 'open');
	}
};