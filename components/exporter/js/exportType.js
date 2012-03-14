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

    fluid.registerNamespace("decapod.pdfExporter");
    
    decapod.pdfExporter.finalInit = function (that) {
        fluid.fetchResources(that.options.resources, function (resourceSpec) {
            that.container.append(that.options.resources.template.resourceText);
            that.events.afterFetchResources.fire(resourceSpec);
        });
    };
    
    fluid.defaults("decapod.pdfExporter", {
        gradeNames: ["fluid.viewComponent", "autoInit"],
        finalInitFunction: "decapod.pdfExporter.finalInit",
        selectors: {
            exportTypeContainer: ".dc-pdfExporter-exportType",
            pdfOptionsContainer: ".dc-pdfExporter-pdfOptions",
            controlsContainer: ".dc-pdfExporter-controls"
        },
        strings: {
            name: "Format type label",
            description: "A delectable medley of bits and bytes to satisfy every platform",
            resolutionLabel: "Output Image resolution:",
            dimensionsLabel: "Output dimensions:",
            dimensions: "A4(210 x 297mm / 8.3 x 11.7in.)",
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
            template: {
                url: "../html/pdfExporterTemplate.html",
                forceCache: true
            }
        },
        components: {
            exportType: {
                type: "decapod.exportType",
                container: "{pdfExporter}.dom.exportTypeContainer",
                createOnEvent: "afterFetchResources",
                options: {
                    strings: {
                        name: "{pdfExporter}.options.strings.name",
                        description: "{pdfExporter}.options.strings.description"
                    }
                }
            },
            exportOptions: {
                type: "decapod.exportType.pdfOptions",
                container: "{pdfExporter}.dom.pdfOptionsContainer",
                createOnEvent: "afterFetchResources",
                options: {
                    strings: {
                        resolutionLabel: "{pdfExporter}.options.strings.resolutionLabel",
                        dimensionsLabel: "{pdfExporter}.options.strings.dimensionsLabel",
                        dimensions: "{pdfExporter}.options.strings.dimensions"
                    }
                }
            },
            exportControls: {
                type: "decapod.exportType.controls",
                container: "{pdfExporter}.dom.controlsContainer",
                createOnEvent: "afterFetchResources",
                options: {
                    strings: {
                        exportControl: "{pdfExporter}.options.strings.exportControl",
                        progressMessage: "{pdfExporter}.options.strings.progressMessage",
                        download: "{pdfExporter}.options.strings.download",
                        restart: "{pdfExporter}.options.strings.restart"
                    },
                    listeners: {
                        "{pdfExporter}.events.afterExportComplete": "{controls}.showFinishControls"
                    }
                }
            }
        }
    });

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
    
    fluid.registerNamespace("decapod.exportType.pdfOptions");
    
    decapod.exportType.pdfOptions.produceTree = function (that) {
        return {
            resolutionLabel: {
                messagekey: "resolutionLabel"
            },
            resolution: {
                value: "${dpi}"
            },
            dimensionsLabel: {
                messagekey: "dimensionsLabel"
            },
            dimensions: {
                messagekey: "dimensions"
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
            resolutionLabel: ".dc-exportType-pdfOptions-resolutionLabel",
            resolution: ".dc-exportType-pdfOptions-resolution",
            dimensionsLabel: ".dc-exportType-pdfOptions-dimensionsLabel",
            dimensions: ".dc-exportType-pdfOptions-dimensions"
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
            resolutionLabel: "Output Image resolution:",
            dimensionsLabel: "Output dimensions:",
            dimensions: "A4(210 x 297mm / 8.3 x 11.7in.)"
        },
        events: {
            afterFetchResources: null,
            afterModelChanged: null
        }
    });
    
    fluid.registerNamespace("decapod.exportType.controls");
    
    decapod.exportType.controls.showControls = function (controlToggle, selectors) {
        controlToggle.showOnly(selectors);
    };
    
    decapod.exportType.controls.preInit = function (that) {
        //exposes the showProgressControls and showFinishControls invokers to be used as listerners in the defauls
        that.showProgressControls = function () {
            that.showProgressControls();
        };
        that.showFinishControls = function () {
            that.showFinishControls();
        };
    };
    
    decapod.exportType.controls.finalInit = function (that) {
        fluid.fetchResources(that.options.resources, function (resourceSpec) {
            that.container.append(that.options.resources.template.resourceText);
            that.events.afterFetchResources.fire(resourceSpec);
            that.refreshView();
        });
    };
    
    decapod.exportType.controls.produceTree = function (that) {
        return {
            exportControl: {
                messagekey: "exportControl",
                decorators: [{
                    type: "jQuery",
                    func: "click",
                    args: function () { that.events.onExportTrigger.fire(); }
                }]
            },
            progressMessage: {
                messagekey: "progressMessage"
            },
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
    
    fluid.defaults("decapod.exportType.controls", {
        gradeNames: ["fluid.rendererComponent", "autoInit"],
        preInitFunction: "decapod.exportType.controls.preInit",
        finalInitFunction: "decapod.exportType.controls.finalInit",
        produceTree: "decapod.exportType.controls.produceTree",
        selectors: {
            exportControl: ".dc-exportType-controls-exportControl",
            progressMessage: ".dc-exportType-controls-progressMessage",
            download: ".dc-exportType-controls-download",
            restart: ".dc-exportType-controls-restart"
        },
        strings: {
            exportControl: "Start Export",
            progressMessage: "Export Progress",
            download: "Download Link",
            restart: "Start Over"
        },
        events: {
            afterFetchResources: null,
            onExportTrigger: null
        },
        listeners: {
            "onExportTrigger.showProgressControls": {
                listener: "{controls}.showProgressControls",
                priority: "first"
            }
        },
        resources: {
            template: {
                url: "../html/exportControlsTemplate.html",
                forceCache: true
            }
        },
        model: {
            downloadURL: "downloadURL"
        },
        invokers: {
            showFinishControls: "decapod.exportType.controls.showFinishControls",
            showProgressControls: "decapod.exportType.controls.showProgressControls",
            showStartControls: "decapod.exportType.controls.showStartControls"
        },
        components: {
            controlToggle: {
                type: "decapod.visSwitcher",
                createOnEvent: "afterRender",
                container: "{controls}.container",
                options: {
                    selectors: "{controls}.options.selectors",
                    model: {
                        exportControl: true,
                        progressMessage: false,
                        download: false,
                        restart: false
                    }
                }
            }
        }
    });
    


})(jQuery);
