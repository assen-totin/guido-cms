/**
 * Per-template loading method. 
 * Will be called whenever the template named 'menu1' is attached to a parent. 
 */
function appLoadTemplate_admin_menu() {
	appRun.logger.debug('Entering function appLoadTemplate_admin_menu()...');

	// Load all images (images will be sought by class; class name should match image name)
	guidoRenderImages();
}



