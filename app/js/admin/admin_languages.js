/**
 * Per-template loading method. 
 * Will be called whenever the template named 'main1' is attached to a parent. 
 */
function appLoadTemplate_admin_languages() {
	appRun.logger.debug('Entering function appLoadTemplate_admin_languages()...');

	// Form definition
	var paramsForm = {
		div: 'admin_languages_form',
		css: 'form-admin',
		fields: {
			language: {
				type: 'SELECT',
				order: 20,
				label: _("Language: "),
				cssField: 'form-admin-div',
				cssInput: 'form-admin-input',
				attributes: {name:'id'},
				extra: {
					options: [],
				},
			},
			submit: {
				type: 'BUTTON',
				cssField: 'form-admin-div',
				cssInput: 'form-admin-button',
				order: 90,
				extra: {text:_('Activate'), name: 'submit', action: 'submit'}
			}
		}
	};

	// Table definition (only header, without rows added)
	var paramsTable = {
		div: 'admin_languages_table',
		css: 'tbl-admin',
		sortControls: {			// We use the built-in font for sort control. See README for other options.
			sortAsc: 'guido',
			sortDesc: 'guido',
			sortedAsc: 'guido',
			sortedDesc: 'guido',
		},
		page: 25,
		pageControls: {
			position: ['bottom'],
			align: ['right'],
			css: 'page',
		},
		header: {
			css: 'th',
			cells: [
				{sort: true, content: _('Name')},
				{content: _(' ')},
			]
		},
		rows: []
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

		// Populate the table, row by row
		for (var i=0; i<data.length; i++) {
			// Prepare form drop-down
			if (data[i].status == 'inactive') {
				var option = {
					value:data[i].id, 
					text: data[i].name_en + ' / ' + data[i].name ,
				};
				paramsForm.fields.language.extra.options.push(option);
			}
			else if (data[i].status == 'active') {
				// Prepare table row
				var row = {
					cells: [],
				};

				var cellName = {
					content: data[i].name_en + ' / ' + data[i].name,
				};
				row.cells.push(cellName);

				var cellDelete = {
					content: "<a href=javascript:void(0); onClick=appAdminLanguagesDelete(" + data[i].id + ");><img src='#' class=del.png title='" + _("Deactivate") + "'></a>",
				};
				row.cells.push(cellDelete);

				paramsTable.rows.push(row);
			}
		}

		// Show new entry form
		var form = new guidoForm(paramsForm, function(error, result) {
			// Pass any error to the error handler
			if (error) {
				appUtilErrorHandler(0, error.validator.error);
				return;
			}

			var jqXHR = $.ajax({
				type: 'PUT',
				url: appConf.api.url + '/admin_languages',
				data: {q: JSON.stringify(result)},
				beforeSend: function (request) {
					appUtilAuthHeader(request);
					appUtilSpinnerShow();
				},
			})
			.done(function() {
				// Hide the spinner
				appUtilSpinnerHide();

				// Reload page
				appLoadTemplate_admin_languages();
		 	})
			.fail(function() {
				// Call the error handler
				appUtilErrorHandler(jqXHR.status, _("Error creating page!"));
			})
		});

		// Show table with languages or display text no entries were found
		if (paramsTable.rows.length)
			var t = new guidoTable(paramsTable, function(){
				// Load all images (images will be sought by class; class name should match image name)
				guidoRenderImages();
			});
		else {
			var el = document.getElementById("admin_languages_table");
			if (el)
				el.innerHTML = "<p>" + _("No active languages found. Use the form above to activate one.") + "</p>";
		}
	})
	.fail(function() {
		// Call the error handler
		appUtilErrorHandler(jqXHR.status, _("Error getting languages!"));
	});
}

function appAdminLanguagesDelete(id) {
	// Call the API to delete the file
	var jqXHR = $.ajax({
		type: 'DELETE',
		url: appConf.api.url + '/admin_languages',
		data: {q: JSON.stringify({id: id})},
		beforeSend: function (request) {appUtilAuthHeader(request);},
	})
	.done(function(data) {
		// Reload page
		appLoadTemplate_admin_languages();
 	})
	.fail(function(jqXHR) {
		appUtilErrorHandler(jqXHR.status, "Error deactivating language.");
	});
}


