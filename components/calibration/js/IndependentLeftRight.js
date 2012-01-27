/*
Copyright 2010 University of Toronto

Licensed under the Educational Community License (ECL), Version 2.0 or the New
BSD license. You may not use this file except in compliance with one of these
Licenses.

You may obtain a copy of the ECL 2.0 License and BSD License at
https://source.fluidproject.org/svn/LICENSE.txt
*/

// Declare dependencies
/*global window, decapod:true, fluid, jQuery*/

// JSLint options 
/*jslint white: true, funcinvoke: true, undef: true, newcap: true, nomen: true, regexp: true, bitwise: true, browser: true, forin: true, maxerr: 100, indent: 4 */

var decapod = decapod || {};

(function ($) {
    
    var generateCutpoints = function (opts) {
        var cutpoints = [];
        $.each(opts.strings, function (key) {
            cutpoints.push({id: key, selector: opts.selectors[key]});
        });
        return cutpoints;
    };
    
    var generateTree = function (model, opts) {
        var tree = [];
        $.each(opts.strings, function (stringName, string) {
            tree.push({
                ID: stringName,
                value: string
            });
        });
            
        return {
            children: tree
        };
    };
    
    var setButtons = function (that) {
        var swap = that.locate("swapButton");
        var submit = that.locate("submitButton");
        
        swap.click(that.swapCameras);
        swap.attr("role", "button");
        
        submit.click(that.submitCalibration);
        submit.attr("role", "button");
    };
    
    var updateRotation = function (model, id, rotation) {
        if (model.left.id === id) {
            model.left.rotation = rotation;
        } else {
            model.right.rotation = rotation;
        }
    };
    
    var initimageRotator = function (that, subcomponentName, cameraID, defaultRotation) {
        that.options[subcomponentName].options.model = {rotation: defaultRotation};
        var rotator = fluid.initSubcomponent(that, subcomponentName, [that.locate(subcomponentName), fluid.COMPONENT_OPTIONS]);
        rotator.cameraID = cameraID;
        rotator.events.rotated.addListener(function (rotation) {
            updateRotation(that.model, cameraID, rotation);
        });
        
        return rotator;
    };
    
    var refreshOrInitRotator = function (that, rotatorName, cameraID, defaultRotation) {
        if (that[rotatorName]) {
            that[rotatorName].refreshView();
        } else {
            that[rotatorName] = initimageRotator(that, rotatorName, cameraID, defaultRotation);
        }
    };
    
    var initimageRotators = function (that) {
        refreshOrInitRotator(that, "leftCameraRotator", that.model.left.id, that.model.left.rotation);
        refreshOrInitRotator(that, "rightCameraRotator", that.model.right.id, that.model.right.rotation);
    };
    
    var render = function (that) {
        var opts = {
            beforeAfterRenderFn: function (that) {
                setButtons(that);
                initimageRotators(that);
            }
        };
        
        decapod.render(that, generateTree, generateCutpoints, opts);
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
    
    decapod.independentLeftRight = function (container, options) {
        var that = fluid.initView("decapod.independentLeftRight", container, options);
        
        that.refreshView = function () {
            render(that);
        };
        
        that.swapCameras = function () {
            var left = that.locate("leftCameraRotator");
            var right = that.locate("rightCameraRotator");
            var leftParent = left.parent();
            var rightParent = right.parent();
            
            leftParent.append(right.remove());
            rightParent.append(left.remove());
            
            var tempLeft = that.model.left;
            that.model.left = that.model.right;
            that.model.right = tempLeft;
            
            initimageRotators(that);
        };
        
        that.submitCalibration = function () {
            $.ajax({
                url: that.options.urls.calibration,
                type: "POST",
                dataType: "json",
                data: {
                    "calibrationModel": JSON.stringify(that.model)
                }
            });
        };
        
        setup(that);
        
        return that;
    };
    
    fluid.defaults("decapod.independentLeftRight", {
        leftCameraRotator: {
            type: "decapod.imageRotator",
            options: {
                url: decapod.resources.testCaptureLeft
            }
        },
        
        rightCameraRotator: {
            type: "decapod.imageRotator",
            options: {
                url: decapod.resources.testCaptureRight
            }
        },
        
        selectors: {
            imageColumn: ".dc-independentLeftRight-imageColumn",
            pageHeader: ".dc-independentLeftRight-pageHeader",
            leftImageHeader: ".dc-independentLeftRight-leftImageHeader",
            rightImageHeader: ".dc-independentLeftRight-rightImageHeader",
            leftCameraID: ".dc-independentLeftRight-leftCameraID",
            rightCameraID: ".dc-independentLeftRight-rightCameraID",
            leftCameraRotator: ".dc-independentLeftRight-leftCameraRotator",
            rightCameraRotator: ".dc-independentLeftRight-rightCameraRotator",
            swapButton: ".dc-independentLeftRight-swapButton",
            submitButton: ".dc-independentLeftRight-submitButton"
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
            calibration: decapod.resources.calibration
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
