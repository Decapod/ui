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
    
    decapod.capturer.handleCaptureSuccess = function (that, response) {
        decapod.capturer.show(that.captureReviewer);
        decapod.capturer.hide(that.status);
        that.captureReviewer.updateModel({"captureIndex": response.totalCaptures, "captures": response.captures});
        that.exportControl.updateModel({"disabled": false});
        
        that.events.onCaptureSuccess.fire();
    };
    
    decapod.capturer.handleCaptureError = function (that, xhr, response) {
        decapod.capturer.hide(that.captureReviewer);
        decapod.capturer.show(that.status);
        that.status.updateStatus("NO_CAPTURE");
        that.captureControl.updateModel({"disabled": true});
        
        that.events.onCaptureError.fire();
    };
    
    decapod.capturer.handleExportSuccess = function (that, response) {
        that.locate("downloadFrame").attr("src", response.url);
        
        that.events.onExportSuccess.fire();
    };
    
    decapod.capturer.handleExportError = function (that, xhr, response) {
        // TODO: Needs to implement "NO_EXPORT" in the status component
        that.status.updateStatus("NO_EXPORT");
        
        that.events.onExportError.fire();
    };
    
    decapod.capturer.cameraStatusSuccess = function (that, response) {
        if (response.statusCode === 'READY') {
            that.captureStatusSource.get();
            that.captureControl.updateModel({"disabled": false});
        } else {
            decapod.capturer.show(that.status);
            decapod.capturer.hide(that.captureReviewer);
            that.status.updateStatus(response.statusCode);
        }
        
        that.events.onCameraStatusReady.fire();
    };
    
    decapod.capturer.captureStatusSuccess = function (that, response) {
        if (response.totalCaptures === 0) {
            decapod.capturer.show(that.status);
            decapod.capturer.hide(that.captureReviewer);
            that.status.updateStatus("READY");
            that.exportControl.updateModel({"disabled": true});
        } else {
            that.imageSource.get(null, {captureIndex: response.lastCaptureIndex});
            that.captureReviewer.updateModel({"captureIndex": response.totalCaptures});
            that.captureControl.updateModel({"disabled": false});
            that.exportControl.updateModel({"disabled": false});
        }
        
        that.events.onCaptureStatusReady.fire();
    };

    decapod.capturer.imageSuccess = function (that, response, type) {
        if (type === "GET") {
            decapod.capturer.show(that.captureReviewer);
            decapod.capturer.hide(that.status);
            that.captureReviewer.updateModel({"captureIndex": that.captureReviewer.model.captureIndex, "captures": response.images});
        }
        
        that.events.onImageProcessedReady.fire();
    };
    
    decapod.capturer.restart = function (that) {
        that.events.onRestart.fire();
    };
    
    decapod.capturer.initCapturerControls = function (that) {
        that.locate("title").text(that.options.strings.title);
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
        });
    };
    
    fluid.defaults("decapod.capturer", {
        gradeNames: ["fluid.viewComponent", "autoInit"],
        preInitFunction: "decapod.capturer.preInit",
        finalInitFunction: "decapod.capturer.finalInit",
        components: {
            captureControl: {
                type: "decapod.processButton",
                createOnEvent: "onExportControllerReady",
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
                        "onReady.onCaptureControllerReady": "{capturer}.events.onCaptureControllerReady",
                        "onProcess": {
                            listener: "decapod.capturer.handleOnCapture",
                            args: ["{capturer}"]
                        },
                        "onProcessSuccess.handleCaptureSuccess": {
                            listener: "decapod.capturer.handleCaptureSuccess",
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
                createOnEvent: "onStateDisplayReady",
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
                        "onReady.onExportControllerReady": "{capturer}.events.onExportControllerReady",
                        "onProcessSuccess.handleExportSuccess": {
                            listener: "decapod.capturer.handleExportSuccess",
                            args: ["{capturer}", "{arguments}.0"]
                        },
                        "onProcessError.handleExportError": {
                            listener: "decapod.capturer.handleExportError",
                            args: ["{capturer}", "{arguments}.0", "{arguments}.1"]
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
                container: "{capturer}.dom.preview",
                options: {
                    listeners: {
                        onDelete: "{capturer}.events.onDelete",
                        "onReady.onCaptureReviewerReady": "{capturer}.events.onCaptureReviewerReady",
                        "afterRender.afterCaptureReviewerRendered": "{capturer}.events.afterCaptureReviewerRendered"
                    }
                }
            },
            status: {
                type: "decapod.status",
                createOnEvent: "onTemplateReady",
                container: "{capturer}.dom.status",
                options: {
                    listeners: {
                        "onReady.onStatusReady": "{capturer}.events.onStatusReady"
                    },
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
                createOnEvent: "onCaptureControllerReady",
                priority: "4",
                options: {
                    url: "../../mock-data/capture/mockCameraStatus.json",
                    listeners: {
                        "success.handleCameraStatusSuccess": {
                            listener: "decapod.capturer.cameraStatusSuccess",
                            priority: "1",
                            args: ["{capturer}", "{arguments}.0"]
                        },
                        "success.onCameraStatusSourceSuccess": "{capturer}.events.onCameraStatusSourceSuccess",
                        "error.handleCameraStatusError": {
                            listener: "decapod.capturer.handleCaptureError",
                            priority: "1",
                            args: ["{capturer}", "{arguments}.0", "{arguments}.1"]
                        },
                        "error.hideCaptuerReviewer": {
                            listener: "decapod.capturer.hide",
                            priority: "1",
                            args: ["{captuerReviewer}"]
                        },
                        "error.showStatus": {
                            listener: "decapod.capturer.show",
                            priority: "1",
                            args: ["{status}"]
                        },
                        "error.onCameraStatusSourceError": "{capturer}.events.onCameraStatusSourceError"
                    }
                }
            },
            captureStatusSource: {
                type: "decapod.dataSource",
                createOnEvent: "onCaptureControllerReady",
                priority: "5",
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
                createOnEvent: "onCaptureControllerReady",
                priority: "3",
                options: {
                    url: "../../mock-data/capture/mockImagesByIndex.json",
                    listeners: {
                        "success.handleImageSuccess": {
                            listener: "decapod.capturer.imageSuccess",
                            args: ["{capturer}", "{arguments}.0", "{arguments}.3"]
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
            },
            deleteStatusSource: {
                type: "decapod.dataSource",
                createOnEvent: "onCaptureControllerReady",
                priority: "2",
                options: {
                    url: "../../mock-data/capture/mockImagesByIndex.json",
                    listeners: {
                        "success.triggerDelete": {
                            listener: "{imageSource}.delete",
                            args: [null, {captureIndex: "{arguments}.0.lastCaptureIndex"}]
                        }
                    }
                }
            }
        },
        model: {
            status: "READY"
        },
        selectors: {
            captureButton: ".dc-capturer-controls",
            exportButton: ".dc-capturer-controls",
            title: ".dc-capturer-title",
            restart: ".dc-capturer-restart",
            help: ".dc-capturer-help",
            status: ".dc-capture-status",
            preview: ".dc-capturer-preview",
            downloadFrame: ".dc-capturer-download-frame"
        },
        strings: {
            title: "Capture",
            help: "Help",
            restart: "Restart"
        },
        events: {
            onTemplateReady: null,
            onRestart: null,
            onDelete: null,
            onCaptureSuccess: null,
            onCaptureError: null,
            onExportSuccess: null,
            onExportError: null,
            onCameraStatusReady: null,
            onCaptureStatusReady: null,
            onImageProcessedReady: null,
            onReady: null,
            
            onCameraStatusSourceSuccess: null,
            onCameraStatusSourceError: null,
            onCaptureControllerReady: null,
            onExportControllerReady: null,
            onCaptureReviewerReady: null,
            afterCaptureReviewerRendered: null,
            onStatusReady: null,
            onStateDisplayReady: {
                events: {
                    captureReviewerReady: "onCaptureReviewerReady",
                    captureReviewerRendered: "afterCaptureReviewerRendered",
                    status: "onStatusReady"
                },
                args: ["{capturer}"]
            },
            onReadySuccess: {
                events: {
                    onStateDisplayReady: "onStateDisplayReady",
                    onCaptureControllerReady: "onCaptureControllerReady",
                    onExportControllerReady: "onExportControllerReady",
                    onCameraStatusSourceSuccess: "onCameraStatusSourceSuccess"
                    
                }
            },
            onReadyError: {
                events: {
                    onStateDisplayReady: "onStateDisplayReady",
                    onCaptureControllerReady: "onCaptureControllerReady",
                    onExportControllerReady: "onExportControllerReady",
                    onCameraStatusSourceError: "onCameraStatusSourceError"
                }
            }
        },
        listeners: {
            onReadySuccess: "{capturer}.events.onReady",
            onReadyError: "{capturer}.events.onReady",
            onRestart: "{captureSource}.delete",
            onTemplateReady: "{capturer}.initCapturerControls",
            onDelete: "{deleteStatusSource}.get",
            onCaptureControllerReady: {
                listener: "{cameraStatusSource}.get", 
                priority: "1"
            }
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
