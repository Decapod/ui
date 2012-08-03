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

    fluid.demands("decapod.exportControls", ["decapod.pdfExporter"], {
        options: {
            events: {
                onExportTrigger: "{pdfExporter}.events.onExportStart"
            },
            listeners: {
                "{pdfExporter}.events.afterExportComplete": {
                    priority: "first",
                    listener: "{exportControls}.updateModel",
                    args: [{
                        showExportStart: false,
                        showExportProgress: false,
                        showExportComplete: true,
                        downloadURL: "{arguments}.0.url"
                    }]
                }
            }
        }
    });

    fluid.demands("decapod.pdfExporter.eventBinder", ["decapod.pdfExporter"], {
        funcName: "decapod.eventBinder"
    });
    
    fluid.demands("decapod.dataSource.put", ["decapod.dataSource", "decapod.pdfExporter"], {
        funcName: "decapod.dataSource.method",
        args: ["{dataSource}", "PUT", "{pdfExporter}.assembledExportOptions", "{arguments}.1"]
    });
    
    fluid.demands("decapod.exportControls.trigger", ["decapod.pdfExporter", "decapod.exportControls", "decapod.outputSettings"], {
        options: {
            listeners: {
                "{outputSettings}.events.onValidationError": {
                    listener: "{trigger}.updateModel",
                    args: ["valid", false]
                }
            },
            events: {
                afterTriggered: "{exportControls}.events.onExportTrigger"
            },
            resources: {
                template: "{exportControls}.options.resources.trigger"
            },
            strings: {
                trigger: "{exportControls}.options.strings.trigger"
            }
        }
    });
    
    /*******************
     * Invoker Demands *
     *******************/
    fluid.demands("decapod.pdfExporter.mapExportOptions", ["decapod.pdfExporter"], {
        args: ["{pdfExporter}", "{arguments}.0"]
    });
    fluid.demands("decapod.pdfExporter.assembleExportOptions", ["decapod.pdfExporter"], {
        args: ["{pdfExporter}"]
    });
    fluid.demands("decapod.pdfExporter.assembleCustomSettings", ["decapod.pdfExporter"], {
        args: ["{pdfExporter}", {
            width: "decapod.pdfExporter.convertDimensionSetting",
            height: "decapod.pdfExporter.convertDimensionSetting",
            resolution: "decapod.pdfExporter.convertResolutionSetting"
        }]
    });
    
})(jQuery);
