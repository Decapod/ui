/*
Copyright 2012 OCAD University

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

    fluid.registerNamespace("decapod.visSwitcher");
    
    decapod.visSwitcher.hideElement = function (elm) {
        elm = $(elm);
        elm.hide();
    };
    
    decapod.visSwitcher.showElement = function (elm) {
        elm = $(elm);
        elm.show();
    };
    
    decapod.visSwitcher.show = function (that, selectors) {
        selectors = $.isArray(selectors) ? selectors : [selectors];
        var tempModel = fluid.copy(that.model);
        for (var i = 0; i < selectors.length; i++) {
            var selector = selectors[i];
            if (tempModel[selector] === false) {
                var elm = that.locate(selector);
                that.showElement(elm);
                tempModel[selector] = true;
            }
        }
        that.applier.requestChange("", tempModel);
    };
    
    decapod.visSwitcher.showAll = function (that) {
        var tempModel = fluid.copy(that.model);
        
        for (var selector in tempModel) {
            var elm = that.locate(selector);
            if (tempModel[selector] === false) {
                that.showElement(elm);
                tempModel[selector] = true;
            } 
        }
        
        that.applier.requestChange("", tempModel);
    };
    
    decapod.visSwitcher.showOnly = function (that, selectors) {
        selectors = $.isArray(selectors) ? selectors : [selectors];
        var tempModel = fluid.copy(that.model);
        
        for (var selector in tempModel) {
            var elm = that.locate(selector);
            var shouldBeVisible = $.inArray(selector, selectors) >= 0;
            if (shouldBeVisible && tempModel[selector] === false) {
                that.showElement(elm);
                tempModel[selector] = true;
            } else if (!shouldBeVisible && tempModel[selector]) {
                that.hideElement(elm);
                tempModel[selector] = false;
            }
        }
        
        that.applier.requestChange("", tempModel);
    };
    
    decapod.visSwitcher.hide = function (that, selectors) {
        selectors = $.isArray(selectors) ? selectors : [selectors];
        var tempModel = fluid.copy(that.model);
        for (var i = 0; i < selectors.length; i++) {
            var selector = selectors[i];
            if (tempModel[selector]) {
                var elm = that.locate(selector);
                that.hideElement(elm);
                tempModel[selector] = false;
            }
        }
        that.applier.requestChange("", tempModel);
    };
    
    decapod.visSwitcher.hideAll = function (that) {
        var tempModel = fluid.copy(that.model);
        
        for (var selector in tempModel) {
            var elm = that.locate(selector);
            if (tempModel[selector]) {
                that.hideElement(elm);
                tempModel[selector] = false;
            } 
        }
        
        that.applier.requestChange("", tempModel);
    };
    
    decapod.visSwitcher.finalInit = function (that) {
        for (var selector in that.model) {
            var elm = that.locate(selector);
            if (that.model[selector]) {
                that.showElement(elm);
            } else {
                that.hideElement(elm);
            }
        }
        that.applier.modelChanged.addListener("*", function (newModel, oldModel) {
            that.events.afterModelChanged.fire(newModel, oldModel);
        });
    };
    
    fluid.defaults("decapod.visSwitcher", {
        gradeNames: ["fluid.viewComponent", "autoInit"],
        finalInitFunction: "decapod.visSwitcher.finalInit",
        model: {}, // of the form {"selector1": true, selector2: false} where selector corresponds to a key in the selector options and the boolean is a value representing its visibility 
        invokers: {
            hideElement: "decapod.visSwitcher.hideElement",
            showElement: "decapod.visSwitcher.showElement",
            hide: "decapod.visSwitcher.hide",
            show: "decapod.visSwitcher.show",
            showOnly: "decapod.visSwitcher.showOnly",
            hideAll: "decapod.visSwitcher.hideAll",
            showAll: "decapod.visSwitcher.showAll"
        },
        events: {
            afterModelChanged: null
        }
    });
})(jQuery);
