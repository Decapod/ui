/*
Copyright 2009 University of Toronto

Licensed under the Educational Community License (ECL), Version 2.0 or the New
BSD license. You may not use this file except in compliance with one of these
Licenses.

You may obtain a copy of the ECL 2.0 License and BSD License at
https://source.fluidproject.org/svn/LICENSE.txt
*/

/*global jQuery*/
/*global fluid*/
/*global decapod*/

var decapod = decapod || {};

(function ($) {
	
	var getCameraProfile = function (that) {
		
		var success = function (cameraInfo) {
			that.events.stopProgress.fire();
			that.events.profilingSucceded.fire(that, cameraInfo);
		};
		
		var failure = function (xhr, status, error) {
			that.events.stopProgress.fire();
            that.events.profilingFailed.fire(that, xhr, status, error);
		};
		
		$.ajax({
			dataType: "json",
			type: "GET",
			success: success,
			error: failure
		});
	};
	
    decapod.cameraChecker = function (options) {
		var that = {};
		fluid.mergeComponentOptions(that, "decapod.cameraChecker", options);
		fluid.instantiateFirers(that, that.options);
        
        that.profileCameras = function () {
			that.options.functions.starProgress();
            getCameraProfile(that);
        };
        
        return that;
    };

    fluid.defaults("decapod.cameraChecker", {
		
        events: {
			startProfiling: null,
			stopProfiling: null,
			profilingSucceded: null,
			profilingFailed: null
        }
    });
    
})(jQuery);
