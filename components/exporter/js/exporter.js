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
/*global window, decapod:true, fluid, jQuery*/

// JSLint options 
/*jslint white: true, funcinvoke: true, undef: true, newcap: true, nomen: true, regexp: true, bitwise: true, browser: true, forin: true, maxerr: 100, indent: 4 */

var decapod = decapod || {};

(function ($) {

    fluid.registerNamespace("decapod.exporter");
    
    decapod.exporter.startImport = function (that, exportType) {
        that.exportType = exportType;
        that.events.onImportStart.fire();
    };
    
    decapod.exporter.validateQueue = function (that) {
        if (that.importStatus.numValidFiles > 0) {
            that.events.afterQueueReady.fire();
        }
    };
    
    decapod.exporter.startExport = function (that) {
        that.events.onExportStart.fire();
        that.exportType.dataSource.put();
    };
    
    decapod.exporter.finishExport = function (that) {
        that.exportType = null;
        that.events.afterExportComplete.fire();
    };
    
    decapod.exporter.preInit = function (that) {
        that.startExport = function () {
            that.startExport();
        };
        that.startImport = function (exportType) {
            that.startImport(exportType);
        };
        that.finishExport = function () {
            that.finishExport();
        };
        that.validateQueue = function () {
            that.validateQueue();
        };
    };
        
    fluid.defaults("decapod.exporter", {
        gradeNames: ["fluid.viewComponent", "autoInit"],
        preInitFunction: "decapod.exporter.preInit",
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
            onReady: null,
            onImportStart: null, 
            onExportStart: null,
            afterQueueReady: null,
            afterExportComplete: null
        },
        invokers: {
            startExport: "decapod.exporter.startExport",
            startImport: "decapod.exporter.startImport",
            finishExport: "decapod.exporter.finishExport",
            validateQueue: "decapod.exporter.validateQueue"
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
                container: "{exporter}.dom.imagePDFContainer",
                options: {
                    strings: {
                        name: "Image PDF",
                        description: "Export each image as a page in a PDF document. Export process is quick and generates a basic PDF."
                    },
                    components: {
                        dataSource: {
                            options: {
                                url: "http://localhost:8080/library/decapod-export/export/pdf/type1"
                            }
                        },
                        exportPoller: {
                            options: {
                                components: {
                                    dataSource: {
                                        options: {
                                            url: "http://localhost:8080/library/decapod-export/export/pdf/type1"
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            },
            ocrPDF: {
                type: "decapod.pdfExporter",
                container: "{exporter}.dom.ocrPDFContainer",
                options: {
                    strings: {
                        name: "Image PDF with OCR Text",
                        description: "OCR is performed on images, and resulting text is embedded in the PDF."
                    },
                    components: {
                        dataSource: {
                            options: {
                                url: "http://localhost:8080/library/decapod-export/export/pdf/type2"
                            }
                        },
                        exportPoller: {
                            options: {
                                components: {
                                    dataSource: {
                                        options: {
                                            url: "http://localhost:8080/library/decapod-export/export/pdf/type2"
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            },
            tracedPDF: {
                type: "decapod.pdfExporter",
                container: "{exporter}.dom.tracedPDFContainer",
                options: {
                    strings: {
                        name: "Computer Traced PDF with OCR Text",
                        description: "Contents of each image is traced by the computer, OCR'ed, and output to a PDF. The process takes longer, but results is a much smaller PDF."
                    },
                    components: {
                        dataSource: {
                            options: {
                                url: "http://localhost:8080/library/decapod-export/export/pdf/type3"
                            }
                        },
                        exportPoller: {
                            options: {
                                components: {
                                    dataSource: {
                                        options: {
                                            url: "http://localhost:8080/library/decapod-export/export/pdf/type3"
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            },
            eventBinder: {
                type: "decapod.exporter.eventBinder",
                priority: "last",
                options: {
                    listeners: {
                        "onReady.exporter": "{exporter}.events.onReady",
                        "{exporter}.events.onImportStart": "{uploader}.start",
                        "{uploader}.events.afterUploadComplete": "{exporter}.startExport",
                        "{pdfExporter}.events.afterExportComplete": "{exporter}.finishExport",
                        "{importStatus}.renderer.events.afterRender": "{exporter}.validateQueue"
                    }
                }
            }
        }
    });
    
    fluid.registerNamespace("decapod.exporter.eventBinder");
    
    decapod.exporter.eventBinder.finalInit = function (that) {
        that.events.onReady.fire();
    };
    
    fluid.defaults("decapod.exporter.eventBinder", {
        gradeNames: ["fluid.eventedComponent", "autoInit"],
        finalInitFunction: "decapod.exporter.eventBinder.finalInit",
        events: {
            onReady: null
        }
    });
    
    fluid.registerNamespace("decapod.exporter.serverReset");
    
    decapod.exporter.serverReset.finalInit = function (that) {
        that.dataSource.delete();
    };
    
    fluid.defaults("decapod.exporter.serverReset", {
        gradeNames: ["fluid.littleComponent", "autoInit"],
        finalInitFunction: "decapod.exporter.serverReset.finalInit",
        components: {
            dataSource: {
                type: "decapod.dataSource",
                options: {
                    url: "http://localhost:8080/library/decapod-export/"
                }
            }
        }
    });
})(jQuery);
