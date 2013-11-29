$(document).ready(function () {
	setupLoginButton();
	registerSuccessful();
});

var setupLoginButton = function() {
	var loginBtn = $('#loginBtn');
	
	var isValidEmailAddress = function(emailAddress) {
		var pattern = new RegExp(/^((([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+(\.([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+)*)|((\x22)((((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(([\x01-\x08\x0b\x0c\x0e-\x1f\x7f]|\x21|[\x23-\x5b]|[\x5d-\x7e]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(\\([\x01-\x09\x0b\x0c\x0d-\x7f]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))))*(((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(\x22)))@((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.?$/i);
		return pattern.test(emailAddress);
	};
	var clearErrors = function() {
		var ids = ['loginEmail','loginPw'];
		$.each(ids, function(i, id) {
			removeError(id);
		});
	};
	var showError = function(id, error) {
		var elem = $('#' + id);
		if (!elem.hasClass('error')) {
			elem.addClass('error');
			elem.after('<small class="error" id="'+id+'_error">'+error+'</small>');
		}
	};
	var removeError = function(id) {
		var elem = $('#' + id);
		var errElem = $('#' + id + '_error');
		if (elem.hasClass('error'))        {
			elem.removeClass('error');
		}
		if (errElem) {
			errElem.remove();
		}
	};
	var handleLoginUserSubmit = function() {
		clearErrors();
		
		//Step 0: Get the fields
		//Step 1: Validate that the fields are setup appropriately.
		var errors = [];
		
		var email = $('#loginEmail').val();
		if (email.length > 50 || !isValidEmailAddress(email)) {
			var email_error = 'Email cannot be more than 50 characters and must be valid.';
			errors.push(email_error);
			showError('loginEmail',email_error);
		}
		
		var passwrd = $('#loginPw').val();
		if (passwrd.length < 8) {
			var passwrd_length_error = 'Password must be between 8 or more characters.';
			errors.push(passwrd_length_error);
			showError('loginPw',passwrd_length_error);
		}
		
		if (errors.length > 0) {
			//Don't submit, there are errors.
		} else {
			//No errors!
			$('#loginForm').submit();
		}


	}
	loginBtn.on('click', function(e) {
		handleLoginUserSubmit();
	});
}

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
