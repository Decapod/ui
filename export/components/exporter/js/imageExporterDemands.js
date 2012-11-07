/*
Copyright 2012 OCAD University 

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
    
    /*************************
     * Sub Component Demands *
     *************************/

    // local
    fluid.demands("decapod.dataSource", ["decapod.fileSystem"], {
        options: {
            url: "../../../mock-book/mockResponse.json"
        }
    });

    fluid.demands("decapod.exportControls", ["decapod.imageExporter"], {
        options: {
            events: {
                onExportTrigger: "{imageExporter}.events.onExportStart"
            },
            listeners: {
                "{imageExporter}.events.afterExportComplete": {
                    priority: "first",
                    listener: "{exportControls}.updateModel",
                    args: [{
                        showExportStart: false,
                        showExportError: false,
                        showExportProgress: false,
                        showExportComplete: true,
                        downloadURL: "{arguments}.0.url"
                    }]
                },
                "{imageExporter}.events.onError": {
                    priority: "first",
                    listener: "{exportControls}.updateModel",
                    args: [{
                        showExportStart: false,
                        showExportError: true,
                        showExportProgress: false,
                        showExportComplete: false,
                        errorStatus: "EXPORT_ERROR",
                        downloadURL: ""
                    }]
                }
            }
        }
    });

    fluid.demands("decapod.imageExporter.eventBinder", ["decapod.imageExporter"], {
        funcName: "decapod.eventBinder"
    });
    
})(jQuery);
