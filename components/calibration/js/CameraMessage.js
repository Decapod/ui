/*
Copyright 2010 University of Toronto

Licensed under the Educational Community License (ECL), Version 2.0 or the New
BSD license. You may not use this file except in compliance with one of these
Licenses.

You may obtain a copy of the ECL 2.0 License and BSD License at
https://source.fluidproject.org/svn/LICENSE.txt
*/

/*global jQuery,fluid,decapod*/

var decapod = decapod || {};

(function ($) {
    
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
    
    var generateTree = function (opts, model) {
        var tree, skipLink, skipWarning, retryLink;
        var isError = model.status !== "success";
        var str = opts.strings;
        var url = opts.urls;
        
        if (isError) {
            skipLink = "skipErrorLink";
            skipWarning = "skipWarningError";
            retryLink = "retryLink";
            
            tree = [
                {
                    ID: "supportedCamerasMessage",
                    value: str.supportedCamerasMessage
                },
                {
                    ID: "supportedCamerasLink",
                    linktext: str.supportedCamerasLink,
                    target: url.supportedCamerasLink
                }
            ];
        } else {
            skipLink = "skipSuccessLink";
            skipWarning = "skipWarningSuccess";
            retryLink = "continueLink";
            
            tree = [];
        }
        
        tree.push({
                ID: "message",
                value: str[model.status]
            });
        tree.push({
                ID: "warning",
                value: str[skipWarning]
            });
        tree.push({
                ID: "retryLink",
                linktext: str[retryLink],
                target: url[retryLink]
            });
        tree.push({
                ID: "skipLink",
                linktext: str[skipLink],
                target: url[skipLink]
            });
            
        return {
            children: tree
        };
    };
    
    var render = function (that) {
        var tree = generateTree(that.options, that.model);
        var opts = {
            cutpoints: generateCutpoints(that.options.selectors)
        };
        
        if (that.templates) {
            fluid.reRender(that.templates, that.container, tree, opts);
        } else {
            that.templates = fluid.selfRender(that.container, tree, opts);
        }
        
        that.events.afterRender.fire();
    };
    
    var bindEvents = function (that) {
        //TODO: Add a click event that calls cameraChecker to retest the cameras
        that.locate("retryLink").click(function () {
            
        });
        
        //TODO: Add a click event that displays the supported cameras
        that.locate("").click(function () {
            
        });
    };
    
    var setup = function (that) {
        that.model = that.options.initialModel;
        if (that.model.status) {
            that.currentStatus();
        } else {
            that.testCameras();
        }
    };
    
    decapod.cameraMessage = function (container, options) {
        var that = fluid.initView("decapod.cameraMessage", container, options);
        
        /**
         * Shows the progress message
         */  
        that.startProgress = function () {
            //TODO: show progress screen
        };
        
        /**
         * Hides the progress message
         */
        that.stopProgress = function () {
            //TODO: hide progress screen
        };
        
        /**
         * Shows the set of supported cameras
         */
        that.showSupportedCameras = function () {
            //TODO: show set of supported cameras
        };
        
        /**
         * Hides the set of supported cameras
         */
        that.hideSupportedCameras = function () {
            //TODO: hide set of supported cameras
        };
        
        /**
         * Updates the model (status of cameras) and renders
         * out the appropriate message
         * 
         * @param {Object} status, the status of the cameras
         */
        that.updateStatus = function (status) {
            that.model.status = status;
            render(that);
        };
        
        /**
         * Renders out the appropriate message based on the 
         * current model (status of cameras)
         */
        that.currentStatus = function () {
            render(that);
        };
        
        /**
         * Tests the status of the cameras.
         * The model (status of cameras) will be updated and
         * and the appropriate message rendered.
         */
        that.testCameras = function () {
            var update = function (result) {
                that.updateStatus(result.status);
                that.stopProgress();
            };
            
            that.startProgress();
            decapod.checkCameras(update, update);
        };
        
        setup(that);
        
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
            showProgress: "ds-cameraMessage-showProgress"
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
            supportedCamerasMessage: "Decapod requires two matching, ",
            supportedCamerasLink: "supported cameras",
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
        
        initialModel: {
            status: null
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
