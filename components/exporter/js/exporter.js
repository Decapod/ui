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
            importStatusContainer: ".dc-exporter-importStatus"
        },
        components: {
            progressiveEnhancementChecker: {
                type: "fluid.progressiveCheckerForComponent",
                priority: "fist",
                options: {
                    componentName: "fluid.uploader"
                }
            },
            importStatus: {
                type: "decapod.importStatus",
                container: "{exporter}.options.selectors.importStatusContainer",
                options: {
                	events: {
                		onInvalidFile: null
                	},
                	listeners: {
                		onInvalidFile: console.log
                	}
               }
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
                        afterFileDialog: function (numQueued) {
                            console.log("Number of files in the queue: " + numQueued);
                        },
                        onFileError: "{importStatus}.addError"
                    }
               }
            }
        }
    });
    
})(jQuery);
