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
    
    var generateCutpoints = function (opts) {
        var cutpoints = [];
        $.each(opts.strings, function (key) {
            cutpoints.push({id: key, selector: opts.selectors[key]});
        });
        return cutpoints;
    };
    
    var generateTree = function (opts) {
        var tree = [];
        $.each(opts.strings, function (stringName, string) {
            var obj = {
                ID: stringName
            };
            
            if (stringName === "submitButton") {
                obj.linktext = string;
                obj.target = opts.urls[stringName];
            } else {
                obj.value = string;
            }
            
            tree.push(obj);
        });
            
        return {
            children: tree
        };
    };
    
    var bindEvents = function (that) {
        that.locate("swapButton").click(that.swapCameras);
        
        that.locate("submitButton").click(that.submitCalibration);
    };
    
    var updateRotation = function (model, id, rotation) {
        if (model.left.id === id) {
            model.left.rotation = rotation;
        } else {
            model.right.rotation = rotation;
        }
    };
    
    var initImageRotaters = function (that) {
        if (that.leftCameraRotater) {
            that.leftCameraRotater.refreshView();
        } else {
            that.leftCameraRotater = fluid.initSubcomponent(that, "leftCameraRotater", [that.locate("leftCameraRotater"), fluid.COMPONENT_OPTIONS]);
            that.leftCameraRotater.cameraID = that.model.left.id;
            that.leftCameraRotater.events.rotated.addListener(function (rotation) {
                updateRotation(that.model, that.leftCameraRotater.cameraID, rotation);
            });
        }
        
        if (that.rightCameraRotater) {
            that.rightCameraRotater.refreshView();
        } else {
            that.rightCameraRotater = fluid.initSubcomponent(that, "rightCameraRotater", [that.locate("rightCameraRotater"), fluid.COMPONENT_OPTIONS]);
            that.rightCameraRotater.cameraID = that.model.right.id;
            that.rightCameraRotater.events.rotated.addListener(function (rotation) {
                updateRotation(that.model, that.rightCameraRotater.cameraID, rotation);
            });
        }
    };
    
    var initReorderer = function (that) {
        if (that.reorderer) {
            that.reorderer.refreshView();
        } else {
            that.reorderer = fluid.initSubcomponent(that, "reorderer", [that.container, fluid.COMPONENT_OPTIONS]);
            that.reorderer.events.afterMove.addListener(function () {
                var tempLeft = that.model.left;
                that.model.left = that.model.right;
                that.model.right = tempLeft;
                initImageRotaters(that);
            });
        }
    };
    
    var render = function (that) {
        var tree = generateTree(that.options);
        var opts = {
            cutpoints: generateCutpoints(that.options)
        };
        
        if (that.templates) {
            fluid.reRender(that.templates, that.container, tree, opts);
        } else {
            that.templates = fluid.selfRender(that.container, tree, opts);
        }
        
        bindEvents(that);
        initReorderer(that);
        initImageRotaters(that);
        that.events.afterRender.fire();
    };
    
    var setup = function (that) {
        var success = function (model) {
            that.model = model;
            that.refreshView();
        }; 
        
        var error = function () {
            that.model = {
                left: {
                    id: "left",
                    rotation: 0
                },
                right: {
                    id: "right",
                    rotation: 0
                }
            };
            that.refreshView();
        };
        
        that.model = that.options.model;
        
        if (!that.model.left.id || !that.model.right.id) {
            $.ajax({
                url: that.options.urls.calibration,
                type: "GET",
                dataType: "json",
                success: success,
                error: error
            });
        } else {
            that.refreshView();
        }
    };
    
    decapod.cameraSetup = function (container, options) {
        var that = fluid.initView("decapod.cameraSetup", container, options);
        
        that.refreshView = function () {
            render(that);
        };
        
        that.swapCameras = function () {
            var leftCamera = that.locate("leftCameraRotater");
            var rightCamera = that.locate("rightCameraRotater")[0];
            that.reorderer.requestMovement({element: rightCamera, position: -1}, leftCamera);
        };
        
        that.submitCalibration = function () {
            $.ajax({
                url: that.options.urls.calibration,
                type: "POST",
                dataType: "json",
                data: that.model
            });
        };
        
        setup(that);
        
        return that;
    };
    
    fluid.defaults("decapod.cameraSetup", {
        reorderer: {
            type: "fluid.reorderList",
            options: {
                selectors: {
                    movables: ".dc-cameraSetup-module",
                    selectables: ".dc-cameraSetup-module"
                }
            }
        },
        
        leftCameraRotater: {
            type: "decapod.imageRotater",
            options: {
                url: decapod.resources.testCaptureLeft
            }
        },
        
        rightCameraRotater: {
            type: "decapod.imageRotater",
            options: {
                url: decapod.resources.testCaptureRight
            }
        },
        
        selectors: {
            imageColumn: ".dc-cameraSetup-imageColumn",
            pageHeader: ".dc-cameraSetup-pageHeader",
            leftImageHeader: ".dc-cameraSetup-leftImageHeader",
            rightImageHeader: ".dc-cameraSetup-rightImageHeader",
            leftCameraID: ".dc-cameraSetup-leftCameraID",
            rightCameraID: ".dc-cameraSetup-rightCameraID",
            leftCameraRotater: ".dc-cameraSetup-leftCameraRotater",
            rightCameraRotater: ".dc-cameraSetup-rightCameraRotater",
            swapButton: ".dc-cameraSetup-swapButton",
            submitButton: ".dc-cameraSetup-submitButton"
        },
        
        strings: {
            pageHeader: "Adjust page rotation and order",
            leftImageHeader: "Left Page",
            rightImageHeader: "Right Page",
            leftCameraID: "(i.e., Left Camera)",
            rightCameraID: "(i.e., Right Camera)",
            swapButton: "Swap Pages",
            submitButton: "Done. Let's start/continue capturing"
        },
        
        events: {
            afterRender: null
        },
        
        urls: {
            calibration: "decapod.resources.calibration",
            submitButton: "decapod.resources.capture"
        }, 
        
        model: {
            left: {
                id: "",
                rotation: 0
            },
            right: {
                id: "",
                rotation: 0
            }
        }
    });
    
})(jQuery);
