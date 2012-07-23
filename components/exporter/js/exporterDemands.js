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
    
    /************************
     * Sub-componet Demands *
     ************************/
     
    fluid.demands("decapod.pdfExporter.eventBinder", ["decapod.exporter", "decapod.pdfExporter"], {
        funcName: "decapod.eventBinder",
        options: {
            listeners: {
                "{pdfExporter}.events.onExportStart": {
                    namespace: "start",
                    listener: "{exporter}.startImport",
                    args: ["{pdfExporter}"]
                }
            }
        }
    });
    
    fluid.demands("decapod.exporter.eventBinder", ["decapod.exporter"], {
        funcName: "decapod.eventBinder"
    });
    
    fluid.demands("fluid.uploader", ["decapod.fileSystem", "decapod.exporter"], {
        options: {
            demo: true
        }
    });
    
    fluid.demands("fluid.uploader", ["decapod.exporter"], {
        options: {
            queueSettings: {
                uploadURL: "/library/decapod-export/pages/"
            }
        }
    });
    
    fluid.demands("decapod.exportControls", ["decapod.exporter", "decapod.pdfExporter"], {
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
    
    fluid.demands("decapod.accordion", ["decapod.exporter", "decapod.pdfExporter"], {
        options: {
            header: ".dc-pdfExporter-exportInfo", //TODO:Remove hardcoding of the selector.
            collapsible: true,
            clearStyle: true,
            active: false
        }
    });
    
    fluid.demands("decapod.exportControls.trigger", ["decapod.exporter", "decapod.exportControls"], {
        options: {
            model: {
                disabled: true
            },
            events: {
                afterTriggered: "{exportControls}.events.onExportTrigger"
            },
            listeners: {
                "{exporter}.events.afterQueueReady": {
                    listener: "{trigger}.updateModel",
                    args: [false]
                }
            },
            resources: {
                template: "{exportControls}.options.resources.trigger"
            },
            strings: {
                trigger: "{exportControls}.options.strings.trigger"
            }
        }
    });
    
    fluid.demands("decapod.pdfExportOptions", ["decapod.exporter", "decapod.pdfExporter"], {
        options: {
            listeners: {
                "{exporter}.events.onImportStart": "{pdfExportOptions}.disable"
            }
        }
    });
    
    /*******************
     * Invoker Demands *
     *******************/
    fluid.demands("decapod.exporter.renderStrings", ["decapod.exporter"], {
        args: ["{exporter}"]
    });
    fluid.demands("decapod.exporter.startExport", ["decapod.exporter"], {
        args: ["{exporter}"]
    });
    fluid.demands("decapod.exporter.startImport", ["decapod.exporter"], {
        args: ["{exporter}", "{arguments}.0"]
    });
    fluid.demands("decapod.exporter.finishExport", ["decapod.exporter"], {
        args: ["{exporter}"]
    });
    fluid.demands("decapod.exporter.validateQueue", ["decapod.exporter"], {
        args: ["{exporter}"]
    });
    fluid.demands("decapod.exporter.disableImport", ["decapod.exporter"], {
        args: ["{exporter}"]
    });
    fluid.demands("decapod.exporter.showInstructions", ["decapod.exporter"], {
        args: ["{exporter}"]
    });
    fluid.demands("decapod.exporter.showStatus", ["decapod.exporter"], {
        args: ["{exporter}"]
    });

    /*****************
     *Event Demands *
     *****************/
     // Due to FLUID-4631, have to pass in both parameters from onQueueError, instead of just grabbing the second one here
//    fluid.demands("onFileError", ["decapod.exporter", "fluid.uploader.multiFileUploader"], ["{arguments}.1"]);
    fluid.demands("afterFilesSelected", ["decapod.exporter", "fluid.uploader.multiFileUploader"], ["status"]);
    
})(jQuery);
