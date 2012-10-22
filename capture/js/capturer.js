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

    decapod.capturer.handleOnCapture = function (that) {
        that.exportControl.updateModel({"disabled": true});
    };
    
    decapod.capturer.handleCaptureSucess = function (that, response) {
        decapod.capturer.show(that.captureReviewer);
        decapod.capturer.hide(that.status);
        that.captureReviewer.updateModel(response);
        that.exportControl.updateModel({"disabled": false});
    };
    
    decapod.capturer.handleCaptureError = function (that, xhr, response) {
        decapod.capturer.hide(that.captureReviewer);
        decapod.capturer.show(that.status);
        that.status.updateStatus("NO_CAPTURE");
        that.captureControl.updateModel({"disabled": true});
    };
    
    decapod.capturer.handleExportError = function (status, xhr, response) {
        // TODO: Needs to implement "NO_EXPORT" in the status component
        status.updateStatus("NO_EXPORT");
    };
    
    decapod.capturer.cameraStatusSuccess = function (that, response) {
        if (response.statusCode === 'READY') {
            that.captureStatusSource.get();
        } else {
            decapod.capturer.show(that.status);
            decapod.capturer.hide(that.captureReviewer);
            that.status.updateStatus(response.statusCode);
        }
    };
    
    decapod.capturer.captureStatusSuccess = function (that, response) {
        if (response.index === 0) {
            decapod.capturer.show(that.status);
            decapod.capturer.hide(that.captureReviewer);
            that.status.updateStatus("READY");
            that.exportControl.updateModel({"disabled": true});
        } else {
            that.imageSource.get(null, {captureIndex: response.index});
            that.captureControl.updateModel({"disabled": false});
            that.exportControl.updateModel({"disabled": false});
        }
    };

    decapod.capturer.imageSuccess = function (that, response) {
        decapod.capturer.show(that.captureReviewer);
        decapod.capturer.hide(that.status);
        that.captureReviewer.updateModel(response);
    };
    
    decapod.capturer.restart = function (that) {
        that.events.onRestart.fire();
    };
    
    decapod.capturer.initCapturerControls = function (that) {
        that.locate("help").text(that.options.strings.help);
        var restart = that.locate("restart");
        restart.text(that.options.strings.restart);
        restart.click(that.restart);
    };
    
    /**
     * Show the component
     */
    decapod.capturer.show = function (componentInstance) {
        if (componentInstance && componentInstance.container) {
            componentInstance.container.show();
        }
    };
    
    /**
     * Hide the component
     */
    decapod.capturer.hide = function (componentInstance) {
        if (componentInstance && componentInstance.container) {
            componentInstance.container.hide();
        }
    };
    
    decapod.capturer.preInit = function (that) {
        /*
         * Work around for FLUID-4709
         * These methods are overwritten by the framework after initComponent executes.
         * This preInit function guarantees that functions which forward to the overwritten versions are available during the event binding phase.
         */
        that.initCapturerControls = function () {
            that.initCapturerControls();
        };
        
        that.restart = function () {
            that.restart();
        };
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
        preInitFunction: "decapod.capturer.preInit",
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
                        "disabled": true
                    },
                    listeners: {
                        "onProcess": {
                            listener: "decapod.capturer.handleOnCapture",
                            args: ["{capturer}"]
                        },
                        "onProcessSuccess.handleCaptureSuccess": {
                            listener: "decapod.capturer.handleCaptureSucess",
                            args: ["{capturer}", "{arguments}.0"]
                        },
                        "onProcessSuccess.showCaptuerReviewer": {
                            listener: "decapod.capturer.show",
                            args: ["{capturerReviewer}"]
                        },
                        "onProcessSuccess.hideStatus": {
                            listener: "decapod.capturer.hide",
                            args: ["{status}"]
                        },
                        "onProcessError.handleCaptureError": {
                            listener: "decapod.capturer.handleCaptureError",
                            args: ["{capturer}", "{arguments}.0", "{arguments}.1"]
                        },
                        "onProcessError.hideCaptuerReviewer": {
                            listener: "decapod.capturer.hide",
                            args: ["{capturerReviewer}"]
                        },
                        "onProcessError.showStatus": {
                            listener: "decapod.capturer.show",
                            args: ["{status}"]
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
                        "disabled": true
                    },
                    listeners: {
                        "onProcessError.handleExportError": {
                            listener: "decapod.capturer.handleExportError",
                            args: ["{status}", "{arguments}.0", "{arguments}.1"]
                        },
                        "onProcessError.hideCaptuerReviewer": {
                            listener: "decapod.capturer.hide",
                            args: ["{captuerReviewer}"]
                        },
                        "onProcessError.showStatus": {
                            listener: "decapod.capturer.show",
                            args: ["{status}"]
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
                        },
                        NO_EXPORT: {
                            name: "Unable to export",
                            description: 'There was a problem with the export. See <a href="">Help</a> documentation for possible fixes',
                            style: "dc-status-noExport"
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
                        "success.handleCameraStatusSuccess": {
                            listener: "decapod.capturer.cameraStatusSuccess",
                            args: ["{capturer}", "{arguments}.0"]
                        },
                        "error.handleCameraStatusError": {
                            listener: "decapod.capturer.handleCaptureError",
                            args: ["{capturer}", "{arguments}.0", "{arguments}.1"]
                        },
                        "error.hideCaptuerReviewer": {
                            listener: "decapod.capturer.hide",
                            args: ["{captuerReviewer}"]
                        },
                        "error.showStatus": {
                            listener: "decapod.capturer.show",
                            args: ["{status}"]
                        }
                    }
                }
            },
            captureStatusSource: {
                type: "decapod.dataSource",
                createOnEvent: "onTemplateReady",
                options: {
                    url: "../../mock-data/capture/mockCaptureStatus.json",
                    listeners: {
                        "success.handleCaptureSuccess": {
                            listener: "decapod.capturer.captureStatusSuccess",
                            args: ["{capturer}", "{arguments}.0"]
                        },
                        "error.handleCaptureError": {
                            listener: "decapod.capturer.handleCaptureError",
                            args: ["{capturer}", "{arguments}.0", "{arguments}.1"]
                        },
                        "error.hideCaptuerReviewer": {
                            listener: "decapod.capturer.hide",
                            args: ["{captuerReviewer}"]
                        },
                        "error.showStatus": {
                            listener: "decapod.capturer.show",
                            args: ["{status}"]
                        }
                    }
                }
            },
            imageSource: {
                type: "decapod.dataSource",
                createOnEvent: "onTemplateReady",
                options: {
                    url: "../../mock-data/capture/mockImagesByIndex.json",
                    listeners: {
                        "success.handleImageSuccess": {
                            listener: "decapod.capturer.imageSuccess",
                            args: ["{capturer}", "{arguments}.0"]
                        },
                        "error.handleImageError": {
                            listener: "decapod.capturer.handleCaptureError",
                            args: ["{capturer}", "{arguments}.0", "{arguments}.1"]
                        },
                        "error.hideCaptuerReviewer": {
                            listener: "decapod.capturer.hide",
                            args: ["{captuerReviewer}"]
                        },
                        "error.showStatus": {
                            listener: "decapod.capturer.show",
                            args: ["{status}"]
                        }
                    }
                }
            },
            captureSource: {
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
            restart: ".dc-capturer-restart",
            help: ".dc-capturer-help",
            status: ".dc-capture-status",
            preview: ".dc-capturer-preview"
        },
        strings: {
            help: "Help",
            restart: "Restart"
        },
        events: {
            onReady: null,
            onTemplateReady: null,
            onRestart: null
        },
        listeners: {
            onRestart: "{captureSource}.delete",
            onTemplateReady: "{capturer}.initCapturerControls"
        },
        invokers: {
            restart: "decapod.capturer.restart",
            initCapturerControls: "decapod.capturer.initCapturerControls"
        },
        resources: {
            template: {
                url: "../html/capturerTemplate.html",
                forceCache: true
            }
        }
    });
})(jQuery);
