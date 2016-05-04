/**
 * Per-template loading method. 
 * Will be called whenever the template named 'main1' is attached to a parent. 
 */
function appLoadTemplate_admin_uploads() {
	appRun.logger.debug('Entering function appLoadTemplate_admin_uploads()...');

	// Table definition (only header, without rows added)
	var paramsTable = {
		div: 'admin_uploads',
		css: 'tbl-admin',
		sort: 2,
		sortControls: {			// We use the built-in font for sort control. See README for other options.
			sortAsc: 'guido',
			sortDesc: 'guido',
			sortedAsc: 'guido',
			sortedDesc: 'guido',
		},
		direction: 'desc',
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
				{content: _('Last update')},
				{content: _(' ')},
				{content: _(' ')},
			]
		},
		rows: []
	};

	var jqXHR = $.ajax({
		type: 'GET',
		url: appConf.api.url + '/admin_uploads',
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
			var row = {
				cells: [],
			};

			var cellName = {
				content: data[i].name,
			};
			row.cells.push(cellName);

			// Convert date to something display-friendly
			var d = new Date(data[i].added_on);
			var cellLastUpdate = {
				content: d.toLocaleString(),
			};
			row.cells.push(cellLastUpdate);

			var cellNewVersion = {
				content: "<a href=javascript:void(0); onClick=appAdminUploadForm(" + data[i].id + ");><img src='#' class=new_version.png title='" + _("Upload new version") + "'></a>",
			};
			row.cells.push(cellNewVersion);

			var cellDelete = {
				content: "<a href=javascript:void(0); onClick=appAdminUploadDelete(" + data[i].id + ");><img src='#' class=del.png title='" + _("Delete") + "'></a>",
			};
			row.cells.push(cellDelete);

			paramsTable.rows.push(row);
		}

		if (data.length)
			var t = new guidoTable(paramsTable, function(){
				// Load all images (images will be sought by class; class name should match image name)
				guidoRenderImages();
			});
		else {
			var el = document.getElementById("admin_uploads");
			if (el)
				el.innerHTML = "<p>" + _("No uploaded files found. Click ") + "<a href=javascript:void(0) onClick=guidoLoadSection('upload')>" + _("here") + "</a>" + _(" to add a file") + "</p>";
		}
	})
	.fail(function() {
		// Call the error handler
		appUtilErrorHandler(jqXHR.status, _("Error getting the list of uploaded files!"));
	});
}

function appAdminUploadForm(id) {
	appRun.kvs.upload_id = id;
	guidoLoadSection('upload');
}

function appAdminUploadDelete(id) {
	// Verify we really want to delete the image
	var r = confirm(_("Really delete the file?"));
	if (! r)
		return;

	// Call the API to delete the file
	var jqXHR = $.ajax({
		type: 'DELETE',
		url: appConf.api.url + '/admin_uploads',
		data: {q: JSON.stringify({id: id})},
		beforeSend: function (request) {appUtilAuthHeader(request);},
	})
	.done(function(data) {
		appLoadTemplate_admin_uploads();
 	})
	.fail(function(jqXHR) {
		appUtilErrorHandler(jqXHR.status, "Error deleting file.");
	});
}

