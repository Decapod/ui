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

    fluid.demands("decapod.dataSource", ["decapod.fileSystem", "decapod.pdfExporter"], {
        options: {
            url: "../../../mock-book/mockResponse.json"
        }
    });
    
    fluid.demands("decapod.dataSource", ["decapod.fileSystem", "decapod.exportPoller"], {
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
                        showExportDownload: true,
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
            }
        }
    });
    fluid.demands("decapod.exportControls.progress", ["decapod.exportControls"], {
        options: {
            resources: {
                template: "{exportControls}.options.resources.progress"
            }
        }
    });
    fluid.demands("decapod.exportControls.download", ["decapod.exportControls"], {
        options: {
            resources: {
                template: "{exportControls}.options.resources.download"
            },
            model: {
                downloadURL: "{exportControls}.model.downloadURL"
            }
        }
    });
    
    //local
    
    fluid.demands("decapod.exportPoller", ["decapod.fileSystem"], {
        options: {
            delay: 10
        }
    });
    
    /*******************
     * Invoker Demands *
     *******************/
    fluid.demands("decapod.pdfExporter.toggleExportDetails", ["decapod.pdfExporter"], {
        args: ["{pdfExporter}"]
    });
    fluid.demands("decapod.pdfExporter.bindEvents", ["decapod.pdfExporter"], {
        args: ["{pdfExporter}"]
    });
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
    fluid.demands("decapod.exportControls.download.updateModel", ["decapod.exportControls.download"], {
        args: ["{download}", "{arguments}.0"]
    });

    
})(jQuery);
