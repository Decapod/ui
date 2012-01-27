/*
Copyright 2011 OCAD University

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
    
    fluid.registerNamespace("decapod.exporter");
    
    decapod.exporter.preInit = function (that) {
        that.handleServerSuccess = function (data, textStatus, jqXHR, type) {
            if (type === "PUT") {
                that.setStarted();
            //TODO: Remove hardcoding of "complete" status
            } else if (type === "GET" && data && data.status === "complete") {
                that.setFetched(data.downloadSRC || "");
            }
        };
    };
    
    decapod.exporter.finalInit = function (that) {
        that.originalModel = fluid.copy(that.model);
        
        that.applier.modelChanged.addListener("status", function (newModel, oldModel, changeRequest) {
            that.events.afterStatusChanged.fire(newModel.status, oldModel.status, changeRequest.source);
        });
        
        that.applier.modelChanged.addListener("", function (newModel, oldModel, changeRequest) {
            that.events.afterModelChanged.fire(newModel, oldModel, changeRequest.source);
        });
    };
    
    decapod.exporter.updateStatus = function (applier, newStatus) {
        applier.requestChange("status", newStatus);
    };
    
    decapod.exporter.updateModel = function (applier, newModel) {
        applier.requestChange("", newModel);
    };
    
    decapod.exporter.resetModel = function (that) {
        that.model = fluid.copy(that.originalModel);
    };
    
    decapod.exporter.setStarted = function (that) {
        that.updateStatus(that.options.strings.inProgress);
        that.events.afterExportStarted.fire();
    };
    
    decapod.exporter.start = function (that, urlTemplateValues) {
        that.server.put(null, urlTemplateValues);
    };
    
    decapod.exporter.setFetched = function (that, downloadSRC) {
        that.updateModel({
            status: that.options.strings.completed,
            downloadSRC: downloadSRC
        });
    };
    
    decapod.exporter.fetchExport = function (that) {
        that.server.get();
    };
    
    decapod.exporter.deleteExport = function (that) {
        that.server["delete"]();
    };

    fluid.defaults("decapod.exporter", {
        gradeNames: ["fluid.eventedComponent", "fluid.modelComponent", "autoInit"],
        finalInitFunction: "decapod.exporter.finalInit",
        preInitFunction: "decapod.exporter.preInit",
        components: {
            server: {
                type: "decapod.dataSource",
                options: {
                    events: {
                        error: "{decapod.exporter}.events.serverError",
                        success: "{decapod.exporter}.events.serverSuccess"
                    }
                }
            }
        },
        invokers: {
            resetModel: "decapod.exporter.resetModel",
            setFetched: "decapod.exporter.setFetched",
            setStarted: "decapod.exporter.setStarted",
            start: "decapod.exporter.start",
            fetchExport: "decapod.exporter.fetchExport",
            deleteExport: "decapod.exporter.deleteExport",
            updateModel: "decapod.exporter.updateModel",
            updateStatus: "decapod.exporter.updateStatus"
        },
        events: {
            afterStatusChanged: null,
            afterModelChanged: null,
            afterExportStarted: null,
            serverError: null,
            serverSuccess: null
        },
        listeners: {
            "serverSuccess.internal": "{decapod.exporter}.handleServerSuccess"
        },
        strings: {
            inProgress: "Making PDF ... (this can take a while)",
            completed: "Completed",
            error: "%textStatus: %errorThrown"
        }
    });
    
})(jQuery);
