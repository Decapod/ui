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

     fluid.demands("decapod.pdfExporter", ["decapod.exporter"], {
        options: {
            listeners: {
                "onStartExport.triggerExporter": "{exporter}.events.onExportStart.fire"
            }
        }
     });
     
    // local only
    fluid.demands("decapod.dataSource", ["decapod.fileSystem", "decapod.exporter"], {
        options: {
            url: "" //local url
        }
    });
    
    fluid.demands("fluid.uploader", ["decapod.fileSystem", "decapod.exporter"], {
        options: {
            demo: true
        }
    });
    
    // server only
    fluid.demands("decapod.dataSource", ["decapod.exporter"], {
        options: {
            url: "/library/decapod05a/export/pdf/%type"
        }
    });
    
    fluid.demands("fluid.uploader", ["decapod.exporter"], {
        options: {
            queueSettings: {
                uploadURL: "/library/decapod05a/pages/"
            }
        }
    });

    /*****************
     *Event Demands *
     *****************/
     // Due to FLUID-4631, have to pass in both parameters from onQueueError, instead of just grabbing the second one here
//    fluid.demands("onFileError", ["decapod.exporter", "fluid.uploader.multiFileUploader"], ["{arguments}.1"]);
    fluid.demands("afterFilesSelected", ["decapod.exporter", "fluid.uploader.multiFileUploader"], ["status"]);
    
})(jQuery);
