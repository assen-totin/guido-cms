/**
 * Per-template loading method. 
 * Will be called whenever the template named 'main1' is attached to a parent. 
 */
function appLoadTemplate_admin_navigation() {
	appRun.logger.debug('Entering function appLoadTemplate_admin_navigation()...');

	// Form definition
	var paramsForm = {
		div: 'admin_navigation_form',
		css: 'form-admin',
		fields: {
			name: {
				type: 'INPUT',
				order: 10,
				cssField: 'form-admin-div',
				cssInput: 'form-admin-input',
				attributes: {type: 'text', placeholder: _("Page name"), name:'name'},
				validator: {
					enabled: true,
					validate: 'notempty',
					error: _('Page name cannot be empty.')
				}
			},
			parent: {
				type: 'SELECT',
				order: 20,
				label: _("Parent: "),
				cssField: 'form-admin-div',
				cssInput: 'form-admin-input',
				attributes: {name:'parent'},
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
		div: 'admin_navigation_table',
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
				{content: ' '},
			]
		},
		rows: []
	};

	var jqXHR = $.ajax({
		type: 'GET',
		url: appConf.api.url + '/admin_navigation',
		beforeSend: function (request) {
			appUtilAuthHeader(request);
			appUtilSpinnerShow();
		},
	})
	.done(function(dataIn) {
		// Hide the spinner
		appUtilSpinnerHide();

		var data = appAdminNavigationSort(dataIn);

		// Populate the table, row by row
		for (var i=0; i<data.length; i++) {
			// Prepare form drop-down
			var option = {
				value:data[i].id, 
				text: data[i].name,
			};
			paramsForm.fields.parent.extra.options.push(option);

			// Skip the first row (to level) from the table
			if (i == 0)
				continue;

			// Prepare table row
			var row = {
				cells: [],
			};

			var cellName = {
				content: data[i].name,
			};
			row.cells.push(cellName);

			// Up arrow
			var cellUp = {
				content: (data[i].showUp) ? "<a href=javascript:void(0); onClick=appAdminNavigationMove(" + data[i].id + ",'up');><img src='#' class=up.png title='" + _("Move up") + "'></a>" :""
			};
			row.cells.push(cellUp);

			// Down arrow
			var cellDown = {
				content: (data[i].showDown) ? "<a href=javascript:void(0); onClick=appAdminNavigationMove(" + data[i].id + ",'down');><img src='#' class=down.png title='" + _("Move down") + "'></a>" : ""
			};
			row.cells.push(cellDown);

			var cellContent = {
				content: "<a href=javascript:void(0); onClick=appAdminNavigationEdit(" + data[i].id + ");><img src='#' class=content.png title='" + _("Delete") + "'></a>",
			};
			row.cells.push(cellContent);

			var cellDelete = {
				content: "<a href=javascript:void(0); onClick=appAdminNavigationDelete(" + data[i].id + ");><img src='#' class=del.png title='" + _("Edit") + "'></a>",
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
				url: appConf.api.url + '/admin_navigation',
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
				appLoadTemplate_admin_navigation();
		 	})
			.fail(function() {
				// Call the error handler
				appUtilErrorHandler(jqXHR.status, _("Error creating page!"));
			})
		});

		// Show table with navigation or display text no entries were found
		if (data.length > 1)
			var t = new guidoTable(paramsTable, function(){
				// Load all images (images will be sought by class; class name should match image name)
				guidoRenderImages();
			});
		else {
			var el = document.getElementById("admin_navigation_table");
			if (el)
				el.innerHTML = "<p>" + _("No navigation found. Use the form above to create one.") + "</p>";
		}
	})
	.fail(function() {
		// Call the error handler
		appUtilErrorHandler(jqXHR.status, _("Error getting navigation!"));
	});
}

// Switch to page editing keeping the ID of the page
function appAdminNavigationEdit(id) {
	appRun.kvs.admin.navigation = id;
	guidoLoadSection('pages');
}

function appAdminNavigationDelete(id) {
	// Verify we really want to delete the image
	var r = confirm(_("Really delete this page?"));
	if (! r)
		return;

	// Call the API to delete the file
	var jqXHR = $.ajax({
		type: 'DELETE',
		url: appConf.api.url + '/admin_navigation',
		data: {q: JSON.stringify({id: id})},
		beforeSend: function (request) {appUtilAuthHeader(request);},
	})
	.done(function(data) {
		// Reload page
		appLoadTemplate_admin_navigation();
 	})
	.fail(function(jqXHR) {
		appUtilErrorHandler(jqXHR.status, "Error deleting page.");
	});
}


function appAdminNavigationMove(id, direction) {
	// Call the API to delete the file
	var jqXHR = $.ajax({
		type: 'PUT',
		url: appConf.api.url + '/admin_navigation',
		data: {q: JSON.stringify({id: id, move: direction})},
		beforeSend: function (request) {appUtilAuthHeader(request);},
	})
	.done(function(data) {
		// Reload page
		appLoadTemplate_admin_navigation();
 	})
	.fail(function(jqXHR) {
		appUtilErrorHandler(jqXHR.status, "Error moving page.");
	});
}

// Recursively find child nodes
function appAdminNavigationFindNext(dataIn, parent, name) {
	var ret = [];

	for (var i=0; i<dataIn.length; i++) {
		if (dataIn[i].parent == parent) {
			dataIn[i].name = name + ' -> ' + dataIn[i].name;
			ret.push(dataIn[i]);

			var res = appAdminNavigationFindNext(dataIn, dataIn[i].id, dataIn[i].name);
			for (var j=0; j<res.length; j++)
				ret.push(res[j]);
		}
	}

	return ret;
}


// Sort the entries in a hierarchial way
function appAdminNavigationSort(dataIn) {
	var ret = [];
	// Index zero is the top-level (invisible in rendering)
	ret[0] = dataIn[0];

	/*
	Step 1: re-order the items and set path - from (parent, priority) to:
	- a
	- a / b
	- a / b / c
	- a / d
	- a / d / e
	*/
	for (var i=0; i<dataIn.length; i++) {
		if (dataIn[i].parent == 1) {
			//dataIn[i].name = '/ ' + dataIn[i].name;
			ret.push(dataIn[i]);
			var res = appAdminNavigationFindNext(dataIn, dataIn[i].id, dataIn[i].name);
			for (var j=0; j<res.length; j++)
				ret.push(res[j]);
		}
	}

	// Step 2: Set flags for down & up buttons
	for (var i=0; i<dataIn.length; i++) {
		for (var j=i+1; j<dataIn.length; j++) {
			if (dataIn[j].parent == dataIn[i].parent)
				dataIn[i].showDown = true;
		}
	}

	for (var i=dataIn.length-1; i>=1; i--) {
		for (var j=i-1; j>=0; j--) {
			if (dataIn[j].parent == dataIn[i].parent)
				dataIn[i].showUp = true;
		}
	}

	return ret;
}

