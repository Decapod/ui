/*
Copyright 2012 OCAD University

Licensed under the Educational Community License (ECL), Version 2.0 or the New
BSD license. You may not use this file except in compliance with one of these
Licenses.

You may obtain a copy of the ECL 2.0 License and BSD License at
https://source.fluidproject.org/svn/LICENSE.txt
*/

// Declare dependencies
/*global setTimeout, window, decapod:true, fluid, jQuery*/

// JSLint options 
/*jslint white: true, funcinvoke: true, undef: true, newcap: true, nomen: true, regexp: true, bitwise: true, browser: true, forin: true, maxerr: 100, indent: 4 */

var decapod = decapod || {};

(function ($) {

    /************************
     *  decapod.pdfExporter *
     *************************/
    
    fluid.registerNamespace("decapod.pdfExporter");
    
    decapod.pdfExporter.finalInit = function (that) {
        fluid.fetchResources(that.options.resources, function (resourceSpec) {
            that.container.append(that.options.resources.pdfExportTemplate.resourceText);
            that.events.afterFetchResources.fire(resourceSpec);
        });
    };
    
    fluid.defaults("decapod.pdfExporter", {
        gradeNames: ["fluid.viewComponent", "autoInit"],
        finalInitFunction: "decapod.pdfExporter.finalInit",
        selectors: {
            exportType: ".dc-pdfExporter-exportType",
            pdfOptions: ".dc-pdfExporter-pdfOptions",
            controls: ".dc-pdfExporter-controls"
        },
        strings: {
            name: "Format type label",
            description: "A delectable medley of bits and bytes to satisfy every platform",
            documentResolutionLabel: "Output Image resolution:",
            documentDimensionsLabel: "Output dimensions:",
            documentDimensions: "A4(210 x 297mm / 8.3 x 11.7in.)",
            exportControl: "Start Export",
            progressMessage: "Export Progress",
            download: "Download Link",  
            restart: "Start Over"
        },
        events: {
            afterFetchResources: null,
            afterExportTypeRendered: null,
            afterControlsRendered: null,
            afterOptionsRendered: null,
            afterExportComplete: null,
            onExportStart: null
        },
        resources: {
            pdfExportTemplate: {
                url: "../html/pdfExporterTemplate.html",
                forceCache: true
            },
            exportType: {
                url: "../html/exportTypeTemplate.html",
                forceCache: true
            },
            pdfOptions: {
                url: "../html/pdfOptionsTemplate.html",
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
            download: {
                url: "../html/exportControlsDownloadTemplate.html",
                forceCache: true
            }
        },
        components: {
            exportType: {
                type: "decapod.exportType",
                container: "{pdfExporter}.dom.exportType",
                createOnEvent: "afterFetchResources",
                options: {
                    strings: {
                        name: "{pdfExporter}.options.strings.name",
                        description: "{pdfExporter}.options.strings.description"
                    },
                    resources: {
                        template: "{pdfExporter}.options.resources.exportType"
                    }
                }
            },
            exportOptions: {
                type: "decapod.exportType.pdfOptions",
                container: "{pdfExporter}.dom.pdfOptions",
                createOnEvent: "afterFetchResources",
                options: {
                    strings: {
                        documentResolutionLabel: "{pdfExporter}.options.strings.documentResolutionLabel",
                        documentDimensionsLabel: "{pdfExporter}.options.strings.documentDimensionsLabel",
                        documentDimensions: "{pdfExporter}.options.strings.documentDimensions"
                    },
                    resources: {
                        template: "{pdfExporter}.options.resources.pdfOptions"
                    }
                }
            },
            exportControls: {
                type: "decapod.exportType.controls",
                container: "{pdfExporter}.dom.controls",
                createOnEvent: "afterFetchResources",
                options: {
                    strings: {
                        exportControl: "{pdfExporter}.options.strings.exportControl",
                        progressMessage: "{pdfExporter}.options.strings.progressMessage",
                        download: "{pdfExporter}.options.strings.download",
                        restart: "{pdfExporter}.options.strings.restart"
                    },
                    resources: {
                        controls: "{pdfExporter}.options.resources.controls",
                        trigger: "{pdfExporter}.options.resources.trigger",
                        progress: "{pdfExporter}.options.resources.progress",
                        download: "{pdfExporter}.options.resources.download"
                    }
                }
            }
        }
    });
    
    /**********************
     * decapod.exportType *
     **********************/

    fluid.registerNamespace("decapod.exportType");

    decapod.exportType.produceTree = function (that) {
        return {
            name: {
                messagekey: "name"
            },
            description: {
                messagekey: "description"
            }
        };
    };
    
    decapod.exportType.finalInit = function (that) {
        fluid.fetchResources(that.options.resources, function (resourceSpec) {
            that.container.append(that.options.resources.template.resourceText);
            that.events.afterFetchResources.fire(resourceSpec);
            that.refreshView();
        });
    };
    
    fluid.defaults("decapod.exportType", {
        gradeNames: ["fluid.rendererComponent", "autoInit"],
        finalInitFunction: "decapod.exportType.finalInit",
        produceTree: "decapod.exportType.produceTree",
        selectors: {
            name: ".dc-exportType-name",
            description: ".dc-exportType-description"
        },
        strings: {
            name: "Format type label",
            description: "A delectable medley of bits and bytes to satisfy every platform"
        },
        events: {
            afterFetchResources: null
        },
        resources: {
            template: {
                url: "../html/exportTypeTemplate.html",
                forceCache: true
            }
        }
    });
    
    /*********************************
     * decapod.exportType.pdfOptions *
     *********************************/
    
    fluid.registerNamespace("decapod.exportType.pdfOptions");
    
    decapod.exportType.pdfOptions.produceTree = function (that) {
        return {
            documentResolutionLabel: {
                messagekey: "documentResolutionLabel"
            },
            documentResolution: {
                value: "${dpi}"
            },
            documentDimensionsLabel: {
                messagekey: "documentDimensionsLabel"
            },
            documentDimensions: {
                messagekey: "documentDimensions"
            },
            exportButton: {
                messagekey: "exportButton"
            }
        };
    };
    
    decapod.exportType.pdfOptions.finalInit = function (that) {
        that.applier.modelChanged.addListener("dpi", that.events.afterModelChanged.fire);
        
        fluid.fetchResources(that.options.resources, function (resourceSpec) {
            that.container.append(that.options.resources.template.resourceText);
            that.events.afterFetchResources.fire(resourceSpec);
            that.refreshView();
        });
    };
    
    fluid.defaults("decapod.exportType.pdfOptions", {
        gradeNames: ["fluid.rendererComponent", "autoInit"],
        finalInitFunction: "decapod.exportType.pdfOptions.finalInit",
        produceTree: "decapod.exportType.pdfOptions.produceTree",
        selectors: {
            documentResolutionLabel: ".dc-exportType-pdfOptions-documentResolutionLabel",
            documentResolution: ".dc-exportType-pdfOptions-documentResolution",
            documentDimensionsLabel: ".dc-exportType-pdfOptions-documentDimensionsLabel",
            documentDimensions: ".dc-exportType-pdfOptions-documentDimensions"
        },
        model: {
            dpi: "300"
        },
        resources: {
            template: {
                url: "../html/pdfOptionsTemplate.html",
                forceCache: true
            }
        },
        strings: {
            documentResolutionLabel: "Output Image resolution:",
            documentDimensionsLabel: "Output dimensions:",
            documentDimensions: "A4(210 x 297mm / 8.3 x 11.7in.)"
        },
        events: {
            afterFetchResources: null,
            afterModelChanged: null
        }
    });
    
    /*******************************
     * decapod.exportType.controls *
     *******************************/
    
    fluid.registerNamespace("decapod.exportType.controls");

    decapod.exportType.controls.produceTree = function (that) {
        return {
            expander: [
                {
                    type: "fluid.renderer.condition",
                    condition: that.model.showExportStart,
                    trueTree: {
                        trigger: {
                            decorators: {
                                type: "fluid",
                                func: "decapod.exportType.controls.trigger"
                            }
                        }
                    }
                },
                {
                    type: "fluid.renderer.condition",
                    condition: that.model.showExportProgress,
                    trueTree: {
                        progress: {
                            decorators: {
                                type: "fluid",
                                func: "decapod.exportType.controls.progress"
                            }
                        }
                    }
                },
                {
                    type: "fluid.renderer.condition",
                    condition: that.model.showExportDownload,
                    trueTree: {
                        download: {
                            decorators: {
                                type: "fluid",
                                func: "decapod.exportType.controls.download"
                            }
                        }
                    }
                }
            ]
        };
    };
    
    decapod.exportType.controls.updateModel = function (that, modelPath, value) {
        that.applier.requestChange(modelPath, value);
    };
    
    decapod.exportType.controls.preInit = function (that) {
        // expose methods to be used by listeners
        that.refreshView = function () {
            that.refreshView();
        };
        
        that.updateModel = function (newModel) {
            that.updateModel(newModel);
        };
        
        // work around for FLUID-4192
        that.initialRender = function () {
            setTimeout(that.refreshView, 1);
        };
    };

    decapod.exportType.controls.finalInit = function (that) {
        that.applier.modelChanged.addListener("*", function (newModel, oldModel) {
            that.events.afterModelChanged.fire(newModel, oldModel);
        });
        
        fluid.fetchResources(that.options.resources, function (resourceSpec) {
            that.container.append(that.options.resources.controls.resourceText);
            that.events.afterFetchResources.fire(resourceSpec);
        });
    };
    
    fluid.defaults("decapod.exportType.controls", {
        gradeNames: ["fluid.rendererComponent", "autoInit"],
        finalInitFunction: "decapod.exportType.controls.finalInit",
        preInitFunction: "decapod.exportType.controls.preInit",
        produceTree: "decapod.exportType.controls.produceTree",
        selectors: {
            trigger: ".dc-exportType-controls-trigger",
            progress: ".dc-exportType-controls-progress",
            download: ".dc-exportType-controls-download"
        },
        strings: {
            trigger: "Start Export",
            progressMessage: "Export Progress",
            download: "Download Link",
            restart: "Start Over"
        },
        events: {
            afterFetchResources: null,
            afterModelChanged: null,
            onExportTrigger: null,
            onReady: null
        },
        listeners: {
            "afterModelChanged.refreshView": "{controls}.refreshView",
            "afterFetchResources.render": "{controls}.initialRender",
            "onExportTrigger.updateModel": {
                listener: "{controls}.updateModel",
                args: [{
                    showExportStart: false,
                    showExportProgress: true,
                    showExportDownload: false
                }]
            }
        },
        model: {
            showExportStart: true,
            showExportProgress: false,
            showExportDownload: false
        },
        invokers: {
            updateModel: "decapod.exportType.controls.updateModel"
        },
        resources: {
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
            download: {
                url: "../html/exportControlsDownloadTemplate.html",
                forceCache: true
            }
        }
    });
    
    /***************************************
     * decapod.exportType.controls.trigger *
     ***************************************/
    
    fluid.registerNamespace("decapod.exportType.controls.trigger");
    
    decapod.exportType.controls.trigger.produceTree = function (that) {
        return {
            trigger: {
                messagekey: "trigger",
                decorators: [{
                    type: "jQuery",
                    func: "click",
                    args: function () { that.events.afterTriggered.fire(); }
                }]
            }
        };
    };
    
    decapod.exportType.controls.trigger.finalInit = function (that) {
        fluid.fetchResources(that.options.resources, function (resourceSpec) {
            that.container.append(that.options.resources.template.resourceText);
            that.events.afterFetchResources.fire(resourceSpec);
            that.refreshView();
        });
    };
    
    fluid.defaults("decapod.exportType.controls.trigger", {
        gradeNames: ["fluid.rendererComponent", "autoInit"],
        finalInitFunction: "decapod.exportType.controls.trigger.finalInit",
        produceTree: "decapod.exportType.controls.trigger.produceTree",
        selectors: {
            trigger: ".dc-exportType-controls-trigger-exportControl"
        },
        strings: {
            trigger: "Start Export"
        },
        events: {
            afterFetchResources: null,
            afterTriggered: null
        },
        resources: {
            template: {
                url: "../html/exportControlsTriggerTemplate.html",
                forceCache: true
            }
        }
    });
    
    /****************************************
     * decapod.exportType.controls.progress *
     ****************************************/
    
    fluid.registerNamespace("decapod.exportType.controls.progress");
    
    decapod.exportType.controls.progress.produceTree = function (that) {
        return {
            message: {
                messagekey: "message"
            }
        };
    };
    
    decapod.exportType.controls.progress.finalInit = function (that) {
        fluid.fetchResources(that.options.resources, function (resourceSpec) {
            that.container.append(that.options.resources.template.resourceText);
            that.events.afterFetchResources.fire(resourceSpec);
            that.refreshView();
        });
    };
    
    fluid.defaults("decapod.exportType.controls.progress", {
        gradeNames: ["fluid.rendererComponent", "autoInit"],
        finalInitFunction: "decapod.exportType.controls.progress.finalInit",
        produceTree: "decapod.exportType.controls.progress.produceTree",
        selectors: {
            message: ".dc-exportType-controls-progress-message"
        },
        strings: {
            message: "Export Progress"
        },
        events: {
            afterFetchResources: null
        },
        resources: {
            template: {
                url: "../html/exportControlsProgressTemplate.html",
                forceCache: true
            }
        }
    });
    
    /****************************************
     * decapod.exportType.controls.download *
     ****************************************/
    
    fluid.registerNamespace("decapod.exportType.controls.download");
    
    decapod.exportType.controls.download.produceTree = function (that) {
        return {
            download: {
                linktext: {
                    messagekey: "download"
                },
                target: "${downloadURL}"
            },
            restart: {
                messagekey: "restart"
            }
        };
    };
    
    decapod.exportType.controls.download.finalInit = function (that) {
        fluid.fetchResources(that.options.resources, function (resourceSpec) {
            that.container.append(that.options.resources.template.resourceText);
            that.events.afterFetchResources.fire(resourceSpec);
            that.refreshView();
        });
    };
    
    fluid.defaults("decapod.exportType.controls.download", {
        gradeNames: ["fluid.rendererComponent", "autoInit"],
        finalInitFunction: "decapod.exportType.controls.download.finalInit",
        produceTree: "decapod.exportType.controls.download.produceTree",
        selectors: {
            download: ".dc-exportType-controls-download-download",
            restart: ".dc-exportType-controls-download-restart"
        },
        strings: {
            download: "Download Link",
            restart: "Start Over"
        },
        events: {
            afterFetchResources: null
        },
        model: {
            downloadURL: "downloadURL"
        },
        resources: {
            template: {
                url: "../html/exportControlsDownloadTemplate.html",
                forceCache: true
            }
        }
    });
})(jQuery);
