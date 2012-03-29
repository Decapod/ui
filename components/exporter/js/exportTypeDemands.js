/*
Copyright 2012 OCAD University

Licensed under the Educational Community License (ECL), Version 2.0 or the New
BSD license. You may not use this file except in compliance with one of these
Licenses.

You may obtain a copy of the ECL 2.0 License and BSD License at
https://source.fluidproject.org/svn/LICENSE.txt
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
    fluid.demands("decapod.exportControls.download.updateModel", ["decapod.exportControls.download"], {
        args: ["{download}", "{arguments}.0"]
    });

    
})(jQuery);
