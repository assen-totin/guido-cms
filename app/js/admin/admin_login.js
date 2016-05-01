/**
 * Per-template loading method. 
 * Will be called whenever the template named 'main1' is attached to a parent. 
 */
function appLoadTemplate_admin_login() {
	appRun.logger.debug('Entering function appLoadTemplate_admin_login()...');

	// Login form
	var params = {
		div: 'admin_login_form',
		css: 'form-admin',
		fields: {
			username: {
				type: 'INPUT',
				order: 10,
				cssField: 'form-admin-div',
				cssInput: 'form-admin-input',
				attributes: {type:'text', placeholder: _('Username'), name:'username'},
				validator: {
					enabled: true,
					validate: 'notempty',
					error: _('Username cannot be empty.')
				}
			},
			password: {
				type: 'INPUT',
				order: 20,
				cssField: 'form-admin-div',
				cssInput: 'form-admin-input',
				attributes: {type:'password', placeholder: _('Password'), name:'password'},
				extra: {submitOnEnter: true},
				getAsString: true,
				validator: {
					enabled: true,
					validate: 'notempty',
					error: _('Password cannot be empty.')
				}
			},
			submit: {
				type: 'BUTTON',
				cssField: 'form-admin-div',
				cssInput: 'form-admin-button',
				order: 90,
				extra: {text:'Next', name: _('Submit'), action: 'submit'}
			}
		}
	};

	var form = new guidoForm(params, function(error, result) {
		// Pass any error to the error handler
		if (error) {
			appUtilErrorHandler(0, error.validator.error);
			return;
		}

		var jqXHR = $.ajax({
			type: 'POST',
			url: appConf.api.url + '/admin_login',
			data: {q: JSON.stringify(result)},
			beforeSend: function (request) {
				appUtilAuthHeader(request);
				appUtilSpinnerShow();
			},
		})
		.done(function() {
			// Hide the spinner
			appUtilSpinnerHide();

			// Save the session cookie
			appRun.cookies.session = jqXHR.getResponseHeader('X-Session-Id');

			// Extract the response 
			var resp = appUtilExtractResponse(jqXHR);
			if (resp) {
				appRun.user.level = resp.level;
				appRun.user.username = result.username;
			}

			// If you have modified the runtime object, save it
			guidoLsSave();

			// Go to next section
			guidoLoadSection('dashboard');
	 	})
		.fail(function() {
			// Call the error handler
			appUtilErrorHandler(0, _("Wrong username or password!"));
		});
	});
}

