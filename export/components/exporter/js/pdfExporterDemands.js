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
                        showExportError: false,
                        showFileError: "{exportControls}.model.fileError",
                        showExportProgress: false,
                        showExportComplete: true,
                        fileError: "{exportControls}.model.fileError",
                        downloadURL: "{arguments}.0.url"
                    }]
                },
                "{pdfExporter}.events.onError": {
                    priority: "first",
                    listener: "{exportControls}.updateModel",
                    args: [{
                        showExportStart: false,
                        showExportError: true,
                        showFileError: false,
                        showExportProgress: false,
                        showExportComplete: false,
                        fileError: "{exportControls}.model.fileError",
                        downloadURL: ""
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
        args: ["{dataSource}", "PUT", null, null, "{pdfExporter}.assembledExportOptions", "{arguments}.1"]
    });
    
    fluid.demands("decapod.outputSettings", ["decapod.pdfExportOptions", "decapod.pdfExporter"], {
        options: {
            listeners: {
                "onValidationError.pdfExporter": "{pdfExporter}.events.onValidationError",
                "onCorrection.pdfExporter": "{pdfExporter}.events.onCorrection"
            },
            resources: {
                template: "{pdfExportOptions}.options.resources.outputSettings"
            }
        }
    });
    
    fluid.demands("decapod.exportControls.trigger", ["decapod.pdfExporter", "decapod.exportControls"], {
        options: {
            listeners: {
                "{pdfExporter}.events.onValidationError": {
                    listener: "{trigger}.updateModel",
                    args: ["validSettings", false]
                },
                "{pdfExporter}.events.onCorrection": {
                    listener: "{trigger}.updateModel",
                    args: ["validSettings", true]
                },
                "{pdfExporter}.events.afterModelChanged": {
                    listener: "{trigger}.updateModel",
                    args: ["validSettings", "{pdfExporter}.isInputValid"]
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
    
    fluid.demands("decapod.exportControls.detailedProgress", ["decapod.pdfExporter", "decapod.exportControls"], {
        options: {
            model: {
                stages: "{pdfExporter}.model.exportStages"
            },
            strings: "{pdfExporter}.options.strings",
            listeners: {
                "{pdfExporter}.events.onExportStatusUpdate": {
                    listener: "{detailedProgress}.update",
                    args: ["{arguments}.0.stage"]
                },
                "{pdfExporter}.events.afterPollComplete": {
                    listener: "{detailedProgress}.finish",
                    args: [true]
                }
            },
            resources: {
                template: "{exportControls}.options.resources.progress"
            }
        }
    });
    
    fluid.demands("fluid.progress", ["decapod.pdfExporter", "decapod.exportPoller", "decapod.exportControls", "decapod.exportControls.detailedProgress"], {
        options: {
            listeners: {
                afterProgressHidden: {
                    listener: "{pdfExporter}.events.afterExportComplete",
                    args: ["{exportPoller}.response"]
                }
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
    fluid.demands("decapod.pdfExporter.isInputValid", ["decapod.pdfExporter"], {
        args: ["{pdfExporter}"]
    });
    
})(jQuery);
