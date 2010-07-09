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
        cameras: "../data/cameras.json",
        calibration: "../data/calibration.json",
        testCaptureLeft: "../data/testCapture.json",
        testCaptureRight: "../data/testCapture.json",
        
        bookManagement: "#_", 
        leftRightCalibration: "#_",
        capture: "#_",
        captureBlocked: "#_"
    };
})(jQuery);
