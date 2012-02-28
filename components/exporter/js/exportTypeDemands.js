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
                afterRender: "{pdfExporter}.events.afterControlsRendered",
                onExportTrigger: "{pdfExporter}.events.onStartExport"
            }
        }
    });
    fluid.demands("decapod.exportType.options", ["decapod.pdfExporter"], {
        options: {
            events: {
                afterRender: "{pdfExporter}.events.afterOptionsRendered"
            }
        }
    });
    
    /*******************
     * Invoker Demands *
     *******************/

    fluid.demands("decapod.exportType.controls.showStartControls", ["decapod.exportType.controls", "decapod.visSwitcher"], {
        funcName:"decapod.exportType.controls.showControls",
        args: ["{controls}.controlToggle", "exportControl"]
    });
    fluid.demands("decapod.exportType.controls.showProgressControls", ["decapod.exportType.controls", "decapod.visSwitcher"], {
        funcName:"decapod.exportType.controls.showControls",
        args: ["{controls}.controlToggle", "progressMessage"]
    });
    fluid.demands("decapod.exportType.controls.showFinishControls", ["decapod.exportType.controls", "decapod.visSwitcher"], {
        funcName:"decapod.exportType.controls.showControls",
        args: ["{controls}.controlToggle", ["download", "restart"]]
    });

    
})(jQuery);
