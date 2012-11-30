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

    /**************************
     *  decapod.imageExporter *
     **************************/
    
    fluid.registerNamespace("decapod.imageExporter");

    decapod.imageExporter.finalInit = function (that) {
        decapod.fetchResources(that.options.resources, function (resourceSpec) {
            that.container.append(that.options.resources.imageExporterTemplate.resourceText);
            that.events.afterFetchResources.fire(resourceSpec);
        });
    };
    
    fluid.defaults("decapod.imageExporter", {
        gradeNames: ["decapod.viewComponentCustomMerge", "autoInit"],
        finalInitFunction: "decapod.imageExporter.finalInit",
        selectors: {
            exportInfo: ".dc-imageExporter-exportInfo",
            exportDetails: ".dc-imageExporter-exportDetails",
            controls: ".dc-imageExporter-controls"
        },
        strings: {
            name: "",
            discription: ""
        },
        events: {
            afterFetchResources: null,
            afterExportComplete: null,
            afterExportControlsRender: null,
            afterExportInfoRender: null,
            onError: null,
            onExportStart: null,
            onEventBinderReady: null,
            onExportPollerReady: null,
            onExportInfoReady: null,
            onExportControlsReady: null,
            onReady: {
                events: {
                    eventBinder: "onEventBinderReady",
                    exportPoller: "onExportPollerReady",
                    exportInfo: "onExportInfoReady",
                    exportControls: "onExportControlsReady"
                },
                args: ["{imageExporter}"]
            },
            afterRender: {
                events: {
                    exportControls: "afterExportControlsRender",
                    exportInfo: "afterExportInfoRender"
                },
                args: ["{imageExporter}"]
            }
        },
        resources: {
            imageExporterTemplate: {
                url: "../html/imageExporterTemplate.html",
                forceCache: true
            },
            exportInfo: {
                url: "../html/exportInfoTemplate.html",
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
                type: "decapod.imageExporter.eventBinder",
                createOnEvent: "afterFetchResources",
                priority: "last",
                options: {
                    listeners: {
                        "onReady.onEventBinderReady": "{imageExporter}.events.onEventBinderReady",
                        "{imageExporter}.events.onExportStart": {
                            namespace: "start",
                            listener: "{dataSource}.put",
                            args: [null]
                        },
                        "{dataSource}.events.success": "{exportPoller}.poll",
                        "{exportPoller}.events.pollComplete": "{imageExporter}.events.afterExportComplete",
                        "{exportPoller}.events.onError": "{imageExporter}.events.onError"
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
                        "onReady.onExportPollerReady": "{imageExporter}.events.onExportPollerReady"
                    }
                }
            },
            exportInfo: {
                type: "decapod.exportInfo",
                container: "{imageExporter}.dom.exportInfo",
                createOnEvent: "afterFetchResources",
                options: {
                    strings: {
                        name: "{imageExporter}.options.strings.name",
                        description: "{imageExporter}.options.strings.description"
                    },
                    resources: {
                        template: "{imageExporter}.options.resources.exportInfo"
                    },
                    listeners: {
                        "onReady.onExportInfoReady": "{imageExporter}.events.onExportInfoReady",
                        "afterRender.afterExportInfoRender": "{imageExporter}.events.afterExportInfoRender"
                    }
                }
            },
            exportControls: {
                type: "decapod.exportControls",
                container: "{imageExporter}.dom.controls",
                createOnEvent: "afterFetchResources",
                options: {
                    resources: {
                        controls: "{imageExporter}.options.resources.controls",
                        trigger: "{imageExporter}.options.resources.trigger",
                        progress: "{imageExporter}.options.resources.progress",
                        complete: "{imageExporter}.options.resources.complete"
                    },
                    listeners: {
                        "onReady.onExportControlsReady": "{imageExporter}.events.onExportControlsReady",
                        "afterRender.afterExportControlsRender": "{imageExporter}.events.afterExportControlsRender"
                    }
                }
            }
        }
    });
})(jQuery);
