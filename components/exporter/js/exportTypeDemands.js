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
    
    /*************************
     * Sub Component Demands *
     *************************/

    fluid.demands("decapod.exportType.controls", ["decapod.pdfExporter"], {
        options: {
            events: {
                onExportTrigger: "{pdfExporter}.events.onExportStart"
            },
            listeners: {
                "{pdfExporter}.events.afterExportComplete": {
                    listener: "{controls}.updateModel",
                    args: [{
                        showExportStart: false,
                        showExportProgress: false,
                        showExportDownload: true
                    }]
                }
            }
        }
    });
    fluid.demands("decapod.exportType.controls.trigger", ["decapod.exportType.controls"], {
        options: {
            events: {
                afterTriggered: "{controls}.events.onExportTrigger"
            },
            resources: {
                template: "{controls}.options.resources.trigger"
            }
        }
    });
    fluid.demands("decapod.exportType.controls.progress", ["decapod.exportType.controls"], {
        options: {
            resources: {
                template: "{controls}.options.resources.progress"
            }
        }
    });
    fluid.demands("decapod.exportType.controls.download", ["decapod.exportType.controls"], {
        options: {
            resources: {
                template: "{controls}.options.resources.download"
            }
        }
    });
    
    /*******************
     * Invoker Demands *
     *******************/
    fluid.demands("decapod.exportType.renderText", ["decapod.exportType"], {
        args: ["{decapod.exportType.renderText}"]
    });
    fluid.demands("decapod.exportType.controls.updateModel", ["decapod.exportType.controls"], {
        args: ["{controls}", "", "{arguments}.0"]
    });

    
})(jQuery);
