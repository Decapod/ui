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
            {id: "courtesyMessage", selector: selectors.courtesyMessage},
            {id: "cancel", selector: selectors.cancel},
            {id: "cancelInfo", selector: selectors.cancelInfo}
        ];
    };
    
    var generateTree = function (opts) {
        var tree = [];
        $.each(opts.strings, function (stringName, string) {
            var obj = {
                ID: stringName
            };
            
            if (stringName === "cancel") {
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
    
    var render = function (that) {
        var tree = generateTree(that.options);
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
    
    decapod.progressMessage = function (container, options) {
        var that = fluid.initView("decapod.progressMessage", container, options);
        
        that.refreshView = function () {
            render(that);
        };
        
        that.refreshView();
        
        return that;
    };
    
    fluid.defaults("decapod.progressMessage", {
        
        selectors: {
            message: ".dc-progressMessage-message",
            courtesyMessage: ".dc-progressMessage-courtesyMessage",
            cancel: ".dc-progressMessage-cancel",
            cancelInfo: ".dc-progressMessage-cancelInfo"
        },
        
        strings: {
            message: "Profiling your cameras.",
            courtesyMessage: "Please wait.",
            cancel: "Cancel",
            cancelInfo: "(Go back to Book Management)"
        },
        
        events: {
            afterRender: null
        },
        
        urls: {
            cancel: decapod.resources.bookManagement
        }
    });
    
})(jQuery);
