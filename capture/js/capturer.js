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
/*global setTimeout, window, decapod:true, fluid, jQuery*/

// JSLint options 
/*jslint white: true, funcinvoke: true, undef: true, newcap: true, nomen: true, regexp: true, bitwise: true, browser: true, forin: true, maxerr: 100, indent: 4 */

var decapod = decapod || {};

(function ($) {

    /*********************
     *  decapod.capturer *
     *********************/
    
    fluid.registerNamespace("decapod.capturer");

    decapod.capturer.handleCaptureSucess = function (captureReviewer, status, response) {
        captureReviewer.show();
        status.hide();
        
        captureReviewer.applier.requestChange("captureIndex", response.captureIndex);
        captureReviewer.applier.requestChange("captures", response.captures);
    };
    
    decapod.capturer.handleCaptureError = function (captureReviewer, status, xhr, response) {
        captureReviewer.hide();
        status.show();
        
        // TODO
        status.applier.requestChange();
    };
    
    fluid.defaults("decapod.processButton", {
        gradeNames: ["fluid.rendererComponent", "autoInit"],
        finalInitFunction: "decapod.processButton.finalInit",
        components: {
            captureControl: {
                type: "decapod.processButton",
                options: {
                    selectors: {
                        button: ".dc-capturer-captureButton"
                    },
                    strings: {
                        inProcess: "Taking picture"
                    },
                    styles: {
                        disabled: "ds-capturer-captureButton-disabled"
                    },
                    listeners: {
                        onProcessSucess: {
                            listener: "decapod.capturer.handleCaptureSucess",
                            args: ["{captureReviewer}", "{status}", "{arguments}.0"]
                        },
                        onProcessError: {
                            listener: "decapod.capturer.handleCaptureError",
                            args: ["{captureReviewer}", "{status}", "{arguments}.0", "{arguments}.1"]
                        }
                    }
                }
            },
            exportControl: {
                type: "decapod.processButton",
                options: {
                    selectors: {
                        button: ".dc-capturer-exportButton"
                    },
                    strings: {
                        inProcess: "Creating archive"
                    },
                    styles: {
                        disabled: "ds-capturer-exportButton-disabled"
                    }
                }
            },
            captureReviewer: {
                type: "decapod.captureReviewer"
            },
            status: {
                type: "decapod.status"
            },
            serverRequestHandler: {
                type: "decapod.dataSource"
            }
        },
        model: {
        },
        selectors: {
        },
        strings: {
        },
        events: {
            onReady: null
        }
    });
})(jQuery);
