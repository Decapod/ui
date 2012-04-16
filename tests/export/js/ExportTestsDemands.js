/*
Copyright 2011 OCAD University 

Licensed under the Apache License, Version 2.0 (the "License"); 
you may not use this file except in compliance with the License. 
You may obtain a copy of the License at 

   http://www.apache.org/licenses/LICENSE-2.0 

Unless required by applicable law or agreed to in writing, software 
distributed under the License is distributed on an "AS IS" BASIS, 
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. 
See the License for the specific language governing permissions and 
limitations under the License.
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
