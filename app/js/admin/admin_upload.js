/**
 * Per-template loading method. 
 * Will be called whenever the template named 'main1' is attached to a parent. 
 */
function appLoadTemplate_admin_upload() {
	appRun.logger.debug('Entering function appLoadTemplate_admin_upload()...');

	// Upload form
	var params = {
		div: 'admin_upload',
		css: 'form-admin',
		fields: {
			file: {
				type: 'FILE',
				order: 10,
				cssField: 'form-admin-div',
				cssInput: 'form-admin-input',
				attributes: {name:'file'},
				validator: {
					enabled: true,
					validate: 'notempty',
					error: _('You must select a file to upload.')
				}
			},
			submit: {
				type: 'BUTTON',
				cssField: 'form-admin-div',
				cssInput: 'form-admin-button',
				order: 90,
				extra: {text:_('Next'), name: 'submit', action: 'submit'}
			}
		}
	};

	var form = new guidoForm(params, function(error, result) {
		// Pass any error to the error handler
		if (error) {
			appUtilErrorHandler(0, error.validator.error);
			return;
		}

		// If we're uploading a new version of existing file, add its ID
		if (appRun.kvs.admin.upload_id)
			result.id = parseInt(appRun.kvs.admin.upload_id, 10);

		// If we're uploadiog to a gallery, add its ID
		if (appRun.kvs.admin.gallery)
			result.gallery = parseInt(appRun.kvs.admin.gallery);

		// Populate a FormData object (used to send AJAX with multipart/form-data)
		var formData = new FormData();
		var keys = Object.keys(result);
		for (var i=0; i<keys.length; i++) {
			if (keys[i] == 'file')
				formData.append(keys[i], result[keys[i]].target.files[0]);
			else
				formData.append(keys[i], result[keys[i]]);
		}

		var jqXHR = $.ajax({
			type: 'POST',
			url: appConf.api.url + '/admin_upload',
		    cache: false,
		    contentType: false,
		    processData: false,
			data: formData,
			beforeSend: function (request) {
				appUtilAuthHeader(request);
				appUtilSpinnerShow();
			},
		})
		.done(function() {
			// Hide the spinner
			appUtilSpinnerHide();

			// Go to next section
			guidoLoadSection('uploads');
	 	})
		.fail(function() {
			// Call the error handler
			appUtilErrorHandler(jqXHR.status, _("Error uploading file!"));
		})
		.always(function(){
			appRun.kvs.admin.upload_id = null;
		});
	});
}

