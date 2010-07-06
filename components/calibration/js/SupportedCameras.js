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
            {id: "componentHeader", selector: selectors.componentHeader},
            {id: "manufacturers:", selector: selectors.manufacturers},
            {id: "manufacturerName", selector: selectors.manufacturerName},
            {id: "deviceLabel:", selector: selectors.deviceLabel}
        ];
    };
    
    var generateTree = function (cameras, strings) {
        var tree = [{
            ID: "componentHeader",
            value: strings.componentHeader
        }]; 
        
        $.each(cameras, function (manufacturer, devices) {
            var manufacturerNodes = fluid.transform(devices, function (device) {
                return {
                    ID: "deviceLabel:",
                    value: device.label
                };
            });
            
            manufacturerNodes.push({
                ID: "manufacturerName",
                value: manufacturer
            });
            
            tree.push({
                ID: "manufacturers:",
                children: manufacturerNodes
            });
        });
            
        return {
            children: tree
        };
    };
    
    var render = function (that) {
        var tree = generateTree(that.model.supportedCameras, that.options.strings);
        var opts = {
            cutpoints: generateCutpoints(that.options.selectors)
        };
        
        if (that.templates) {
            fluid.reRender(that.templates, that.container, tree, opts);
        } else {
            that.templates = fluid.selfRender(that.container, tree, opts);
        }
        
        that.locate("closeButton").click(that.hide);
        
        that.events.afterRender.fire();
    };
    
    var addHeadingRole = function (elm) {
        if (!elm.is(":header")) {
            elm.attr("role", "heading");
        }
    };
    
    var addAria = function (that) {
        addHeadingRole(that.locate("componentHeader"));
        
        that.locate("manufacturerName").each(function (idx, element) {
            var elm = $(element);
            addHeadingRole(elm);
            that.locate("devices").eq(idx).attr("aria-labelledby", fluid.allocateSimpleId(elm));
        });
        
        that.locate("closeButton").attr("role", "button");
    };
    
    var setup = function (that) {
        that.model = that.options.model;
        
        if (!that.model.supportedCameras) {
            decapod.checkSupportedCameras(function (model) {
                that.model = model;
                that.refreshView();
            }, 
            function () {
                that.model.supportedCameras = {};
                that.refreshView();
            });
        } else {
            that.refreshView();
        }
    };
    
    decapod.supportedCameras = function (container, options) {
        var that = fluid.initView("decapod.supportedCameras", container, options);
        
        /**
         * Refreshes the view. 
         * Useful if the model has been updated.
         */
        that.refreshView = function () {
            render(that);
            addAria(that);
        };
        
        /**
         * Shows the entire component
         */
        that.show = function () {
            that.container.show();
        };
        
        /**
         * Hides the entire component
         */
        that.hide = function () {
            that.container.hide();
        };
        
        setup(that);
        
        return that;
    };
    
    fluid.defaults("decapod.supportedCameras", {
        
        selectors: {
            manufacturers: ".dc-supportedCameras-manufacturer",
            manufacturerName: ".dc-supportedCameras-manufacturerName",
            devices: ".dc-supportedCameras-devices",
            deviceLabel: ".dc-supportedCameras-deviceLabel",
            componentHeader: ".dc-supportedCameras-componentHeader",
            closeButton: ".dc-supportedCameras-closeButton"
        },
        
        strings: {
            componentHeader: "Supported Cameras"
        },
        
        events: {
            afterRender: null
        },
        
        model: {
            supportedCameras: null
        }
    });
    
})(jQuery);
