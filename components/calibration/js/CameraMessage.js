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
        return [
            {id: "message", selector: selectors.message},
            {id: "supportedCamerasMessage", selector: selectors.supportedCamerasMessage},
            {id: "supportedCamerasButton", selector: selectors.supportedCamerasButton},
            {id: "retryAndContinue", selector: selectors.retryAndContinue},
            {id: "skipLink", selector: selectors.skipLink},
            {id: "warning", selector: selectors.warning}
        ];
    };
    
    var generateTree = function (opts, model) {
        var tree, skipLink, skipWarning;
        var isError = model.status !== "success";
        var str = opts.strings;
        var url = opts.urls;
        
        if (isError) {
            skipLink = "skipErrorLink";
            skipWarning = "skipWarningError";
            
            tree = [
                {
                    ID: "supportedCamerasMessage",
                    value: str.supportedCamerasMessage
                },
                {
                    ID: "supportedCamerasButton",
                    value: str.supportedCamerasLink,
                    decorators: [{
                        type: "attrs",
                        attributes: {role: "button"}
                    }]
                }, 
                {
                    ID: "retryAndContinue",
                    value: str.retryLink,
                    decorators: [{
                        type: "attrs",
                        attributes: {role: "button"}
                    }]
                }
            ];
        } else {
            skipLink = "skipSuccessLink";
            skipWarning = "skipWarningSuccess";
            
            tree = [{
                ID: "retryAndContinue",
                linktext: str.continueLink,
                target: url.continueLink
            }];
        }
        
        tree.push({
                ID: "message",
                value: str.statuses[model.status]
            });
        tree.push({
                ID: "warning",
                value: str[skipWarning]
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
    
    var bindEvents = function (that) {
        that.locate("retryAndContinue").click(function (event) {
            that.testCameras();
            event.preventDefault();
        });
        
        that.locate("supportedCamerasButton").click(function (event) {
            that.showSupportedCameras();
            event.preventDefault();
        });
    };
    
    var render = function (that) {
        var tree = generateTree(that.options, that.model);
        var opts = {
            cutpoints: generateCutpoints(that.options.selectors)
        };
        
        if (that.templates) {
            fluid.reRender(that.templates, that.locate("messageContainer"), tree, opts);
        } else {
            that.templates = fluid.selfRender(that.locate("messageContainer"), tree, opts);
        }
        
        if (that.model.status !== "success") {
            bindEvents(that);
        }
        
        that.events.afterRender.fire(that.model);
    };
    
    var initSupportedCameras = function (that) {
        that.supportedCameras = fluid.initSubcomponent(that, "supportedCameras", [that.locate("supportedCamerasContainer"), {model: that.model}]);
        that.supportedCameras.hide();
    };
    
    var setup = function (that) {
        that.model = that.options.initialModel;
        that.progress = fluid.initSubcomponent(that, "progressMessage", [that.locate("progressContainer"), fluid.COMPONENT_OPTIONS]);
        
        if (that.model.status) {
            that.currentStatus();
            initSupportedCameras(that);
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
            that.container.addClass(that.options.styles.showProgress);
        };
        
        /**
         * Hides the progress message
         */
        that.stopProgress = function () {
            that.container.removeClass(that.options.styles.showProgress);
        };
        
        /**
         * Shows the set of supported cameras
         */
        that.showSupportedCameras = function () {
            that.supportedCameras.show();
        };
        
        /**
         * Hides the set of supported cameras
         */
        that.hideSupportedCameras = function () {
            that.supportedCameras.hide();
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
                that.model = result;
                render(that);
                if (!that.supportedCameras) {
                    initSupportedCameras(that);
                }
                that.stopProgress();
            };
            
            that.startProgress();
            $.ajax({
                url: that.options.urls.cameras,
                type: "GET",
                dataType: "json",
                success: update,
                error: update
            });
        };
        
        setup(that);
        
        return that;
    };
    
    fluid.defaults("decapod.cameraMessage", {
        
        progressMessage: {
            type: "decapod.progressMessage",
            options: {}
        },
        
        supportedCameras: {
            type: "decapod.supportedCameras",
            options: {}
        },
        
        selectors: {
            supportedCamerasContainer: ".dc-cameraMessage-supportedCameras",
            progressContainer: ".dc-cameraMessage-progress",
            messageContainer: ".dc-cameraMessage-messageContainer",
            message: ".dc-cameraMessage-message",
            supportedCamerasMessage: ".dc-cameraMessage-supportedCamerasMessage",
            supportedCamerasButton: ".dc-cameraMessage-supportedCamerasButton",
            retryAndContinue: ".dc-cameraMessage-retryAndContinue",
            skipLink: ".dc-cameraMessage-skipLink",
            warning: ".dc-cameraMessage-warning"
        },
        
        styles: {
            showProgress: "ds-cameraMessage-showProgress"
        },
        
        strings: {
            
            statuses: {
                oneCameraIncompatible: "It seems like you only have one camera connected, and it is incompatible.",
                oneCameraCompatible: "It seems like you have only one camera connected.",
                notMatchingOneCompatibleOneNot: "It seems like you have two cameras connected; one is compatible, the other is not.",
                notMatchingIncompatible: "It seems like you have two cameras connected, buty they are not compatible nor matching.",
                notMatchingCompatible: "It seems like you have two supported cameras connected, but they are not matching.",
                incompatible: "It seems like you have two matching cameras connected, but they are not compatible.",
                noCameras: "It seems like no cameras are connected.",
                success: "To get the best results, you should run through calibration before capturing"
            },
            
            supportedCamerasMessage: "Decapod requires two matching, ",
            supportedCamerasButton: "supported cameras",
            retryLink: "Try again",
            continueLink: "Continue to calibration",
            skipErrorLink: "Skip camera setup",
            skipSuccessLink: "Skip calibration",
            skipWarningError: "(You won't be able to capture)",
            skipWarningSuccess: "(Results may be unpredictable)"
        },
        
        events: {
            afterRender: null
        },
        
        initialModel: {
            status: null
        },
        
        urls: {
            continueLink: decapod.resources.leftRightCalibration,
            skipErrorLink: decapod.resources.captureBlocked,
            skipSuccessLink: decapod.resources.capture,
            cameras: decapod.resources.cameras
        }
    });
    
})(jQuery);
