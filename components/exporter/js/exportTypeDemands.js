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
    fluid.demands("decapod.exportControls.trigger", ["decapod.exportControls"], {
        options: {
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
    fluid.demands("decapod.exportControls.progress", ["decapod.exportControls"], {
        options: {
            resources: {
                template: "{exportControls}.options.resources.progress"
            },
            strings: {
                message: "{exportControls}.options.strings.progressMessage"
            }
        }
    });
    fluid.demands("decapod.exportControls.complete", ["decapod.exportControls"], {
        options: {
            resources: {
                template: "{exportControls}.options.resources.complete"
            },
            model: {
                downloadURL: "{exportControls}.model.downloadURL"
            },
            strings: {
                download: "{exportControls}.options.strings.download",
                restart: "{exportControls}.options.strings.restart"
            }
        }
    });
    
    fluid.demands("decapod.select", ["decapod.pdfExportOptions"], {
        options: {
            resources: {
                template: "{pdfExportOptions}.options.resources.select"
            }
        }
    });
    
    fluid.demands("decapod.pdfExporter.eventBinder", ["decapod.pdfExporter"], {
        funcName: "decapod.eventBinder"
    });
    
    fluid.demands("decapod.exportPoller.eventBinder", ["decapod.exportPoller"], {
        funcName: "decapod.eventBinder"
    });
    
    //local
    
    fluid.demands("decapod.exportPoller", ["decapod.fileSystem"], {
        options: {
            delay: 10
        }
    });
    
    fluid.demands("decapod.dataSource", ["decapod.fileSystem"], {
        options: {
            url: "../../../mock-book/mockResponse.json"
        }
    });

    
    /*******************
     * Invoker Demands *
     *******************/
    fluid.demands("decapod.exportPoller.poll", ["decapod.exportPoller"], {
        args: ["{exportPoller}"]
    });
    fluid.demands("decapod.exportPoller.handleResponse", ["decapod.exportPoller"], {
        args: ["{exportPoller}", "{arguments}.0"]
    });
    fluid.demands("decapod.exportInfo.renderText", ["decapod.exportInfo"], {
        args: ["{decapod.exportInfo.renderText}"]
    });
    fluid.demands("decapod.exportControls.updateModel", ["decapod.exportControls"], {
        args: ["{exportControls}", "", "{arguments}.0"]
    });
    fluid.demands("decapod.exportControls.trigger.updateModel", ["decapod.exportControls.trigger"], {
        args: ["{trigger}", "{arguments}.0"]
    });
    fluid.demands("decapod.exportControls.complete.updateModel", ["decapod.exportControls.complete"], {
        args: ["{complete}", "{arguments}.0"]
    });
})(jQuery);
