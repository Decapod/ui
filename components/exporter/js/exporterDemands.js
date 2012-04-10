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
    
    /************************
     * Sub-componet Demands *
     ************************/
     
    fluid.demands("decapod.eventBinder", ["decapod.exporter", "decapod.pdfExporter"], {
        options: {
            listeners: {
                "{pdfExporter}.events.onExportStart": [{
                    listener: "{exporter}.startImport",
                    args: ["{pdfExporter}"]
                }]
            }
        }
    });
    
    fluid.demands("fluid.uploader", ["decapod.fileSystem", "decapod.exporter"], {
        options: {
            demo: true
        }
    });
    
    fluid.demands("fluid.uploader", ["decapod.exporter"], {
        options: {
            queueSettings: {
                uploadURL: "/library/decapod-export/pages/"
            }
        }
    });
    
    /*******************
     * Invoker Demands *
     *******************/
    fluid.demands("decapod.exporter.startExport", ["decapod.exporter"], {
        args: ["{exporter}"]
    });
    fluid.demands("decapod.exporter.startImport", ["decapod.exporter"], {
        args: ["{exporter}", "{arguments}.0"]
    });
    fluid.demands("decapod.exporter.finishExport", ["decapod.exporter"], {
        args: ["{exporter}"]
    });

    /*****************
     *Event Demands *
     *****************/
     // Due to FLUID-4631, have to pass in both parameters from onQueueError, instead of just grabbing the second one here
//    fluid.demands("onFileError", ["decapod.exporter", "fluid.uploader.multiFileUploader"], ["{arguments}.1"]);
    fluid.demands("afterFilesSelected", ["decapod.exporter", "fluid.uploader.multiFileUploader"], ["status"]);
    
})(jQuery);
