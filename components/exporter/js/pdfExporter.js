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

    decapod.pdfExporter.finalInit = function (that) {
        decapod.fetchResources(that.options.resources, function (resourceSpec) {
            that.container.append(that.options.resources.pdfExportTemplate.resourceText);
            that.events.afterFetchResources.fire(resourceSpec);
        });
    };
    
    fluid.defaults("decapod.pdfExporter", {
        gradeNames: ["fluid.viewComponent", "autoInit"],
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
            progressMessage: "Creating PDF",
            download: "Download PDF",  
            restart: "Start Over"
        },
        events: {
            afterFetchResources: null,
            afterExportComplete: null,
            afterExportOptionsRender: null,
            afterExportControlsRender: null,
            afterExportInfoRender: null,
            onExportStart: null,
            onReady: null,
            afterRender: {
                events: {
                    exportOptions: "afterExportOptionsRender",
                    exportControls: "afterExportControlsRender",
                    exportInfo: "afterExportInfoRender"
                }
            }
        },
        model: {
            colour: {selection: "colour", choices: ["colour", "grey", "bw"], names: ["True Colour (24 bit)", "Greyscale", "Black and White"]},
            output: {selection: "a4", choices: ["a4", "a5", "letter", "custom"], names: ["A4 (210x297 mm)", "A5 (148x210 mm)", "Letter (216x279mm)", "Custom"]}
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
            controls: {
                url: "../html/exportControlsTemplate.html",
                forceCache: true
            },
            trigger: {
                url: "../html/exportControlsTriggerTemplate.html",
                forceCache: true
            },
            progress: {
                url: "../html/exportControlsProgressTemplate.html",
                forceCache: true
            },
            complete: {
                url: "../html/exportControlsCompleteTemplate.html",
                forceCache: true
            }
        },
        components: {
            eventBinder: {
                type: "decapod.pdfExporter.eventBinder",
                createOnEvent: "afterFetchResources",
                priority: "last",
                options: {
                    events: {
                        "onReady": "{pdfExporter}.events.onReady"
                    },
                    listeners: {
                        "{pdfExporter}.events.onExportStart": {
                            namespace: "start",
                            listener: "{dataSource}.put",
                            args: [null]
                        },
                        "{dataSource}.events.success": "{exportPoller}.poll",
                        "{exportPoller}.events.pollComplete": "{pdfExporter}.events.afterExportComplete"
                    }
                }
            },
            dataSource: {
                type: "decapod.dataSource"
            },
            exportPoller: {
                type: "decapod.exportPoller"
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
                    model: "{pdfExporter}.model",
                    resources: {
                        template: "{pdfExporter}.options.resources.pdfExportOptions",
                        select: "{pdfExporter}.options.resources.select"
                    },
                    listeners: {
                        "afterRender.afterExportOptionsRender": "{pdfExporter}.events.afterExportOptionsRender"
                    }
                }
            },
            exportControls: {
                type: "decapod.exportControls",
                container: "{pdfExporter}.dom.controls",
                createOnEvent: "afterFetchResources",
                options: {
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
                        "afterRender.afterExportControlsRender": "{pdfExporter}.events.afterExportControlsRender"
                    }
                }
            }
        }
    });
    
    /************************
     * decapod.exportPoller *
     ************************/
     
    fluid.registerNamespace("decapod.exportPoller");
    
    decapod.exportPoller.poll = function (that) {
        that.events.onPoll.fire();
    };
    
    decapod.exportPoller.isComplete = function (response) {
        return response.status && response.status.toLowerCase() === "complete";
    };
    
    decapod.exportPoller.handleResponse = function (that, response) {
        that.response = response;
        if (that.isComplete(response)) {
            that.events.pollComplete.fire(response);
        } else {
            setTimeout(function () {
                that.poll();
            }, that.options.delay);
        }
    };
    
    decapod.exportPoller.preInit = function (that) {
        /*
         * Work around for FLUID-4709
         * This method is overwritten by the framework after initComponent executes.
         * This preInit function guarantees that functions which forward to the overwritten versions are available during the event binding phase.
         */
        that.handleResponse = function (response) {
            that.handleResponse(response);
        };
    };
     
    fluid.defaults("decapod.exportPoller", {
        gradeNames: ["fluid.eventedComponent", "autoInit"],
        preInitFunction: "decapod.exportPoller.preInit",
        invokers: {
            poll: "decapod.exportPoller.poll",
            isComplete: "decapod.exportPoller.isComplete",
            handleResponse: "decapod.exportPoller.handleResponse"
        },
        events: {
            onPoll: null,
            pollComplete: null
        },
        delay: 5000,
        components: {
            eventBinder: {
                type: "decapod.exportPoller.eventBinder",
                priority: "last",
                options: {
                    listeners: {
                        "{exportPoller}.events.onPoll": "{dataSource}.get"
                    }
                }
            },
            dataSource: {
                type: "decapod.dataSource",
                priority: "first",
                options: {
                    listeners: {
                        "success.handler": "{exportPoller}.handleResponse"
                    }
                }
            }
        }
    });
})(jQuery);
