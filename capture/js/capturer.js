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
    
    decapod.capturer.handleExportSuccess = function (that, response) {
        that.locate("downloadFrame").attr("src", response.url);
        
        that.events.onExportSuccess.fire();
    };

    
    decapod.capturer.cameraStatusSuccess = function (that, response) {
        if (response.statusCode === 'READY') {
            that.events.onCameraReady.fire();
        } else {
            that.events.onError.fire(response, response.statusCode);
        }
    };
    
    decapod.capturer.captureStatusSuccess = function (that, response) {
        if (response.totalCaptures === 0) {
            decapod.capturer.show(that.status);
            decapod.capturer.hide(that.captureReviewer);
            that.status.updateStatus("READY");
            that.exportControl.updateModel({"disabled": true});
            that.events.onReadyToCapture.fire();
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
            that.events.onReadyToCapture.fire();
        }
        
        that.events.onImageProcessedReady.fire();
    };
    
    decapod.capturer.initCapturerControls = function (that) {
        that.locate("title").text(that.options.strings.title);
        that.locate("help").text(that.options.strings.help);
        var restart = that.locate("restart");
        restart.text(that.options.strings.restart);
        restart.click(function () {
            that.events.onRestart.fire();
        });
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
    
    decapod.capturer.displayElement = function (element, shouldShow) {
        if (shouldShow) {
            $(element).show();
        } else {
            $(element).hide();
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
        
        that.displayElement = function (element, shouldShow) {
            that.displayElement(element, shouldShow);
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
                createOnEvent: "onExportControllerAttached",
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
                        "onAttach.onCaptureControllerAttached": "{capturer}.events.onCaptureControllerAttached",
                        "onProcess": {
                            listener: "{exportControl}.updateModel",
                            args: [{"disabled": true}]
                        },
                        "onProcessSuccess.showCaptureReviewer": {
                            listener: "{capturer}.displayElement",
                            args: ["{captureReviewer}.dom.container", true]
                        },
                        "onProcessSuccess.hideCaptureReviewer": {
                            listener: "{capturer}.displayElement",
                            args: ["{status}.dom.container", false]
                        },
                        "onProcessSuccess.captureReviewerUpdateModel": {
                            listener: "{captureReviewer}.updateModel",
                            args: [{"captureIndex": "{arguments}.0.totalCaptures", "captures": "{arguments}.0.captures"}]
                        },
                        "onProcessSuccess.exportControlUpdateModel": {
                            listener: "{exportControl}.updateModel",
                            args: [{"disabled": false}]
                        },
                        "{capturer}.events.onCameraReady": {
                            listener: "{captureControl}.updateModel",
                            args: [{"disabled": false}]
                        },              

                        "onProcessError.onError": {
                            listener: "{capturer}.events.onError",
                            args: ["{arguments}.0", "NO_CAPTURE"]
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
                        "onAttach.onExportControllerAttached": "{capturer}.events.onExportControllerAttached",
                        "onProcessSuccess.handleExportSuccess": {
                            listener: "decapod.capturer.handleExportSuccess",
                            args: ["{capturer}", "{arguments}.0"]
                        },
                        "onProcessError.onError": {
                            listener: "{capturer}.events.onError",
                            // TODO: Needs to implement "NO_EXPORT" in the status component
                            args: ["{arguments}.0", "NO_EXPORT"]
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
                        "onAttach.onCaptureReviewerAttached": "{capturer}.events.onCaptureReviewerAttached",
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
                        "onAttach.onStatusAttached": "{capturer}.events.onStatusAttached",
                        "afterRender.afterStatusRendered": "{capturer}.events.afterStatusRendered"
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
                createOnEvent: "onCaptureStatusSourceAttached",
                options: {
                    url: "../../mock-data/capture/mockCameraStatus.json",
                    listeners: {
                        "onAttach.onCameraStatusSourceAttached": "{capturer}.events.onCameraStatusSourceAttached",
                        "success.handleCameraStatusSuccess": {
                            listener: "decapod.capturer.cameraStatusSuccess",
                            priority: "1",
                            args: ["{capturer}", "{arguments}.0"]
                        },
                        "success.onCameraStatusSourceSuccess": "{capturer}.events.onCameraStatusSourceSuccess",
                        "error.onError": {
                            listener: "{capturer}.events.onError",
                            args: ["{arguments}.0", "NO_CAPTURE"]
                        },
                        "error.onCameraStatusSourceError": "{capturer}.events.onCameraStatusSourceError"
                    }
                }
            },
            captureStatusSource: {
                type: "decapod.dataSource",
                createOnEvent: "onCaptureControllerAttached",
                options: {
                    url: "../../mock-data/capture/mockCaptureStatus.json",
                    listeners: {
                        "onAttach.onCaptureStatusSourceAttached": "{capturer}.events.onCaptureStatusSourceAttached",
                        "success.handleCaptureSuccess": {
                            listener: "decapod.capturer.captureStatusSuccess",
                            args: ["{capturer}", "{arguments}.0"]
                        },
                        "error.onError": {
                            listener: "{capturer}.events.onError",
                            args: ["{arguments}.0", "NO_CAPTURE"]
                        },
                        "{capturer}.events.onCameraReady": {
                            listener: "{captureStatusSource}.get"
                        }
                    }
                }
            },
            imageSource: {
                type: "decapod.dataSource",
                createOnEvent: "onStateDisplayReady",
                options: {
                    url: "../../mock-data/capture/mockImagesByIndex.json",
                    listeners: {
                        "onAttach.onImageSourceAttached": "{capturer}.events.onImageSourceAttached",
                        "success.handleImageSuccess": {
                            listener: "decapod.capturer.imageSuccess",
                            args: ["{capturer}", "{arguments}.0", "{arguments}.3"]
                        },
                        "error.onError": {
                            listener: "{capturer}.events.onError",
                            args: ["{arguments}.0", "NO_CAPTURE"]
                        }
                    }
                }
            },
            captureSource: {
                type: "decapod.dataSource",
                createOnEvent: "onTemplateReady",
                options: {
                    url: "../../mock-data/capture/mockImagesByIndex.json",
                    listeners: {
                        "onAttach.onCaptureSourceAttached": "{capturer}.events.onCaptureSourceAttached"
                    }
                }
            },
            deleteStatusSource: {
                type: "decapod.dataSource",
                createOnEvent: "onImageSourceAttached",
                options: {
                    url: "../../mock-data/capture/mockImagesByIndex.json",
                    listeners: {
                        "onAttach.onDeleteStatusSourceAttached": "{capturer}.events.onDeleteStatusSourceAttached",
                        "success.triggerDelete": {
                            listener: "{imageSource}.delete",
                            args: [null, {captureIndex: "{arguments}.0.lastCaptureIndex"}]
                        }
                    }
                }
            },
            eventBinder: {
                type: "decapod.eventBinder",
                createOnEvent: "onCameraStatusSourceAttached",
                options: {
                    listeners: {
                        "onAttach.onEventBinderAttached": "{capturer}.events.onEventBinderAttached",
                        "{capturer}.events.onError": [{
                            listener: "{capturer}.displayElement",
                            args: ["{captureReviewer}.dom.container", false]
                        }, {
                            listener: "{capturer}.displayElement",
                            args: ["{status}.dom.container", true]
                        }, {
                            listener: "{status}.updateStatus",
                            args: ["{arguments}.1"]
                        }, {
                            listener: "{captureControl}.updateModel",
                            args: [{"disabled": true}]
                        }]
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
            
            onError: null,
            onReadyToCapture: null,
            onCameraReady: null,
            
            onEventBinderAttached: null,
            onDeleteStatusSourceAttached: null,
            onCaptureSourceAttached: null,
            onImageSourceAttached: null,
            onCaptureStatusSourceAttached: null,
            onCameraStatusSourceAttached: null,
            onStatusAttached: null,
            onCaptureReviewerAttached: null,
            onExportControllerAttached: null,
            onCaptureControllerAttached: null,
            onCameraStatusSourceSuccess: null,
            onCameraStatusSourceError: null,
            afterCaptureReviewerRendered: null,
            afterStatusRendered: null,
            onStateDisplayReady: {
                events: {
                    captureReviewer: "onCaptureReviewerAttached",
                    captureReviewerRendered: "afterCaptureReviewerRendered",
                    status: "onStatusAttached",
                    statusRendered: "afterStatusRendered"
                },
                args: ["{capturer}"]
            },
            onReadySuccess: {
                events: {
                    "eventBinder": "onEventBinderAttached",
                    "deleteStatusSource": "onDeleteStatusSourceAttached",
                    "captureSource": "onCaptureSourceAttached",
                    "imageSource": "onImageSourceAttached",
                    "captureStatusSource": "onCaptureStatusSourceAttached",
                    "cameraStatusSource": "onCameraStatusSourceAttached",
                    "status": "onStatusAttached",
                    "caputreReviewer": "onCaptureReviewerAttached",
                    "exportController": "onExportControllerAttached",
                    "captureController": "onCaptureControllerAttached",
                    "readyToCapture": "onReadyToCapture"
                }
            },
            onReadyError: {
                events: {
                    "eventBinder": "onEventBinderAttached",
                    "deleteStatusSource": "onDeleteStatusSourceAttached",
                    "captureSource": "onCaptureSourceAttached",
                    "imageSource": "onImageSourceAttached",
                    "captureStatusSource": "onCaptureStatusSourceAttached",
                    "cameraStatusSource": "onCameraStatusSourceAttached",
                    "status": "onStatusAttached",
                    "caputreReviewer": "onCaptureReviewerAttached",
                    "exportController": "onExportControllerAttached",
                    "captureController": "onCaptureControllerAttached",
                    "onError": "onError"
                }
            }
        },
        listeners: {
            onReadySuccess: "{capturer}.events.onReady",
            onReadyError: "{capturer}.events.onReady",
            onRestart: "{captureSource}.delete",
            onTemplateReady: "{capturer}.initCapturerControls",
            onDelete: "{deleteStatusSource}.get",
            onCameraStatusSourceAttached: {
                listener: "{cameraStatusSource}.get",
                args: [null]
            }
        },
        invokers: {
            displayElement: "decapod.capturer.displayElement",
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
