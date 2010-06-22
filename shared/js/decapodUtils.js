var decapod = decapod || {};

decapod.resources = {
	cameras: "/cameras"
};

decapod.checkCameras = function (success, error) {
	$.ajax({
		url: decapod.resources.camera,
		type: "GET",
		dataType: "json",
		success: success,
		error: error
	});	
}
