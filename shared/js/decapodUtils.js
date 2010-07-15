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
    
    var localDataURLs = {
        cameras: "../data/cameras.json",
        calibration: "../data/calibration.json",
        testCaptureLeft: "../data/testCapture.json",
        testCaptureRight: "../data/testCapture.json"
    };
    
    var servedResourceURLs = {
        cameras: "/cameras/",
        calibration: "/cameras/calibration/",
        testCaptureLeft: "/cameras/calibration/left",
        testCaptureRight: "/cameras/calibration/right"
    };

    decapod.resources = window.location.protocol === "file:" ? localDataURLs : servedResourceURLs;
    
    decapod.render = function (that, treeMaker, cutpointsMaker, options) {
        var options = options || {};
        var container = options.container || that.container;
        
        var tree = treeMaker(that.model, that.options);
        var opts = {
            cutpoints: cutpointsMaker(that.options)
        };
        
        if (that.templates) {
            fluid.reRender(that.templates, container, tree, opts);
        } else {
            that.templates = fluid.selfRender(container, tree, opts);
        }
        
        if (options.beforeAfterRenderFn) {
            options.beforeAfterRenderFn(that);
        }
        
        that.events.afterRender.fire();
    };
    
})(jQuery);
