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

    fluid.registerNamespace("decapod.pdfExporter");
    
    decapod.pdfExporter.produceTree = function (that) {
        return {
            formatName: {
                messagekey: "formatName"
            },
            description: {
                messagekey: "description"
            },
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
    
    decapod.pdfExporter.finalInit = function (that) {
        that.applier.modelChanged.addListener("dpi", that.events.afterModelChanged.fire);
        
        fluid.fetchResources(that.options.resources, function (resourceSpec) {
            that.container.append(that.options.resources.template.resourceText);
            that.events.afterFetchResources.fire(resourceSpec);
            that.refreshView();
        });
    };
    
    fluid.defaults("decapod.pdfExporter", {
        gradeNames: ["fluid.rendererComponent", "autoInit"],
        finalInitFunction: "decapod.pdfExporter.finalInit",
        produceTree: "decapod.pdfExporter.produceTree",
        selectors: {
            formatName: ".dc-pdfExporter-formatName",
            description: ".dc-pdfExporter-formatDescription",
            resolutionLabel: ".dc-pdfExporter-resolutionLabel",
            resolution: ".dc-pdfExporter-resolution",
            dimensionsLabel: ".dc-pdfExporter-dimensionsLabel",
            dimensions: ".dc-pdfExporter-dimensions",
            exportButton: ".dc-pdfExporter-exportButton"
        },
        model: {
            dpi: 300
        },
        resources: {
            template: {
                url: "../html/pdfExporter.html",
                forceCache: true
            }
        },
        strings: {
            formatName: "PDF",
            description: "A delectable medley of bits and bytes to satisfy every platform",
            resolutionLabel: "Output Image resolution:",
            dimensionsLabel: "Output dimensions:",
            dimensions: "A4(210 x 297mm / 8.3 x 11.7in.)",
            exportButton: "Start Export"
        },
        events: {
            afterFetchResources: null,
            afterModelChanged: null
        }
    });

})(jQuery);
