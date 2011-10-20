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
    
    var generateCutpoints = function (options) {
        var selectors = options.selectors;
        return [
            {id: "message", selector: selectors.message},
            {id: "courtesyMessage", selector: selectors.courtesyMessage},
            {id: "cancel", selector: selectors.cancel},
            {id: "cancelInfo", selector: selectors.cancelInfo}
        ];
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
    
    var render = function (that) {
        decapod.render(that, generateTree, generateCutpoints);
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
        }
    });
    
})(jQuery);
