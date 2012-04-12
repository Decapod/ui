/*
Copyright 2011-2012 OCAD University 

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
            downloadSRC: "../../../mock-book/images/pdf/mockBook.pdf"
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
            url: "/library/decapod05a/export/pdf/%selection/"
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

