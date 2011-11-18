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
    
    decapod.localPut = function (that) {
        that.events.success.fire({
            status: "in progress"
        }, "success", null, "PUT");
    };
    
    decapod.localGet = function (that) {
        that.events.success.fire({
            status: "complete",
            downloadSRC: "../../../mock-book/capturedImages/pdf/mockBook.pdf"
        }, "success", null, "GET");
    };
    
    // local
    fluid.demands("decapod.dataSource.put", ["decapod.fileSystem", "decapod.exportView", "decapod.exporter", "decapod.dataSource"], {
        funcName: "decapod.localPut",
        args: ["{decapod.dataSource}"]
    });
    
    // local
    fluid.demands("decapod.dataSource.get", ["decapod.fileSystem", "decapod.exportView", "decapod.exporter", "decapod.dataSource"], {
        funcName: "decapod.localGet",
        args: ["{decapod.dataSource}"]
    });
    
    fluid.demands("decapod.dataSource", ["decapod.exportView", "decapod.exporter"], {
        options: {
            url: "/books/decapod05a/export/pdf/%selection/"
        }
    }); 
    
    fluid.demands("decapod.exporter.start", ["decapod.exportView", "decapod.exporter"], {
        args: ["{decapod.exporter}", "{decapod.exporter}.model"]
    });
    
    /*******************
     * Invoker Demands *
     *******************/
    
    fluid.demands("decapod.exportView.cancelPolling", ["decapod.exportView"], {
        args: ["{decapod.exportView}"]
    });
    
    fluid.demands("decapod.exportView.pollExport", ["decapod.exportView"], {
        args: ["{decapod.exportView}"]
    });
    
    fluid.demands("decapod.exportView.showExport", ["decapod.exportView"], {
        args: ["{decapod.exportView}", "{decapod.exportView}.model.downloadSRC"]
    });
    
    fluid.demands("decapod.exportView.updateStatus", ["decapod.exportView"], {
        args: ["{decapod.exportView}", "{arguments}.0"]
    });
    
})(jQuery);

