/*
Copyright 2010 University of Toronto

Licensed under the Educational Community License (ECL), Version 2.0 or the New
BSD license. You may not use this file except in compliance with one of these
Licenses.

You may obtain a copy of the ECL 2.0 License and BSD License at
https://source.fluidproject.org/svn/LICENSE.txt
*/

/*global jQuer,fluid,decapod*/

var decapod = decapod || {};

(function ($) {
    
    /**
     * Creates a selector map
     * 
     * @param {Object} selectors, an object literal of the selectors
     */
    var generateCutpoints = function (selectors) {
        var cutpoints = [];
        for (var key in selectors) {
            cutpoints.push({
                id: key,
                selector: selectors[key]
            });
        }
        return cutpoints;
    };
    
    var generateErrorTree = function (opts, error) {
        var str = opts.strings;
        var url = opts.urls;
        return {
            children: [
                {
                    ID: "message",
                    value: str.error
                },
                {
                    ID: "requirement",
                    value: str.supportCamerasMessage
                },
                {
                    ID: "warning",
                    value: str.skipWarningError
                },
                {
                    ID: "requirementLink",
                    linktext: str.supportCamerasLink,
                    target: url.supportCamerasLink
                },
                {
                    ID: "retryLink",
                    linktext: str.retryLink,
                    target: url.retryLink
                },
                {
                    ID: "skipLink",
                    linktext: str.skipErrorLink,
                    target: url.skipErrorLink
                }
            ]
        };
    };
    
    var generateTree = function (opts, error) {
        var str = opts.strings;
        var url = opts.urls;
        
        var tree = [
            {
                ID: "message",
                value: str[error || "success"]
            },
            {
                ID: "requirement",
                value: str.supportCamerasMessage
            },
            {
                ID: "warning",
                value: str.skipWarningError
            },
            {
                ID: "requirementLink",
                linktext: str.supportCamerasLink,
                target: url.supportCamerasLink
            },
            {
                ID: "retryLink",
                linktext: str.retryLink,
                target: url.retryLink
            },
            {
                ID: "skipLink",
                linktext: str.skipErrorLink,
                target: url.skipErrorLink
            }
        ];
            
        return {
            children: tree
        };
    };
    
    var render = function (that, container) {
        var tree = generateTree(that.options);
        var opts = {
            cutpoints: generateCutpoints(that.options.selectors)
        };
        
        if (that.templates) {
            fluid.reRender(that.templates, container, tree, opts);
        } else {
            that.templates = fluid.render(that, container, tree, opts);
        }
    };
    
    var bindEvents = function (that) {
        // Add a click event that calls cameraChecker to retest the cameras
        that.locate("retryLink").click(function () {
            
        });
        
        // Add a click event that displays the supported cameras
        that.locate("").click(function () {
            
        });
    };
    
    var setup = function (that) {
        that.testCameras();
    };
    
    decapod.cameraMessage = function (container, options) {
        var that = fluid.initView("decapod.cameraMessage", container, options);
        
        that.showSuccessMessage = function (error) {
            // render the success message
        };
        
        that.showErrorMessage = function () {
            // renders the specified error message
        };
        
        that.testCameras = function () {
            var callErrorMessage = function (result) {
                that.showSuccessMessage(result.status);
            };
            
            decapod.checkCameras(that.showSuccessMessage, callErrorMessage);
        };
        
//        setup();
        
        return that;
    };
    
    fluid.defaults("decapod.cameraMessage", {
        
        selectors: {
            message: ".dc-cameraMessage-message",
            supportedCamerasMessage: ".dc-cameraMessage-requirement",
            supportedCamerasLink: ".dc-cameraMessage-requirementLink",
            retryLink: ".dc-cameraMessage-retryLink",
            skipLink: ".dc-cameraMessage-skipLink",
            warning: ".dc-cameraMessage-warning"
        },
        
        styles: {
            
        },
        
        strings: {
            oneCameraIncompatible: "It seems like you only have one camera connected, and it is incompatible.",
            oneCameraCompatible: "It seems like you have only one camera connected.",
            notMatchingOneCompatibleOneNot: "It seems like you have two cameras connected; one is compatible, the other is not.",
            notMatchingIncompatible: "It seems like you have two cameras connected, buty they are not compatible nor matching.",
            notMatchingCompatible: "It seems like you have two supported cameras connected, but they are not matching.",
            incompatible: "It seems like you have two matching cameras connected, but they are not compatible.",
            noCameras: "It seems like no cameras are connected.",
            success: "To get the best results, you should run through calibration before capturing",
            supportCamerasMessage: "Decapod requires two matching, ",
            supportCamerasLink: "supported cameras",
            retryLink: "Try again",
            continueLink: "Continue to calibration",
            skipErrorLink: "Skip camera setup",
            skipSuccessLink: "Skip calibration",
            skipWarningError: "(You won't be able to capture)",
            skipWarningSuccess: "Results may be unpredictable"
        },
        
        events: {
            afterRender: null
        },
        
        urls: {
            retryLink: "#_",
            continueLink: "#_",
            supportedCamerasLink: "#_",
            skipErrorLink: "#_",
            skipSuccessLink: "#_"
        }
    });
    
})(jQuery);
