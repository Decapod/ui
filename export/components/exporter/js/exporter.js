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

    /********************
     * decapod.exporter *
     ********************/

    fluid.registerNamespace("decapod.exporter");
    
    /**
     * Renders the strings for the component.
     * The strings for its sub components are stored in nested objects
     * within the strings block. These are not used here.
     * 
     * @param {object} that, the component
     */
    decapod.exporter.renderStrings = function (that) {
        $.each(that.options.strings, function (key, str) {
            if (typeof (str) === "string" && that.options.selectors[key]) {
                that.locate(key).text(str);
            }
        });
    };
    
    /**
     * Sets the export type and fires the onImportStart event.
     * 
     * @param {object} that, the component
     * @param {object} exportType, the exportType component that should be handling the export.
     * Typically this is the subComponent which triggered the import/export workflow.
     */
    decapod.exporter.startImport = function (that, exportType) {
        that.exportType = exportType;
        // TODO: Should move this to a listeners block. Currently the order of instantiation isn't enforced enough to ensure that all the necessary parts are available.
        that.uploader.events.onFileError.addListener(
            function () {
                var exportControls = that.exportType.exportControls;
                var model = fluid.copy(exportControls.model);
                model.fileError = true;
                exportControls.updateModel(model);
            },
            "addError",
            null,
            "first"
        );
        that.events.onImportStart.fire();
    };
    
    /**
     * If there are valid files in the uploader queue it will fire the afterQueueReady event
     * 
     * @param {object} that, the component
     */
    decapod.exporter.validateQueue = function (that) {
        if (that.importStatus.model.valid > 0) {
            that.events.afterQueueReady.fire();
        }
    };
    
    /**
     * Forces the uploader's browse button to be disabled and have the disabled styling applied
     * 
     * @param {object} that, the component
     */
    decapod.exporter.disableImport = function (that) {
        var uploader = that.uploader;
        uploader.strategy.local.disableBrowseButton();
        uploader.locate("browseButton").addClass(uploader.options.styles.dim);
    };
    
    /**
     * Fires the onExportStart event and triggers the current exportType to start it's export.
     * 
     * @param {object} that, the component
     */
    decapod.exporter.startExport = function (that) {
        that.events.onExportStart.fire();
        that.exportType.dataSource.put();
    };
    
    /**
     * Sets if the component is in a busy state or not.
     * 
     * @param {object} that, the component
     * @param {boolean} isBusy, a boolean representing if the component should be in a busy state. 
     * This is typically used when an export is in progress
     */
    decapod.exporter.setBusy = function (that, isBusy) {
        that.container[isBusy ? "addClass" : "removeClass"](that.options.styles.busy);
    };
    
    /**
     * Sets the current exportType to null and fires the afterExportComplete event.
     * 
     * @param {object} that, the component
     */
    decapod.exporter.finishExport = function (that) {
        that.exportType = null;
        that.events.afterExportComplete.fire();
    };
    
    /**
     * Displays the instruction text and hides the status component.
     * 
     * @param {object} that, the component
     */
    decapod.exporter.showInstructions = function (that) {
        that.locate("importStatusContainer").hide();
        that.locate("instructions").show();
    };
    
    /**
     * Displays the status component and hides the instruction text.
     * 
     * @param {object} that, the component
     */
    decapod.exporter.showStatus = function (that) {
        that.locate("instructions").hide();
        that.locate("importStatusContainer").show();
    };
    
    /**
     * Since the various uploader functions for setting the state of the buttons
     * is not public, this function is needed to force the browseButton to be disabled.
     * 
     * @param {object} uploader, the uploader component
     */
    decapod.exporter.uploaderDisableBrowse = function (uploader) {
        var browseBttn = uploader.locate("browseButton");
        browseBttn.prop("disabled", true);
        browseBttn.addClass(uploader.options.styles.dim);
        uploader.strategy.local.disableBrowseButton();
    };
    
    decapod.exporter.pageUnloadWarning = function (that) {
        window.onbeforeunload = function () {
            return that.options.strings.pageUnloadWarning;
        };
    };
    
    decapod.exporter.preInit = function (that) {
        /*
         * Work around for FLUID-4709
         * These methods are overwritten by the framework after initComponent executes.
         * This preInit function guarantees that functions which forward to the overwritten versions are available during the event binding phase.
         */
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
        that.showInstructions = function () {
            that.showInstructions();
        };
        that.showStatus = function () {
            that.showStatus();
        };
        that.setBusy = function (isBusy) {
            that.setBusy(isBusy);
        };
        that.pageUnloadWarning = function () {
            that.pageUnloadWarning();
        };
    };
    
    decapod.exporter.finalInit = function (that) {
        that.pageUnloadWarning();
        that.showInstructions();
        that.renderStrings();
        that.events.onFinalInit.fire();
    };
    
    /**
     * Manages the importing of images to a server
     * and triggering the exporting of those images back to
     * the user as either a pdf or zipped image bundle.
     */  
    fluid.defaults("decapod.exporter", {
        gradeNames: ["fluid.viewComponent", "autoInit"],
        finalInitFunction: "decapod.exporter.finalInit",
        preInitFunction: "decapod.exporter.preInit",
        selectors: {
            title: ".dc-exporter-title",
            formats: ".dc-exporter-formats",
            help: ".dc-exporter-help",
            uploadClear: ".dc-exporter-uploadClear",
            uploadContainer: ".dc-exporter-upload",
            uploadBrowse: ".dc-exporter-uploadBrowse",
            importStatusContainer: ".dc-exporter-importStatus",
            importMessages: ".dc-exporter-importMessages",
            instructions: ".dc-exporter-instructions",
            pdfs: ".dc-exporter-pdfs",
            images: ".dc-exporter-images",
            accordionContainer: ".dc-exporter-accordion"
        },
        strings: {
            title: "PDF and Image Export",
            instructions: "Select 'Browse Files' to choose images to export.",
            uploadClear: "Restart",
            help: "Help",
            pageUnloadWarning: "Leaving the page could result in loss of export data.",
            formats: "Select Export Option",
            pdfs: {
                name: "PDF",
                formatStrings: [
                    {name: "1. Image PDF", description: "Export each image as a page in a PDF document. Export process is quick and generates a basic PDF."},
                    {name: "2. Image PDF with OCR Text", description: "OCR is performed on images, and resulting text is embedded in the PDF."},
                    {name: "3. Computer Traced PDF with OCR Text", description: "Content of each image is traced by the computer, OCR'ed, and output to a PDF. The process takes longer, but results is a much smaller PDF."},
                    {name: "4. Font Matched PDF with OCR Text", description: "Text on image is matched to a True-Type font resulting in a very compact PDF. Works best with Latin script."}
                ]
            },
            images: {
                name: "Image",
                formatStrings: [
                    {name: "5. TIFF", description: ""},
                    {name: "6. PNG", description: ""}
                ]
            }
        },
        styles: {
            busy: "ds-shared-busy"
        },
        events: {
            onReady: null,
            onFinalInit: null,
            onImportStart: null, 
            onExportStart: null,
            onError: null,
            afterQueueReady: null,
            afterExportComplete: null,
            afterExportError: null,
            afterPDFExportersRendered: null, 
            afterImagePDFRender: null,
            afterOCRPDFRender: null,
            afterTracedPDFRender: null,
            afterFontMatchedPDFRender: null,
            afterImageExportersRendered: null,
            afterPNGRender: null,
            afterTIFFRender: null,
            afterExportersRendered: {
                events: {
                    pdfs: "afterPDFExportersRendered",
                    imagePDF: "afterImagePDFRender",
                    ocrPDF: "afterOCRPDFRender",
                    tracedPDF: "afterTracedPDFRender",
                    fontMatchedPDF: "afterFontMatchedPDFRender",
                    images: "afterImageExportersRendered",
                    tiff: "afterTIFFRender",
                    png: "afterPNGRender"
                },
                args: ["{exporter}"]
            }
        },
        listeners: {
            "onExportStart.setBusy": {
                listener: "{exporter}.setBusy",
                args: [true]
            },
            "afterExportComplete.setBusy": {
                listener: "{exporter}.setBusy",
                args: [false]
            },
            "onError.setBusy": {
                listener: "{exporter}.setBusy",
                args: [false]
            }
        },
        invokers: {
            renderStrings: "decapod.exporter.renderStrings",
            startExport: "decapod.exporter.startExport",
            startImport: "decapod.exporter.startImport",
            finishExport: "decapod.exporter.finishExport",
            validateQueue: "decapod.exporter.validateQueue",
            disableImport: "decapod.exporter.disableImport",
            showInstructions: "decapod.exporter.showInstructions",
            showStatus: "decapod.exporter.showStatus",
            setBusy: "decapod.exporter.setBusy",
            pageUnloadWarning: "decapod.exporter.pageUnloadWarning"
        },
        components: {
            progressiveEnhancementChecker: {
                type: "fluid.progressiveCheckerForComponent",
                priority: "first",
                options: {
                    componentName: "fluid.uploader"
                }
            },
            importStatus: {
                type: "decapod.importStatus",
                container: "{exporter}.dom.importStatusContainer",
                options: {
                    strings: {
                        "-100": "%numErrors files exceeded the queue limit",
                        "-110": "%numErrors files exceeded the size limit",
                        "-120": "%numErrors files were empty (0 bytes)",
                        "-130": "%numErrors files had an invalid file type",
                        "-250": "%numErrors files were ignored by the server. May have not been valid image type."
                    },
                    ignoreFromTotals: ["-200", "-210", "-220", "-230", "-240", "-250", "-260", "-270", "-280", "-290"]
                }
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
                        fileSizeLimit: 102401 // Due to FLUID-4713 setting this to 1 Byte larger than 100MB in order to set the max size to 100MB
                    },
                    selectors: {
                        browseButton: "{exporter}.options.selectors.uploadBrowse",
                        lastMultifileInput: ".flc-uploader-html5-input:visible"
                    },
                    strings: {
                        buttons: {
                            addMore: "Browse Files"
                        }
                    },
                    focusWithEvent: {
                        afterFileDialog: "lastMultifileInput"
                    },
                    events: {
                        afterFilesSelected: {
                            event: "afterFileDialog"
                        }
                    },
                    listeners: {
                        // forces the browseButton to be disabled
                        "afterFileDialog.disableBrowse": {
                            listener: "decapod.exporter.uploaderDisableBrowse",
                            args: ["{uploader}"],
                            priority: "-1000"
                        },
                        "afterFileDialog.setValidFiles": {
                            listener: "{importStatus}.addValid",
                            priority: "2"
                        },
                        "afterFileDialog.renderStatuses": {
                            listener: "{importStatus}.renderStatuses",
                            priority: "1"
                        },
                        "afterFilesSelected.showStatus": {
                            listener: "{exporter}.showStatus",
                            priority: "0"
                        },
                        "onQueueError.addError": {
                            listener: "{importStatus}.addError",
                            args: ["{arguments}.1"]
                        }
                    }
                }
            },
            accordion: {
                type: "decapod.accordion",
                container: "{exporter}.dom.accordionContainer",
                createOnEvent: "afterExportersRendered",
                priority: "first",
                options: {
                    listeners: {
                        "{exporter}.events.onImportStart": "{accordion}.disable",
                        "onReady.exporter": "{exporter}.events.onReady"
                    }
                }
            },
            eventBinder: {
                type: "decapod.exporter.eventBinder",
                createOnEvent: "onFinalInit",
                options: {
                    listeners: {
                        "{exporter}.events.onImportStart": "{uploader}.start",
                        "{uploader}.events.afterUploadComplete": [
                            {
                                listener: "{exporter}.startExport"
                            },
                            {
                                listener: "{exporter}.disableImport",
                                priority: "last"
                            },
                            {
                                listener: "{importStatus}.renderStatuses"
                            }
                        ],
                        "{importStatus}.renderer.events.afterRender": "{exporter}.validateQueue"
                    }
                }
            },
            pdfExporters: {
                type: "decapod.pdfs.exportFormatGroup",
                container: "{exporter}.dom.pdfs",
                options: {
                    strings: {
                        name: "{exporter}.options.strings.pdfs.name"
                    },
                    listeners: {
                        "afterRender.exporter": "{exporter}.events.afterPDFExportersRendered"
                    },
                    model: {
                        formats: ["decapod.imagePDF.pdfExporter", "decapod.ocrPDF.pdfExporter", "decapod.tracedPDF.pdfExporter", "decapod.fontMatchedPDF.pdfExporter"]
                    }
                }
            },
            imageExporters: {
                type: "decapod.images.exportFormatGroup",
                container: "{exporter}.dom.images",
                options: {
                    strings: {
                        name: "{exporter}.options.strings.images.name"
                    },
                    listeners: {
                        "afterRender.exporter": "{exporter}.events.afterImageExportersRendered"
                    },
                    model: {
                        formats: ["decapod.tiff.imageExporter", "decapod.png.imageExporter"]
                    }
                }
            }
        }
    });
    
    /********************************
     * decapod.exporter.serverReset *
     ********************************/
    
    fluid.registerNamespace("decapod.exporter.serverReset");
    
    decapod.exporter.serverReset.finalInit = function (that) {
        that.dataSource["delete"]();
    };
    
    /**
     * A simple component to trigger the server to delete any existing import/export data.
     */
    fluid.defaults("decapod.exporter.serverReset", {
        gradeNames: ["fluid.littleComponent", "autoInit"],
        finalInitFunction: "decapod.exporter.serverReset.finalInit",
        components: {
            dataSource: {
                type: "decapod.dataSource",
                options: {
                    url: "http://localhost:8083/library/decapod-export/"
                }
            }
        }
    });
})(jQuery);
