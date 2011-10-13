/*
Copyright 2010 University of Toronto

Licensed under the Educational Community License (ECL), Version 2.0 or the New
BSD license. You may not use this file except in compliance with one of these
Licenses.

You may obtain a copy of the ECL 2.0 License and BSD License at
https://source.fluidproject.org/svn/LICENSE.txt
*/

// Declare dependencies
/*global decapod:true, fluid, jQuery*/

// JSLint options 
/*jslint white: true, funcinvoke: true, undef: true, newcap: true, nomen: true, regexp: true, bitwise: true, browser: true, forin: true, maxerr: 100, indent: 4 */

var decapod = decapod || {};

(function ($) {
    var generateCutpoints = function (options) {
        var selectors = options.selectors;
        var cutPoints = [];
        $.each(selectors, function (id, selector) {
            cutPoints.push({id: id, selector: selector});
        });
        return cutPoints;
    };
    
    var generateTree = function (model, opts) {
        var tree = [];
        $.each(opts.strings, function (stringName, string) {
            if (stringName !== "image") {
                tree.push({
                    ID: stringName,
                    value: string,
                    decorators: [{
                        type: "attrs",
                        attributes: {role: "button"}
                    }]
                });
            } else {
                tree.push({
                    ID: stringName,
                    target: model.image + "?" + (new Date()).getTime(),
                    decorators: [{
                        type: "attrs",
                        attributes: {alt: string}
                    }]
                });
            }
        });
            
        return {
            children: tree
        };
    };
    
    var bindEvents = function (that) {
        that.locate("cwButton").click(that.rotateCW);
        
        that.locate("ccwButton").click(that.rotateCCW);
        
        that.locate("captureButton").click(that.captureImage);
    };
        
    var setRotationStyle = function (that) {
        var image = that.locate("image");
        var rotationStyle = that.options.styles[that.model.rotation];
        
        image.removeClass(that.currentStyle || "");
        image.addClass(rotationStyle);
        that.currentStyle = rotationStyle;
    };
    
    var rotationInDegrees = function (startingRotation, rotationChange) {
        var newRotation = (startingRotation + rotationChange) % 360;
        
        newRotation += newRotation < 0 ? 360 : 0;
        
        return newRotation;
    };
    
    var setRotation = function (model, rotation) {
        var newRotation = rotationInDegrees(model.rotation, rotation);
        model.rotation = newRotation;
        return newRotation;
    };
    
    var rotate = function (that, rotation) {
        setRotation(that.model, rotation);
        setRotationStyle(that);
        that.events.rotated.fire(that.model.rotation);
    };
    
    var render = function (that) {
        var opts = {
            beforeAfterRenderFn: function (that) {
                setRotationStyle(that);
                bindEvents(that);
            }
        };
        
        decapod.render(that, generateTree, generateCutpoints, opts);
    };
    
    var setup = function (that) {
        that.model = that.options.model;
        
        if (that.model.image) {
            that.refreshView();
        } else {
            that.captureImage();
        }
    };
    
    decapod.imageRotator = function (container, options) {
        var that = fluid.initView("decapod.imageRotator", container, options);
        
        /**
         * Rotates the displayed image clockwise (90 degrees)
         */
        that.rotateCW = function () {
            rotate(that, 90);
        };
        
        /**
         * Rotates the displayed image counter clockwise (90 degrees)
         */
        that.rotateCCW = function () {
            rotate(that, -90);
        };
        
        /**
         * Performs a capture.
         * 
         * The capture is done via an ajax call to the server at the url specified in the options
         */
        that.captureImage = function () {
            var success = function (imageData) {
                that.model.image = imageData.image;
                that.refreshView();
            };
            
            var error = function (xhr, st, er) {
                //TODO: provide proper error handling (likely an error message of some sort)
                fluid.log(er);
            };
            
            $.ajax({
                url: that.options.url,
                type: "PUT",
                dataType: "json",
                success: success,
                error: error
            });
        };
        
        that.refreshView = function () {
            render(that);
        };
        
        setup(that);
        
        return that;
    };
    
    fluid.defaults("decapod.imageRotator", {
        selectors: {
            image: ".dc-imageRotator-image",
            cwButton: ".dc-imageRotator-cw",
            ccwButton: ".dc-imageRotator-ccw",
            captureButton: ".dc-imageRotator-capture"
        },
        
        styles: {
            90: "ds-imageRotator-90",
            180: "ds-imageRotator-180",
            270: "ds-imageRotator-270"
        },
        
        strings: {
            image: "Captured Image",
            cwButton: "Rotate clockwise",
            ccwButton: "Rotate counter clockwise",
            captureButton: "Do another test capture"
        },
        
        events: {
            afterRender: null,
            rotated: null
        },
        
        model: {
            image: "",
            rotation: 0
        },
        
        url: decapod.resources.testCaptureRight
    });
    
})(jQuery);
