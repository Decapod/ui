/*
Copyright 2011 OCAD University

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
     
    // local
    fluid.demands("decapod.dataSource", ["decapod.fileSystem", "decapod.exporter"], {
        options: {
            url: "" //local url
        }
    });
    
    // server
    fluid.demands("decapod.dataSource", ["decapod.exporter"], {
        options: {
            url: "/library/decapod05a/export/pdf/%type"
        }
    });
    
    /*******************
     * Invoker Demands *
     *******************/
    
    fluid.demands("decapod.exporter.deleteExport", ["decapod.exporter"], {
        args: ["{decapod.exporter}"]
    });
    
    fluid.demands("decapod.exporter.fetchExport", ["decapod.exporter"], {
        args: ["{decapod.exporter}"]
    });
    
    fluid.demands("decapod.exporter.resetModel", ["decapod.exporter"], {
        args: ["{decapod.exporter}"]
    });
        
    fluid.demands("decapod.exporter.setFetched", ["decapod.exporter"], {
        args: ["{decapod.exporter}", "{arguments}.0"]
    });
    
    fluid.demands("decapod.exporter.setStarted", ["decapod.exporter"], {
        args: ["{decapod.exporter}"]
    });
    
    fluid.demands("decapod.exporter.start", ["decapod.exporter"], {
        args: ["{decapod.exporter}", "{arguments}.0"]
    });
    
    fluid.demands("decapod.exporter.updateModel", ["decapod.exporter"], {
        args: ["{decapod.exporter}.applier", "{arguments}.0"]
    });
    
    fluid.demands("decapod.exporter.updateStatus", ["decapod.exporter"], {
        args: ["{decapod.exporter}.applier", "{arguments}.0"]
    }); 
})(jQuery);
