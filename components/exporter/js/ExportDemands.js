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

