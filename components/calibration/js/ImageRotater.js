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
                    target: model.image,
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
    
    var setRotation = function (model, rotation) {
        var newRotation = (model.rotation + rotation) % 360;
        
        if (newRotation < 0) {
            newRotation = newRotation + 360;
        }
        
        model.rotation = newRotation;
        return newRotation;
    };
    
    var render = function (that) {
        var tree = generateTree(that.model, that.options);
        var opts = {
            cutpoints: generateCutpoints(that.options.selectors)
        };
        
        if (that.templates) {
            fluid.reRender(that.templates, that.container, tree, opts);
        } else {
            that.templates = fluid.selfRender(that.container, tree, opts);
        }
        
        setRotationStyle(that);
        bindEvents(that);
        that.events.afterRender.fire();
    };
    
    var setup = function (that) {
        that.model = that.options.model;
        
        if (that.model.image) {
            that.refreshView();
        } else {
            that.captureImage();
        }
    };
    
    decapod.imageRotater = function (container, options) {
        var that = fluid.initView("decapod.imageRotater", container, options);
        
        /**
         * Rotates the displayed image clockwise (90 degrees)
         */
        that.rotateCW = function () {
            setRotation(that.model, 90);
            setRotationStyle(that);
        };
        
        /**
         * Rotates the displayed image counter clockwise (90 degrees)
         */
        that.rotateCCW = function () {
            setRotation(that.model, -90);
            setRotationStyle(that);
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
    
    fluid.defaults("decapod.imageRotater", {
        selectors: {
            image: ".dc-imageRotater-image",
            cwButton: ".dc-imageRotater-cw",
            ccwButton: ".dc-imageRotater-ccw",
            captureButton: ".dc-imageRotater-capture"
        },
        
        styles: {
            90: "ds-imageRotater-90",
            180: "ds-imageRotater-180",
            270: "ds-imageRotater-270"
        },
        
        strings: {
            image: "Captured Image",
            cwButton: "Rotate clockwise",
            ccwButton: "Rotate counter clockwise",
            captureButton: "Do another test capture"
        },
        
        events: {
            afterRender: null
        },
        
        model: {
            image: "",
            rotation: 0
        },
        
        url: decapod.resources.testCaptureRight
    });
    
})(jQuery);