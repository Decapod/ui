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

    decapod.exporter.test = {
        error: "error",
        inProgress: "in progress",
        complete: "complete"
    };

    decapod.exporter.testStart = function (that, status, type) {
        if (status === decapod.exporter.test.error) {
            that.events.serverError.fire("Error Status", "Error Message Thrown");
        } else {
            that.events.serverSuccess.fire({status: status, downloadSRC: "../path/to/download"}, "Success", null, type);
        }
    };
    
    fluid.demands("decapod.exporter.start", ["decapod.exporter", "decapod.test"], {
        funcName: "decapod.exporter.testStart",
        args: ["{decapod.exporter}", "{arguments}.0", "PUT"]
    });
    
    fluid.demands("decapod.exporter.fetchExport", ["decapod.exporter", "decapod.test"], {
        funcName: "decapod.exporter.testStart",
        args: ["{decapod.exporter}", "{arguments}.0", "GET"]
    });
    
    fluid.demands("decapod.exporter.deleteExport", ["decapod.exporter", "decapod.test"], {
        funcName: "decapod.exporter.testStart",
        args: ["{decapod.exporter}", "{arguments}.0", "DELETE"]
    });
       
})(jQuery);
