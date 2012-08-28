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
    
    fluid.demands("decapod.imageExporter.eventBinder", ["decapod.exporter", "decapod.imageExporter"], {
        funcName: "decapod.eventBinder",
        options: {
            listeners: {
                "{imageExporter}.events.onExportStart": {
                    namespace: "start",
                    listener: "{exporter}.startImport",
                    args: ["{imageExporter}"]
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
    
    fluid.demands("decapod.pdfs.exportFormatGroup", ["decapod.exporter"], {
        funcName: "decapod.exportFormatGroup",
        options: {
            resources: {
                exportFormatGroupTemplate: {
                    url: "../html/exportFormatGroupTemplate.html",
                    forceCache: true
                },
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
            }
        }
    });
    
    fluid.demands("decapod.images.exportFormatGroup", ["decapod.exporter"], {
        funcName: "decapod.exportFormatGroup",
        options: {
            resources: {
                exportFormatGroupTemplate: {
                    url: "../html/exportFormatGroupTemplate.html",
                    forceCache: true
                },
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
            header: ".dc-accordion-header", //TODO:Remove hardcoding of the selector.
            collapsible: true,
            clearStyle: true,
            active: false
        }
    });
    
    fluid.demands("decapod.exportControls.trigger", ["decapod.exporter", "decapod.exportControls"], {
        options: {
            model: {
                "fileQueueReady": false
            },
            events: {
                afterTriggered: "{exportControls}.events.onExportTrigger"
            },
            listeners: {
                "{exporter}.events.afterQueueReady": {
                    listener: "{trigger}.updateModel",
                    args: ["fileQueueReady", true]
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
    
    fluid.demands("decapod.exportControls.trigger", ["decapod.exporter", "decapod.pdfExporter", "decapod.exportControls"], {
        options: {
            model: {
                "fileQueueReady": false
            },
            listeners: {
                "{pdfExporter}.events.onValidationError": {
                    listener: "{trigger}.updateModel",
                    args: ["validSettings", false]
                },
                "{pdfExporter}.events.onCorrection": {
                    listener: "{trigger}.updateModel",
                    args: ["validSettings", true]
                },
                "{exporter}.events.afterQueueReady": {
                    listener: "{trigger}.updateModel",
                    args: ["fileQueueReady", true]
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
    
    fluid.demands("decapod.pdfExportOptions", ["decapod.exporter", "decapod.pdfExporter"], {
        options: {
            listeners: {
                "{exporter}.events.onImportStart": "{pdfExportOptions}.disable"
            }
        }
    });
    
    fluid.demands("decapod.imagePDF.pdfExporter", ["decapod.exporter", "decapod.exportFormatGroup"], {
        funcName: "decapod.pdfExporter",
        options: {
            strings: "{exporter}.options.strings.pdfs.formatStrings.0",
            model: {
                exportStages: ["books2pages", "ocro2pdf.py"]
            },
            listeners: {
                "afterExportComplete.finishExport": "{exporter}.finishExport",
                "afterRender.afterImagePDFRender": "{exporter}.events.afterImagePDFRender"
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
            },
            resources: "{exportFormatGroup}.options.resources"
        }
    });
    
    fluid.demands("decapod.ocrPDF.pdfExporter", ["decapod.exporter", "decapod.exportFormatGroup"], {
        funcName: "decapod.pdfExporter",
        options: {
            strings: "{exporter}.options.strings.pdfs.formatStrings.1",
            model: {
                exportStages: ["books2pages", "pages2lines", "lines2fsts", "fsts2text", "ocro2pdf.py"]
            },
            listeners: {
                "afterExportComplete.finishExport": "{exporter}.finishExport",
                "afterRender.afterOCRPDFRender": "{exporter}.events.afterOCRPDFRender"
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
            },
            resources: "{exportFormatGroup}.options.resources"
        }
    });
    
    fluid.demands("decapod.tracedPDF.pdfExporter", ["decapod.exporter", "decapod.exportFormatGroup"], {
        funcName: "decapod.pdfExporter",
        options: {
            strings: "{exporter}.options.strings.pdfs.formatStrings.2",
            model: {
                exportStages: ["books2pages", "pages2lines", "lines2fsts", "fsts2text", "binned-inter", "ocro2pdf.py"]
            },
            listeners: {
                "afterExportComplete.finishExport": "{exporter}.finishExport",
                "afterRender.afterTracedPDFRender": "{exporter}.events.afterTracedPDFRender"
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
            },
            resources: "{exportFormatGroup}.options.resources"
        }
    });
    
    fluid.demands("decapod.fontMatchedPDF.pdfExporter", ["decapod.exporter", "decapod.exportFormatGroup"], {
        funcName: "decapod.pdfExporter",
        options: {
            strings: "{exporter}.options.strings.pdfs.formatStrings.3",
            model: {
                exportStages: ["books2pages", "pages2lines", "lines2fsts", "fsts2text", "binned-inter", "fontGrouper.py", "ocro2pdf.py"]
            },
            listeners: {
                "afterExportComplete.finishExport": "{exporter}.finishExport",
                "afterRender.afterFontMatchedPDFRender": "{exporter}.events.afterFontMatchedPDFRender"
            },
            components: {
                dataSource: {
                    options: {
                        url: "http://localhost:8080/library/decapod-export/export/pdf/type4"
                    }
                },
                exportPoller: {
                    options: {
                        components: {
                            dataSource: {
                                options: {
                                    url: "http://localhost:8080/library/decapod-export/export/pdf/type4"
                                }
                            }
                        }
                    }
                }
            },
            resources: "{exportFormatGroup}.options.resources"
        }
    });
    
    fluid.demands("decapod.tiff.imageExporter", ["decapod.exporter", "decapod.exportFormatGroup"], {
        funcName: "decapod.imageExporter",
        options: {
            strings: "{exporter}.options.strings.images.formatStrings.0",
            listeners: {
                "afterExportComplete.finishExport": "{exporter}.finishExport",
                "afterRender.afterTIFFRender": "{exporter}.events.afterTIFFRender"
            },
            components: {
                dataSource: {
                    options: {
                        url: "http://localhost:8080/library/decapod-export/export/image/tiff"
                    }
                },
                exportPoller: {
                    options: {
                        components: {
                            dataSource: {
                                options: {
                                    url: "http://localhost:8080/library/decapod-export/export/image/tiff"
                                }
                            }
                        }
                    }
                }
            },
            resources: "{exportFormatGroup}.options.resources"
        }
    });
    
    fluid.demands("decapod.png.imageExporter", ["decapod.exporter", "decapod.exportFormatGroup"], {
        funcName: "decapod.imageExporter",
        options: {
            strings: "{exporter}.options.strings.images.formatStrings.1",
            listeners: {
                "afterExportComplete.finishExport": "{exporter}.finishExport",
                "afterRender.afterPNGRender": "{exporter}.events.afterPNGRender"
            },
            components: {
                dataSource: {
                    options: {
                        url: "http://localhost:8080/library/decapod-export/export/image/png"
                    }
                },
                exportPoller: {
                    options: {
                        components: {
                            dataSource: {
                                options: {
                                    url: "http://localhost:8080/library/decapod-export/export/image/png"
                                }
                            }
                        }
                    }
                }
            },
            resources: "{exportFormatGroup}.options.resources"
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
    fluid.demands("decapod.exporter.setBusy", ["decapod.exporter"], {
        args: ["{exporter}", "{arguments}.0"]
    });

    /*****************
     *Event Demands *
     *****************/
     // Due to FLUID-4631, have to pass in both parameters from onQueueError, instead of just grabbing the second one here
//    fluid.demands("onFileError", ["decapod.exporter", "fluid.uploader.multiFileUploader"], ["{arguments}.1"]);
    fluid.demands("afterFilesSelected", ["decapod.exporter", "fluid.uploader.multiFileUploader"], ["status"]);
    
})(jQuery);
