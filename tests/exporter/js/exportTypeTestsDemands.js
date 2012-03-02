/*
Copyright 2012 OCAD University

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
    
    fluid.demands("decapod.exportType.controls", ["decapod.test", "decapod.pdfExporter"], {
        options: {
            events: {
                afterRender: "{pdfExporter}.events.afterControlsRendered",
                onExportTrigger: "{pdfExporter}.events.onStartExport"
            },
            listeners: {
                "{pdfExporter}.events.onStartExport": {
                    listener: "{controls}.showProgressControls",
                    priority: "last"
                }
            },
            resources: {
                template: {
                    url: "../../../components/exporter/html/exportControlsTemplate.html"
                }
            }
        }
    });
    fluid.demands("decapod.exportType.pdfOptions", ["decapod.test", "decapod.pdfExporter"], {
        options: {
            events: {
                afterRender: "{pdfExporter}.events.afterOptionsRendered"
            },
            resources: {
                template: {
                    url: "../../../components/exporter/html/pdfOptionsTemplate.html"
                }
            }
        }
    });
    
    /*****************
     * Event Demands *
     *****************/
    fluid.setLogging(true);
    fluid.demands("testModel", ["decapod.test", "decapod.exportType.pdfOptions"], [
        "{arguments}.0",
        "{pdfOptions}"
    ]);
    fluid.demands("testClick", ["decapod.test", "decapod.exportType.controls"], ["{controls}"]);
    fluid.demands("afterControls", ["decapod.test", "decapod.pdfExporter"], ["{pdfExporter}"]);
})(jQuery);
