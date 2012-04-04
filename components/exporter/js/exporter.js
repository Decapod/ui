/*
Copyright 2012 OCAD University

Licensed under the Educational Community License (ECL), Version 2.0 or the New
BSD license. You may not use this file except in compliance with one of these
Licenses.

You may obtain a copy of the ECL 2.0 License and BSD License at
https://source.fluidproject.org/svn/LICENSE.txt
*/

// Declare dependencies
/*global window, decapod:true, fluid, jQuery*/

// JSLint options 
/*jslint white: true, funcinvoke: true, undef: true, newcap: true, nomen: true, regexp: true, bitwise: true, browser: true, forin: true, maxerr: 100, indent: 4 */

var decapod = decapod || {};

(function ($) {

    fluid.registerNamespace("decapod.exporter");
    
    fluid.defaults("decapod.exporter", {
        gradeNames: ["fluid.viewComponent", "autoInit"],
        selectors: {
            uploadContainer: ".dc-exporter-upload",
            uploadBrowse: ".dc-exporter-uploadBrowse",
            importStatusContainer: ".dc-exporter-importStatus",
            importMessages: ".dc-exporter-importMessages",
            instructions: ".dc-exporter-instructions",
            imagePDFContainer: ".dc-exporter-imagePDF",
            ocrPDFContainer: ".dc-exporter-ocrPDF",
            tracedPDFContainer: ".dc-exporter-tracedPDF"
        },
        events: {
            onExportStart: null
        },
        components: {
            progressiveEnhancementChecker: {
                type: "fluid.progressiveCheckerForComponent",
                priority: "first",
                options: {
                    componentName: "fluid.uploader"
                }
            },
            statusToggle: {
                type: "decapod.visSwitcher",
                container: "{exporter}.dom.importMessages",
                options: {
                    selectors: {
                        instructions: "{exporter}.options.selectors.instructions",
                        status: "{exporter}.options.selectors.importStatusContainer"
                    },
                    model: {
                        instructions: true,
                        status: false
                    }
                }
            },
            importStatus: {
                type: "decapod.importStatus",
                container: "{exporter}.dom.importStatusContainer"
            },
            uploader: {
                type: "fluid.uploader",
                container: "{exporter}.dom.uploadContainer",
                options: {
                    components: {
                        fileQueueView: {
                            type: "fluid.emptySubcomponent"
                        },
                        totalProgressBar: {
                            type: "fluid.emptySubcomponent"
                        },
                        errorPanel: {
                            type: "fluid.emptySubcomponent"
                        },
                        strategy: {
                            type: "fluid.uploader.html5Strategy"
                        }
                    },
                    queueSettings: {
                        fileSizeLimit: 409600
                    },
                    selectors: {
                        browseButton: "{exporter}.options.selectors.uploadBrowse"
                    },
                    events: {
                        onFileError: {
                            event: "onQueueError"
                        },
                        afterFilesSelected: {
                            event: "afterFileDialog"
                        }
                    },
                    listeners: {
                        "afterFileDialog.setValidFiles": {
                            listener: "{importStatus}.setNumValidFiles",
                            priority: "2"
                        },
                        "afterFileDialog.renderStatuses": {
                            listener: "{importStatus}.renderStatuses",
                            priority: "1"
                        },
                        "afterFilesSelected.showStatus": {
                            listener: "{statusToggle}.showOnly",
                            priority: "0"
                        },
                        onFileError: "{importStatus}.addError"
                    }
                }
            },
            imagePDF: {
                type: "decapod.pdfExporter",
                container: "{exporter}.dom.imagePDFContainer"
            },
            ocrPDF: {
                type: "decapod.pdfExporter",
                container: "{exporter}.dom.ocrPDFContainer"
            },
            tracedPDF: {
                type: "decapod.pdfExporter",
                container: "{exporter}.dom.tracedPDFContainer"
            },
            eventBinder: {
                type: "decapod.exporter.eventBinder",
                priority: "last",
                options: {
                    listeners: {
                        "{exporter}.events.onExportStart": "{uploader}.start"
                    }
                }
            }
        }
    });
    
    fluid.defaults("decapod.exporter.eventBinder", {
        gradeNames: ["fluid.eventedComponent", "autoInit"]
    });
})(jQuery);
