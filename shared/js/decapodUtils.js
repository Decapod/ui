/*
Copyright 2010 University of Toronto

Licensed under the Educational Community License (ECL), Version 2.0 or the New
BSD license. You may not use this file except in compliance with one of these
Licenses.

You may obtain a copy of the ECL 2.0 License and BSD License at
https://source.fluidproject.org/svn/LICENSE.txt
*/

/*global jQuery,decapod, window*/

var decapod = decapod || {};

(function ($) {
    
    // resources to use when running off the filesystem
    var localResources = {
        cameras: "../data/cameras.json",
        calibration: "../data/calibration.json",
        testCaptureLeft: "../data/testCapture.json",
        testCaptureRight: "../data/testCapture.json",
        
        bookManagement: "../../bookManagement/html/bookManagement.html", 
        cameraTest: "../../calibration/html/cameraMessage.html",
        leftRightCalibration: "../../calibration/html/calibration.html",
        capture: "../../capture/html/Capture.html",
        captureBlocked: "../../capture/html/Capture.html"
    };
    
    // resources to use when run through a server
    var servedResources = {
        cameras: "/cameras",
        calibration: "/cameras/calibration",
        testCaptureLeft: "/cameras/calibration/left",
        testCaptureRight: "/cameras/calibration/right",
        
        bookManagement: "/components/bookManagement/html/bookManagement.html", 
        cameraTest: "/components/calibration/html/cameraMessage.html",
        leftRightCalibration: "/components/calibration/html/calibration.html",
        capture: "/components/capture/html/Capture.html",
        captureBlocked: "/components/capture/html/Capture.html"
    };
    
    // sets the appropriate set of decapod resources
    decapod.resources = window.location.protocol === "file:" ? localResources : servedResources;
    
    decapod.rotationInDegrees = function (startingRotation, rotationChange) {
        var newRotation = (startingRotation + rotationChange) % 360;
        
        newRotation += newRotation < 0 ? 360 : 0;
        
        return newRotation;
    };
    
    // set navigationBar and bookManagement urls
    // TODO: move these to proper component code
    var setNavBar = function () {
        $(".dc-navigationBar-bookManagement").attr("href", decapod.resources.bookManagement);
        $(".dc-navigationBar-calibration").attr("href", decapod.resources.leftRightCalibration);
        $(".dc-navigationBar-capture").attr("href", decapod.resources.capture);
        $(".dc-bookManagement-cameraMessage").attr("href", decapod.resources.cameraTest);
    };
    
    $(document).ready(function () {
        setNavBar();
    });
    
})(jQuery);
