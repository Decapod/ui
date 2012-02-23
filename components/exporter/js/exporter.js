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
            imagePDFContainer: ".dc-exporter-imagePDF",
            ocrPDFContainer: ".dc-exporter-ocrPDF",
            tracedPDFContainer: ".dc-exporter-tracedPDF"
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
                type: "decapod.exporter.statusToggle",
                container: "{exporter}.options.selectors.importMessages"
            },
            importStatus: {
                type: "decapod.importStatus",
                container: "{exporter}.options.selectors.importStatusContainer"
            },
            uploader: {
                type: "fluid.uploader",
                container: "{exporter}.options.selectors.uploadContainer",
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
                        "afterFileDialog.showStatus": {
                            listener: "{statusToggle}.showStatus",
                            priority: "0"
                        },
                        onFileError: "{importStatus}.addError"
                    }
                }
            },
            imagePDF: {
                type: "decapod.pdfExporter",
                container: "{exporter}.options.selectors.imagePDFContainer",
                options: {}
            },
            ocrPDF: {
                type: "decapod.pdfExporter",
                container: "{exporter}.options.selectors.ocrPDFContainer",
                options: {}
            },
            tracedPDF: {
                type: "decapod.pdfExporter",
                container: "{exporter}.options.selectors.tracedPDFContainer",
                options: {}
            }
        }
    });
    
    fluid.registerNamespace("decapod.exporter.statusToggle");
    
    decapod.exporter.statusToggle.setContainerStyle = function (that, style) {
        var classes = [];
        var styles = that.options.styles;
        for (var styleName in styles) {
            if (styleName !== style) {
                classes.push(styles[styleName]);
            }
        }
        that.container.removeClass(classes.join(" "));
        that.container.addClass(styles[style]);
    };
    
    decapod.exporter.statusToggle.finalInit = function (that) {
        var styles = that.options.styles;
        that.setContainerStyle(that.options.styleOnInit);
        that.locate("status").addClass(styles.status);
        that.locate("instructions").addClass(styles.instructions);
    };
    
    fluid.defaults("decapod.exporter.statusToggle", {
        gradeNames: ["fluid.viewComponent", "autoInit"],
        finalInitFunction: "decapod.exporter.statusToggle.finalInit",
        selectors: {
            status: ".dc-exporter-statusToggle-status",
            instructions: ".dc-exporter-statusToggle-instructions"
        },
        styles: {
            showStatus: "ds-exporter-statusToggle-showStatus",
            showInstructions: "ds-exporter-statusToggle-showInstructions",
            status: "ds-exporter-statusToggle-status",
            instructions: "ds-exporter-statusToggle-instructions"
        },
        styleOnInit: "showInstructions",
        invokers: {
            setContainerStyle: "decapod.exporter.statusToggle.setContainerStyle",
            showStatus: "decapod.exporter.statusToggle.showStatus",
            showInstructions: "decapod.exporter.statusToggle.showInstructions"
        }
    });
    
})(jQuery);
