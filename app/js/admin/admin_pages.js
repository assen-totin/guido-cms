/**
 * Per-template loading method. 
 * Will be called whenever the template named 'main1' is attached to a parent. 
 */
function appLoadTemplate_admin_pages() {
	appRun.logger.debug('Entering function appLoadTemplate_admin_pages()...');

	// Form definition
	appRun.kvs.admin.pages_form = {};
	appRun.kvs.admin.pages_form.formId = 'F' + appUtilRandomUuid();
	appRun.kvs.admin.pages_form.fieldLanguage = 'f' + appUtilRandomUuid();
	appRun.kvs.admin.pages_form.fieldTitle = 'f' + appUtilRandomUuid();
	appRun.kvs.admin.pages_form.fieldContent = 'f' + appUtilRandomUuid();
	var paramsForm = {
		id: appRun.kvs.admin.pages_form.formId,
		div: 'admin_pages_form',
		css: 'form-admin',
		exec: 'appAdminPagesOnLoad',
		fields: {
			language: {
				type: 'SELECT',
				order: 10,
				label: _("Language: "),
				cssField: 'form-admin-div',
				cssInput: 'form-admin-input',
				attributes: {name:'language', id: appRun.kvs.admin.pages_form.fieldLanguage},
				extra: {
					options: [],
				},
				onChange: 'appAdminPagesOnChangeLanguage',
			},
			title: {
				type: 'INPUT',
				order: 20,
				cssField: 'form-admin-div',
				cssInput: 'form-admin-input',
				attributes: {type: 'text', placeholder: _("Page title"), name:'title', id: appRun.kvs.admin.pages_form.fieldTitle},
				validator: {
					enabled: true,
					validate: 'notempty',
					error: _('Page title cannot be empty.')
				},
				extra: {},
			},
			content: {
				type: 'TEXTAREA',
				order: 30,
				cssField: 'form-admin-div',
				cssInput: 'form-admin-input',
				attributes: {name:'content', rows:4, cols:40, id: appRun.kvs.admin.pages_form.fieldContent},
				extra: {
					text: _('Enter your page content here.'),
				},
				validator: {
					enabled: true,
					validate: 'notempty',
					error: _('Page content cannot be empty.')
				}
			},
			submit: {
				type: 'BUTTON',
				cssField: 'form-admin-div',
				cssInput: 'form-admin-button',
				order: 90,
				extra: {text:_('Edit'), name: 'submit', action: 'submit'}
			}
		}
	};

	var jqXHR = $.ajax({
		type: 'GET',
		url: appConf.api.url + '/admin_languages',
		beforeSend: function (request) {
			appUtilAuthHeader(request);
			appUtilSpinnerShow();
		},
	})
	.done(function(data) {
		// Hide the spinner
		appUtilSpinnerHide();

		// Populate drop-down
		for (var i=0; i<data.length; i++) {
			if (data[i].status == 'active') {
				var option = {
					value:data[i].id, 
					text: data[i].name_en + ' / ' + data[i].name ,
				};
				paramsForm.fields.language.extra.options.push(option);
			}
		}

		// Show new entry form
		var form = new guidoForm(paramsForm, function(error, result) {
			// Pass any error to the error handler
			if (error) {
				appUtilErrorHandler(0, error.validator.error);
				return;
			}

			// Add the page ID
			result.navigation = appRun.kvs.admin.navigation;

			var jqXHR = $.ajax({
				type: 'PUT',
				url: appConf.api.url + '/admin_pages',
				data: {q: JSON.stringify(result)},
				beforeSend: function (request) {
					appUtilAuthHeader(request);
					appUtilSpinnerShow();
				},
			})
			.done(function(data) {
				// Hide the spinner
				appUtilSpinnerHide();

				// Reload page
				guidoLoadSection('navigation');
		 	})
			.fail(function() {
				// Call the error handler
				appUtilErrorHandler(jqXHR.status, _("Error editing page!"));
			})
		});
	})
	.fail(function() {
		// Call the error handler
		appUtilErrorHandler(jqXHR.status, _("Error getting page!"));
	});
}


function appAdminPagesDelete(id) {
	// Verify we really want to delete the image
	var r = confirm(_("Really delete this page?"));
	if (! r)
		return;

	// Call the API to delete the file
	var jqXHR = $.ajax({
		type: 'DELETE',
		url: appConf.api.url + '/admin_pages',
		data: {q: JSON.stringify({id: id})},
		beforeSend: function (request) {appUtilAuthHeader(request);},
	})
	.done(function(data) {
		// Reload page
		appLoadTemplate_admin_pages();
 	})
	.fail(function(jqXHR) {
		appUtilErrorHandler(jqXHR.status, "Error deleting page.");
	});
}

// First load only function for initial language
function appAdminPagesOnLoad() {
	if (appRun.kvs.admin.pages_form.already_loaded)
		return;

	appRun.kvs.admin.pages_form.already_loaded = true;
	appAdminPagesOnChangeLanguage();
}

// On change of language drop down, change the value of the title and content
function appAdminPagesOnChangeLanguage() {
	var elementLanguage = document.getElementById(appRun.kvs.admin.pages_form.fieldLanguage);
	var language = elementLanguage.options[elementLanguage.selectedIndex].value;

	// Call the API to get the page
	var jqXHR = $.ajax({
		type: 'GET',
		url: appConf.api.url + '/admin_pages',
		data: {q: JSON.stringify({language: language, page: appRun.kvs.admin.page})},
		beforeSend: function (request) {appUtilAuthHeader(request);},
	})
	.done(function(data) {
		// Find which array element this value belongs to
		var index = 0;
		for (index=0; index < data.length; index++ ) {
			if (data[index].language_id == language)
				break;
		}

		var elementTitle = document.getElementById(appRun.kvs.admin.pages_form.fieldTitle);
		elementTitle.value = data[index].title;

		var elementContent = document.getElementById(appRun.kvs.admin.pages_form.fieldTitle);
		elementContent.value = data[index].content;
 	})
	.fail(function(jqXHR) {
		appUtilErrorHandler(jqXHR.status, "Error getting page.");
	});
};

