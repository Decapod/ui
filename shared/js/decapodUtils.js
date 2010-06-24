/*
Copyright 2010 University of Toronto

Licensed under the Educational Community License (ECL), Version 2.0 or the New
BSD license. You may not use this file except in compliance with one of these
Licenses.

You may obtain a copy of the ECL 2.0 License and BSD License at
https://source.fluidproject.org/svn/LICENSE.txt
*/

/*global jQuery,decapod*/

var decapod = decapod || {};

(function ($) {
    decapod.resources = {
        cameras: "/cameras",
        supportedCameras: "/supportedCameras.json"
    };
    
    decapod.checkCameras = function (success, error) {
        $.ajax({
            url: decapod.resources.camera,
            type: "GET",
            dataType: "json",
            success: success,
            error: error
        });
    };
    
    decapod.supportedCameras = function (success, error) {
        $.ajax({
            url: decapod.resources.supportedCameras,
            type: "GET",
            dataType: "json",
            success: success,
            error: error
        });
    };
})(jQuery);
