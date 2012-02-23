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

    fluid.registerNamespace("decapod.exportType");
    
    decapod.exportType.finalInit = function (that) {
        var str = that.options.strings;
        that.locate("name").text(str.name);
        that.locate("description").text(str.description);
    };
    
    fluid.defaults("decapod.exportType", {
        gradeNames: ["fluid.viewComponent", "autoInit"],
        finalInitFunction: "decapod.exportType.finalInit",
        selectors: {
            name: ".dc-exportType-name",
            description: ".dc-exportType-description"
        },
        strings: {
            name: "Format type label",
            description: "A delectable medley of bits and bytes to satisfy every platform",
        }
    });
    

    fluid.registerNamespace("decapod.exportType.pdfOptions");
    
    decapod.exportType.pdfOptions.produceTree = function (that) {
        return {
            resolutionLabel: {
                messagekey: "resolutionLabel"
            },
            resolution: {
                value: "${dpi}"
            },
            dimensionsLabel: {
                messagekey: "dimensionsLabel"
            },
            dimensions: {
                messagekey: "dimensions"
            },
            exportButton: {
                messagekey: "exportButton"
            }
        };
    };
    
    decapod.exportType.pdfOptions.finalInit = function (that) {
        that.applier.modelChanged.addListener("dpi", that.events.afterModelChanged.fire);
        
        fluid.fetchResources(that.options.resources, function (resourceSpec) {
            that.container.append(that.options.resources.template.resourceText);
            that.events.afterFetchResources.fire(resourceSpec);
            that.refreshView();
        });
    };
    
    fluid.defaults("decapod.exportType.pdfOptions", {
        gradeNames: ["fluid.rendererComponent", "autoInit"],
        finalInitFunction: "decapod.exportType.pdfOptions.finalInit",
        produceTree: "decapod.exportType.pdfOptions.produceTree",
        selectors: {
            resolutionLabel: ".dc-exportType-pdfOptions-resolutionLabel",
            resolution: ".dc-exportType-pdfOptions-resolution",
            dimensionsLabel: ".dc-exportType-pdfOptions-dimensionsLabel",
            dimensions: ".dc-exportType-pdfOptions-dimensions"
        },
        model: {
            dpi: "300"
        },
        resources: {
            template: {
                url: "../html/pdfOptionsTemplate.html",
                forceCache: true
            }
        },
        strings: {
            resolutionLabel: "Output Image resolution:",
            dimensionsLabel: "Output dimensions:",
            dimensions: "A4(210 x 297mm / 8.3 x 11.7in.)"
        },
        events: {
            afterFetchResources: null,
            afterModelChanged: null
        }
    });
    
    fluid.registerNamespace("decapod.exportType.controls");
    
    decapod.exportType.controls.finalInit = function (that) {
        fluid.fetchResources(that.options.resources, function (resourceSpec) {
            that.container.append(that.options.resources.template.resourceText);
            that.events.afterFetchResources.fire(resourceSpec);
            that.refreshView();
        });
    };
    
    decapod.exportType.controls.produceTree = function (that) {
        return {
            exportControl: {
                messagekey: "exportControl",
                decorators: [{
                    type: "jQuery",
                    func: "click",
                    args: function() { that.events.afterExportTriggered.fire() }
                }]
            },
            progressMessage: {
                messagekey: "progressMessage"
            },
            download: {
                linktext: {
                    messagekey: "download"
                },
                target: "${downloadURL}"
            },
            restart: {
                messagekey: "restart"
            }
        };
    };
    
    fluid.defaults("decapod.exportType.controls", {
        gradeNames: ["fluid.rendererComponent", "autoInit"],
        finalInitFunction: "decapod.exportType.controls.finalInit",
        produceTree: "decapod.exportType.controls.produceTree",
        selectors: {
            exportControl: ".dc-exportType-controls-exportControl",
            progressMessage: ".dc-exportType-controls-progressMessage",
            download: ".dc-exportType-controls-download",
            restart: ".dc-exportType-controls-restart"
        },
        strings: {
            exportControl: "Start Export",
            progressMessage: "Export Progress",
            download: "Download Link",
            restart: "Start Over"
        },
        events: {
            afterFetchResources: null,
            afterExportTriggered: null
        },
        resources: {
            template: {
                url: "../html/exportControlsTemplate.html",
                forceCache: true
            }
        },
        model: {
            downloadURL: "downloadURL"
        }
    });
    


})(jQuery);
