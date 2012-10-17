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
        captureReviewer.applier.requestChange("captureIndex", response.captureIndex);
        captureReviewer.applier.requestChange("captures", response.captures);
    };
    
    decapod.capturer.handleCaptureError = function (captureReviewer, status, xhr, response) {
        status.applier.requestChange("currentStatus", "NO_CAPTURE");
    };
    
    decapod.capturer.handleExportError = function (captureReviewer, status, xhr, response) {
        // TODO: Needs to implement "NO_EXPORT" in the status component
        status.applier.requestChange("currentStatus", "NO_EXPORT");
    };
    
    decapod.capturer.finalInit = function (that) {
        decapod.fetchResources(that.options.resources, function (resourceSpec) {
            that.container.append(that.options.resources.template.resourceText);
            that.events.onTemplateReady.fire();
            
            that.cameraStatusSource.get();
        });
    };
    
    fluid.defaults("decapod.capturer", {
        gradeNames: ["fluid.viewComponent", "autoInit"],
        finalInitFunction: "decapod.capturer.finalInit",
        components: {
            captureControl: {
                type: "decapod.processButton",
                createOnEvent: "onTemplateReady",
                container: "{capturer}.dom.captureButton",
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
                    model: {
                        disabled: true
                    },
                    listeners: {
                        "onProcessSuccess.handleCaptureSuccess": {
                            listener: "decapod.capturer.handleCaptureSucess",
                            args: ["{captureReviewer}", "{status}", "{arguments}.0"]
                        },
                        "onProcessSuccess.showCaptuerReviewer": {
                            listener: "{captureReviewer}.container.show",
                            args: []
                        },
                        "onProcessSuccess.hideStatus": {
                            listener: "{status}.container.hide",
                            args: []
                        },
                        "onProcessError.handleCaptureError": {
                            listener: "decapod.capturer.handleCaptureError",
                            args: ["{captureReviewer}", "{status}", "{arguments}.0", "{arguments}.1"]
                        },
                        "onProcessError.hideCaptuerReviewer": {
                            listener: "{captureReviewer}.container.hide",
                            args: []
                        },
                        "onProcessError.showStatus": {
                            listener: "{status}.container.show",
                            args: []
                        }
                    }
                }
            },
            exportControl: {
                type: "decapod.processButton",
                createOnEvent: "onTemplateReady",
                container: "{capturer}.dom.exportButton",
                options: {
                    selectors: {
                        button: ".dc-capturer-exportButton"
                    },
                    strings: {
                        inProcess: "Creating archive"
                    },
                    styles: {
                        disabled: "ds-capturer-exportButton-disabled"
                    },
                    model: {
                        disabled: true
                    },
                    listeners: {
                        onProcessError: {
                            listener: "decapod.capturer.handleExportError",
                            args: ["{captureReviewer}", "{status}", "{arguments}.0", "{arguments}.1"]
                        }
                    }
                }
            },
            captureReviewer: {
                type: "decapod.captureReviewer",
                createOnEvent: "onTemplateReady",
                container: "{capturer}.dom.preview"
            },
            status: {
                type: "decapod.status",
                createOnEvent: "onTemplateReady",
                container: "{capturer}.dom.status",
                options: {
                    model: {
                        currentStatus: "{capturer}.model.status",
                        READY: {
                            name: "Ready to Capture",
                            description: "Press the Camera Button to start.",
                            style: "dc-status-ready"
                        },
                        NO_CAMERAS: {
                            name: "No camera detected",
                            description: "",
                            style: "dc-status-noCameras"
                        },
                        CAMERA_DISCONNECTED: {
                            name: "A camera has been disconnected.",
                            description: "Check that the camera is plugged in and turned on.",
                            style: "dc-status-cameraDisconnected"
                        },
                        NO_CAPTURE: {
                            name: "Unable to capture",
                            description: 'There was a problem with a camera. See <a href="">Help</a> documentation for possible fixes',
                            style: "dc-status-noCapture"
                        },
                        TOO_MANY_CAMERAS: {
                            name: "Too many cameras detected",
                            description: "Connect only one or two cameras",
                            style: "dc-status-tooManyCameras"
                        }
                    }
                }
            },
            cameraStatusSource: {
                type: "decapod.dataSource",
                createOnEvent: "onTemplateReady",
                options: {
                    url: "../../mock-data/capture/mockCameraStatus.json",
                    listeners: {
                        "success.handleCaptureSuccess": {
                            listener: "decapod.capturer.handleCameraStatusSuccess",
                            args: ["{captureReviewer}", "{status}", "{arguments}.0"]
                        },
                        "success.showCaptuerReviewer": {
                            listener: "{captureReviewer}.container.show",
                            args: []
                        },
                        "success.hideStatus": {
                            listener: "{status}.container.hide",
                            args: []
                        }//,
//                        "error.handler": {
//                            listener: "decapod.processButton.handleCameraStatusError",
//                            args: ["{captureReviewer}", "{status}", "{arguments}.0", "{arguments}.1"]
//                        }
                    }
                }
            },
            captureStatusSource: {
                type: "decapod.dataSource",
                createOnEvent: "onTemplateReady",
                options: {
                    url: "../../mock-data/capture/mockCaptureStatus.json"
                }
            },
            imageSource: {
                type: "decapod.dataSource",
                createOnEvent: "onTemplateReady",
                options: {
                    url: "../../mock-data/capture/mockImagesByIndex.json"
                }
            }
        },
        model: {
            status: "READY"
        },
        selectors: {
            captureButton: ".dc-capturer-controls",
            exportButton: ".dc-capturer-controls",
            status: ".dc-capture-status",
            preview: ".dc-capturer-preview"
        },
        strings: {
        },
        events: {
            onReady: null,
            onTemplateReady: null
        },
        resources: {
            template: {
                url: "../html/capturerTemplate.html",
                forceCache: true
            }
        }
    });
})(jQuery);
