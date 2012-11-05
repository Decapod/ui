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
    
    decapod.capturer.download = function (that, url) {
        that.locate("downloadFrame").attr("src", url);
    };

    decapod.capturer.setLabel = function (container, label) {
        container.html(label);
    };

    decapod.capturer.cameraStatusSuccess = function (that, response) {
        if (response.statusCode === 'READY_FOR_CONVENTIONAL' || response.statusCode === 'READY_FOR_STEREO') {
            that.events.onCameraReady.fire();
        } else {
            that.events.onError.fire(response, response.statusCode);
        }
    };
    
    decapod.capturer.captureStatusSuccess = function (that, response) {
        if (response.totalCaptures === 0) {
            that.events.onNoCaptures.fire(response.statusCode);
        } else {
            that.events.onCapturesRetrieved.fire(response);
        }
    };
    
    decapod.capturer.initCapturerControls = function (that) {
        that.locate("title").text(that.options.strings.title);
        that.locate("help").text(that.options.strings.help);
        that.locate("exportButton").text(that.options.strings.exportButton);
        that.locate("captureButton").html(that.options.markup.captureButton);
        that.locate("loadMessage").text(that.options.strings.loadMessage);
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
        
        that.download = function (url) {
            that.download(url);
        };
        
        that.setLabel = function (container, label) {
            that.setLabel(container, label);
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
                type: "decapod.button",
                createOnEvent: "onExportControllerAttached",
                container: "{capturer}.dom.captureButton",
                options: {
                    strings: {
                        label: "{capturer}.options.markup.captureButton"
                    },
                    styles: {
                        disabled: "ds-capturer-captureButton-disabled"
                    },
                    model: {
                        "state": "disabled"
                    },
                    listeners: {
                        "onAttach.onCaptureControllerAttached": "{capturer}.events.onCaptureControllerAttached",
                        "onClick.Capture": {
                            listener: "{captureSource}.post",
                            args: [null]
                        },
                        "onClick.disableCaptureControl": {
                            listener: "{captureControl}.setState",
                            args: ["disabled"]
                        },
                        "onClick.setProgress": {
                            listener: "{capturer}.setLabel",
                            args: ["{captureControl}.container", "{capturer}.options.strings.captureInProgress"]
                        },
                        "onClick.hideExportDesc": {
                            listener: "{capturer}.displayElement",
                            args: ["{capturer}.dom.exportDesc", false]
                        },
                        "{captureSource}.events.postSuccess": [{
                            listener: "{captureControl}.setState",
                            args: ["enabled"]
                        }, {
                            listener: "{exportControl}.setState",
                            args: ["enabled"]
                        }, {
                            listener: "{capturer}.setLabel",
                            args: ["{captureControl}.container", "{capturer}.options.markup.captureButton"]
                        }, {
                            listener: "{capturer}.displayElement",
                            args: ["{captureReviewer}.dom.container", true]
                        }, {
                            listener: "{capturer}.displayElement",
                            args: ["{status}.dom.container", false]
                        }, {
                            listener: "{captureReviewer}.updateModel",
                            args: [{"captureIndex": "{arguments}.0.totalCaptures", "captures": "{arguments}.0.captures"}]
                        }, {
                            listener: "{capturer}.events.onCaptureSuccess",
                            priority: "last"
                        }],
                        "{captureSource}.events.postError": {
                            listener: "{capturer}.events.onError",
                            args: ["{arguments}.0", "NO_CAPTURE"]
                        },
                        "{capturer}.events.onCameraReady": {
                            listener: "{captureControl}.setState",
                            args: ["enabled"]
                        }
                    }
                }
            },
            exportControl: {
                type: "decapod.button",
                createOnEvent: "onStateDisplayReady",
                container: "{capturer}.dom.exportButton",
                options: {
                    strings: {
                        label: "{capturer}.options.strings.exportButton"
                    },
                    styles: {
                        disabled: "ds-capturer-exportButton-disabled"
                    },
                    model: {
                        "state": "disabled"
                    },
                    listeners: {
                        "onAttach.onExportControllerAttached": "{capturer}.events.onExportControllerAttached",
                        "onClick.fetchCaptures": {
                            listener: "{captureSource}.get",
                            args: [null]
                        },
                        "onClick.disableExportControl": {
                            listener: "{exportControl}.setState",
                            args: ["disabled"]
                        },
                        "onClick.setProgress": {
                            listener: "{capturer}.setLabel",
                            args: ["{exportControl}.container", "{capturer}.options.strings.exportInProgress"]
                        },
                        "{captureSource}.events.getSuccess": [{
                            listener: "{capturer}.displayElement",
                            args: ["{capturer}.dom.exportDesc", true]
                        }, {
                            listener: "{capturer}.setLabel",
                            args: ["{capturer}.dom.exportDesc", "{capturer}.options.markup.exportDesc"]
                        }, {
                            listener: "{exportControl}.setState",
                            args: ["enabled"]
                        }, {
                            listener: "{capturer}.setLabel",
                            args: ["{exportControl}.container", "{capturer}.options.strings.exportButton"]
                        }, {
                            listener: "{capturer}.download",
                            args: ["{arguments}.0.url"]
                        }, {
                            listener: "{capturer}.events.onExportSuccess",
                            priority: "last"
                        }],
                        "{captureSource}.events.getError": {
                            listener: "{capturer}.events.onError",
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
                        "afterRender.afterCaptureReviewerRendered": "{capturer}.events.afterCaptureReviewerRendered",
                        "{imageSource}.events.getSuccess": {
                            listener: "{captureReviewer}.updateModel",
                            args: [{"captureIndex": "{captureReviewer}.model.captureIndex", "captures": "{arguments}.0.images"}]
                        }
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
                        READY_FOR_CONVENTIONAL: {
                            name: "Ready for conventional Capture",
                            description: "3D stereo capture is unavailable. <br /> Press the Camera Button to start.",
                            style: "dc-status-ready"
                        },
                        READY_FOR_STEREO: {
                            name: "Ready for stereo Capture",
                            description: "Capable of capturing in stereo. <br />Press the Camera Button to start.",
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
                        "error.onError": {
                            listener: "{capturer}.events.onError",
                            args: ["{arguments}.0", "NO_CAPTURE"]
                        }
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
                        "getSuccess.showCaptureReviewer": {
                            listener: "{capturer}.displayElement",
                            args: ["{captureReviewer}.dom.container", true]
                        },
                        "getSuccess.hideStatus": {
                            listener: "{capturer}.displayElement",
                            args: ["{status}.dom.container", false]
                        },
                        "getSuccess.onReadyToCapture": {
                            listener: "{capturer}.events.onReadyToCapture",
                            priority: "last",
                            args: [null]
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
                            listener: "{capturer}.displayElement",
                            args: ["{capturer}.dom.load", false]
                        }, {
                            listener: "{status}.updateStatus",
                            args: ["{arguments}.1"]
                        }, {
                            listener: "{captureControl}.setState",
                            args: ["disabled"]
                        }],
                        "{capturer}.events.onNoCaptures": [{
                            listener: "{capturer}.displayElement",
                            args: ["{captureReviewer}.dom.container", false]
                        }, {
                            listener: "{capturer}.displayElement",
                            args: ["{status}.dom.container", true]
                        }, {
                            listener: "{status}.updateStatus",
                            args: ["{arguments}.0"]
                        }, {
                            listener: "{exportControl}.setState",
                            args: ["disabled"]
                        }, {
                            listener: "{capturer}.events.onReadyToCapture",
                            priority: "last",
                            args: [null]
                        }],
                        "{capturer}.events.onCapturesRetrieved": [{
                            listener: "{imageSource}.get",
                            args: [null, {"captureIndex": "{arguments}.0.lastCaptureIndex"}]
                        }, {
                            listener: "{captureReviewer}.updateModel",
                            args: [{"captureIndex": "{arguments}.0.totalCaptures"}]
                        }, {
                            listener: "{captureControl}.setState",
                            args: ["enabled"]
                        }, {
                            listener: "{exportControl}.setState",
                            args: ["enabled"]
                        }]
                    }
                }
            }
        },
        model: {
            status: "READY_FOR_CONVENTIONAL"
        },
        selectors: {
            captureButton: ".dc-capturer-captureButton",
            exportButton: ".dc-capturer-exportButton",
            load: ".dc-capture-load",
            loadMessage: ".dc-capture-loadMessage",
            title: ".dc-capturer-title",
            restart: ".dc-capturer-restart",
            help: ".dc-capturer-help",
            status: ".dc-capture-status",
            preview: ".dc-capturer-preview",
            exportDesc: ".dc-capturer-export-description",
            downloadFrame: ".dc-capturer-download-frame"
        },
        strings: {
            title: "Capture",
            help: "Help",
            restart: "Restart",
            exportButton: "Export Captures",
            exportInProgress: "Creating Archive...",
            captureInProgress: "Taking Picture...",
            loadMessage: "Checking cameras..."
        },
        markup: {
            captureButton: "Capture<br /><span>(Keyboard shortcut: C)</span>",
            exportDesc: "If capturing with Stereo 3D, be sure to run the Decapod Calibration tool prior to dewarping the images. <br /><br />See <a href='help.html'>Help</a> or Decapod documentation for more details."
        },
        events: {
            onRestart: null,
            onDelete: null,
            onReadyToCapture: null,
            onCameraReady: null,
            onNoCaptures: null,
            onCapturesRetrieved: null,
            onError: null,
            onExportSuccess: null,
            onCaptureSuccess: null,
            
            afterCaptureReviewerRendered: null,
            afterStatusRendered: null,

            onTemplateReady: null,
            onReady: null,
            
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
            },
            
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
        },
        listeners: {
            onReadySuccess: {
                listener: "{capturer}.events.onReady",
                priority: "last"
            },
            onReadyError: {
                listener: "{capturer}.events.onReady",
                priority: "last"
            },
            onRestart: [
                "{captureSource}.delete",
                {
                    listener: "{capturer}.displayElement",
                    args: ["{capturer}.dom.exportDesc", false]
                }
            ],
            onTemplateReady: [
                "{capturer}.initCapturerControls",
                {
                    listener: "{capturer}.displayElement",
                    args: ["{capturer}.dom.status", false]
                },
                {
                    listener: "{capturer}.displayElement",
                    args: ["{capturer}.dom.preview", false]
                },
                {
                    listener: "{capturer}.displayElement",
                    args: ["{capturer}.dom.exportDesc", false]
                }
            ],
            onDelete: [
                "{deleteStatusSource}.get",
                {
                    listener: "{capturer}.displayElement",
                    args: ["{capturer}.dom.exportDesc", false]
                }
            ],
            onCameraStatusSourceAttached: {
                listener: "{cameraStatusSource}.get",
                args: [null]
            },
            onReadyToCapture: {
                listener: "{capturer}.displayElement",
                priority: "first",
                args: ["{capturer}.dom.load", false]
            }
        },
        invokers: {
            download: "decapod.capturer.download",
            displayElement: "decapod.capturer.displayElement",
            initCapturerControls: "decapod.capturer.initCapturerControls",
            setLabel: "decapod.capturer.setLabel"
        },
        resources: {
            template: {
                url: "../html/capturerTemplate.html",
                forceCache: true
            }
        }
    });
})(jQuery);
