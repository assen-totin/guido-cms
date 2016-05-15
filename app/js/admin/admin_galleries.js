/**
 * Per-template loading method. 
 * Will be called whenever the template named 'main1' is attached to a parent. 
 */
function appLoadTemplate_admin_galleries() {
	appRun.logger.debug('Entering function appLoadTemplate_admin_galleries()...');

	// Form definition
	var paramsForm = {
		div: 'admin_galleries_form',
		css: 'form-admin',
		fields: {
			name: {
				type: 'INPUT',
				order: 10,
				cssField: 'form-admin-div',
				cssInput: 'form-admin-input',
				attributes: {type: 'text', placeholder: _("Gallery name"), name:'name'},
				validator: {
					enabled: true,
					validate: 'notempty',
					error: _('Gallery name cannot be empty.')
				}
			},
			style: {
				type: 'SELECT',
				order: 20,
				label: _("Style: "),
				cssField: 'form-admin-div',
				cssInput: 'form-admin-input',
				attributes: {name:'style'},
				extra: {
					options: [],
				},
			},
			submit: {
				type: 'BUTTON',
				cssField: 'form-admin-div',
				cssInput: 'form-admin-button',
				order: 90,
				extra: {text:_('Create'), name: 'submit', action: 'submit'}
			}
		}
	};

	// Table definition (only header, without rows added)
	var paramsTable = {
		div: 'admin_galleries_table',
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
				{content: ' '},
				{content: ' '},
				{content: ' '},
			]
		},
		rows: []
	};

	var jqXHR = $.ajax({
		type: 'GET',
		url: appConf.api.url + '/admin_gallery_styles',
		beforeSend: function (request) {
			appUtilAuthHeader(request);
			appUtilSpinnerShow();
		},
	})
	.done(function(data) {
		// Hide the spinner
		appUtilSpinnerHide();

		// Fill-in gallery styles drop-down
		for (var i=0; i<data.length; i++) {
			var option = {
				value: data[i].id, 
				text: data[i].name
			}
			paramsForm.fields.style.extra.options.push(option);
		}

		var jqXHR = $.ajax({
			type: 'GET',
			url: appConf.api.url + '/admin_galleries',
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
				// Prepare table row
				var row = {
					cells: [],
				};

				var cellName = {
					content: data[i].name,
				};
				row.cells.push(cellName);

				var cellContent = {
					content: "<a href=javascript:void(0); onClick=appAdminGalleriesUpload(" + data[i].id + ");><img src='#' class=new_version.png title='" + _("Upload") + "'></a>",
				};
				row.cells.push(cellContent);

				var cellContent = {
					content: "<a href=javascript:void(0); onClick=appAdminGalleriesEdit(" + data[i].id + ");><img src='#' class=content.png title='" + _("Edit") + "'></a>",
				};
				row.cells.push(cellContent);

				var cellDelete = {
					content: "<a href=javascript:void(0); onClick=appAdminGalleriesDelete(" + data[i].id + ");><img src='#' class=del.png title='" + _("Delete") + "'></a>",
				};
				row.cells.push(cellDelete);

				paramsTable.rows.push(row);
			}

			// Show new entry form
			var form = new guidoForm(paramsForm, function(error, result) {
				// Pass any error to the error handler
				if (error) {
					appUtilErrorHandler(0, error.validator.error);
					return;
				}

				var jqXHR = $.ajax({
					type: 'POST',
					url: appConf.api.url + '/admin_galleries',
					data: {q: JSON.stringify(result)},
					beforeSend: function (request) {
						appUtilAuthHeader(request);
						appUtilSpinnerShow();
					},
				})
				.done(function() {
					// Hide the spinner
					appUtilSpinnerHide();

					// Reload galleries
					appLoadTemplate_admin_galleries();
			 	})
				.fail(function() {
					// Call the error handler
					appUtilErrorHandler(jqXHR.status, _("Error creating gallery!"));
				})
			});

			// Show table with galleries or display text no entries were found
			if (data.length > 0)
				var t = new guidoTable(paramsTable, function(){
					// Load all images (images will be sought by class; class name should match image name)
					guidoRenderImages();
				});
			else {
				var el = document.getElementById("admin_galleries_table");
				if (el)
					el.innerHTML = "<p>" + _("No galleries found. Use the form above to create one.") + "</p>";
			}
		})
		.fail(function() {
			// Call the error handler
			appUtilErrorHandler(jqXHR.status, _("Error getting galleries!"));
		});
	})
	.fail(function() {
		// Call the error handler
		appUtilErrorHandler(jqXHR.status, _("Error getting gallery_styles!"));
	});
}

function appAdminGalleriesUpload(id) {
	appRun.kvs.admin.gallery = id;
	guidoLoadSection('upload');
}

// Switch to gallery editing keeping the ID of the gallery
function appAdminGalleriesEdit(id) {
	appRun.kvs.admin.galleries = id;
	guidoLoadSection('gallery_images');
}

function appAdminGalleriesDelete(id) {
	// Verify we really want to delete the image
	var r = confirm(_("Really delete this gallery?"));
	if (! r)
		return;

	// Call the API to delete the file
	var jqXHR = $.ajax({
		type: 'DELETE',
		url: appConf.api.url + '/admin_galleries',
		data: {q: JSON.stringify({id: id})},
		beforeSend: function (request) {appUtilAuthHeader(request);},
	})
	.done(function(data) {
		// Reload gallery
		appLoadTemplate_admin_galleries();
 	})
	.fail(function(jqXHR) {
		appUtilErrorHandler(jqXHR.status, "Error deleting gallery.");
	});
}

