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
/*global setTimeout, window, decapod:true, fluid, jQuery*/

// JSLint options 
/*jslint white: true, funcinvoke: true, undef: true, newcap: true, nomen: true, regexp: true, bitwise: true, browser: true, forin: true, maxerr: 100, indent: 4 */

var decapod = decapod || {};

(function ($) {

    /************************
     *  decapod.pdfExporter *
     ************************/
    
    fluid.registerNamespace("decapod.pdfExporter");
    
    /**
     * Returns the mapped selection. If it is a function, the function will be exectued with the "that" supplied as an argument
     * 
     * @param {object} that, the component
     * @param {string} selection, the key into the options map. It should be based on the selection in the output select box.
     */
    decapod.pdfExporter.mapExportOptions = function (that, selection) {
        var optionsData = that.options.exportOptionsMap[selection] || {};
        if (typeof (optionsData) === "string") {
            optionsData = typeof (that[optionsData]) === "function" ? that[optionsData](that) : fluid.invokeGlobalFunction(optionsData, [that]);
        }
        return optionsData;
    };
    
    /**
     * Assignts the mapped export options to the assembledExportOptions property.
     * 
     * @param {object} that, the component
     */
    decapod.pdfExporter.assembleExportOptions = function (that) {
        that.assembledExportOptions = that.mapExportOptions(that.model.exportOptions.output.selection);
        return that.assembledExportOptions;
    };
    
    /**
     * Converts from mm to cm
     * 
     * @param {object} setting, the output setting object
     */
    decapod.pdfExporter.convertDimensionSetting = function (setting) {
        var converted = {};
        var val = parseFloat(setting.value) / 10; // converts the size value from mm to cm
        converted[setting.name] = val;
        return converted;
    };
    
    /**
     * Converts the resolution from a setting object to an object containing dpi as the key.
     * 
     * @param {object} setting, the output setting object
     */
    decapod.pdfExporter.convertResolutionSetting = function (setting) {
        return {dpi: setting.value};
    };
    
    /**
     * Converts a the customSettings making use of a dictionary of conversion functions.
     * 
     * @param {object} that, the component
     * @param {object} map, a dictionary of conversion functions.
     */
    decapod.pdfExporter.assembleCustomSettings = function (that, map) {
        var settings = {};
        $.each(that.model.exportOptions.outputSettings.settings, function (idx, setting) {
            fluid.merge("replace", settings, fluid.invokeGlobalFunction(map[setting.name], [setting]));
        });
        return settings;
    };
    
    /**
     * Returns whether the input is in a valid state
     * 
     * @param {object} that, the component
     */
    decapod.pdfExporter.isInputValid = function (that) {
        return that.exportOptions.isValid;
    };
    
    decapod.pdfExporter.exportControlsProduceTree = function (that) {
        return {
            expander: [
                {
                    type: "fluid.renderer.condition",
                    condition: that.model.showExportStart,
                    trueTree: {
                        trigger: {
                            decorators: {
                                type: "fluid",
                                func: "decapod.exportControls.trigger"
                            }
                        }
                    }
                },
                {
                    type: "fluid.renderer.condition",
                    condition: that.model.showExportError,
                    trueTree: {
                        status: {
                            decorators: {
                                type: "fluid",
                                func: "decapod.status",
                                options: {
                                    model: {
                                        currentStatus: "error",
                                        "error": {
                                            name: "Error creating export",
                                            description: "See Help for more details.",
                                            style: "ds-status-error"
                                        }
                                    }
                                }
                            }
                        }
                    }
                },
                {
                    type: "fluid.renderer.condition",
                    condition: that.model.showExportProgress,
                    trueTree: {
                        progress: {
                            decorators: {
                                type: "fluid",
                                func: "decapod.exportControls.detailedProgress"
                            }
                        }
                    }
                },
                {
                    type: "fluid.renderer.condition",
                    condition: that.model.showExportComplete,
                    trueTree: {
                        complete: {
                            decorators: {
                                type: "fluid",
                                func: "decapod.exportControls.complete"
                            }
                        }
                    }
                }
            ]
        };
    };
    
    decapod.pdfExporter.preInit = function (that) {
        /*
         * Work around for FLUID-4709
         * This method is overwritten by the framework after initComponent executes.
         * This preInit function guarantees that functions which forward to the overwritten versions are available during the event binding phase.
         */
        that.mapExportOptions = function (selection) {
            that.mapExportOptions(selection);
        };
        that.assembleExportOptions = function () {
            that.assembleExportOptions();
        };
        that.assembleCustomSettings = function (elPath) {
            that.assembleCustomSettings(elPath);
        };
    };

    decapod.pdfExporter.finalInit = function (that) {
        // creates a property called isValid. Doesn't work for <IE9.
        Object.defineProperty(that, "isInputValid", {
            get: that.isInputValidImp
        });
        
        that.assembleExportOptions();
        that.applier.modelChanged.addListener("*", function (newModel, oldModel) {
            that.events.afterModelChanged.fire(newModel, oldModel);
        });
        
        decapod.fetchResources(that.options.resources, function (resourceSpec) {
            that.container.append(that.options.resources.pdfExportTemplate.resourceText);
            that.events.afterFetchResources.fire(resourceSpec);
        });
    };
    
    fluid.defaults("decapod.pdfExporter", {
        gradeNames: ["decapod.viewComponentCustomMerge", "autoInit"],
        preInitFunction: "decapod.pdfExporter.preInit",
        finalInitFunction: "decapod.pdfExporter.finalInit",
        selectors: {
            exportInfo: ".dc-pdfExporter-exportInfo",
            exportDetails: ".dc-pdfExporter-exportDetails",
            pdfExportOptions: ".dc-pdfExporter-pdfExportOptions",
            controls: ".dc-pdfExporter-controls"
        },
        strings: {
            name: "Format type label",
            description: "A delectable medley of bits and bytes to satisfy every platform",
            documentResolutionLabel: "Output Image resolution:",
            documentDimensionsLabel: "Output dimensions:",
            documentDimensions: "A4(210 x 297mm / 8.3 x 11.7in.)",
            exportControl: "Start Export",
            initialProgressMessage: "Creating export...",
            inProgressMessage: "Creating export... Step %step of %steps.",
            completeProgressMessage: "Creating export... Done!",
            download: "Download PDF",  
            restart: "Start Over"
        },
        events: {
            afterFetchResources: null,
            afterModelChanged: null,
            afterPollComplete: null,
            afterExportComplete: null,
            afterExportOptionsRender: null,
            afterExportControlsRender: null,
            afterExportInfoRender: null,
            onError: null,
            onExportStart: null,
            onExportStatusUpdate: null,
            onCorrection: null,
            onValidationError: null,
            onEventBinderReady: null,
            onExportPollerReady: null,
            onExportInfoReady: null,
            onExportOptionsReady: null,
            onExportControlsReady: null,
            onReady: {
                events: {
                    eventBinder: "onEventBinderReady",
                    exportPoller: "onExportPollerReady",
                    exportInfo: "onExportInfoReady",
                    exportOptions: "onExportOptionsReady",
                    exportControls: "onExportControlsReady"
                },
                args: ["{pdfExporter}"]
            },
            afterRender: {
                events: {
                    exportOptions: "afterExportOptionsRender",
                    exportControls: "afterExportControlsRender",
                    exportInfo: "afterExportInfoRender"
                },
                args: ["{pdfExporter}"]
            }
        },
        listeners: {
            "afterModelChanged.internal": "{pdfExporter}.assembleExportOptions"
        },
        model: {
            exportStages: [],
            exportOptions: {
                output: {selection: "a4", choices: ["a4", "a5", "letter", "custom"], names: ["A4 (210x297 mm)", "A5 (148x210 mm)", "Letter (216x279mm)", "Custom"]},
                outputSettings: {
                    settings: [
                        {value: "210", name: "width", unit: "mm", attrs: {type: "number", min: "1", max: "300"}},
                        {value: "297", name: "height", unit: "mm", attrs: {type: "number", min: "1", max: "300"}},
                        {value: "200", name: "resolution", unit: "dpi", attrs: {type: "number", min: "50", max: "600"}}
                    ]
                }
            }
        },
        exportOptionsMap: {
            "a4": {
                width: 21,
                height: 29.7,
                dpi: 200
            },
            "a5": {
                width: 14.8,
                height: 21,
                dpi: 200
            },
            "letter": {
                width: 21.6,
                height: 27.9,
                dpi: 200
            },
            "custom": "assembleCustomSettings" // function to call to map the settings
        },
        resources: {
            pdfExportTemplate: {
                url: "../html/pdfExporterTemplate.html",
                forceCache: true
            },
            exportInfo: {
                url: "../html/exportInfoTemplate.html",
                forceCache: true
            },
            pdfExportOptions: {
                url: "../html/pdfExportOptionsTemplate.html",
                forceCache: true
            },
            select: {
                url: "../../select/html/selectTemplate.html",
                forceCache: true
            },
            outputSettings: {
                url: "../html/outputSettingsTemplate.html",
                forceCache: true
            },
            controls: {
                url: "../html/exportControlsTemplate.html",
                forceCache: true
            },
            trigger: {
                url: "../html/exportControlsTriggerTemplate.html",
                forceCache: true
            },
            progress: {
                url: "../html/exportControlsDetailedProgressTemplate.html",
                forceCache: true
            },
            complete: {
                url: "../html/exportControlsCompleteTemplate.html",
                forceCache: true
            }
        },
        invokers: {
            mapExportOptions: "decapod.pdfExporter.mapExportOptions",
            assembleExportOptions: "decapod.pdfExporter.assembleExportOptions",
            assembleCustomSettings: "decapod.pdfExporter.assembleCustomSettings",
            isInputValidImp: "decapod.pdfExporter.isInputValid"
        },
        components: {
            eventBinder: {
                type: "decapod.pdfExporter.eventBinder",
                createOnEvent: "afterFetchResources",
                priority: "last",
                options: {
                    listeners: {
                        "onReady.onEventBinderReady": "{pdfExporter}.events.onEventBinderReady",
                        "{pdfExporter}.events.onExportStart": {
                            namespace: "start",
                            listener: "{dataSource}.put",
                            args: [null]
                        },
                        "{dataSource}.events.success": "{exportPoller}.poll",
                        "{exportPoller}.events.pollComplete": "{pdfExporter}.events.afterPollComplete",
                        "{exportPoller}.events.afterPoll": "{pdfExporter}.events.onExportStatusUpdate",
                        "{exportPoller}.events.onError": "{pdfExporter}.events.onError"
                    }
                }
            },
            dataSource: {
                type: "decapod.dataSource"
            },
            exportPoller: {
                type: "decapod.exportPoller",
                options: {
                    listeners: {
                        "onReady.onExportPollerReady": "{pdfExporter}.events.onExportPollerReady"
                    }
                }
            },
            exportInfo: {
                type: "decapod.exportInfo",
                container: "{pdfExporter}.dom.exportInfo",
                createOnEvent: "afterFetchResources",
                options: {
                    strings: {
                        name: "{pdfExporter}.options.strings.name",
                        description: "{pdfExporter}.options.strings.description"
                    },
                    resources: {
                        template: "{pdfExporter}.options.resources.exportInfo"
                    },
                    listeners: {
                        "onReady.onExportInfoReady": "{pdfExporter}.events.onExportInfoReady",
                        "afterRender.afterExportInfoRender": "{pdfExporter}.events.afterExportInfoRender"
                    }
                }
            },
            exportOptions: {
                type: "decapod.pdfExportOptions",
                container: "{pdfExporter}.dom.pdfExportOptions",
                createOnEvent: "afterFetchResources",
                options: {
                    strings: {
                        documentResolutionLabel: "{pdfExporter}.options.strings.documentResolutionLabel",
                        documentDimensionsLabel: "{pdfExporter}.options.strings.documentDimensionsLabel",
                        documentDimensions: "{pdfExporter}.options.strings.documentDimensions"
                    },
                    model: "{pdfExporter}.model.exportOptions",
                    resources: {
                        template: "{pdfExporter}.options.resources.pdfExportOptions",
                        select: "{pdfExporter}.options.resources.select",
                        outputSettings: "{pdfExporter}.options.resources.outputSettings"
                    },
                    listeners: {
                        "onReady.onExportOptionsReady": "{pdfExporter}.events.onExportOptionsReady",
                        "afterRender.afterExportOptionsRender": "{pdfExporter}.events.afterExportOptionsRender",
                        "afterFetchResources.outputSettingsOnRender": {
                            listener: "{pdfExportOptions}.showIfModelValue",
                            args: ["outputSettings", "output.selection", "custom"]
                        },
                        "afterModelChanged.outputSettingsOnModelChange": {
                            listener: "{pdfExportOptions}.showIfModelValue",
                            args: ["outputSettings", "output.selection", "custom"]
                        },
                        "afterModelChanged.parent": {
                            listener: "{pdfExporter}.applier.requestChange",
                            args: ["exportOptions", "{arguments}.0"]
                        }
                        
                    }
                }
            },
            exportControls: {
                type: "decapod.exportControls",
                container: "{pdfExporter}.dom.controls",
                createOnEvent: "onExportOptionsReady",
                options: {
                    produceTree: "decapod.pdfExporter.exportControlsProduceTree",
                    strings: {
                        trigger: "{pdfExporter}.options.strings.exportControl",
                        progressMessage: "{pdfExporter}.options.strings.progressMessage",
                        download: "{pdfExporter}.options.strings.download",
                        restart: "{pdfExporter}.options.strings.restart"
                    },
                    resources: {
                        controls: "{pdfExporter}.options.resources.controls",
                        trigger: "{pdfExporter}.options.resources.trigger",
                        progress: "{pdfExporter}.options.resources.progress",
                        complete: "{pdfExporter}.options.resources.complete"
                    },
                    listeners: {
                        "onReady.onExportControlsReady": "{pdfExporter}.events.onExportControlsReady",
                        "afterRender.afterExportControlsRender": "{pdfExporter}.events.afterExportControlsRender"
                    }
                }
            }
        }
    });
})(jQuery);
