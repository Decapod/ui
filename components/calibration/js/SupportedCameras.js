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
            {id: "manufacturers:", selector: selectors.manufacturers},
            {id: "manufacturerName", selector: selectors.manufacturerName},
            {id: "model:", selector: selectors.model}
        ];
    };
    
    var generateTree = function (model) {
        var tree = [];
        $.each(model, function (manufacturer, devices) {
            var manufacturerNodes = fluid.transform(devices, function (device) {
                return {
                    ID: "model:",
                    value: device.deviceName
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
        var tree = generateTree(that.model);
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
    
    decapod.supportedCameras = function (container, options) {
        var that = fluid.initView("decapod.supportedCameras", container, options);
        
        that.model = that.options.model;
        that.refreshView = function () {
            render(that);
        };
        
        that.refreshView();
        
        return that;
    };
    
    fluid.defaults("decapod.supportedCameras", {
        
        selectors: {
            manufacturers: ".dc-supportedCameras-manufacturer",
            manufacturerName: ".dc-supportedCameras-manufacturerName",
            model: ".dc-supportedCameras-model"
        },
        
        events: {
            afterRender: null
        },
        
        model: null
    });
    
})(jQuery);
